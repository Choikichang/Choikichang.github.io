// Tiny shared store so the (vanilla) page-transition code can drive the
// (React) manta scene without prop drilling or window-event plumbing.
export const bus = {
  cross: -1, // hero-manta sweep position: -1 = idle/hidden, 0..1 = left->right
  surge: 0, // 0..1 — extra wing-flap energy during a transition
  dive: 0, // reserved (camera dive); kept at 0 with the hero-wipe transition
  dir: 1,
}

// Briefly energise flapping during a transition (decays in-scene).
export function surge(dir = 1) {
  bus.dir = dir
  bus.surge = 1
}
