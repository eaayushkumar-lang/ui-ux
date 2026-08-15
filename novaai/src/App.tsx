import { ScrollVideo } from "@/components/scroll-video";
import { Navbar } from "@/components/navbar";
import { SectionOne } from "@/components/section-one";
import { SectionTwo } from "@/components/section-two";
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
        </main>
      </div>
    </div>
  );
}
