export type Status =
  | 'planning'
  | 'building'
  | 'polishing'
  | 'shipping'
  | 'paused'
  | 'done'

export type Accent = 'blue' | 'green' | 'orange' | 'purple' | 'indigo' | 'red' | 'teal'

export interface OngoingItem {
  id: string
  title: string
  description: string
  progress: number // 0–100
  status: Status
  accent?: Accent
  tags?: string[]
  /** ISO date string, YYYY-MM-DD */
  updated: string
}

export const STATUS_META: Record<Status, { label: string; accent: Accent }> = {
  planning:   { label: 'Planning',   accent: 'purple' },
  building:   { label: 'Building',   accent: 'blue' },
  polishing:  { label: 'Polishing',  accent: 'indigo' },
  shipping:   { label: 'Shipping',   accent: 'orange' },
  paused:     { label: 'Paused',     accent: 'red' },
  done:       { label: 'Done',       accent: 'green' },
}

export const items: OngoingItem[] = [
  {
    id: 'ongoing-page',
    title: 'Ongoing page',
    description: 'This very page — a public, minimal tracker for the things I am actively working on.',
    progress: 90,
    status: 'polishing',
    accent: 'indigo',
    tags: ['react', 'vite', 'design'],
    updated: '2026-04-16',
  },
  {
    id: 'portfolio-chat',
    title: 'Portfolio AI agent',
    description: 'Ask-anything chat on my portfolio that answers questions about my work, backed by a context corpus and streaming tool calls.',
    progress: 72,
    status: 'building',
    accent: 'blue',
    tags: ['ai', 'streaming', 'cloudflare'],
    updated: '2026-04-14',
  },
  {
    id: 'auditex',
    title: 'Auditex',
    description: 'Automated audit workbench for SMB accountants — document intake, extraction, and reconciliation flows.',
    progress: 58,
    status: 'building',
    accent: 'orange',
    tags: ['product', 'ai', 'saas'],
    updated: '2026-04-11',
  },
  {
    id: 'voicy-v2',
    title: 'Voicy v2',
    description: 'Redesigning the onboarding and voice-capture flow to feel closer to a native iOS surface.',
    progress: 34,
    status: 'planning',
    accent: 'purple',
    tags: ['mobile', 'design'],
    updated: '2026-04-09',
  },
  {
    id: 'writing',
    title: 'New essay — "Small models, big leverage"',
    description: 'A long-form post on picking the right model size for agentic workloads.',
    progress: 20,
    status: 'planning',
    accent: 'purple',
    tags: ['writing'],
    updated: '2026-04-06',
  },
  {
    id: 'portfolio-v3',
    title: 'Portfolio v3 launch',
    description: 'Shipped the redesign with the new tokens, dark mode, and blog.',
    progress: 100,
    status: 'done',
    accent: 'green',
    tags: ['design', 'web'],
    updated: '2026-03-28',
  },
]
