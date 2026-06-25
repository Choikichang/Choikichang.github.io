import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { bus } from './bus.js'

// The giant "wipe" manta. Hidden until a page transition runs (bus.cross >= 0),
// then it sweeps left -> right across the camera, big enough to curtain the
// screen at the midpoint. Tune the constants below to taste.
const HSPAN = 26 // how far off-screen it starts/ends (world x)
const HERO_Y = 6 // height (closer to the overhead camera)
const HERO_Z = 6 // depth (in front of the school, nearer the camera)
const HERO_SCALE = 1.35 // overall size — bigger = covers more
const lerp = (a, b, t) => a + (b - a) * t

export default function HeroManta({ parts, material }) {
  const ref = useRef()
  const rWing = useRef()
  const lWing = useRef()

  useFrame((state) => {
    const g = ref.current
    if (!g) return
    const c = bus.cross
    const active = c >= 0 && c <= 1
    g.visible = active
    if (!active) return

    const t = state.clock.elapsedTime
    g.position.x = lerp(-HSPAN, HSPAN, c)
    g.position.y = HERO_Y + Math.sin(t * 2) * 0.25
    g.position.z = HERO_Z
    g.rotation.x = -0.35 // tip the planform up toward the high camera
    g.rotation.y = -Math.PI / 2 + Math.sin(t * 3) * 0.05 // head leads the sweep
    g.rotation.z = (c - 0.5) * 0.5 // bank through the pass

    const flap = Math.sin(t * 6) * 0.5 // big slow-mo wing beats
    if (rWing.current) rWing.current.rotation.z = flap
    if (lWing.current) lWing.current.rotation.z = -flap
  })

  return (
    <group ref={ref} scale={HERO_SCALE} visible={false}>
      <mesh geometry={parts.center} material={material} />
      <group ref={rWing}>
        <mesh geometry={parts.right} material={material} />
      </group>
      <group ref={lWing}>
        <mesh geometry={parts.left} material={material} />
      </group>
    </group>
  )
}
