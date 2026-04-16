import { agentRegistry, type AgentEntry } from './_registry'

export function resolveAgent(host: string, platformDomain: string): AgentEntry | null {
  // Strip port for local dev
  const hostname = host.split(':')[0]!

  // Check if this is the bare domain (gallery)
  if (hostname === platformDomain || hostname === 'localhost') {
    return null
  }

  // Extract subdomain slug: "bounty.agents.bastienyoussfi.com" → "bounty"
  const slug = hostname.split('.')[0]!

  return agentRegistry.get(slug) ?? null
}

export function resolveAgentBySlug(slug: string): AgentEntry | null {
  return agentRegistry.get(slug) ?? null
}

export function isGalleryHost(host: string, platformDomain: string): boolean {
  const hostname = host.split(':')[0]!
  return hostname === platformDomain || hostname === 'localhost'
}
