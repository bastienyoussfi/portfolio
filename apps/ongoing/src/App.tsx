import { useMemo } from 'react'
import TopBar from '@/components/TopBar'
import Item from '@/components/Item'
import { items as rawItems, type OngoingItem } from '@/data/ongoing'

function lastUpdatedLabel(items: OngoingItem[]): string {
  const latest = items
    .map(i => new Date(i.updated + 'T00:00:00Z').getTime())
    .filter(t => !Number.isNaN(t))
    .sort((a, b) => b - a)[0]
  if (!latest) return '—'
  return new Date(latest).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function App() {
  const { active, done } = useMemo(() => {
    const sorted = [...rawItems].sort(
      (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime(),
    )
    return {
      active: sorted.filter(i => i.status !== 'done'),
      done: sorted.filter(i => i.status === 'done'),
    }
  }, [])

  const avg = useMemo(() => {
    if (active.length === 0) return 0
    return Math.round(
      active.reduce((sum, i) => sum + i.progress, 0) / active.length,
    )
  }, [active])

  return (
    <div className="page">
      <TopBar />

      <section className="hero">
        <div className="hero__eyebrow">
          <span className="hero__dot" />
          Live
        </div>
        <h1 className="hero__title">
          <em>Ongoing</em> <strong>work.</strong>
        </h1>
        <p className="hero__subtitle">Tracked in the open.</p>
        <div className="hero__meta">
          <span>{active.length} active</span>
          <span className="hero__meta-sep" />
          <span>{avg}% avg progress</span>
          <span className="hero__meta-sep" />
          <span>Updated {lastUpdatedLabel(rawItems)}</span>
        </div>
      </section>

      <div className="section-label">
        <span className="section-label__title">In progress</span>
        <span className="section-label__count">{active.length}</span>
      </div>
      {active.length === 0 ? (
        <div className="empty">Nothing active right now.</div>
      ) : (
        <div className="items">
          {active.map((item, i) => (
            <Item key={item.id} item={item} index={i} />
          ))}
        </div>
      )}

      {done.length > 0 && (
        <>
          <div className="section-label">
            <span className="section-label__title">Recently shipped</span>
            <span className="section-label__count">{done.length}</span>
          </div>
          <div className="items">
            {done.map((item, i) => (
              <Item key={item.id} item={item} index={i} />
            ))}
          </div>
        </>
      )}

      <footer className="foot">
        <span>Hand-rolled by</span>
        <a href="https://bastienyoussfi.com">Bastien</a>
      </footer>
    </div>
  )
}
