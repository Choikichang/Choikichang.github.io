import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// palette: navy dorsal (back), white ventral (belly), dark eyes
const NAVY = new THREE.Color('#1c2c5e')
const WHITE = new THREE.Color('#eef1fa')
const EYE = new THREE.Color('#0a0a14')

// manta planform parameters (units)
const S = 5.5 // wing half-span (x)
const CF = 3.0 // head reach toward the front (-z)
const CB = 2.4 // body reach toward the back (+z) before the tail
const BODY_HALF = 0.95 // |x| under this stays on the (non-flapping) body

// Half-thickness (y) of the pectoral disc at a given (x, z); 0 = outside.
function discThickness(x, z) {
  const u = Math.abs(x) / S
  if (u >= 1) return 0
  const sweep = 1.7 * u * u // wings sweep back toward the tips
  const chordFront = CF * Math.pow(1 - u, 0.7) + 0.2
  const chordBack = CB * Math.pow(1 - u, 0.85) + 0.2
  const dz = z - sweep
  if (dz < -chordFront || dz > chordBack) return 0
  const rz = dz < 0 ? dz / chordFront : dz / chordBack
  let th = (1 - u * 0.8) * Math.sqrt(Math.max(0, 1 - rz * rz)) * 0.5
  if (u < 0.3) th += (0.3 - u) * 1.1 * Math.sqrt(Math.max(0, 1 - (dz / CB) ** 2)) // body ridge
  return th
}

// Is (x,y,z) inside the manta volume?
function solidAt(x, y, z) {
  const th = discThickness(x, z)
  if (th > 0 && Math.abs(y) <= th) return true
  for (const s of [-1, 1]) {
    const dx = (x - s * 0.7) / 0.55
    const dz = (z + (CF + 0.7)) / 0.95
    const dy = y / 0.32
    if (dx * dx + dz * dz + dy * dy <= 1) return true // cephalic horns
  }
  if (z > CB * 0.6) {
    const tz = z - CB * 0.6
    const r = Math.max(0.42 - tz * 0.05, 0.06)
    if (tz < 7 && x * x + y * y <= r * r) return true // whip tail
  }
  return false
}

function voxel(size, cx, cy, cz, forced) {
  const g = new THREE.BoxGeometry(size, size, size)
  g.translate(cx, cy, cz)
  const pos = g.attributes.position
  const colors = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    const c = forced || (pos.getY(i) >= 0 ? NAVY : WHITE)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return g
}

// Voxelise the manta into 3 merged geometries: body (+head+tail+eyes) and the
// two wings (kept separate so they can flap). Built once, shared by the school.
export function buildManta(vox = 0.2) {
  const inv = 1 / vox
  const key = (a, b, c) => a + ',' + b + ',' + c
  const occ = new Set()
  const cells = []
  const xMax = S + 1
  const zMin = -(CF + 2)
  const zMax = CB + 8
  const yMax = 1.2

  for (let ix = Math.floor(-xMax * inv); ix <= Math.ceil(xMax * inv); ix++) {
    for (let iz = Math.floor(zMin * inv); iz <= Math.ceil(zMax * inv); iz++) {
      for (let iy = Math.floor(-yMax * inv); iy <= Math.ceil(yMax * inv); iy++) {
        const x = ix * vox
        const y = iy * vox
        const z = iz * vox
        if (solidAt(x, y, z)) {
          occ.add(key(ix, iy, iz))
          cells.push({ ix, iy, iz, x, y, z })
        }
      }
    }
  }

  const left = []
  const right = []
  const center = []
  const s = vox * 1.02

  for (const c of cells) {
    if (
      occ.has(key(c.ix + 1, c.iy, c.iz)) && occ.has(key(c.ix - 1, c.iy, c.iz)) &&
      occ.has(key(c.ix, c.iy + 1, c.iz)) && occ.has(key(c.ix, c.iy - 1, c.iz)) &&
      occ.has(key(c.ix, c.iy, c.iz + 1)) && occ.has(key(c.ix, c.iy, c.iz - 1))
    ) {
      continue // surface culling
    }
    const g = voxel(s, c.x, c.y, c.z)
    if (c.x > BODY_HALF) right.push(g)
    else if (c.x < -BODY_HALF) left.push(g)
    else center.push(g)
  }

  // eyes: a small white sclera patch with a raised black pupil, on the head
  const eyeS = vox * 0.95
  for (const sgn of [-1, 1]) {
    const ex = sgn * 1.1
    const ey = 0.28
    const ez = -(CF - 0.95)
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        center.push(voxel(eyeS, ex + i * eyeS, ey, ez + j * eyeS, WHITE)) // sclera (whites)
      }
    }
    center.push(voxel(eyeS, ex, ey + eyeS * 0.8, ez, EYE)) // black pupil, raised on top
  }

  return {
    center: mergeGeometries(center, false),
    left: mergeGeometries(left, false),
    right: mergeGeometries(right, false),
  }
}

export function disposeManta(parts) {
  if (!parts) return
  parts.center?.dispose()
  parts.left?.dispose()
  parts.right?.dispose()
}
