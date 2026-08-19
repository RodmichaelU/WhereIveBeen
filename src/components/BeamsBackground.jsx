import { useEffect, useRef } from 'react'

// Canvas beams background — soft glowing light beams drifting upward.
// Adapted from kokonutui's BeamsBackground (MIT) for plain JS/Vite: dropped
// the framer-motion + "@/lib/utils" cn dependencies this project doesn't
// have, and the light/dark-mode toggle since this app is always dark.
// Also fixed beam spacing to use logical (CSS-pixel) canvas dimensions
// instead of the device-pixel-scaled ones, which the original mixed with a
// scaled drawing context — on a high-DPR screen that pushed beam columns
// outside the visible area.

const MINIMUM_BEAMS = 20

const OPACITY_MAP = {
  subtle: 0.7,
  medium: 0.85,
  strong: 1,
}

const HUE_BASE = 190
const HUE_RANGE = 70
const SATURATION = '85%'
const LIGHTNESS = '65%'

function createBeam(width, height) {
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle: -35 + Math.random() * 10,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: HUE_BASE + Math.random() * HUE_RANGE,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  }
}

export default function BeamsBackground({ className = '', intensity = 'strong' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let width = 0
    let height = 0
    let beams = []
    let animId = 0

    // iOS Safari's dynamic toolbar fires a stream of incremental resize
    // events (height only, a few px at a time) as it collapses/expands
    // while scrolling. Touching the canvas buffer on any of those — even
    // without re-seeding the beams — clears and resets it, which reads as
    // a constant flicker. Ignore anything that isn't a real resize entirely;
    // the width/height baseline only updates when it actually is one, so
    // a string of small toolbar-driven steps never accumulates into a
    // false "real resize" either.
    function resize() {
      const newWidth = canvas.clientWidth
      const newHeight = canvas.clientHeight
      const isRealResize = beams.length === 0 || newWidth !== width || Math.abs(newHeight - height) > 150

      if (!isRealResize) return

      width = newWidth
      height = newHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.scale(dpr, dpr)

      const totalBeams = MINIMUM_BEAMS * 1.5
      beams = Array.from({ length: totalBeams }, () => createBeam(width, height))
    }

    function resetBeam(beam, index, totalBeams) {
      const column = index % 3
      const spacing = width / 3

      beam.y = height + 100
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5
      beam.width = 100 + Math.random() * 100
      beam.speed = 0.5 + Math.random() * 0.4
      beam.hue = HUE_BASE + (index * HUE_RANGE) / totalBeams
      beam.opacity = 0.2 + Math.random() * 0.1
      return beam
    }

    function drawBeam(beam) {
      ctx.save()
      ctx.translate(beam.x, beam.y)
      ctx.rotate((beam.angle * Math.PI) / 180)

      const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * OPACITY_MAP[intensity]

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length)
      gradient.addColorStop(0, `hsla(${beam.hue}, ${SATURATION}, ${LIGHTNESS}, 0)`)
      gradient.addColorStop(0.1, `hsla(${beam.hue}, ${SATURATION}, ${LIGHTNESS}, ${pulsingOpacity * 0.5})`)
      gradient.addColorStop(0.4, `hsla(${beam.hue}, ${SATURATION}, ${LIGHTNESS}, ${pulsingOpacity})`)
      gradient.addColorStop(0.6, `hsla(${beam.hue}, ${SATURATION}, ${LIGHTNESS}, ${pulsingOpacity})`)
      gradient.addColorStop(0.9, `hsla(${beam.hue}, ${SATURATION}, ${LIGHTNESS}, ${pulsingOpacity * 0.5})`)
      gradient.addColorStop(1, `hsla(${beam.hue}, ${SATURATION}, ${LIGHTNESS}, 0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length)
      ctx.restore()
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)
      ctx.filter = 'blur(35px)'

      const totalBeams = beams.length
      beams.forEach((beam, index) => {
        beam.y -= beam.speed
        beam.pulse += beam.pulseSpeed

        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams)
        }

        drawBeam(beam)
      })

      animId = requestAnimationFrame(animate)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    animate()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [intensity])

  return (
    <div className={`overflow-hidden bg-slate-950 ${className}`}>
      <canvas className="absolute inset-0 w-full h-full" ref={canvasRef} style={{ filter: 'blur(15px)' }} />
      <div
        className="absolute inset-0 bg-slate-950/5 beams-pulse"
        style={{ backdropFilter: 'blur(50px)' }}
      />
    </div>
  )
}
