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

export default function AgentCard({ agent }: { agent: AgentSummary }) {
  const href = `/${agent.slug}`

  const badgeClass = agent.status
    ? `agent-card__badge agent-card__badge--${agent.status}`
    : ''

  return (
    <a className="agent-card" href={href}>
      <div
        className="agent-card__avatar"
        style={{ background: agent.theme.accentLight }}
      >
        {agent.avatar || agent.name[0]}
      </div>
      <div className="agent-card__name">{agent.name}</div>
      <div className="agent-card__tagline">{agent.description || agent.tagline}</div>
      <div className="agent-card__footer">
        {agent.status && (
          <span className={badgeClass}>{agent.status}</span>
        )}
        {agent.tags?.map((tag) => (
          <span key={tag} className="agent-card__tag">{tag}</span>
        ))}
      </div>
    </a>
  )
}
