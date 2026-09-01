import { lazy, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { NavDots } from "@/components/nav-dots";
import { ProgressBar } from "@/components/progress-bar";
import { NoiseOverlay } from "@/components/noise-overlay";
import { ScrollFrames } from "@/components/scroll-frames";
import { BrandIntro } from "@/components/brand-intro";
import { Hero } from "@/sections/hero";

const Services = lazy(() => import("@/sections/services").then((m) => ({ default: m.Services })));
const Demo = lazy(() => import("@/sections/demo").then((m) => ({ default: m.Demo })));
const RealSystems = lazy(() => import("@/sections/real-systems").then((m) => ({ default: m.RealSystems })));
const BeforeAfter = lazy(() =>
  import("@/sections/before-after").then((m) => ({ default: m.BeforeAfter })),
);
const HowItWorks = lazy(() =>
  import("@/sections/how-it-works").then((m) => ({ default: m.HowItWorks })),
);
const About = lazy(() => import("@/sections/about").then((m) => ({ default: m.About })));
const Founder = lazy(() => import("@/sections/founder").then((m) => ({ default: m.Founder })));
const Industries = lazy(() => import("@/sections/industries").then((m) => ({ default: m.Industries })));
const FAQ = lazy(() => import("@/sections/faq").then((m) => ({ default: m.FAQ })));
const CTA = lazy(() => import("@/sections/cta").then((m) => ({ default: m.CTA })));
const Contact = lazy(() => import("@/sections/contact").then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import("@/components/footer").then((m) => ({ default: m.Footer })));

export function HomePage() {
  return (
    <div className="relative min-h-dvh bg-bg">
      {/* Fixed, full-page scroll-scrubbed video background (z-0). This
          video/animation is a LOCKED, approved asset — do not modify. */}
      <ScrollFrames />
      <BrandIntro />
      <NoiseOverlay />
      <ProgressBar />
      <Navbar />
      <NavDots />

      {/* Structure: Hero -> What We Automate -> Interactive Demo ->
          Demo Systems by Industry -> Before/After -> How It Works ->
          Why Aurevyn -> Founder -> Built For -> FAQ -> Free Audit CTA -> Contact. */}
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Services />
          <Demo />
          <RealSystems />
          <BeforeAfter />
          <HowItWorks />
          <About />
          <Founder />
          <Industries />
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
