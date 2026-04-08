import { useState } from 'react'
import type { ToolCallDisplay } from '@/types/chat'
import type { Project } from '@/types/project'
import ProjectCard from './ProjectCard'
import TextShimmer from './TextShimmer'

const LABELS: Record<string, string> = {
  search_projects: 'Searching projects',
  get_skills: 'Looking up skills',
  get_experience: 'Retrieving experience',
  get_contact: 'Getting contact info',
}

const DONE_LABELS: Record<string, (result: unknown) => string> = {
  search_projects: (r) => {
    const res = r as { count?: number }
    return `Found ${res?.count ?? 0} project${(res?.count ?? 0) !== 1 ? 's' : ''}`
  },
  get_skills: () => 'Retrieved skills',
  get_experience: () => 'Found experience',
  get_contact: () => 'Got contact info',
}

function isProjectResult(result: unknown): result is { count: number; projects: Project[] } {
  if (!result || typeof result !== 'object') return false
  const r = result as Record<string, unknown>
  return Array.isArray(r.projects) && r.projects.length > 0
}

const checkIcon = (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M3 8.5l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function ToolCallBlock({ tc }: { tc: ToolCallDisplay }) {
  const [open, setOpen] = useState(false)
  const done = tc.status === 'complete'
  const label = LABELS[tc.name] ?? tc.name

  return (
    <div className="tool-step">
      <div className={`tool-step__bar ${done ? 'tool-step__bar--done' : ''}`} />

      <div className="tool-step__content">
        <div
          className={`tool-step__header ${done ? 'tool-step__header--clickable' : ''}`}
          onClick={() => done && setOpen((o) => !o)}
        >
          <div className={`tool-step__icon ${done ? 'tool-step__icon--done' : ''}`}>
            {done ? checkIcon : <div className="tool-call__spinner" />}
          </div>

          <span className="tool-step__label">
            {done ? (
              DONE_LABELS[tc.name]?.(tc.result) ?? label
            ) : (
              <TextShimmer duration={3} spread={15}>{`${label}...`}</TextShimmer>
            )}
          </span>

          {done && (
            <svg
              className={`thinking__chevron ${open ? 'thinking__chevron--open' : ''}`}
              viewBox="0 0 7 12"
              fill="none"
            >
              <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        {done && (
          <div className={`tool-step__body ${open ? 'tool-step__body--open' : ''}`}>
            <div className="tool-step__body-inner">
              {tc.name === 'search_projects' && isProjectResult(tc.result) ? (
                <div className="project-cards">
                  {tc.result.projects.map((p, i) => (
                    <ProjectCard key={p.title} project={p} index={i} />
                  ))}
                </div>
              ) : (
                <div className="tool-call__details">
                  {Object.keys(tc.input).length > 0 && (
                    <>
                      <span className="tool-call__section-label">Input</span>
                      <pre className="tool-call__code">{JSON.stringify(tc.input, null, 2)}</pre>
                    </>
                  )}
                  {tc.result !== undefined && (
                    <>
                      <span className="tool-call__section-label">Result</span>
                      <pre className="tool-call__code">{JSON.stringify(tc.result, null, 2)}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
