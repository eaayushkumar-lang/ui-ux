import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NavDots } from "@/components/nav-dots";
import { ProgressBar } from "@/components/progress-bar";
import { NoiseOverlay } from "@/components/noise-overlay";
import { ParticleField } from "@/components/particle-field";
import { FloatingGlobe } from "@/components/floating-globe";
import { Hero } from "@/sections/hero";
import { TrustStrip } from "@/sections/trust-strip";
import { Services } from "@/sections/services";
import { About } from "@/sections/about";
import { Pricing } from "@/sections/pricing";
import { CaseStudies } from "@/sections/case-studies";
import { HowItWorks } from "@/sections/how-it-works";
import { Testimonials } from "@/sections/testimonials";
import { FAQ } from "@/sections/faq";
import { CTA } from "@/sections/cta";
import { Contact } from "@/sections/contact";

export function HomePage() {
  return (
    <div className="relative min-h-dvh bg-bg">
      <NoiseOverlay />
      <FloatingGlobe />
      <ParticleField />
      <ProgressBar />
      <Navbar />
      <NavDots />

      <main>
        <Hero />
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
      </main>

      <Footer />
    </div>
  );
}
