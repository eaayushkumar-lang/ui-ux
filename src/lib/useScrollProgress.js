import { useEffect, useRef } from 'react';
import { motionValue } from 'framer-motion';

/**
 * Tracks scroll progress of `ref` against the viewport as a Framer Motion
 * MotionValue, without depending on framer-motion's own useScroll (whose
 * scroll-timeline acceleration path was unreliable here). 0 = element top at
 * viewport top, 1 = element bottom at viewport bottom — matching a
 * `sticky top-0` pin section whose wrapper is N*100vh tall.
 */
export function useScrollProgress(ref) {
  const progress = useRef(motionValue(0)).current;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let frame = null;

    const update = () => {
      frame = null;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = total > 0 ? -rect.top / total : 0;
      progress.set(Math.min(1, Math.max(0, raw)));
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [ref, progress]);

  return progress;
}

/**
 * Imperatively writes styles to `targetRef.current` on every change of a
 * MotionValue, bypassing framer-motion's `style={{...}}` reactive binding.
 * Use this for elements that wrap nested motion components with their own
 * `animate` opacity — that combination has proven unreliable here (a scroll-
 * driven opacity on an ancestor silently stops updating once a descendant
 * owns its own `animate` opacity). `applyStyles` should be a stable callback
 * (e.g. defined outside render or wrapped in useCallback with no deps).
 */
export function useImperativeScrollStyle(motionValueSource, targetRef, applyStyles) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return undefined;

    const apply = (v) => applyStyles(el, v);
    apply(motionValueSource.get());
    return motionValueSource.on('change', apply);
  }, [motionValueSource, targetRef, applyStyles]);
}
