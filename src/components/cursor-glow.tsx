import { useEffect, useRef } from "react";

/**
 * Global, additive cursor-follow glow — a soft warm light that trails the
 * pointer for a premium, "reads presence" feel. It is a completely independent,
 * fixed, `pointer-events-none` layer: it never touches, wraps, or reads the
 * hero ScrollFrames/ScrollVideo component, so the scroll-driven animation
 * behaves exactly as before.
 *
 * Position is written straight to the element's transform via a ref inside a
 * rAF loop (lerp-smoothed) — no React state per frame, so it costs nothing.
 * The effect is disabled for coarse/touch pointers and for
 * prefers-reduced-motion.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window.matchMedia !== "function") return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return; // no-op on touch or reduced-motion

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
    };
    const onLeave = () => {
      shown = false;
      el.style.opacity = "0";
    };

    function loop() {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.12; // same 0.12 smoothing feel used elsewhere
      y += (ty - y) * 0.12;
      el!.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <div
        ref={ref}
        className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full opacity-0 transition-opacity duration-500 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(193,80,46,0.18) 0%, rgba(224,160,122,0.11) 34%, transparent 68%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
