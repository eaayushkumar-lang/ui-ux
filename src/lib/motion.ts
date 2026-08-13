// Strong custom easing curves (per emil-design-eng: built-in CSS/Motion
// easings are too weak for UI work).
// - Entering/exiting elements (reveals, dropdowns, icon crossfades): ease-out
// - On-screen movement/morphing while staying visible: ease-in-out
// - Drawer-style panels (iOS-like): ease-drawer
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

// Spring presets. Two distinct feels, chosen by what's moving:
// - SPRING_HOVER: fast, tight response for pointer-driven pop-out
//   interactions (cards, buttons, nav links) - the element should feel like
//   it's reacting instantly to the cursor.
// - SPRING_SMOOTH: slower, heavier, used to smooth continuous scroll-linked
//   values (the top progress bar) so they glide instead of snapping frame
//   to frame.
export const SPRING_HOVER = { type: "spring", stiffness: 300, damping: 20 } as const;
export const SPRING_SMOOTH = { type: "spring", stiffness: 100, damping: 30, mass: 0.5 } as const;
// Dynamic Island nav: pill morph and active-item indicator share this spring
// so the whole component reads as one physical object.
export const SPRING_ISLAND = { type: "spring", stiffness: 300, damping: 25 } as const;
// Hero robot: parts flying into an exploded-assembly entrance want real
// heft and a touch of overshoot (lower damping than SPRING_SMOOTH) so they
// feel physically thrown into place rather than eased in.
export const SPRING_ENTRANCE = { type: "spring", stiffness: 80, damping: 12, mass: 1 } as const;
// Hero robot: head tracking the cursor - soft and slow enough to read as a
// deliberate glance rather than a jittery snap-to-pointer.
export const SPRING_HEAD_TILT = { type: "spring", stiffness: 120, damping: 18, mass: 0.6 } as const;
