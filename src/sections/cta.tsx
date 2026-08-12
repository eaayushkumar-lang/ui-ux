import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BookACallButton } from "@/components/book-a-call-button";
import { EASE_OUT as EASE } from "@/lib/motion";
import { LiquidHeadingReveal } from "@/components/liquid-text";

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Progress-linked opacity + parallax scale: the background image is
  // faintest at the section's edges and reaches full strength mid-section.
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.08, 0.25, 0.08]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-surface py-28 lg:py-36 [contain:layout_style_paint]"
    >
      <div className="absolute inset-0">
        <motion.img
          src="https://picsum.photos/seed/auxai-systems-dark/1800/900"
          alt=""
          style={{ opacity: imageOpacity, scale: imageScale }}
          className="gpu-active h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/85 to-surface/70" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-5xl"
        >
          <LiquidHeadingReveal>Your competitors are still doing this by hand.</LiquidHeadingReveal>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-ink-dim"
        >
          Book a call and we'll show you exactly what to automate first, and
          what it's worth to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mt-10"
        >
          <BookACallButton size="lg" />
        </motion.div>
      </div>
    </section>
  );
}
