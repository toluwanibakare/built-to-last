import { useMemo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

import frontCoverUrl from '../assets/book/front_cover.jpeg'
import backCoverUrl from '../assets/book/back_cover.jpeg'
import spineUrl from '../assets/book/spine_image.jpeg'

const COVER_W = 1.5
const COVER_H = 2.28
const PAGE_W = 1.48
const PAGE_H = 2.26
const THICKNESS = 0.15

export const PRESETS = {
  front: { y: 0, x: 0 },
  spine: { y: Math.PI / 2, x: 0 },
  back: { y: Math.PI, x: 0 },
}

const ROTATE_SPEED = 0.006
const ZOOM_SPEED = 0.0016
const MIN_DIST = 3.1
const MAX_DIST = 7.2
const MIN_TILT = -0.5
const MAX_TILT = 0.55

function useBookTextures() {
  const loader = useMemo(() => new TextureLoader(), [])

  const front = loader.load(frontCoverUrl)
  const back = loader.load(backCoverUrl)
  const spine = loader.load(spineUrl)

  useEffect(() => {
    const list = [front, back, spine]
    list.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
      t.generateMipmaps = true
      t.minFilter = THREE.LinearMipmapLinearFilter
    })
    return () => list.forEach((t) => t.dispose())
  }, [front, back, spine])

  return { front, back, spine }
}

function ContactShadow() {
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(29, 37, 52, 0.42)')
    gradient.addColorStop(1, 'rgba(29, 37, 52, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.45, 0]} renderOrder={1}>
      <planeGeometry args={[6, 6]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

function PageBlock() {
  const pageTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f2efe6'
    ctx.fillRect(0, 0, 256, 64)
    ctx.fillStyle = 'rgba(29, 37, 52, 0.08)'
    for (let i = 0; i < 64; i += 3) {
      ctx.fillRect(0, i, 256, 1)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.repeat.set(1, 26)
    return tex
  }, [])

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[PAGE_W, PAGE_H, THICKNESS]} />
      <meshStandardMaterial map={pageTexture} roughness={0.95} metalness={0} />
    </mesh>
  )
}

function FrontCover({ width, height, thickness, position, texture }) {
  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // x+
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // x-
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // y+
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // y-
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7, metalness: 0.06 }), // z+ (front)
      new THREE.MeshStandardMaterial({ color: '#e5e0d4', roughness: 0.9 }), // z- (inside cover)
    ],
    [texture],
  )

  return (
    <mesh position={position} material={materials}>
      <boxGeometry args={[width, height, thickness]} />
    </mesh>
  )
}

function BackCover({ width, height, thickness, position, texture }) {
  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // x+
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // x-
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // y+
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // y-
      new THREE.MeshStandardMaterial({ color: '#e5e0d4', roughness: 0.9 }), // z+ (inside cover)
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7, metalness: 0.06 }), // z- (back)
    ],
    [texture],
  )

  return (
    <mesh position={position} material={materials}>
      <boxGeometry args={[width, height, thickness]} />
    </mesh>
  )
}

function Spine({ width, height, depth, position, texture }) {
  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // x+ (inside spine)
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.75, metalness: 0.05 }), // x- (outer spine)
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // y+
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // y-
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // z+
      new THREE.MeshStandardMaterial({ color: '#161b25', roughness: 0.8 }), // z-
    ],
    [texture],
  )

  return (
    <mesh position={position} material={materials}>
      <boxGeometry args={[width, height, depth]} />
    </mesh>
  )
}

const Book = forwardRef(function Book({ onFirstInteract }, ref) {
  const { front, back, spine } = useBookTextures()
  const groupRef = useRef(null)
  const stateRef = useRef({
    targetY: 0,
    targetX: 0,
    targetZ: 4.6,
    velocityY: 0,
    velocityX: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
  })
  const onFirstInteractRef = useRef(onFirstInteract)
  onFirstInteractRef.current = onFirstInteract

  useImperativeHandle(ref, () => ({
    setView: (view) => {
      const preset = PRESETS[view]
      const s = stateRef.current
      s.targetY = preset.y
      s.targetX = preset.x
      s.velocityY = 0
      s.velocityX = 0
    },
  }))

  const gl = useThree((s) => s.gl)

  useEffect(() => {
    const canvas = gl.domElement
    canvas.style.touchAction = 'none'
    const s = stateRef.current

    const onPointerDown = (e) => {
      s.dragging = true
      s.lastX = e.clientX
      s.lastY = e.clientY
      s.velocityY = 0
      s.velocityX = 0
      canvas.setPointerCapture?.(e.pointerId)
    }

    const onPointerMove = (e) => {
      if (!s.dragging) return
      const dx = e.clientX - s.lastX
      const dy = e.clientY - s.lastY
      s.lastX = e.clientX
      s.lastY = e.clientY
      s.targetY += dx * ROTATE_SPEED
      s.targetX = THREE.MathUtils.clamp(s.targetX + dy * ROTATE_SPEED, MIN_TILT, MAX_TILT)
      s.velocityY = dx * ROTATE_SPEED
      s.velocityX = dy * ROTATE_SPEED
      onFirstInteractRef.current?.()
    }

    const onPointerUp = () => {
      s.dragging = false
    }

    const onWheel = (e) => {
      e.preventDefault()
      s.targetZ = THREE.MathUtils.clamp(s.targetZ + e.deltaY * ZOOM_SPEED, MIN_DIST, MAX_DIST)
      onFirstInteractRef.current?.()
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [gl])

  useFrame(({ camera }, delta) => {
    const s = stateRef.current
    const group = groupRef.current
    if (!group) return

    const dt = Math.min(delta, 0.05)

    if (!s.dragging) {
      s.velocityY *= Math.pow(0.86, dt * 60)
      s.velocityX *= Math.pow(0.86, dt * 60)
      s.targetY += s.velocityY
      s.targetX = THREE.MathUtils.clamp(s.targetX + s.velocityX, MIN_TILT, MAX_TILT)
    }

    const k = 1 - Math.pow(0.0001, dt)
    group.rotation.y += (s.targetY - group.rotation.y) * k
    group.rotation.x += (s.targetX - group.rotation.x) * k

    camera.position.z += (s.targetZ - camera.position.z) * k
    camera.position.y = 0.25 + (camera.position.z - 3.1) * 0.045
  })

  return (
    <group>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 6, 5]} intensity={1.35} />
      <directionalLight position={[-5, 2, -4]} intensity={0.5} color="#a9b4c8" />
      <directionalLight position={[0, -3, 6]} intensity={0.35} color="#fff6e0" />

      <group ref={groupRef} style={{ cursor: 'grab' }}>
        <FrontCover
          width={COVER_W}
          height={COVER_H}
          thickness={0.006}
          position={[0, 0, THICKNESS / 2 + 0.003]}
          texture={front}
        />
        <PageBlock />
        <BackCover
          width={COVER_W}
          height={COVER_H}
          thickness={0.006}
          position={[0, 0, -THICKNESS / 2 - 0.003]}
          texture={back}
        />
        <Spine
          width={0.006}
          height={COVER_H}
          depth={THICKNESS + 0.012}
          position={[-COVER_W / 2 + 0.003, 0, 0]}
          texture={spine}
        />
      </group>

      <ContactShadow />
    </group>
  )
})

export { Book }