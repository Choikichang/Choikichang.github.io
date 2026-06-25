import React from 'react'
import { Canvas } from '@react-three/fiber'
import MantaSchool from './MantaSchool.jsx'

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function MantaBackground({ transparent = false }) {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280
  const small = w < 760
  // fewer fish + lighter render on small / low-power devices
  const count = small ? 5 : 8
  const dpr = small ? 1 : [1, 1.6]

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

      <MantaSchool count={count} paused={reduceMotion} />
    </Canvas>
  )
}
