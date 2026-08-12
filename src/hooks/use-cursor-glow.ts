import { useRef, type MouseEvent } from "react";

/** Writes cursor position to --mx/--my via direct DOM mutation (never
 * React state, so hovering never triggers a re-render) for the
 * `cursor-glow` / `liquid-metal-card` CSS utilities to read. Same pattern
 * the liquid-metal Button already uses for its own sheen tracking. */
export function useCursorGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  function onMouseMove(event: MouseEvent<T>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return { ref, onMouseMove };
}
