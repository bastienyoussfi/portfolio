import { useParams, Link } from 'react-router-dom'
import type { Project } from '@/types/project'
import { projects } from '@/data'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getTechIcon } from '@/utils/techIcons'

const projectImages: Record<string, string> = {
  auditex: '/projects/auditex.png',
  growonline: '/projects/growonline.png',
  voicy: '/projects/voicy.png',
  autoscribe: '/projects/autoscribe.png',
  portfolio: '/projects/portfolio.png',
}

export default function ProjectPostPage() {
  const { id } = useParams<{ id: string }>()
  const project = (projects as Project[]).find((p) => p.id === id)

  if (!project) {
    return (
      <main className="project-post">
        <Link to="/projects" className="project-post__back">
          &larr; Back to projects
        </Link>
        <h1 className="project-post__title">Project not found</h1>
      </main>
    )
  }

  const image = id ? projectImages[id] : undefined

  return (
    <main className="project-post">
      <Link to="/projects" className="project-post__back">
        &larr; Back to projects
      </Link>

      <header className="project-post__header">
        <h1 className="project-post__title">{project.title}</h1>
        <div className="project-post__meta">
          <span>{project.year} &middot; {project.role}</span>
          {project.technologies && project.technologies.length > 0 && (
            <div className="project-post__techs">
              {project.technologies.map((tech) => {
                const { icon, initials } = getTechIcon(tech)
                return (
                  <Avatar key={tech} className="size-5">
                    <AvatarImage
                      src={icon || undefined}
                      alt={tech}
                      className="border border-[var(--card)] bg-[var(--card)] p-0.5"
                    />
                    <AvatarFallback className="text-[8px]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )
              })}
            </div>
          )}
        </div>
      </header>

      {image && (
        <img
          src={image}
          alt={project.title}
          className="project-post__hero"
        />
      )}

      <div className="project-post__body">
        <p>{project.longDescription}</p>
      </div>

      {(project.links?.live || project.links?.github) && (
        <div className="project-post__links">
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer">
              View live &rarr;
            </a>
          )}
          {project.links.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer">
              GitHub &rarr;
            </a>
          )}
        </div>
      )}
    </main>
  )
}
