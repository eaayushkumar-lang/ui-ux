import { ScrollVideo } from "@/components/scroll-video";
import { Navbar } from "@/components/navbar";
import { SectionOne } from "@/components/section-one";
import { SectionTwo } from "@/components/section-two";
import { StatsBar } from "@/components/stats-bar";
import { Services } from "@/components/services";
import { AboutFounder } from "@/components/about-founder";
import { Pricing } from "@/components/pricing";
import { CaseStudies } from "@/components/case-studies";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { HERO_VIDEO_URL } from "@/lib/assets";

export default function App() {
  return (
    <div className="relative">
      <ScrollVideo src={HERO_VIDEO_URL} />

      <div className="relative z-10">
        <Navbar />
        <main>
          <SectionOne />
          {/* Critical: gives the scroll video timeline room to scrub
              between the two sections. Do not remove. */}
          <div aria-hidden="true" className="h-[80vh]" />
          <SectionTwo />

          {/* Content sections sit on a solid #0a0a0a surface so they stay
              readable; the cinematic scroll video remains the hero's star. */}
          <div className="relative bg-[#0a0a0a]">
            <StatsBar />
            <Services />
            <AboutFounder />
            <Pricing />
            <CaseStudies />
            <HowItWorks />
            <Testimonials />
            <Faq />
            <FinalCta />
            <Contact />
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
