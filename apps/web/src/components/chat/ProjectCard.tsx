import type { Project } from '@/types/project'
import { getTagColor } from '@/utils/tagColors'
import { categoryConfig, defaultCategoryConfig } from '@/utils/categoryConfig'

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const config = categoryConfig[project.category] ?? defaultCategoryConfig

  return (
    <div
      className="project-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="project-card__header">
        <div className="project-card__icon" style={{ background: config.bg }}>
          {config.icon}
        </div>
        <div className="project-card__info">
          <div className="project-card__title">{project.title}</div>
          <div className="project-card__type">
            {project.category} &middot; {project.year}
          </div>
        </div>
      </div>
      <div className="project-card__desc">{project.description}</div>
      <div className="project-card__tags">
        {project.technologies?.map((t) => (
          <span key={t} className={`ptag ptag--${getTagColor(t)}`}>{t}</span>
        ))}
      </div>
    </div>
  )
}
