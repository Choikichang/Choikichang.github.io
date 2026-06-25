import React from 'react'
import { Canvas } from '@react-three/fiber'
import VoxelManta from './VoxelManta.jsx'

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The underwater scene. `transparent` lets the same scene sit over the real
// Jekyll page (alpha canvas) instead of painting its own ocean (dev preview).
export default function MantaBackground({ transparent = false }) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 16], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: transparent, powerPreference: 'high-performance' }}
      frameloop={reduceMotion ? 'demand' : 'always'}
    >
      {!transparent && <color attach="background" args={['#0b1f3a']} />}
      <fog attach="fog" args={['#0b1f3a', 14, 34]} />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#bcd4ff', '#0a1830', 0.6]} />
      <directionalLight position={[6, 10, 8]} intensity={1.15} />
      <directionalLight position={[-8, -3, -6]} intensity={0.35} color="#5b7cff" />

      <VoxelManta paused={reduceMotion} />
    </Canvas>
  )
}
