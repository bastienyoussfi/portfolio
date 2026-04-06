import type { Project } from '@/types/project'
import { categoryConfig, defaultCategoryConfig } from '@/utils/categoryConfig'

export default function ProjectGridCard({ project, index }: { project: Project; index: number }) {
  const config = categoryConfig[project.category] ?? defaultCategoryConfig
  const href = project.links?.live || project.links?.github
  const Tag = href ? 'a' : 'div'
  const linkProps = href ? { href, target: '_blank' as const, rel: 'noopener noreferrer' } : {}

  return (
    <Tag
      className="pgrid-card"
      style={{ animationDelay: `${index * 60}ms` }}
      {...linkProps}
    >
      <div className="pgrid-card__thumb">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.title} loading="lazy" />
        ) : (
          <div className="pgrid-card__gradient" style={{ background: config.bg }}>
            {config.iconLg}
          </div>
        )}
      </div>
      <div className="pgrid-card__text">
        <div className="pgrid-card__title">{project.title}</div>
        <div className="pgrid-card__sub">
          {project.category} &middot; {project.year}
        </div>
      </div>
    </Tag>
  )
}
