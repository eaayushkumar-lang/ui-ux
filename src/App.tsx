import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { TryAIAgentsPage } from "@/pages/try-ai-agents";
import { TryAutomationPage } from "@/pages/try-automation";
import { TryVoiceAgentPage } from "@/pages/try-voice-agent";
import { TryAISystemPage } from "@/pages/try-ai-system";
import { ScrollMorphShowcasePage } from "@/pages/scroll-morph-showcase";

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
        <Route path="/try/ai-agents" element={<TryAIAgentsPage />} />
        <Route path="/try/automation" element={<TryAutomationPage />} />
        <Route path="/try/voice-agent" element={<TryVoiceAgentPage />} />
        <Route path="/try/ai-system" element={<TryAISystemPage />} />
        <Route path="/experiments/scroll-morph-hero" element={<ScrollMorphShowcasePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
