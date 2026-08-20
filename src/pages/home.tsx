import { lazy, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { NavDots } from "@/components/nav-dots";
import { ProgressBar } from "@/components/progress-bar";
import { NoiseOverlay } from "@/components/noise-overlay";
import { ScrollFrames } from "@/components/scroll-frames";
import { BrandIntro } from "@/components/brand-intro";
import { Hero } from "@/sections/hero";

const TrustStrip = lazy(() => import("@/sections/trust-strip").then((m) => ({ default: m.TrustStrip })));
const Problem = lazy(() => import("@/sections/problem").then((m) => ({ default: m.Problem })));
const Services = lazy(() => import("@/sections/services").then((m) => ({ default: m.Services })));
const WhatYouGet = lazy(() => import("@/sections/what-you-get").then((m) => ({ default: m.WhatYouGet })));
const RealSystems = lazy(() => import("@/sections/real-systems").then((m) => ({ default: m.RealSystems })));
const HowItWorks = lazy(() =>
  import("@/sections/how-it-works").then((m) => ({ default: m.HowItWorks })),
);
const Demo = lazy(() => import("@/sections/demo").then((m) => ({ default: m.Demo })));
const Industries = lazy(() => import("@/sections/industries").then((m) => ({ default: m.Industries })));
const About = lazy(() => import("@/sections/about").then((m) => ({ default: m.About })));
const Process = lazy(() => import("@/sections/process").then((m) => ({ default: m.Process })));
const Contact = lazy(() => import("@/sections/contact").then((m) => ({ default: m.Contact })));
const FAQ = lazy(() => import("@/sections/faq").then((m) => ({ default: m.FAQ })));
const Pricing = lazy(() => import("@/sections/pricing").then((m) => ({ default: m.Pricing })));
const CTA = lazy(() => import("@/sections/cta").then((m) => ({ default: m.CTA })));
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

      {/* Conversion funnel: attention -> problem -> offer clarity ->
          proof -> desire -> understanding -> action. */}
      <main>
        <Hero />
        <Suspense fallback={null}>
          <TrustStrip />
          <Problem />
          <Services />
          <WhatYouGet />
          <RealSystems />
          <HowItWorks />
          <Demo />
          <Industries />
          <About />
          <Process />
          <Contact />
          <FAQ />
          <Pricing />
          <CTA />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
