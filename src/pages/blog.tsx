import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { TrialShell } from "@/components/trial-shell";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { useCursorGlow } from "@/hooks/use-cursor-glow";
import { useToast } from "@/hooks/use-toast";

const CARD_HOVER_SHADOW =
  "0 0 0 1px rgba(193,80,46,0.4), 0 26px 52px -20px rgba(0,0,0,0.65), 0 0 40px -8px rgba(193,80,46,0.35)";
const CARD_BASE_SHADOW =
  "0 0 0 1px rgba(193,80,46,0), 0 26px 52px -20px rgba(0,0,0,0), 0 0 40px -8px rgba(193,80,46,0)";

interface Post {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const posts: Post[] = [
  {
    title: "How AI Agents Are Replacing Traditional Customer Support",
    excerpt:
      "Response times, coverage, and cost all move in the same direction once an agent owns the first reply. Here's what actually changes.",
    date: "Jul 28, 2026",
    readTime: "6 min read",
  },
  {
    title: "5 Workflows Every Business Should Automate in 2026",
    excerpt:
      "Not every process is worth automating. These five consistently pay back their setup cost within the first quarter.",
    date: "Jul 14, 2026",
    readTime: "5 min read",
  },
  {
    title: "Voice Agents vs Chatbots: Which Is Right for Your Business?",
    excerpt:
      "Text and voice solve different problems. A practical framework for deciding which channel your customers actually want.",
    date: "Jun 30, 2026",
    readTime: "7 min read",
  },
  {
    title: "The True ROI of AI Automation: A Data-Driven Analysis",
    excerpt:
      "Beyond the headline efficiency numbers - what automation actually returns once you account for setup, maintenance, and edge cases.",
    date: "Jun 12, 2026",
    readTime: "8 min read",
  },
  {
    title: "Building Your First AI System: A Step-by-Step Guide",
    excerpt:
      "From mapping your first workflow to shipping a live agent - the exact sequence we walk every new client through.",
    date: "May 22, 2026",
    readTime: "9 min read",
  },
  {
    title: "Why 80% of Businesses Will Use AI Agents by 2027",
    excerpt:
      "The adoption curve is steeper than most projections assume. Here's the data behind that number, and what it means for laggards.",
    date: "May 3, 2026",
    readTime: "6 min read",
  },
];

export function BlogPage() {
  return (
    <TrialShell title="AI Insights & Updates" eyebrow="Blog">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((post, i) => (
          <PostCard key={post.title} post={post} index={i} />
        ))}
      </div>
    </TrialShell>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const { ref, onMouseMove } = useCursorGlow<HTMLDivElement>();
  const { notify } = useToast();

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
      whileHover={{ scale: 1.02, y: -4, boxShadow: CARD_HOVER_SHADOW, transition: SPRING_HOVER }}
      style={{ boxShadow: CARD_BASE_SHADOW }}
      className="gpu cursor-glow glass-card flex flex-col rounded-[var(--radius-card)] p-6"
    >
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.04em] text-ink-faint">
        <span>{post.date}</span>
        <span className="h-1 w-1 rounded-full bg-ink-faint/60" aria-hidden="true" />
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" strokeWidth={1.75} />
          {post.readTime}
        </span>
      </div>

      <h3 className="mt-4 text-[17px] font-medium leading-snug text-ink">{post.title}</h3>
      <p className="mt-2.5 line-clamp-2 flex-1 text-[14px] leading-relaxed text-ink-dim">
        {post.excerpt}
      </p>

      <button
        type="button"
        onClick={() => notify("Full posts are coming soon - check back shortly.")}
        className="group mt-5 flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-accent transition-colors hover:text-coral"
      >
        Read More
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
          strokeWidth={1.75}
        />
      </button>
    </motion.article>
  );
}
