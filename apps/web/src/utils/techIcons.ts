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
    icon: '',
    initials: 'UI',
  },
  'claude api': {
    icon: '',
    initials: 'Cl',
  },
  'claude haiku': {
    icon: '',
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
    icon: '',
    initials: 'Ge',
  },
  'hetzner': {
    icon: '',
    initials: 'Hz',
  },
  'oauth 2.0': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oauth/oauth-original.svg',
    initials: 'OA',
  },
  'elevenlabs api': {
    icon: '',
    initials: 'EL',
  },
  'twilio': {
    icon: '',
    initials: 'Tw',
  },
  'llm': {
    icon: '',
    initials: 'LM',
  },
  'rag': {
    icon: '',
    initials: 'RG',
  },
  'embeddings': {
    icon: '',
    initials: 'Em',
  },
  'scaleway': {
    icon: '',
    initials: 'Sc',
  },
  'self-hosted llms': {
    icon: '',
    initials: 'SH',
  },
  'framer motion': {
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg',
    initials: 'FM',
  },
  'speech-to-text': {
    icon: '',
    initials: 'ST',
  },
  'nlp': {
    icon: '',
    initials: 'NL',
  },
}

export function getTechIcon(tech: string): { icon: string; initials: string } {
  return TECH_ICONS[tech.toLowerCase()] ?? { icon: '', initials: tech.slice(0, 2).toUpperCase() }
}
