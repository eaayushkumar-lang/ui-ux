import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once, at module load - every scroll-linked section imports
// gsap from here rather than the raw package, so the plugin is always
// registered before it's used.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
