// Adaptive quality: scale particle DENSITY (not frame rate) by device signals.
// `window.__forceLowEnd = true|false` overrides detection for deterministic tests.

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
    return { count: 42000, pixelRatio: 1, tier: "low" };
  }
  return { count: 95000, pixelRatio: Math.min(window.devicePixelRatio || 1, 2), tier: "high" };
}
