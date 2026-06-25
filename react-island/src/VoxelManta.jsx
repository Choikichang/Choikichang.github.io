import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const UNIT = 0.5
const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1)

// Build voxel specs for the body/tail (center, x≈0) and ONE wing (right, +x).
// The left wing is the same specs mirrored across x at render time.
function buildVoxels() {
  const center = []
  const wing = []

  // Body column running front(-z) to back(+z)
  const bodyLen = 7
  for (let i = 0; i < bodyLen; i++) {
    const z = (i - (bodyLen - 1) / 2) * UNIT
    const front = i < 2
    const sy = front ? 0.7 : 1.0 - (i / bodyLen) * 0.35
    center.push({ pos: [0, 0, z], scale: [UNIT * 1.6, UNIT * sy, UNIT] })
  }
  // Head leading edge + two cephalic "horns"
  const nose = -((bodyLen - 1) / 2) * UNIT
  center.push({ pos: [0, 0.05, nose - UNIT], scale: [UNIT * 1.2, UNIT * 0.55, UNIT * 0.9] })
  for (const s of [-1, 1]) {
    center.push({ pos: [s * UNIT, 0, nose - UNIT * 1.1], scale: [UNIT * 0.55, UNIT * 0.4, UNIT * 0.8] })
  }
  // Whip tail trailing back (+z)
  const tailLen = 7
  for (let i = 1; i <= tailLen; i++) {
    const z = ((bodyLen - 1) / 2) * UNIT + i * UNIT
    const th = Math.max(0.55 - i * 0.06, 0.12)
    center.push({ pos: [0, 0, z], scale: [UNIT * th, UNIT * th, UNIT] })
  }

  // Right wing: a tapering, back-swept triangular sweep
  const span = 8
  for (let wx = 1; wx <= span; wx++) {
    const t = wx / span
    const chord = Math.max(Math.round((1 - t) * 6) + 1, 1)
    const sweep = t * 1.4
    const thickness = (1 - t) * 0.55 + 0.12
    const yArc = Math.sin(t * Math.PI * 0.5) * 0.25
    for (let c = 0; c < chord; c++) {
      const z = (c - (chord - 1) / 2) * UNIT + sweep
      const lead = c === 0 ? 1 : 0.55
      wing.push({ pos: [wx * UNIT, yArc * lead, z], scale: [UNIT, UNIT * thickness, UNIT] })
    }
  }

  return { center, wing }
}

export default function VoxelManta({
  paused = false,
  color = '#4b3a78',
  flapSpeed = 1.6,
  flapAmount = 0.5,
  drift = true,
}) {
  const root = useRef()
  const leftWing = useRef()
  const rightWing = useRef()
  const { center, wing } = useMemo(() => buildVoxels(), [])
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.05 }),
    [color],
  )

  useFrame((state) => {
    if (paused) return
    const t = state.clock.elapsedTime
    const flap = Math.sin(t * flapSpeed) * flapAmount
    if (rightWing.current) rightWing.current.rotation.z = flap
    if (leftWing.current) leftWing.current.rotation.z = -flap
    if (root.current) {
      root.current.position.y = Math.sin(t * 0.8) * 0.3
      root.current.rotation.y = Math.sin(t * 0.25) * 0.25
      root.current.rotation.z = Math.sin(t * 0.5) * 0.05
      if (drift) root.current.position.x = ((t * 0.6 + 12) % 24) - 12
    }
  })

  return (
    <group ref={root}>
      {center.map((v, i) => (
        <mesh key={`c${i}`} geometry={UNIT_BOX} position={v.pos} scale={v.scale} material={mat} />
      ))}
      <group ref={rightWing}>
        {wing.map((v, i) => (
          <mesh key={`r${i}`} geometry={UNIT_BOX} position={v.pos} scale={v.scale} material={mat} />
        ))}
      </group>
      <group ref={leftWing}>
        {wing.map((v, i) => (
          <mesh
            key={`l${i}`}
            geometry={UNIT_BOX}
            position={[-v.pos[0], v.pos[1], v.pos[2]]}
            scale={v.scale}
            material={mat}
          />
        ))}
      </group>
    </group>
  )
}
