const TAG_COLORS: Record<string, string> = {
  'react': 'blue',
  'typescript': 'blue',
  'claude api': 'blue',
  'fastapi': 'blue',
  'tailwind css': 'blue',
  'vite': 'blue',
  'node.js': 'green',
  'nestjs': 'green',
  'python': 'green',
  'express': 'green',
  'flask': 'green',
  'postgresql': 'purple',
  'langchain': 'purple',
  'openai api': 'purple',
  'graphql': 'purple',
  'docker': 'orange',
  'whatsapp api': 'orange',
  'javascript': 'orange',
  'firebase': 'orange',
  'aws': 'orange',
  'mistral': 'indigo',
  'prisma': 'indigo',
  'next.js': 'indigo',
  'supabase': 'indigo',
  'redis': 'indigo',
}

export function getTagColor(tech: string): string {
  return TAG_COLORS[tech.toLowerCase()] ?? 'blue'
}
