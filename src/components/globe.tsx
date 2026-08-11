import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

const POINT_COUNT = 240;
const STAR_COUNT = 160;
const EDGE_THRESHOLD = 0.965;
const ACCENT = "63, 217, 190";
const DIM = "154, 161, 173";

function buildSpherePoints(count: number): Point3D[] {
  const points: Point3D[] = [];
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    points.push({
      x: Math.cos(theta) * radiusAtY,
      y,
      z: Math.sin(theta) * radiusAtY,
    });
  }
  return points;
}

function buildEdges(points: Point3D[]): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dot =
        points[i].x * points[j].x +
        points[i].y * points[j].y +
        points[i].z * points[j].z;
      if (dot > EDGE_THRESHOLD) edges.push([i, j]);
    }
  }
  return edges;
}

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points = buildSpherePoints(POINT_COUNT);
    const edges = buildEdges(points);
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      r: Math.random() * 1.1 + 0.25,
      o: Math.random() * 0.5 + 0.15,
    }));

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    let angle = 0;
    let raf = 0;
    const tilt = -0.32;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    function project(p: Point3D, rotY: number) {
      const cosA = Math.cos(rotY);
      const sinA = Math.sin(rotY);
      const x1 = p.x * cosA - p.z * sinA;
      const z1 = p.x * sinA + p.z * cosA;
      const y1 = p.y * cosT - z1 * sinT;
      const z2 = p.y * sinT + z1 * cosT;
      const scale = Math.min(width, height) * 0.42;
      const perspective = 2.6 / (2.6 + z2);
      return {
        x: width / 2 + x1 * scale * perspective,
        y: height / 2 + y1 * scale * perspective,
        z: z2,
        perspective,
      };
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (const s of stars) {
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${DIM}, ${s.o})`;
        ctx!.arc(
          (width / 2) * (1 + s.x * 1.9),
          (height / 2) * (1 + s.y * 1.9),
          s.r,
          0,
          Math.PI * 2,
        );
        ctx!.fill();
      }

      const projected = points.map((p) => project(p, angle));

      ctx!.lineWidth = 0.6;
      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        const depth = (pa.perspective + pb.perspective) / 2;
        const alpha = Math.max(0, Math.min(0.4, (depth - 0.75) * 1.3));
        if (alpha <= 0.01) continue;
        ctx!.strokeStyle = `rgba(${ACCENT}, ${alpha})`;
        ctx!.beginPath();
        ctx!.moveTo(pa.x, pa.y);
        ctx!.lineTo(pb.x, pb.y);
        ctx!.stroke();
      }

      for (const p of projected) {
        const depth = (p.perspective - 0.78) * 2.4;
        const alpha = Math.max(0.12, Math.min(1, depth));
        const radius = Math.max(0.6, 1.9 * p.perspective);
        ctx!.beginPath();
        ctx!.fillStyle =
          depth > 0.35 ? `rgba(${ACCENT}, ${alpha})` : `rgba(${DIM}, ${alpha * 0.8})`;
        ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function tick() {
      angle += 0.0016;
      draw();
      raf = requestAnimationFrame(tick);
    }

    if (reduceMotion) {
      draw();
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Rotating network sphere representing AUXAI.AI's connected agent systems"
    />
  );
}
