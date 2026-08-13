import { useReducedMotion } from "framer-motion";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

// Same texture the old rotating-Earth Globe used for its sphere.
const EARTH_TEXTURE_URL = "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg";

interface RobotFlybyProps {
  className?: string;
}

/**
 * Hand-built CSS/clip-path armored figure holding a small rotating globe -
 * replaces the earlier Spline-iframe embed (a cross-origin 3D scene we had
 * no way to re-skin - carbon fiber, amber seams, an arc reactor, etc. can
 * only be applied to pixels this app actually paints, not to content
 * inside someone else's iframe). Every plate is a `div` with an angular
 * `clip-path`; the carbon-fiber weave, amber seam border, and hover sheen
 * all live in the injected `.robot-plate` class below so each is painted
 * (and hover-clipped) per plate rather than as one rectangular overlay
 * across the whole figure - the earlier version of this component made
 * that mistake and it visibly recreated the rectangular box this component
 * exists specifically to not have. No wrapping box, border, or background
 * of its own anywhere - the figure floats directly on the page.
 *
 * Reduced motion keeps the same amber Bot-glyph fallback the iframe
 * version used, rather than rendering the full figure with every pulse/
 * float/sheen animation suppressed piecemeal.
 */
export const RobotFlyby = ({ className }: RobotFlybyProps) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center", className)}>
        <Bot className="h-16 w-16 text-accent" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <div className={cn("robot-figure relative h-full w-full", className)}>
      <style>{`
        .robot-figure .robot-plate {
          background-image:
            linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.22) 48%, transparent 61%),
            repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px),
            repeating-linear-gradient(-45deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 4px),
            linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
          background-size: 250% 250%, auto, auto, auto;
          background-position: -60% -60%, 0 0, 0 0, 0 0;
          border: 1.5px solid rgba(255,184,0,0.55);
          box-shadow: 0 0 6px rgba(255,184,0,0.5), inset 0 0 8px rgba(255,184,0,0.12);
          transition: background-position 0.6s ease-out;
        }
        .robot-figure:hover .robot-plate {
          background-position: 160% 160%, 0 0, 0 0, 0 0;
        }
        @keyframes robot-earth-rotate { 0% { background-position: 0 0; } 100% { background-position: 200px 0; } }
        @keyframes robot-reactor-pulse { 0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.92); } 50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); } }
        @keyframes robot-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes robot-energy-flow { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.9; } }
      `}</style>

      <div
        className="relative mx-auto h-full w-full max-w-[280px]"
        style={{ animation: "robot-float 6s ease-in-out infinite" }}
      >
        {/* Legs */}
        <div
          className="robot-plate absolute"
          style={{
            left: "31%",
            top: "60%",
            width: "14%",
            height: "34%",
            clipPath: "polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)",
          }}
        />
        <div
          className="robot-plate absolute"
          style={{
            right: "31%",
            top: "60%",
            width: "14%",
            height: "34%",
            clipPath: "polygon(0% 0%, 88% 0%, 100% 100%, 12% 100%)",
          }}
        />

        {/* Torso */}
        <div
          className="robot-plate absolute left-1/2 -translate-x-1/2"
          style={{
            top: "27%",
            width: "42%",
            height: "32%",
            clipPath: "polygon(14% 0%, 86% 0%, 100% 18%, 100% 100%, 0% 100%, 0% 18%)",
          }}
        >
          <div
            className="absolute left-1/2 top-[36%] h-[28%] w-[28%] rounded-full"
            style={{
              background: "radial-gradient(circle, #fff3d6 0%, #ffb800 45%, #ff6b00 75%, transparent 100%)",
              boxShadow: "0 0 18px 4px rgba(255,184,0,0.85), 0 0 38px 10px rgba(255,184,0,0.35)",
              animation: "robot-reactor-pulse 2.4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Shoulders */}
        <div
          className="robot-plate absolute"
          style={{
            left: "8%",
            top: "23%",
            width: "20%",
            height: "13%",
            clipPath: "polygon(0% 32%, 65% 0%, 100% 38%, 100% 100%, 15% 100%)",
          }}
        />
        <div
          className="robot-plate absolute"
          style={{
            right: "8%",
            top: "23%",
            width: "20%",
            height: "13%",
            clipPath: "polygon(35% 0%, 100% 32%, 85% 100%, 0% 100%, 0% 38%)",
          }}
        />

        {/* Arms: upper arm angled out, forearm angled back in toward the globe */}
        <div
          className="robot-plate absolute origin-top"
          style={{
            left: "12%",
            top: "33%",
            width: "11%",
            height: "22%",
            transform: "rotate(20deg)",
            clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
          }}
        />
        <div
          className="robot-plate absolute origin-top"
          style={{
            left: "18%",
            top: "52%",
            width: "9%",
            height: "15%",
            transform: "rotate(-32deg)",
            clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
          }}
        />
        <div
          className="robot-plate absolute origin-top"
          style={{
            right: "12%",
            top: "33%",
            width: "11%",
            height: "22%",
            transform: "rotate(-20deg)",
            clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
          }}
        />
        <div
          className="robot-plate absolute origin-top"
          style={{
            right: "18%",
            top: "52%",
            width: "9%",
            height: "15%",
            transform: "rotate(32deg)",
            clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
          }}
        />

        {/* Head */}
        <div
          className="robot-plate absolute left-1/2 -translate-x-1/2"
          style={{
            top: "0%",
            width: "24%",
            height: "20%",
            clipPath: "polygon(30% 0%, 70% 0%, 100% 32%, 84% 100%, 16% 100%, 0% 32%)",
          }}
        >
          <div
            className="absolute left-[22%] top-[42%] h-[11%] w-[18%] rounded-full"
            style={{ background: "#ffd770", boxShadow: "0 0 8px 2px rgba(255,184,0,0.9)" }}
          />
          <div
            className="absolute right-[22%] top-[42%] h-[11%] w-[18%] rounded-full"
            style={{ background: "#ffd770", boxShadow: "0 0 8px 2px rgba(255,184,0,0.9)" }}
          />
        </div>

        {/* Amber energy line from the hands down into the globe */}
        <div
          className="absolute left-1/2 top-[62%] h-[13%] w-[2px] -translate-x-1/2"
          style={{
            background: "linear-gradient(to bottom, rgba(255,184,0,0.9), transparent)",
            animation: "robot-energy-flow 1.8s ease-in-out infinite",
          }}
        />

        {/* Globe held between the palms, below the arms' reach */}
        <div
          className="absolute left-1/2 top-[80%] h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
          style={{ boxShadow: "0 0 0 2px rgba(255,184,0,0.45), 0 0 22px 4px rgba(255,184,0,0.4)" }}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url(${EARTH_TEXTURE_URL})`,
              backgroundSize: "cover",
              backgroundPosition: "left",
              animation: "robot-earth-rotate 16s linear infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
};
