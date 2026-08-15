import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// A small fixed workflow-automation diagram: a few nodes connected by
// lines, alternating violet/orange per CLAUDE.md's "system" section spec.
const NODES = [
  { x: 40, y: 130, color: "primary" as const },
  { x: 140, y: 50, color: "secondary" as const },
  { x: 140, y: 210, color: "primary" as const },
  { x: 250, y: 130, color: "primary" as const },
  { x: 350, y: 60, color: "secondary" as const },
  { x: 350, y: 200, color: "secondary" as const },
];

const LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
];

const COLOR_HEX = { primary: "#6C5CE7", secondary: "#F5A623" } as const;

/**
 * Abstract connected-nodes / line diagram (CLAUDE.md's "system" section
 * visual). Lines draw themselves in via stroke-dashoffset, nodes pop in
 * staggered right after, both gated behind the same scroll-triggered
 * reveal as the section's text.
 */
export function NodesDiagram({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const lines = svg.querySelectorAll<SVGLineElement>("[data-line]");
    const nodes = svg.querySelectorAll<SVGCircleElement>("[data-node]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(lines, { strokeDashoffset: 0 });
      gsap.set(nodes, { scale: 1, opacity: 1 });
      return;
    }

    lines.forEach((line) => {
      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
    });
    gsap.set(nodes, { scale: 0, opacity: 0, transformOrigin: "center" });

    const trigger = ScrollTrigger.create({
      trigger: svg,
      start: "top 75%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(lines, { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, ease: "power2.inOut" });
        tl.to(nodes, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: "back.out(1.6)" }, "-=0.5");
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf([...lines, ...nodes]);
    };
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 390 260" className={className} role="presentation" aria-hidden="true">
      {LINKS.map(([a, b], i) => (
        <line
          key={i}
          data-line
          x1={NODES[a].x}
          y1={NODES[a].y}
          x2={NODES[b].x}
          y2={NODES[b].y}
          stroke="#6C5CE7"
          strokeOpacity={0.4}
          strokeWidth={1.5}
        />
      ))}
      {NODES.map((node, i) => (
        <circle key={i} data-node cx={node.x} cy={node.y} r={8} fill={COLOR_HEX[node.color]} />
      ))}
    </svg>
  );
}
