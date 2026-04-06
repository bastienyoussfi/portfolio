import { useMemo } from 'react'
import type { Project } from '@/types/project'
import { projects } from '@/data'
import ProjectGridCard from './ProjectGridCard'

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
        {items.map((p, i) => (
          <ProjectGridCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </main>
  )
}
