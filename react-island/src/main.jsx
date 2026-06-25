import React from 'react'
import { createRoot } from 'react-dom/client'
import MantaBackground from './MantaBackground.jsx'
import { setupTransitions } from './transition.js'
import './styles.css'

// Self-mounting entry: render the manta background into #manta-root wherever
// the host page provides it. Safe to load on every page.
function mount() {
  const el = document.getElementById('manta-root')
  if (!el || el.dataset.mounted === 'true') return
  el.dataset.mounted = 'true'
  // Over the real Jekyll page the canvas must be transparent; the standalone
  // dev preview paints its own ocean. Host opts in via data-transparent="true".
  const transparent = el.dataset.transparent === 'true'
  createRoot(el).render(
    <React.StrictMode>
      <MantaBackground transparent={transparent} />
    </React.StrictMode>,
  )
  setupTransitions()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
