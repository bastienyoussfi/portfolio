import { useState, useEffect, useRef } from 'react'

export type Phase = 'hero' | 'transitioning' | 'chat'

export function useAnimatedProgress(phase: Phase, duration = 850): number {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (phase === 'transitioning') {
      let start: number | null = null
      const animate = (ts: number) => {
        if (!start) start = ts
        const raw = Math.min((ts - start) / duration, 1)
        const eased = 1 - Math.pow(1 - raw, 3)
        setProgress(eased)
        if (raw < 1) {
          rafRef.current = requestAnimationFrame(animate)
        }
      }
      rafRef.current = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(rafRef.current)
    } else if (phase === 'hero') {
      setProgress(0)
    } else {
      setProgress(1)
    }
  }, [phase, duration])

  return progress
}
