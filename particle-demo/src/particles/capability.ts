// Adaptive quality: pick a particle budget + pixel ratio from device signals.
// The goal is to hold 60fps by scaling visual DENSITY down on weaker hardware,
// never by dropping the frame rate. Mirrors the scroll-video low-end check.
//
// `window.__forceLowEnd = true|false` overrides detection (used to verify the
// low-end path deterministically, exactly like the earlier scroll-video test).

export interface Caps {
  count: number;
  pixelRatio: number;
  tier: "high" | "low";
}

export function detectCaps(): Caps {
  const forced = (window as unknown as { __forceLowEnd?: boolean }).__forceLowEnd;
  const cores = navigator.hardwareConcurrency || 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  const low =
    typeof forced === "boolean"
      ? forced
      : cores <= 4 || (typeof mem === "number" && mem <= 4);

  if (low) {
    return { count: 36000, pixelRatio: 1, tier: "low" };
  }
  return { count: 90000, pixelRatio: Math.min(window.devicePixelRatio || 1, 2), tier: "high" };
}
