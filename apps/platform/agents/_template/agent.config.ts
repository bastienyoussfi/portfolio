import type { AgentConfig } from '../../shared/types/agent'

const config: AgentConfig = {
  slug: 'AGENT_SLUG',
  name: 'Agent Name',
  tagline: 'Short description',
  description: 'Longer description for the gallery card.',
  avatar: '',

  model: 'claude-sonnet-4-20250514',
  provider: 'anthropic',
  systemPrompt: `You are a helpful AI assistant. Answer questions clearly and concisely.`,
  temperature: 0.7,
  maxTokens: 2048,

  tools: [],

  theme: {
    accent: '#007aff',
    accentLight: 'rgba(0, 122, 255, 0.08)',
  },

  greeting: 'Hello! How can I help you today?',
  placeholder: 'Type your message...',
  suggestedQuestions: [],

  visibility: 'unlisted',
  status: 'wip',
  tags: [],
}

export default config
