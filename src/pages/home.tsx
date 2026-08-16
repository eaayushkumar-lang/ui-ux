import { lazy, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { NavDots } from "@/components/nav-dots";
import { ProgressBar } from "@/components/progress-bar";
import { NoiseOverlay } from "@/components/noise-overlay";
import { ScrollVideo } from "@/components/scroll-video";
import { HERO_VIDEO_URL } from "@/lib/hero-video";
import { Hero } from "@/sections/hero";

// Hero renders above the fold on first paint, so it stays a static import.
// Everything below it is off-screen at load time - code-splitting these
// keeps the initial bundle to just what's needed for first paint, and
// useActiveSection watches for these ids to mount instead of requiring them
// synchronously (see watchForElements), so late-mounted sections no longer
// break nav-dot highlighting.
const TrustStrip = lazy(() => import("@/sections/trust-strip").then((m) => ({ default: m.TrustStrip })));
const Services = lazy(() => import("@/sections/services").then((m) => ({ default: m.Services })));
const About = lazy(() => import("@/sections/about").then((m) => ({ default: m.About })));
const Pricing = lazy(() => import("@/sections/pricing").then((m) => ({ default: m.Pricing })));
const CaseStudies = lazy(() =>
  import("@/sections/case-studies").then((m) => ({ default: m.CaseStudies })),
);
const HowItWorks = lazy(() =>
  import("@/sections/how-it-works").then((m) => ({ default: m.HowItWorks })),
);
const Testimonials = lazy(() =>
  import("@/sections/testimonials").then((m) => ({ default: m.Testimonials })),
);
const FAQ = lazy(() => import("@/sections/faq").then((m) => ({ default: m.FAQ })));
const CTA = lazy(() => import("@/sections/cta").then((m) => ({ default: m.CTA })));
const Contact = lazy(() => import("@/sections/contact").then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import("@/components/footer").then((m) => ({ default: m.Footer })));

export function HomePage() {
  return (
    <div className="relative min-h-dvh bg-bg">
      {/* Fixed, full-page scroll-scrubbed video background (z-0). Sections
          below are transparent so it stays visible through the whole page. */}
      <ScrollVideo src={HERO_VIDEO_URL} />
      <NoiseOverlay />
      <ProgressBar />
      <Navbar />
      <NavDots />

      <main>
        <Hero />
        <Suspense fallback={null}>
          <TrustStrip />
          <Services />
          <About />
          <Pricing />
          <CaseStudies />
          <HowItWorks />
          <Testimonials />
          <FAQ />
          <CTA />
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
