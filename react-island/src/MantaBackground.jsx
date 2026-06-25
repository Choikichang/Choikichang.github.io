import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { buildManta } from './mantaGeometry.js'
import MantaSchool from './MantaSchool.jsx'
import HeroManta from './HeroManta.jsx'

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

      <MantaSchool parts={parts} material={material} count={count} paused={reduceMotion} />
      <HeroManta parts={parts} material={material} />
    </Canvas>
  )
}
