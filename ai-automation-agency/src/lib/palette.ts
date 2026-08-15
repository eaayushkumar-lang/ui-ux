import * as THREE from "three";

// Brand palette as THREE.Color instances, shared by every particle effect
// so the violet/amber gradient is defined in exactly one place (CLAUDE.md).
export const VIOLET = new THREE.Color("#6C5CE7");
export const AMBER = new THREE.Color("#F5A623");

/** Blend violet -> amber by t (0..1), writing into `out` to avoid
 * allocating a Color per particle. */
export function mixBrand(out: THREE.Color, t: number) {
  return out.copy(VIOLET).lerp(AMBER, THREE.MathUtils.clamp(t, 0, 1));
}
