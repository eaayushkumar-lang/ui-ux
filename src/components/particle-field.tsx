import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Pt {
  x: number;
  y: number;
}

const SHAPE_ORDER = ["hero", "services", "how-it-works", "testimonials", "cta"] as const;
type ShapeKey = (typeof SHAPE_ORDER)[number];

function inBrainShape(x: number, y: number): boolean {
  const left = (x + 0.32) ** 2 / 0.42 ** 2 + y ** 2 / 0.55 ** 2 <= 1;
  const right = (x - 0.32) ** 2 / 0.42 ** 2 + y ** 2 / 0.55 ** 2 <= 1;
  return left || right;
}

function shapeBrain(count: number): Pt[] {
  const points: Pt[] = [];
  let attempts = 0;
  while (points.length < count && attempts < count * 60) {
    attempts++;
    const x = (Math.random() * 2 - 1) * 0.9;
    const y = (Math.random() * 2 - 1) * 0.75;
    if (inBrainShape(x, y)) points.push({ x, y });
  }
  while (points.length < count) points.push({ x: 0, y: 0 });
  return points;
}

function shapeGrid(count: number): Pt[] {
  const cols = Math.ceil(Math.sqrt(count * 1.4));
  const rows = Math.ceil(count / cols);
  const points: Pt[] = [];
  for (let r = 0; r < rows && points.length < count; r++) {
    for (let c = 0; c < cols && points.length < count; c++) {
      const x = cols > 1 ? (c / (cols - 1)) * 2 - 1 : 0;
      const y = rows > 1 ? (r / (rows - 1)) * 2 - 1 : 0;
      points.push({ x: x * 0.9, y: y * 0.75 });
    }
  }
  return points;
}

function shapeArrow(count: number): Pt[] {
  const points: Pt[] = [];
  const tailX = -0.85;
  const tipX = 0.85;
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const upper = Math.random() < 0.5;
    const x = tailX + (tipX - tailX) * t;
    const yAtTail = upper ? 0.65 : -0.65;
    const y = yAtTail + (0 - yAtTail) * t;
    const jitter = (Math.random() - 0.5) * 0.09;
    points.push({ x: x + jitter, y: y + jitter });
  }
  return points;
}

function shapeStarCluster(count: number): Pt[] {
  const centers = [
    { x: -0.55, y: -0.35 },
    { x: 0.5, y: -0.15 },
    { x: -0.1, y: 0.45 },
    { x: 0.6, y: 0.5 },
    { x: -0.6, y: 0.5 },
  ];
  const points: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const c = centers[i % centers.length];
    const r = Math.sqrt(Math.random()) * 0.22;
    const a = Math.random() * Math.PI * 2;
    points.push({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r * 0.85 });
  }
  return points;
}

function shapeFunnel(count: number): Pt[] {
  const points: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const width = (1 - t) * 0.95 + 0.02;
    const x = (Math.random() * 2 - 1) * width;
    const y = -0.8 + t * 1.55;
    points.push({ x, y });
  }
  return points;
}

function buildShapes(count: number): Record<ShapeKey, Pt[]> {
  return {
    hero: shapeBrain(count),
    services: shapeGrid(count),
    "how-it-works": shapeArrow(count),
    testimonials: shapeStarCluster(count),
    cta: shapeFunnel(count),
  };
}

/**
 * Ambient, cross-section particle field. Renders as a fixed, pointer-events
 * -none, screen-blended overlay above section backgrounds (the same
 * layering approach as NoiseOverlay) so it reads as ambient light rather
 * than obscuring content - screen blend can only brighten, and our text is
 * already near-white, so it barely touches readability while still glowing
 * vividly against the dark empty space around it.
 *
 * Particles morph between five shapes keyed to the page's own section ids
 * (reusing the ids useActiveSection already tracks), blended by how far
 * scroll has progressed between each pair of adjacent sections. Edge
 * (connection-line) recomputation is throttled to every 4th frame - full
 * pairwise distance checks at 60fps is unnecessary for lines that only need
 * to look "roughly right", and skipping most frames meaningfully cuts the
 * per-frame cost at 250+ particles.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 100 : 260;
    const EDGE_THRESHOLD = isMobile ? 0.13 : 0.1;
    const shapes = buildShapes(COUNT);
    const current: Pt[] = shapes.hero.map((p) => ({ ...p }));

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let zones: { key: ShapeKey; top: number }[] = [];
    let ctaBottom = Infinity;
    function measureZones() {
      zones = SHAPE_ORDER.map((key) => {
        const el = document.getElementById(key);
        const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        return { key, top };
      });
      const ctaEl = document.getElementById("cta");
      ctaBottom = ctaEl
        ? ctaEl.getBoundingClientRect().top + window.scrollY + ctaEl.offsetHeight
        : Infinity;
    }

    resize();
    measureZones();

    function handleResize() {
      resize();
      measureZones();
    }
    window.addEventListener("resize", handleResize);

    const scrollState = { y: window.scrollY };
    function onScroll() {
      scrollState.y = window.scrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    const mouse = { x: -9999, y: -9999 };
    function onMouseMove(event: MouseEvent) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    function currentBlend() {
      if (zones.length === 0 || zones.every((z) => z.top === 0)) {
        return { a: shapes.hero, b: shapes.hero, t: 0, fade: 1 };
      }
      const y = scrollState.y + height * 0.5;
      let idx = 0;
      for (let i = 0; i < zones.length; i++) {
        if (y >= zones[i].top) idx = i;
      }
      const bIdx = Math.min(idx + 1, zones.length - 1);
      const a = zones[idx];
      const b = zones[bIdx];
      const span = b.top - a.top || 1;
      const t = a.key === b.key ? 0 : Math.min(1, Math.max(0, (y - a.top) / span));
      const fade = y > ctaBottom ? Math.max(0, 1 - (y - ctaBottom) / 400) : 1;
      return { a: shapes[a.key], b: shapes[b.key], t, fade };
    }

    let edges: [number, number][] = [];
    function recomputeEdges() {
      const next: [number, number][] = [];
      for (let i = 0; i < current.length; i++) {
        for (let j = i + 1; j < current.length; j++) {
          const dx = current[i].x - current[j].x;
          const dy = current[i].y - current[j].y;
          if (dx * dx + dy * dy < EDGE_THRESHOLD * EDGE_THRESHOLD) next.push([i, j]);
        }
      }
      edges = next;
    }

    function drawFrame(fade: number) {
      ctx!.clearRect(0, 0, width, height);
      const scale = Math.min(width, height) * 0.42;
      const cx = width / 2;
      const cy = height / 2;

      ctx!.lineWidth = 0.6;
      for (const [i, j] of edges) {
        const pi = current[i];
        const pj = current[j];
        ctx!.strokeStyle = `rgba(255,184,0,${0.14 * fade})`;
        ctx!.beginPath();
        ctx!.moveTo(cx + pi.x * scale, cy + pi.y * scale);
        ctx!.lineTo(cx + pj.x * scale, cy + pj.y * scale);
        ctx!.stroke();
      }

      for (let i = 0; i < current.length; i++) {
        const depth = (i % 7) / 7;
        const r = 0.9 + depth * 1.7;
        const px = cx + current[i].x * scale;
        const py = cy + current[i].y * scale;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(255,${Math.round(184 - depth * 50)},${Math.round(
          depth * 40,
        )},${(0.3 + depth * 0.4) * fade})`;
        ctx!.arc(px, py, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    let frame = 0;
    let raf = 0;

    function tick() {
      const { a, b, t, fade } = currentBlend();

      for (let i = 0; i < current.length; i++) {
        const targetX = a[i].x + (b[i].x - a[i].x) * t;
        const targetY = a[i].y + (b[i].y - a[i].y) * t;
        current[i].x += (targetX - current[i].x) * 0.045;
        current[i].y += (targetY - current[i].y) * 0.045;
      }

      const scale = Math.min(width, height) * 0.42;
      const cx = width / 2;
      const cy = height / 2;
      const repelRadius = 120;
      for (const p of current) {
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < repelRadius * repelRadius) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (1 - dist / repelRadius) * 14;
          p.x += ((dx / dist) * force) / scale;
          p.y += ((dy / dist) * force) / scale;
        }
      }

      if (frame % 4 === 0) recomputeEdges();
      frame++;

      canvas!.style.opacity = String(0.55 * fade);
      drawFrame(fade);
      raf = requestAnimationFrame(tick);
    }

    if (reduceMotion) {
      recomputeEdges();
      canvas!.style.opacity = "0.4";
      drawFrame(1);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="gpu pointer-events-none fixed inset-0 z-[15] mix-blend-screen"
    />
  );
}
