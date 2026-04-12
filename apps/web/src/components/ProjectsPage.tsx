import { useMemo } from 'react'
import type { Project } from '@/types/project'
import { projects } from '@/data'
import ProjectCard from '@/components/ui/project-card'

const projectImages: Record<string, string> = {
  auditex: '/projects/auditex.png',
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
      <div className="projects-list">
        {items.map((p) => (
          <ProjectCard
            key={p.id}
            title={p.title}
            year={p.year}
            description={p.description}
            href={`/projects/${p.id}`}
            image={projectImages[p.id]}
            technologies={p.technologies}
          />
        ))}
      </div>
    </main>
  )
}
