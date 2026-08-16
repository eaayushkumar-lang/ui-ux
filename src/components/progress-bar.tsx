import { motion, useScroll, useSpring } from "framer-motion";
import { SPRING_SMOOTH } from "@/lib/motion";

export function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    ...SPRING_SMOOTH,
    restDelta: 0.001,
  });

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent">
      <motion.div
        style={{ scaleX, transformOrigin: "0% 50%" }}
        className="h-full w-full bg-gradient-to-r from-accent to-accent-2 shadow-[0_0_12px_-1px_rgba(193,80,46,0.7)]"
      />
    </div>
  );
}
