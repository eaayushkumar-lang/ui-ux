interface StatRefs {
  count: (el: HTMLSpanElement | null) => void;
  ms: (el: HTMLSpanElement | null) => void;
  cold: (el: HTMLSpanElement | null) => void;
  fps: (el: HTMLSpanElement | null) => void;
  tier: (el: HTMLSpanElement | null) => void;
}

/** Live readout, bottom of viewport. Values are written imperatively to these
 * spans from the render loop (real numbers, never placeholders). */
export function Stats({ refs }: { refs: StatRefs }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2">
      <div className="font-mono-stat flex flex-wrap items-center justify-center gap-x-5 gap-y-1 rounded-xl border border-white/10 bg-black/55 px-5 py-2.5 text-[12px] backdrop-blur-md">
        <Stat label="particles" refCb={refs.count} unit="" />
        <Stat label="frame" refCb={refs.ms} unit="ms" />
        <Stat label="cold start" refCb={refs.cold} unit="s" />
        <Stat label="fps" refCb={refs.fps} unit="" />
        <Stat label="tier" refCb={refs.tier} unit="" />
      </div>
    </div>
  );
}

function Stat({
  label,
  refCb,
  unit,
}: {
  label: string;
  refCb: (el: HTMLSpanElement | null) => void;
  unit: string;
}) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-white/40">{label}</span>
      <span ref={refCb} className="tabular-nums text-teal-300">
        —
      </span>
      {unit && <span className="text-white/30">{unit}</span>}
    </span>
  );
}
