import { useState, useEffect, useRef } from 'react'

interface Props {
  content: string
  isStreaming?: boolean
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let rest = text
  let k = 0

  while (rest.length > 0) {
    const bold = rest.match(/^\*\*(.+?)\*\*/)
    if (bold) { parts.push(<strong key={k++}>{bold[1]}</strong>); rest = rest.slice(bold[0].length); continue }

    const italic = rest.match(/^\*(.+?)\*/)
    if (italic) { parts.push(<em key={k++}>{italic[1]}</em>); rest = rest.slice(italic[0].length); continue }

    const code = rest.match(/^`(.+?)`/)
    if (code) { parts.push(<code key={k++}>{code[1]}</code>); rest = rest.slice(code[0].length); continue }

    const link = rest.match(/^\[(.+?)\]\((.+?)\)/)
    if (link) {
      parts.push(<a key={k++} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]} →</a>)
      rest = rest.slice(link[0].length); continue
    }

    const plain = rest.match(/^[^*`\[]+/)
    if (plain) {
      parts.push(plain[0])
      rest = rest.slice(plain[0].length)
      continue
    }
    parts.push(rest[0])
    rest = rest.slice(1)
  }

  return <>{parts}</>
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  const out: React.ReactNode[] = []
  let list: React.ReactNode[] = []

  const flush = () => {
    if (list.length) {
      out.push(<ul key={`ul-${out.length}`}>{list}</ul>)
      list = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    const li = line.match(/^[\-\*]\s+(.+)/) || line.match(/^\d+\.\s+(.+)/)

    if (li) {
      list.push(<li key={i}>{renderInline(li[1]!)}</li>)
    } else {
      flush()
      if (line.trim() === '') {
        if (out.length > 0) out.push(<br key={`br-${i}`} />)
      } else {
        out.push(<p key={i}>{renderInline(line)}</p>)
      }
    }
  }

  flush()
  return out
}

export default function Markdown({ content, isStreaming }: Props) {
  const [displayed, setDisplayed] = useState(isStreaming ? '' : content)
  const targetRef = useRef(content)
  const indexRef = useRef(isStreaming ? 0 : content.length)
  const rafRef = useRef(0)

  targetRef.current = content

  // Streaming animation loop — smoothly reveals characters
  useEffect(() => {
    if (!isStreaming) {
      // When streaming ends, show full content immediately
      cancelAnimationFrame(rafRef.current)
      setDisplayed(content)
      indexRef.current = content.length
      return
    }

    let last = 0

    const tick = (now: number) => {
      if (!last) last = now
      const behind = targetRef.current.length - indexRef.current

      if (behind <= 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const elapsed = now - last
      const speed = behind > 60 ? 4 : behind > 30 ? 8 : behind > 10 ? 14 : 20
      if (elapsed < speed) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const chars = Math.max(1, Math.floor(elapsed / speed))
      const next = Math.min(indexRef.current + chars, targetRef.current.length)
      if (next !== indexRef.current) {
        indexRef.current = next
        setDisplayed(targetRef.current.slice(0, next))
      }
      last = now
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isStreaming, content])

  const text = isStreaming ? displayed : content

  return (
    <div className="msg-bubble--assistant b1">
      {renderMarkdown(text)}
    </div>
  )
}
