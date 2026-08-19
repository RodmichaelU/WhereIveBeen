import { useEffect, useRef } from 'react'

// Canvas particle flow field background — organic noise-driven streams of
// glowing light. Adapted from kokonutui's FlowField (MIT) for plain JS/Vite:
// dropped the framer-motion + "@/lib/utils" cn dependencies this project
// doesn't have, kept the vanilla canvas particle engine as-is.

const PARTICLE_COUNTS = {
  sparse: 600,
  medium: 1200,
  dense: 2000,
}

const THEMES = {
  aurora: { hueStart: 120, hueRange: 200, saturation: 90, lightness: 62, bg: '5, 5, 8', trailAlpha: 0.06 },
  ember: { hueStart: 0, hueRange: 55, saturation: 95, lightness: 58, bg: '8, 4, 2', trailAlpha: 0.07 },
  ocean: { hueStart: 180, hueRange: 90, saturation: 88, lightness: 60, bg: '2, 6, 10', trailAlpha: 0.06 },
}

// Smooth organic 2D noise via a multi-octave trigonometric series.
// Returns an angle in radians that evolves continuously with time `t`.
function fieldAngle(x, y, t) {
  const s = 0.0025
  return (
    Math.sin(x * s + t * 0.0007) * Math.PI +
    Math.cos(y * s + t * 0.0005) * Math.PI +
    Math.sin((x + y) * s * 0.6 + t * 0.0009) * Math.PI * 0.6 +
    Math.cos((x - y) * s * 0.4 + t * 0.0006) * Math.PI * 0.4
  )
}

export default function FlowField({ className = '', children, theme = 'ocean', density = 'medium' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cfg = THEMES[theme]
    const count = PARTICLE_COUNTS[density]
    const dpr = window.devicePixelRatio ?? 1

    let width = 0
    let height = 0
    let animId = 0
    let time = 0
    let particles = []

    const spawnParticle = () => {
      const maxLife = 200 + Math.floor(Math.random() * 300)
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 1.1 + Math.random() * 1.8,
        hue: cfg.hueStart + Math.random() * cfg.hueRange,
        life: Math.floor(Math.random() * maxLife),
        maxLife,
      }
    }

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.scale(dpr, dpr)

      ctx.fillStyle = `rgb(${cfg.bg})`
      ctx.fillRect(0, 0, width, height)

      particles = Array.from({ length: count }, spawnParticle)
    }

    const render = () => {
      time++

      // Fade previous frame — each dot persists ~16 frames, creating soft trails
      ctx.fillStyle = `rgba(${cfg.bg}, ${cfg.trailAlpha})`
      ctx.fillRect(0, 0, width, height)

      for (const p of particles) {
        const angle = fieldAngle(p.x, p.y, time)

        p.x += Math.cos(angle) * p.speed
        p.y += Math.sin(angle) * p.speed
        p.life++

        if (p.life > p.maxLife) {
          p.x = Math.random() * width
          p.y = Math.random() * height
          p.life = 0
          p.hue = cfg.hueStart + Math.random() * cfg.hueRange
          continue
        }

        if (p.x < 0) p.x += width
        else if (p.x > width) p.x -= width
        if (p.y < 0) p.y += height
        else if (p.y > height) p.y -= height

        const progress = p.life / p.maxLife
        const fadeIn = Math.min(progress * 8, 1)
        const fadeOut = Math.min((1 - progress) * 6, 1)
        const alpha = fadeIn * fadeOut * 0.9

        const hueMod = (p.hue + (angle / (Math.PI * 2)) * 70 + 360) % 360

        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hueMod}, ${cfg.saturation}%, ${cfg.lightness}%, ${alpha})`
        ctx.fill()
      }

      animId = requestAnimationFrame(render)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    render()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [theme, density])

  const bgColor = THEMES[theme].bg

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `rgb(${bgColor})` }}
    >
      <canvas aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full" ref={canvasRef} />

      {/* Radial vignette — focuses center, dims edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 65% 60% at 50% 50%, transparent 20%, rgba(${bgColor}, 0.92) 100%)`,
        }}
      />

      {/* Soft top / bottom fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: `linear-gradient(to bottom, rgb(${bgColor}), transparent)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: `linear-gradient(to top, rgb(${bgColor}), transparent)` }}
      />

      {children}
    </div>
  )
}
