// Tiny shared store so the (vanilla) page-transition code can drive the
// (React) manta scene without prop drilling or window-event plumbing.
export const bus = {
  dive: 0, // 0 = normal view, 1 = camera fully dived forward into the deep
  surge: 0, // 0..1 — extra wing-flap energy during a transition
  dir: 1,
}

// Briefly energise the school's flapping during a transition (decays in-scene).
export function surge(dir = 1) {
  bus.dir = dir
  bus.surge = 1
}
