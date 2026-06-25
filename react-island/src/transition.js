import { bus, surge } from './bus.js'

// "A giant manta wipes across the screen." Outgoing: the hero manta sweeps from
// the edge to centre while the ocean veil fades the page out; at the covered
// midpoint we navigate (the reload is hidden). Incoming: the hero starts centred
// and sweeps off the far edge while the veil clears, revealing the new page. The
// background school keeps drifting throughout. On an MPA the veil guarantees a
// clean cover even if WebGL stalls.

const SWEEP_OUT = 620 // edge -> centre (cover)
const SWEEP_IN = 780 // centre -> edge (reveal)

const easeIn = (p) => p * p
const easeOut = (p) => 1 - (1 - p) * (1 - p)

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

function setVeil(el, o) {
  el.style.transition = 'none'
  el.style.opacity = String(o)
}

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
  const root = document.documentElement
  const reduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Arriving mid-transition: hero centred + covered -> sweep off + reveal.
  if (sessionStorage.getItem('mantaReveal') === '1') {
    sessionStorage.removeItem('mantaReveal')
    root.classList.add('manta-crossing')
    setVeil(veil, 1)
    if (reduce) {
      bus.cross = -1
      requestAnimationFrame(() => {
        tween(1, 0, 400, easeOut, (o) => setVeil(veil, o), () => root.classList.remove('manta-crossing'))
      })
    } else {
      bus.cross = 0.5
      surge(1)
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          tween(0.5, 1, SWEEP_IN, easeOut, (c) => {
            bus.cross = c
            setVeil(veil, Math.max(0, 1 - (c - 0.5) / 0.5))
          }, () => {
            bus.cross = -1
            root.classList.remove('manta-crossing')
          }),
        ),
      )
    }
    setTimeout(() => root.classList.remove('manta-crossing'), SWEEP_IN + 600) // safety
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

      root.classList.add('manta-crossing')
      surge(1)
      if (reduce) {
        bus.cross = -1
        setVeil(veil, 0)
        tween(0, 1, 320, easeIn, (o) => setVeil(veil, o), go)
      } else {
        bus.cross = 0
        tween(0, 0.5, SWEEP_OUT, easeIn, (c) => {
          bus.cross = c
          setVeil(veil, Math.min(1, c / 0.45))
        }, go)
      }
      setTimeout(go, (reduce ? 320 : SWEEP_OUT) + 80) // safety: always navigates
    },
    true,
  )
}
