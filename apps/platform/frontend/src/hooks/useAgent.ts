import { useState, useEffect } from 'react'

export interface AgentPublicConfig {
  slug: string
  name: string
  tagline: string
  description: string
  avatar: string
  theme: {
    accent: string
    accentLight: string
    fontDisplay?: string
    fontBody?: string
  }
  greeting: string
  placeholder: string
  suggestedQuestions?: string[]
  status?: 'live' | 'demo' | 'wip'
}

export function useAgent(slug: string | null) {
  const [agent, setAgent] = useState<AgentPublicConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchAgent() {
      try {
        const res = await fetch(`/api/agent?slug=${slug}`)
        if (!res.ok) throw new Error('Agent not found')
        const data = await res.json()
        if (!cancelled) setAgent(data)
      } catch (err) {
        if (!cancelled) setError(String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAgent()
    return () => { cancelled = true }
  }, [slug])

  return { agent, loading, error }
}
