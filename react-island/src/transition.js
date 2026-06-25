import { bus, surge } from './bus.js'

// "Dive forward into the deep, then surface on the next page." On a multi-page
// Jekyll site the canvas can't survive a navigation, so we choreograph it as
// cover -> reveal: the outgoing page dives the camera forward through the school
// while an ocean veil closes in; the incoming page starts deep and rises back
// up out of the veil. The veil guarantees a clean cover even if WebGL stalls.

const DIVE_MS = 700 // outgoing dive
const RISE_MS = 800 // incoming surface

const easeIn = (p) => p * p * p
const easeOut = (p) => 1 - Math.pow(1 - p, 3)

function tween(from, to, ms, ease, onUpdate, onDone) {
  const start = performance.now()
  const step = (now) => {
    const p = Math.min(1, (now - start) / ms)
    onUpdate(from + (to - from) * ease(p))
    if (p < 1) requestAnimationFrame(step)
    else if (onDone) onDone()
  }
  requestAnimationFrame(step)
}

function makeVeil() {
  let el = document.getElementById('manta-veil')
  if (el) return el
  el = document.createElement('div')
  el.id = 'manta-veil'
  document.body.appendChild(el)
  return el
}

// Resolved URL string if `a` is a safe in-site navigation, else null.
function internalHref(a) {
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return null
  const raw = a.getAttribute('href')
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return null
  let url
  try {
    url = new URL(a.href, location.href)
  } catch {
    return null
  }
  if (url.origin !== location.origin) return null
  if (/\.(pdf|zip|png|jpe?g|svg|gif|docx?|pptx?|xlsx?)$/i.test(url.pathname)) return null
  if (url.pathname === location.pathname && url.search === location.search) return null
  return url.href
}

export function setupTransitions() {
  const veil = makeVeil()
  const reduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Arriving mid-transition: start deep + covered, then rise and clear.
  if (sessionStorage.getItem('mantaReveal') === '1') {
    sessionStorage.removeItem('mantaReveal')
    bus.dive = reduce ? 0 : 1
    veil.classList.add('show')
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        surge(1)
        veil.classList.remove('show')
        if (!reduce) tween(1, 0, RISE_MS, easeOut, (v) => (bus.dive = v))
      }),
    )
  }

  document.addEventListener(
    'click',
    (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest && e.target.closest('a')
      const href = internalHref(a)
      if (!href) return
      e.preventDefault()

      let navigated = false
      const go = () => {
        if (navigated) return
        navigated = true
        sessionStorage.setItem('mantaReveal', '1')
        location.href = href
      }

      surge(1)
      veil.classList.add('show')
      if (!reduce) tween(0, 1, DIVE_MS, easeIn, (v) => (bus.dive = v))
      setTimeout(go, (reduce ? 260 : DIVE_MS) + 40) // also fires on dive end via safety margin
    },
    true,
  )
}
