import { useEffect, useRef, useState } from 'react'

// Smoothly animates a displayed integer toward `target` whenever it
// changes — used for headline numbers that swap on hover (e.g. a
// choropleth's total vs. a hovered country's count).
export function useCountUp(target, duration = 500) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(null)

  useEffect(() => {
    const from = fromRef.current
    const to = target
    if (from === to) return

    let start = null
    function step(ts) {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(from + (to - from) * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = to
      }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}
