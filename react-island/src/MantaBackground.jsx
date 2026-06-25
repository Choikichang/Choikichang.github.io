import React, { useMemo, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildManta } from './mantaGeometry.js'
import MantaSchool from './MantaSchool.jsx'
import HeroManta from './HeroManta.jsx'
import { bus } from './bus.js'

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Listens for clicks/taps anywhere (the canvas is pointer-events:none, so the
// page keeps working) and turns them into a world-space "poke" the school darts
// away from. Works for mouse and touch via Pointer Events.
function Pointer() {
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    const ray = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0) // the y = 0 water plane
    const ndc = new THREE.Vector2()
    const hit = new THREE.Vector3()
    const onDown = (e) => {
      ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
      ray.setFromCamera(ndc, camera)
      if (ray.ray.intersectPlane(plane, hit)) {
        bus.startle.x = hit.x
        bus.startle.z = hit.z
        bus.startle.t = performance.now()
      }
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [camera])
  return null
}

export default function MantaBackground({ transparent = false }) {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280
  const small = w < 760
  const count = small ? 5 : 8
  const dpr = small ? 1 : [1, 1.6]

  // geometry + material built once, shared by the whole school and the hero
  const parts = useMemo(() => buildManta(0.2), [])
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

  return (
    <Canvas
      camera={{ position: [0, 12, 11], fov: 50 }}
      dpr={dpr}
      gl={{ antialias: !small, alpha: transparent, powerPreference: 'high-performance' }}
      frameloop={reduceMotion ? 'demand' : 'always'}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      {!transparent && <color attach="background" args={['#08182f']} />}
      <fog attach="fog" args={['#08182f', 16, 44]} />

      <ambientLight intensity={0.6} />
      <hemisphereLight args={['#bcd4ff', '#08152b', 0.6]} />
      <directionalLight position={[8, 14, 6]} intensity={1.2} />
      <directionalLight position={[-8, 6, -6]} intensity={0.4} color="#5b7cff" />

      <Pointer />
      <MantaSchool parts={parts} material={material} count={count} paused={reduceMotion} />
      <HeroManta parts={parts} material={material} />
    </Canvas>
  )
}
