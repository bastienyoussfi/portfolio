import type { ReactNode } from 'react'
import { getTagColor } from '@/utils/tagColors'

export interface ProjectResult {
  title: string
  description: string
  category: string
  technologies: string[]
  status: string
  year: number
  metrics?: Array<{ label: string; value: string }>
  links?: { live?: string; github?: string }
}

const categoryConfig: Record<string, { icon: ReactNode; bg: string }> = {
  ai: {
    bg: 'var(--purple-light)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v1m0 16v1m-7.07-2.93l.71-.71m12.73-12.73l.7-.7M3 12h1m16 0h1m-2.93 7.07l-.71-.71M5.64 5.64l-.7-.7" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  web: {
    bg: 'var(--blue-light)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
      </svg>
    ),
  },
  mobile: {
    bg: 'var(--green-light)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  'open-source': {
    bg: 'var(--orange-light)',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
  },
}

const defaultConfig = {
  bg: 'var(--indigo-light)',
  icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--indigo)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  ),
}

export default function ProjectCard({ project, index }: { project: ProjectResult; index: number }) {
  const config = categoryConfig[project.category] ?? defaultConfig

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
        {project.technologies.map((t) => (
          <span key={t} className={`ptag ptag--${getTagColor(t)}`}>{t}</span>
        ))}
      </div>
    </div>
  )
}
