import { useMemo, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

import frontCoverUrl from '../assets/book/front_cover.jpeg'
import backCoverUrl from '../assets/book/back_cover.jpeg'
import spineUrl from '../assets/book/spine_image.jpeg'

const COVER_W = 1.66
const COVER_H = 2.5
const PAGE_W = 1.5
const PAGE_H = 2.28
const THICKNESS = 0.13

export const PRESETS = {
  front: { y: 0, x: 0 },
  spine: { y: -Math.PI / 2, x: 0 },
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

function BookCover({ width, height, thickness, position, front, back, spine }) {
  const coverMaterials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ map: spine, roughness: 0.75, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({ map: spine, roughness: 0.75, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({ color: '#1c2530', roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: '#1c2530', roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: front, roughness: 0.7, metalness: 0.06 }),
      new THREE.MeshStandardMaterial({ map: back, roughness: 0.7, metalness: 0.06 }),
    ],
    [front, back, spine],
  )

  return (
    <mesh position={position} material={coverMaterials}>
      <boxGeometry args={[width, height, thickness]} />
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
        <BookCover
          width={COVER_W}
          height={COVER_H}
          thickness={0.05}
          position={[0, 0, THICKNESS / 2 + 0.026]}
          front={front}
          back={back}
          spine={spine}
        />
        <PageBlock />
        <BookCover
          width={COVER_W}
          height={COVER_H}
          thickness={0.05}
          position={[0, 0, -THICKNESS / 2 - 0.026]}
          front={front}
          back={back}
          spine={spine}
        />
      </group>

      <ContactShadow />
    </group>
  )
})

export { Book }