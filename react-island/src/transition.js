import { surge } from './bus.js'

// "Mantas swoosh across, ocean veil wipes, page swaps." On a multi-page Jekyll
// site we can't keep one canvas alive across navigations, so we sell the
// transition with a DOM veil (robust) + a surge of the background school
// (flair). The veil guarantees a clean cover/reveal even if WebGL is slow.

const FADE_MS = 600

function makeVeil() {
  let el = document.getElementById('manta-veil')
  if (el) return el
  el = document.createElement('div')
  el.id = 'manta-veil'
  document.body.appendChild(el)
  return el
}

// Returns the resolved URL string if `a` is a safe in-site navigation, else null.
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

  // Arriving mid-transition: start covered, then wipe the veil away.
  if (sessionStorage.getItem('mantaReveal') === '1') {
    sessionStorage.removeItem('mantaReveal')
    veil.classList.add('show')
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        surge(1)
        veil.classList.remove('show')
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
      surge(1)
      veil.classList.add('show')
      let navigated = false
      const go = () => {
        if (navigated) return
        navigated = true
        sessionStorage.setItem('mantaReveal', '1')
        location.href = href
      }
      setTimeout(go, FADE_MS + 60) // safety: always navigates
    },
    true,
  )
}
