import { useState, useEffect, useRef, Fragment } from 'react'

interface Props {
  content: string
}

function renderWithBreaks(text: string) {
  if (!text) return null
  const parts = text.split('\n')
  return parts.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < parts.length - 1 && <br />}
    </Fragment>
  ))
}

export default function StreamingContent({ content }: Props) {
  const [displayed, setDisplayed] = useState('')
  const targetRef = useRef(content)
  const indexRef = useRef(0)
  const rafRef = useRef(0)

  targetRef.current = content

  useEffect(() => {
    let last = 0

    const tick = (now: number) => {
      if (!last) last = now
      const behind = targetRef.current.length - indexRef.current

      if (behind <= 0) return

      const elapsed = now - last
      const speed = behind > 60 ? 4 : behind > 30 ? 8 : behind > 10 ? 14 : 20
      if (elapsed < speed) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const chars = Math.max(1, Math.floor(elapsed / speed))
      indexRef.current = Math.min(indexRef.current + chars, targetRef.current.length)
      setDisplayed(targetRef.current.slice(0, indexRef.current))
      last = now
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [content])

  return (
    <div className="streaming-content msg-bubble--assistant b1">
      {renderWithBreaks(displayed)}
      <span className="streaming-cursor" />
    </div>
  )
}
