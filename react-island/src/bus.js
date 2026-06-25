// Tiny shared store so the (vanilla) page-transition code can talk to the
// (React) manta scene without prop drilling or window-event plumbing.
export const bus = {
  surge: 0, // 0..1 — boosts swim speed/flap during a page transition
  dir: 1, // exit direction for the swoosh (+1 = swim right, -1 = left)
}

// Kick off the "mantas swoosh across" surge; it decays each frame in the scene.
export function surge(dir = 1) {
  bus.dir = dir
  bus.surge = 1
}
