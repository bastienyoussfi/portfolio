import { useMemo } from 'react'
import type { Project } from '@/types/project'
import { projects } from '@/data'
import ProjectCard from '@/components/ui/project-card'

const projectImages: Record<string, string> = {
  auditex: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  'grow-online': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  squaire: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
  'posi-btp': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
  'portfolio-site': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
}

const defaultImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'

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
      <div className="projects-list">
        {items.map((p) => (
          <ProjectCard
            key={p.id}
            title={p.title}
            year={p.year}
            description={p.description}
            href={p.links?.live || p.links?.github || undefined}
            image={projectImages[p.id] ?? defaultImage}
            technologies={p.technologies}
          />
        ))}
      </div>
    </main>
  )
}
