import { agentRegistry } from './_registry'

export function getPublicAgents() {
  const agents: Array<Record<string, unknown>> = []

  for (const [, entry] of agentRegistry) {
    const c = entry.config
    if (c.visibility !== 'public') continue

    agents.push({
      slug: c.slug,
      name: c.name,
      tagline: c.tagline,
      description: c.description,
      avatar: c.avatar,
      theme: c.theme,
      status: c.status,
      tags: c.tags,
    })
  }

  return agents
}
