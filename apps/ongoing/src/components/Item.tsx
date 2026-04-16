import ProgressBar from '@/components/ProgressBar'
import { STATUS_META, type OngoingItem } from '@/data/ongoing'

interface Props {
  item: OngoingItem
  index: number
}

function formatUpdated(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z')
  if (Number.isNaN(d.getTime())) return iso
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000)
  if (diffDays <= 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function Item({ item, index }: Props) {
  const meta = STATUS_META[item.status]
  const accent = item.accent ?? meta.accent
  const isDone = item.status === 'done'

  return (
    <article
      className={`item${isDone ? ' item--done' : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="item__head">
        <div className="item__title-wrap">
          <div className="item__title-row">
            <h3 className="item__title">{item.title}</h3>
            <span className={`status status--${meta.accent}`}>{meta.label}</span>
          </div>
          <p className="item__desc">{item.description}</p>
        </div>
        <span className="item__pct">{item.progress}%</span>
      </div>

      <ProgressBar value={item.progress} accent={accent} />

      <div className="item__foot">
        <div className="item__tags">
          {item.tags?.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <span className="item__updated">Updated {formatUpdated(item.updated)}</span>
      </div>
    </article>
  )
}
