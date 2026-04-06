interface Props {
  content: string
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

    parts.push(rest[0])
    rest = rest.slice(1)
  }

  return <>{parts}</>
}

export default function Markdown({ content }: Props) {
  const lines = content.split('\n')
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
  return <div className="msg-bubble--assistant b1">{out}</div>
}
