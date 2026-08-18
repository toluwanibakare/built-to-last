import { useMemo, useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

import frontCoverUrl from '../assets/book/front_cover.jpeg'
import backCoverUrl from '../assets/book/back_cover.jpeg'
import spineUrl from '../assets/book/spine_image.jpeg'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const COVER_W = 1.66
const COVER_H = 2.5
const PAGE_W = 1.5
const PAGE_H = 2.28
const THICKNESS = 0.13

const VIEWS = {
  front: new THREE.Vector3(0, 0.25, 4.6),
  back: new THREE.Vector3(0, 0.25, -4.6),
  spine: new THREE.Vector3(4.2, 0.25, 0),
}

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
  const controlsRef = useRef(null)
  const target = useRef(VIEWS.front.clone())
  const [interacted, setInteracted] = useState(false)

  useImperativeHandle(ref, () => ({
    setView: (view) => {
      target.current.copy(VIEWS[view])
    },
  }))

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const handle = () => {
      if (!interacted) {
        setInteracted(true)
        onFirstInteract?.()
      }
    }
    controls.addEventListener('start', handle)
    return () => controls.removeEventListener('start', handle)
  }, [interacted, onFirstInteract])

  useFrame(({ camera }, delta) => {
    const controls = controlsRef.current
    if (!controls) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      camera.position.copy(target.current)
    } else {
      const t = 1 - Math.pow(0.002, delta)
      camera.position.lerp(target.current, t)
    }
    controls.update()
  })

  return (
    <group>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 6, 5]} intensity={1.35} />
      <directionalLight position={[-5, 2, -4]} intensity={0.5} color="#a9b4c8" />
      <directionalLight position={[0, -3, 6]} intensity={0.35} color="#fff6e0" />

      <group>
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

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableZoom
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.85}
        zoomSpeed={0.7}
        minDistance={2.6}
        maxDistance={8}
        minPolarAngle={Math.PI / 2 - 0.55}
        maxPolarAngle={Math.PI / 2 + 0.5}
      />
    </group>
  )
})

export { Book }
