import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface TypingTextProps {
  text: string;
  start: boolean;
  speed?: number;
  startDelay?: number;
  showCursor?: boolean;
  className?: string;
  onDone?: () => void;
}

/** Progressive character reveal with a blinking cursor. Gated by `start`
 * (the parent decides when, typically via whileInView), and collapses to
 * the full text instantly under prefers-reduced-motion. */
export function TypingText({
  text,
  start,
  speed = 28,
  startDelay = 0,
  showCursor = true,
  className,
  onDone,
}: TypingTextProps) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? text.length : 0);
  const [done, setDone] = useState(Boolean(reduceMotion));

  useEffect(() => {
    if (reduceMotion) {
      setCount(text.length);
      setDone(true);
      return;
    }
    if (!start) return;

    setCount(0);
    setDone(false);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
          onDone?.();
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
    // onDone intentionally excluded: it's a fire-once callback, not a value
    // this effect should re-run for.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, text, speed, startDelay, reduceMotion]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {showCursor && !done && (
        <span
          aria-hidden="true"
          className="animate-blink ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-current align-middle"
        />
      )}
    </span>
  );
}
