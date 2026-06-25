import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import MantaSchool from './MantaSchool.jsx'
import { bus } from './bus.js'

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Camera poses for the forward "dive into the deep" transition.
const HOME = new THREE.Vector3(0, 12, 11)
const DIVED = new THREE.Vector3(0, 3, -10)
const LOOK_IDLE = new THREE.Vector3(0, 0, 0)
const LOOK_DEEP = new THREE.Vector3(0, -4, -45)
const _look = new THREE.Vector3()

// Drives the camera every frame from bus.dive (0 = home, 1 = deep), so the
// page-transition code can push the view forward through the school.
function CameraRig() {
  useFrame(({ camera, scene }) => {
    const d = bus.dive
    camera.position.lerpVectors(HOME, DIVED, d)
    _look.copy(LOOK_IDLE).lerp(LOOK_DEEP, d)
    camera.lookAt(_look)
    if (scene.fog) scene.fog.far = 44 - 24 * d // water thickens as we descend
  })
  return null
}

export default function MantaBackground({ transparent = false }) {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280
  const small = w < 760
  const count = small ? 5 : 8
  const dpr = small ? 1 : [1, 1.6]

  return (
    <Canvas
      camera={{ position: [0, 12, 11], fov: 50 }}
      dpr={dpr}
      gl={{ antialias: !small, alpha: transparent, powerPreference: 'high-performance' }}
      frameloop={reduceMotion ? 'demand' : 'always'}
    >
      {!transparent && <color attach="background" args={['#08182f']} />}
      <fog attach="fog" args={['#08182f', 16, 44]} />

      <ambientLight intensity={0.6} />
      <hemisphereLight args={['#bcd4ff', '#08152b', 0.6]} />
      <directionalLight position={[8, 14, 6]} intensity={1.2} />
      <directionalLight position={[-8, 6, -6]} intensity={0.4} color="#5b7cff" />

      <CameraRig />
      <MantaSchool count={count} paused={reduceMotion} />
    </Canvas>
  )
}
