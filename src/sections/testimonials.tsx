import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { SplitText } from "@/components/split-text";

const CARD_HOVER_SHADOW =
  "0 0 0 1px rgba(193,80,46,0.4), 0 32px 60px -20px rgba(0,0,0,0.7), 0 0 40px -10px rgba(193,80,46,0.3)";
const CARD_BASE_SHADOW = "0 0 0 1px rgba(193,80,46,0), 0 32px 60px -20px rgba(0,0,0,0), 0 0 40px -10px rgba(193,80,46,0)";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name, src }: { name: string; src: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-3 font-mono text-[13px] text-ink-dim">
        {initials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={44}
      height={44}
      loading="lazy"
      onError={() => setErrored(true)}
      className="h-11 w-11 shrink-0 rounded-full object-cover"
    />
  );
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "AUXAI.AI didn't hand us a chatbot. They rebuilt how dispatch decisions get made, and our team stopped drowning in the same three questions every day.",
    name: "Priya Nandakumar",
    role: "VP Operations",
    company: "Halcyon Freight",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    quote:
      "We had four systems talking past each other. Now one agent handles intake end to end, and our staff finally have time for patients.",
    name: "Marcus Webb",
    role: "Director of Care Access",
    company: "Meridian Health Group",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    quote:
      "Every vendor before them promised automation. AUXAI.AI is the first one that shipped something our analysts actually trust with real client data.",
    name: "Elena Sokolova",
    role: "Head of Portfolio Ops",
    company: "Clearwater Capital",
    avatar: "https://i.pravatar.cc/150?img=48",
  },
];

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]") as HTMLElement | null;
    const distance = card ? card.offsetWidth + 20 : 360;
    track.scrollBy({ left: distance * direction, behavior: "smooth" });
  }

  return (
    <section id="testimonials" className="relative z-10 py-24 lg:py-32 [contain:layout_style_paint]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-lg text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl">
            <SplitText text="Operators who stopped competing on effort." />
          </h2>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-dim transition-[transform,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-ink/40 hover:text-ink active:scale-90 active:duration-100"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-dim transition-[transform,border-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-ink/40 hover:text-ink active:scale-90 active:duration-100"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {testimonials.map((t) => (
            <motion.article
              key={t.name}
              data-card
              whileHover={{
                scale: 1.04,
                y: -6,
                boxShadow: CARD_HOVER_SHADOW,
                transition: SPRING_HOVER,
              }}
              style={{ boxShadow: CARD_BASE_SHADOW }}
              className="gpu glass-card w-[85%] shrink-0 cursor-pointer snap-start rounded-[var(--radius-card)] p-8 sm:w-[60%] lg:w-[36%]"
            >
              <p className="text-lg leading-relaxed text-ink">
                “{t.quote}”
              </p>
              <div className="mt-8 flex items-center gap-3">
                <Avatar name={t.name} src={t.avatar} />
                <div>
                  <p className="text-[15px] font-medium text-ink">{t.name}</p>
                  <p className="text-[13px] text-ink-faint">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
