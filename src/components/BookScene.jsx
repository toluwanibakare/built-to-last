import { forwardRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Book } from './BookModel'

const BookScene = forwardRef(function BookScene({ onError, onFirstInteract }, ref) {
  useEffect(() => {
    const canvas = document.querySelector('[data-book-canvas] canvas')
    if (canvas && !canvas.getContext('webgl2') && !canvas.getContext('webgl')) {
      onError?.()
    }
  }, [onError])

  return (
    <Canvas
      data-book-canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.25, 4.6], fov: 35 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onError?.()
        })
      }}
      onError={() => onError?.()}
      style={{ touchAction: 'none' }}
      aria-label="Interactive 3D view of the Built to Last book. Drag to rotate, scroll to zoom."
      role="img"
    >
      <Book ref={ref} onFirstInteract={onFirstInteract} />
    </Canvas>
  )
})

export { BookScene }