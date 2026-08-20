import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { EASE_OUT as EASE, SPRING_HOVER } from "@/lib/motion";
import { WHATSAPP_LINK } from "@/lib/links";

const POPUP_SHOWN_KEY = "aurevyn_wa_popup_shown";
const POPUP_DELAY_MS = 2500;
const POPUP_AUTO_DISMISS_MS = 7000;

/** Site-wide floating WhatsApp CTA, mounted once at the app root (like
 * ToastProvider/CursorGlow) so it's present on every route. Bottom-right,
 * clear of NavDots (right-center) and the toast layer (bottom-center). */
export function WhatsAppButton() {
  const [popupVisible, setPopupVisible] = useState(false);

  // Show the greeting bubble once per browser session, not on every mount/
  // route change - sessionStorage survives client-side navigation within
  // the tab but resets on a fresh tab, matching "once per session".
  useEffect(() => {
    if (sessionStorage.getItem(POPUP_SHOWN_KEY)) return;
    const showTimer = window.setTimeout(() => {
      setPopupVisible(true);
      sessionStorage.setItem(POPUP_SHOWN_KEY, "1");
    }, POPUP_DELAY_MS);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!popupVisible) return;
    const hideTimer = window.setTimeout(() => setPopupVisible(false), POPUP_AUTO_DISMISS_MS);
    return () => window.clearTimeout(hideTimer);
  }, [popupVisible]);

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {popupVisible && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="glass-card relative flex max-w-[230px] items-center pr-7 text-[13px] leading-snug text-ink shadow-[0_20px_48px_-20px_rgba(0,0,0,0.8),0_0_32px_-12px_rgba(193,80,46,0.35)]"
          >
            <span className="py-3 pl-4">👋 Chat with us on WhatsApp</span>
            <button
              type="button"
              onClick={() => setPopupVisible(false)}
              aria-label="Dismiss"
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-ink-faint transition-colors hover:text-ink"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={SPRING_HOVER}
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-2 text-accent-ink shadow-[0_0_0_1px_rgba(193,80,46,0.35),0_20px_40px_-14px_rgba(158,58,28,0.75)]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-accent/50 motion-safe:animate-breathe"
        />
        <MessageCircle className="relative h-6 w-6" strokeWidth={1.75} />
      </motion.a>
    </div>
  );
}
