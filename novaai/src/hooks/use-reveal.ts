import { useEffect, useRef, useState } from "react";

/**
 * Fade-up-on-enter reveal (spec: IntersectionObserver threshold 0.15,
 * hidden = translate-y-8 opacity-0, visible = translate-y-0 opacity-100,
 * 700ms ease-out). Returns a ref to attach and a `shown` flag; the caller
 * applies the transition classes and its own per-element transition-delay.
 * Fires once, then stops observing.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shown) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return { ref, shown };
}
