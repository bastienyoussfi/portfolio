import { useMemo } from 'react'
import type { Project } from '@/types/project'
import { projects } from '@/data'
import { AnimatedHikeCard } from '@/components/ui/card-25'
import { Brain, Rocket, Code, Calendar, Layers } from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  ai: <Brain className="h-4 w-4" />,
  saas: <Rocket className="h-4 w-4" />,
  fullstack: <Code className="h-4 w-4" />,
}

const projectImages: Record<string, string[]> = {
  auditex: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
  ],
  'grow-online': [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
  ],
  squaire: [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
  ],
  'posi-btp': [
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
  ],
  'portfolio-site': [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&h=600&fit=crop',
  ],
}

const defaultImages = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1550439062-609e1531270e?w=800&h=600&fit=crop',
]

function buildStats(project: Project) {
  const stats = []
  const icon = categoryIcons[project.category] ?? <Code className="h-4 w-4" />
  stats.push({ icon, label: project.category })
  stats.push({ icon: <Calendar className="h-4 w-4" />, label: String(project.year) })
  if (project.technologies?.length) {
    stats.push({ icon: <Layers className="h-4 w-4" />, label: `${project.technologies.length} techs` })
  }
  return stats
}

export default function ProjectsPage() {
  const items = useMemo(
    () => (projects as Project[])
      .filter((p) => p.featured !== false)
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
    [],
  )

  return (
    <main className="projects-page">
      <div className="projects-page__header">
        <h1 className="projects-page__title">
          Selected <strong>work.</strong>
        </h1>
        <p className="projects-page__subtitle">
          Things I've built & shipped.
        </p>
      </div>
      <div className="projects-grid">
        {items.map((p) => (
          <AnimatedHikeCard
            key={p.id}
            title={p.title}
            images={projectImages[p.id] ?? defaultImages}
            stats={buildStats(p)}
            description={p.description}
            href={p.links?.live || p.links?.github || '#'}
          />
        ))}
      </div>
    </main>
  )
}
