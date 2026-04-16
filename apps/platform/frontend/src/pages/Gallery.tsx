import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import AgentCard from '@/components/AgentCard'

interface AgentSummary {
  slug: string
  name: string
  tagline: string
  description: string
  avatar: string
  theme: { accent: string; accentLight: string }
  status?: 'live' | 'demo' | 'wip'
  tags?: string[]
}

const sunIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const moonIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export default function Gallery() {
  const [agents, setAgents] = useState<AgentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then((data) => setAgents(data as AgentSummary[]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page page--scroll">
      <div className="gallery">
        <div className="gallery__header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 className="gallery__title">Meet my agents</h1>
              <p className="gallery__subtitle">
                AI assistants I've built — each with its own personality, tools, and expertise. Click one to start chatting.
              </p>
            </div>
            <button
              className="agent-header__theme-toggle"
              onClick={toggle}
              aria-label="Toggle theme"
              style={{ marginTop: 8 }}
            >
              {theme === 'light' ? moonIcon : sunIcon}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div className="typing-indicator" style={{ justifyContent: 'center' }}>
              <div className="typing-indicator__dots">
                <div className="typing-indicator__dot" />
                <div className="typing-indicator__dot" />
                <div className="typing-indicator__dot" />
              </div>
            </div>
          </div>
        ) : agents.length === 0 ? (
          <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: '48px 0' }}>
            No agents available yet.
          </p>
        ) : (
          <div className="gallery__grid">
            {agents.map((agent) => (
              <AgentCard key={agent.slug} agent={agent} />
            ))}
          </div>
        )}

        <div className="gallery__footer">
          <a href="https://bastienyoussfi.com">bastienyoussfi.com</a>
        </div>
      </div>
    </div>
  )
}
