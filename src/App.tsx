import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { ComingSoonPage } from "@/pages/coming-soon";
import { ToastProvider } from "@/hooks/use-toast";
import { CursorGlow } from "@/components/cursor-glow";

// Home stays a static import since it's the entry route almost every
// visitor lands on first. Everything else is route-level code-split: each
// only downloads when actually navigated to. This is deliberately NOT
// applied to the home page's own sections (About, Pricing, etc.) - those
// live inside one continuously-scrollable page tracked by
// useActiveSection, which queries document.getElementById synchronously
// on mount; a section whose chunk hasn't resolved yet at that point would
// silently never be observed, breaking the nav dots/Dynamic Island's
// active-section highlighting for it.
const TryAIAgentsPage = lazy(() =>
  import("@/pages/try-ai-agents").then((m) => ({ default: m.TryAIAgentsPage })),
);
const TryAutomationPage = lazy(() =>
  import("@/pages/try-automation").then((m) => ({ default: m.TryAutomationPage })),
);
const TryVoiceAgentPage = lazy(() =>
  import("@/pages/try-voice-agent").then((m) => ({ default: m.TryVoiceAgentPage })),
);
const TryAISystemPage = lazy(() =>
  import("@/pages/try-ai-system").then((m) => ({ default: m.TryAISystemPage })),
);
const ScrollMorphShowcasePage = lazy(() =>
  import("@/pages/scroll-morph-showcase").then((m) => ({ default: m.ScrollMorphShowcasePage })),
);
const BlogPage = lazy(() => import("@/pages/blog").then((m) => ({ default: m.BlogPage })));

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <span className="h-2.5 w-2.5 rounded-full bg-accent motion-safe:animate-breathe" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/try/ai-agents"
          element={
            <Suspense fallback={<RouteFallback />}>
              <TryAIAgentsPage />
            </Suspense>
          }
        />
        <Route
          path="/try/automation"
          element={
            <Suspense fallback={<RouteFallback />}>
              <TryAutomationPage />
            </Suspense>
          }
        />
        <Route
          path="/try/voice-agent"
          element={
            <Suspense fallback={<RouteFallback />}>
              <TryVoiceAgentPage />
            </Suspense>
          }
        />
        <Route
          path="/try/ai-system"
          element={
            <Suspense fallback={<RouteFallback />}>
              <TryAISystemPage />
            </Suspense>
          }
        />
        <Route
          path="/experiments/scroll-morph-hero"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ScrollMorphShowcasePage />
            </Suspense>
          }
        />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<RouteFallback />}>
              <BlogPage />
            </Suspense>
          }
        />
        <Route path="/privacy" element={<ComingSoonPage title="Privacy Policy" />} />
        <Route path="/terms" element={<ComingSoonPage title="Terms of Service" />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    // reducedMotion="user" defers to the OS-level prefers-reduced-motion
    // setting for every Motion-driven transform/opacity animation site-wide
    // (these are set via direct inline style writes each frame, so they sit
    // outside the CSS `!important` escape hatch in index.css - see the
    // comment there). Canvas/SVG-filter-driven effects that Motion doesn't
    // touch (particle field, floating globe, liquid text, this button's
    // cursor-follow sheen) still carry their own useReducedMotion() checks.
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        {/* Independent, additive cursor-follow glow — does not touch the hero
            ScrollFrames layer; disabled for touch / reduced-motion. */}
        <CursorGlow />
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
      </ToastProvider>
    </MotionConfig>
  );
}
