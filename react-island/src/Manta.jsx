import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { bus } from './bus.js'

// One manta gliding in the horizontal plane (viewed from slightly above so the
// navy back shows; banking reveals the white belly). Shares geometry with the
// rest of the school. Reads bus.surge to swoosh across during page transitions.
export default function Manta({ parts, material, params: p, bounds = 16, paused = false }) {
  const root = useRef()
  const left = useRef()
  const right = useRef()

  useFrame((state, delta) => {
    const g = root.current
    if (!g || paused) return
    const t = state.clock.elapsedTime
    // The school keeps a calm cruise; the *camera* provides the dive motion.
    g.position.x += p.dir * p.speed * delta

    // startle: flinch + dart away fast from a recent pointer poke (mouse/touch)
    let startle = 0
    const sk = bus.startle
    const age = (performance.now() - sk.t) / 1000
    if (age >= 0 && age < 1.1) {
      const dx = g.position.x - sk.x
      const dz = g.position.z - sk.z
      const dist = Math.hypot(dx, dz)
      const R = 7 // reaction radius
      if (dist < R) {
        startle = (1 - dist / R) * Math.exp(-age * 2.4) // strong, then fades
        g.position.x += (dx >= 0 ? 1 : -1) * startle * 16 * delta // dart across
      }
    }

    if (g.position.x > bounds) g.position.x = -bounds
    else if (g.position.x < -bounds) g.position.x = bounds
    g.position.y = p.y0 + Math.sin(t * p.bobSpeed + p.phase) * p.bobAmp
    g.position.z = p.z0 + Math.sin(t * 0.25 + p.phase) * 0.6

    g.rotation.y = (p.dir >= 0 ? -Math.PI / 2 : Math.PI / 2) + Math.sin(t * 0.3 + p.phase) * 0.12
    g.rotation.z = Math.sin(t * 0.5 + p.phase) * 0.09 + startle * 0.45 // bank + flinch

    const flap =
      Math.sin(t * p.flapSpeed + p.phase) * p.flapAmount * (1 + bus.surge * 0.8) + startle * 0.8
    if (right.current) right.current.rotation.z = flap
    if (left.current) left.current.rotation.z = -flap
  })

  return (
    <group ref={root} position={[p.x0, p.y0, p.z0]} scale={p.scale}>
      <mesh geometry={parts.center} material={material} />
      <group ref={right}>
        <mesh geometry={parts.right} material={material} />
      </group>
      <group ref={left}>
        <mesh geometry={parts.left} material={material} />
      </group>
    </group>
  )
}
