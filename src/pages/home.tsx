import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NavDots } from "@/components/nav-dots";
import { ProgressBar } from "@/components/progress-bar";
import { Hero } from "@/sections/hero";
import { TrustStrip } from "@/sections/trust-strip";
import { Services } from "@/sections/services";
import { HowItWorks } from "@/sections/how-it-works";
import { Testimonials } from "@/sections/testimonials";
import { FAQ } from "@/sections/faq";
import { CTA } from "@/sections/cta";

export function HomePage() {
  return (
    <div className="relative min-h-dvh bg-bg">
      <ProgressBar />
      <Navbar />
      <NavDots />

      <main>
        <Hero />
        <TrustStrip />
        <Services />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
