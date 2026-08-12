import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EASE_OUT as EASE } from "@/lib/motion";

interface ToastContextValue {
  notify: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/** Single global toast, mounted once at the app root. Used for
 * not-built-yet interactions (blog post detail pages) that need
 * acknowledgment without a dead link or a fake navigation. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setMessage(msg);
    window.setTimeout(() => {
      setMessage((current) => (current === msg ? null : current));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="glass-card pointer-events-auto flex items-center gap-2.5 rounded-full border border-accent/25 px-5 py-3 text-sm text-ink shadow-[0_20px_48px_-20px_rgba(0,0,0,0.8),0_0_32px_-12px_rgba(255,184,0,0.35)]"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
