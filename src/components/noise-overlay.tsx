const NOISE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
  <rect width="100%" height="100%" filter="url(#n)" />
</svg>`;

const NOISE_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

/**
 * Fixed, pointer-events-none grain texture. Never applied to a scrolling
 * container - painted once at the viewport level so it doesn't trigger
 * repaints as the page scrolls.
 */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[55] opacity-[0.05] mix-blend-overlay"
      style={{ backgroundImage: NOISE_DATA_URI }}
    />
  );
}
