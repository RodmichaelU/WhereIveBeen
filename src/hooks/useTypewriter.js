import { useEffect, useRef, useState } from 'react'

// Char-by-char typewriter effect cycling through a sequence of phrases.
// Adapted from kokonutui's Typewriter (MIT) for plain JS/Vite: dropped the
// TypeScript types and framer-motion dependency this project doesn't have —
// callers own the visual cursor/animation, this hook just returns the text.
export function useTypewriter(sequences, {
  typingSpeed = 50,
  startDelay = 200,
  autoLoop = true,
  loopDelay = 1000,
  deleteSpeed = 30,
  pauseBeforeDelete = 1000,
  naturalVariance = true,
} = {}) {
  const [displayText, setDisplayText] = useState('')
  const sequenceIndexRef = useRef(0)
  const charIndexRef = useRef(0)
  const isDeletingRef = useRef(false)
  const timeoutRef = useRef(null)
  const sequencesRef = useRef(sequences)

  useEffect(() => {
    sequencesRef.current = sequences
  }, [sequences])

  useEffect(() => {
    const getTypingDelay = () => {
      if (!naturalVariance) return typingSpeed

      // More natural human typing pattern
      const random = Math.random()
      if (random < 0.1) return typingSpeed * 2 // occasional hesitation
      if (random > 0.9) return typingSpeed * 0.5 // occasional burst

      const variance = 0.4
      const min = typingSpeed * (1 - variance)
      const max = typingSpeed * (1 + variance)
      return Math.random() * (max - min) + min
    }

    const runTypewriter = () => {
      const currentSequence = sequencesRef.current[sequenceIndexRef.current]
      if (!currentSequence) return

      if (isDeletingRef.current) {
        if (charIndexRef.current > 0) {
          charIndexRef.current -= 1
          setDisplayText(currentSequence.text.slice(0, charIndexRef.current))
          timeoutRef.current = setTimeout(runTypewriter, deleteSpeed)
        } else {
          isDeletingRef.current = false
          const isLastSequence = sequenceIndexRef.current === sequencesRef.current.length - 1

          if (isLastSequence && autoLoop) {
            timeoutRef.current = setTimeout(() => {
              sequenceIndexRef.current = 0
              runTypewriter()
            }, loopDelay)
          } else if (!isLastSequence) {
            timeoutRef.current = setTimeout(() => {
              sequenceIndexRef.current += 1
              runTypewriter()
            }, 100)
          }
        }
      } else if (charIndexRef.current < currentSequence.text.length) {
        charIndexRef.current += 1
        setDisplayText(currentSequence.text.slice(0, charIndexRef.current))
        timeoutRef.current = setTimeout(runTypewriter, getTypingDelay())
      } else {
        const pauseDuration = currentSequence.pauseAfter ?? pauseBeforeDelete

        if (currentSequence.deleteAfter) {
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true
            runTypewriter()
          }, pauseDuration)
        } else {
          const isLastSequence = sequenceIndexRef.current === sequencesRef.current.length - 1

          if (isLastSequence && autoLoop) {
            timeoutRef.current = setTimeout(() => {
              sequenceIndexRef.current = 0
              charIndexRef.current = 0
              setDisplayText('')
              runTypewriter()
            }, loopDelay)
          } else if (!isLastSequence) {
            timeoutRef.current = setTimeout(() => {
              sequenceIndexRef.current += 1
              charIndexRef.current = 0
              setDisplayText('')
              runTypewriter()
            }, pauseDuration)
          }
        }
      }
    }

    timeoutRef.current = setTimeout(runTypewriter, startDelay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // Only restart the loop if timing configs change — sequencesRef holds
    // the content so this effect doesn't restart on array reference change.
  }, [typingSpeed, deleteSpeed, pauseBeforeDelete, autoLoop, loopDelay, startDelay, naturalVariance])

  return displayText
}
