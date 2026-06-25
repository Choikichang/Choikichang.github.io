import React, { useMemo } from 'react'
import * as THREE from 'three'
import { buildManta } from './mantaGeometry.js'
import Manta from './Manta.jsx'

// A loose school of mantas migrating across the view. Geometry + material are
// built once and shared by every fish (cheap: ~3 meshes per manta, no per-fish
// geometry).
export default function MantaSchool({ count = 8, detail = 0.2, bounds = 16, paused = false }) {
  const parts = useMemo(() => buildManta(detail), [detail])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading: true,
        roughness: 0.78,
        metalness: 0.04,
      }),
    [],
  )

  const fleet = useMemo(() => {
    const r = (a, b) => a + Math.random() * (b - a)
    return Array.from({ length: count }, () => ({
      x0: r(-bounds, bounds),
      y0: r(-1.6, 1.8),
      z0: r(-7, 4), // depth lanes for parallax
      scale: r(0.3, 0.5), // small-ish background fish
      speed: r(0.5, 1.05),
      dir: 1, // a cohesive school drifts the same way
      bobAmp: r(0.25, 0.6),
      bobSpeed: r(0.5, 0.9),
      flapSpeed: r(1.0, 1.6),
      flapAmount: r(0.28, 0.42),
      phase: r(0, Math.PI * 2),
    }))
  }, [count, bounds])

  return (
    <group>
      {fleet.map((p, i) => (
        <Manta key={i} parts={parts} material={material} params={p} bounds={bounds} paused={paused} />
      ))}
    </group>
  )
}
