// Strong custom easing curves (per emil-design-eng: built-in CSS/Motion
// easings are too weak for UI work).
// - Entering/exiting elements (reveals, dropdowns, icon swaps): ease-out
// - On-screen movement/morphing while staying visible: ease-in-out
// - Drawer-style panels (iOS-like): ease-drawer
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
