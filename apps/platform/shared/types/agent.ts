export interface AgentConfig {
  // Identity
  slug: string
  name: string
  tagline: string
  description: string
  avatar: string

  // LLM
  model: string
  provider: 'anthropic' | 'mistral'
  systemPrompt: string
  temperature?: number
  maxTokens?: number

  // Tools
  tools: string[]

  // Theme — overrides accent from tokens.css
  theme: {
    accent: string
    accentLight: string
    fontDisplay?: string
    fontBody?: string
  }

  // Chat UI
  greeting: string
  placeholder: string
  suggestedQuestions?: string[]

  // Visibility
  visibility: 'public' | 'unlisted'
  status?: 'live' | 'demo' | 'wip'

  // Optional
  externalUrl?: string
  tags?: string[]
}
