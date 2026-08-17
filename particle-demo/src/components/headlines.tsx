// Three headline layers, one per formation. Their opacity is driven
// imperatively (from the scene's morph value) via the refCb-captured nodes, so
// they crossfade continuously as the field morphs rather than snapping.

const A = "Motion instead of chrome";
const B = "Reads presence, in motion";

interface LayerProps {
  refCb: (el: HTMLDivElement | null) => void;
}

/** Torus: big line top-left + smaller supporting line right-aligned. */
export function TorusHeadline({ refCb }: LayerProps) {
  return (
    <div
      ref={refCb}
      className="pointer-events-none fixed inset-0 z-20 px-8 py-28 transition-none"
      style={{ opacity: 0 }}
    >
      <h1 className="max-w-2xl text-left text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
        {A}
      </h1>
      <p className="absolute right-8 top-1/2 max-w-xs text-right text-lg text-teal-200/80">{B}</p>
    </div>
  );
}

/** Galaxy: single line, centered, large. */
export function GalaxyHeadline({ refCb }: LayerProps) {
  return (
    <div
      ref={refCb}
      className="pointer-events-none fixed inset-0 z-20 grid place-items-center px-8 transition-none"
      style={{ opacity: 0 }}
    >
      <h1 className="text-center text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
        {B}
      </h1>
    </div>
  );
}

/** Brain: line top-left + line bottom-right. */
export function BrainHeadline({ refCb }: LayerProps) {
  return (
    <div
      ref={refCb}
      className="pointer-events-none fixed inset-0 z-20 px-8 py-28 transition-none"
      style={{ opacity: 0 }}
    >
      <h1 className="max-w-xl text-left text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
        {A}
      </h1>
      <p className="absolute bottom-24 right-8 max-w-md text-right text-2xl font-medium text-teal-200/85 md:text-3xl">
        {B}
      </p>
    </div>
  );
}
