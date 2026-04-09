// Maps technology names to devicon CDN URLs for avatar display
const TECH_ICONS: Record<string, { icon: string; initials: string }> = {
  'react': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    initials: 'Re',
  },
  'typescript': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    initials: 'TS',
  },
  'vite': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg',
    initials: 'Vi',
  },
  'tailwind css': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    initials: 'TW',
  },
  'shadcn/ui': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shadcnui.svg',
    initials: 'UI',
  },
  'claude api': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/anthropic.svg',
    initials: 'Cl',
  },
  'claude haiku': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/anthropic.svg',
    initials: 'CH',
  },
  'nestjs': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg',
    initials: 'Ne',
  },
  'postgresql': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
    initials: 'PG',
  },
  'docker': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    initials: 'Do',
  },
  'python': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    initials: 'Py',
  },
  'prisma': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg',
    initials: 'Pr',
  },
  'github actions': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg',
    initials: 'GA',
  },
  'gemini flash api': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googlegemini.svg',
    initials: 'Ge',
  },
  'hetzner': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/hetzner.svg',
    initials: 'Hz',
  },
  'oauth 2.0': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oauth/oauth-original.svg',
    initials: 'OA',
  },
  'elevenlabs api': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/elevenlabs.svg',
    initials: 'EL',
  },
  'twilio': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/twilio.svg',
    initials: 'Tw',
  },
  'llm': {
    icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/brain.svg',
    initials: 'LM',
  },
  'rag': {
    icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/file-search.svg',
    initials: 'RG',
  },
  'embeddings': {
    icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/layers.svg',
    initials: 'Em',
  },
  'scaleway': {
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/scaleway.svg',
    initials: 'Sc',
  },
  'self-hosted llms': {
    icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/server.svg',
    initials: 'SH',
  },
  'framer motion': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg',
    initials: 'FM',
  },
  'speech-to-text': {
    icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/mic.svg',
    initials: 'ST',
  },
  'nlp': {
    icon: 'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/languages.svg',
    initials: 'NL',
  },
}

export function getTechIcon(tech: string): { icon: string; initials: string } {
  return TECH_ICONS[tech.toLowerCase()] ?? { icon: '', initials: tech.slice(0, 2).toUpperCase() }
}
