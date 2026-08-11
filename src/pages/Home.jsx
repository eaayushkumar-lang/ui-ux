import Hero from '../components/Hero.jsx';
import Services from '../components/Services.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import Testimonials from '../components/Testimonials.jsx';
import FAQ from '../components/FAQ.jsx';
import CTA from '../components/CTA.jsx';

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
