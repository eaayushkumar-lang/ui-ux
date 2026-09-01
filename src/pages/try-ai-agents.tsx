import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Bot, User } from "lucide-react";
import { TrialShell } from "@/components/trial-shell";
import { getSimulatedReply } from "@/lib/simulated-ai";
import { EASE_IN_OUT, EASE_OUT, SPRING_HOVER } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = ["Schedule a meeting", "Summarize this document", "Write an email for me"];

let nextId = 1;

export function TryAIAgentsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId++,
      role: "assistant",
      content: "Hi, I'm the Aurevyn agent. What do you need done?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((prev) => [...prev, { id: nextId++, role: "user", content: trimmed }]);
    setInput("");
    setTyping(true);
    const delay = 700 + Math.random() * 700;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: "assistant", content: getSimulatedReply(trimmed) },
      ]);
      setTyping(false);
    }, delay);
  }

  return (
    <TrialShell title="Try Our AI Agent" eyebrow="AI Agents">
      <div className="mx-auto w-full max-w-2xl">
        <div className="glass-card rounded-[var(--radius-card)] p-4 sm:p-6">
          <div
            ref={scrollRef}
            className="flex h-[420px] flex-col gap-4 overflow-y-auto pr-1 sm:h-[480px]"
          >
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {typing && <TypingIndicator />}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-line/60 pt-4">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                disabled={typing}
                className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-accent/50 hover:text-ink disabled:pointer-events-none disabled:opacity-40"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="mt-4 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask the agent to do something..."
              className="h-12 flex-1 rounded-full border border-line bg-bg/60 px-5 text-sm text-ink placeholder:text-ink-faint focus:border-accent/50 focus:outline-none"
            />
            <motion.button
              type="submit"
              disabled={typing || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING_HOVER}
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-2 text-accent-ink shadow-[0_0_0_1px_rgba(193,80,46,0.35),0_10px_24px_-10px_rgba(158,58,28,0.7)] disabled:pointer-events-none disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp className="h-5 w-5" strokeWidth={2} />
            </motion.button>
          </form>
        </div>
      </div>
    </TrialShell>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}
    >
      <span
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-gradient-to-r from-accent to-accent-2 text-accent-ink" : "bg-accent/15 text-accent",
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" strokeWidth={1.75} />
        ) : (
          <Bot className="h-3.5 w-3.5" strokeWidth={1.75} />
        )}
      </span>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed text-ink",
          isUser
            ? "rounded-tr-sm border border-accent/25 bg-gradient-to-r from-accent/25 to-accent-2/15"
            : "glass-card rounded-tl-sm",
        )}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Bot className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
      <div className="glass-card flex items-center gap-1 rounded-2xl rounded-tl-sm px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-ink-faint"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: EASE_IN_OUT }}
          />
        ))}
      </div>
    </div>
  );
}
