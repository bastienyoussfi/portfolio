import { useState } from 'react'
import type { ToolCallDisplay } from '@/types/chat'

const LABELS: Record<string, string> = {
  search_projects: 'Searching projects',
  get_skills: 'Looking up skills',
  get_experience: 'Retrieving experience',
  get_contact: 'Getting contact info',
}

export default function ToolCallBlock({ tc }: { tc: ToolCallDisplay }) {
  const [open, setOpen] = useState(false)
  const done = tc.status === 'complete'
  const label = LABELS[tc.name] ?? tc.name

  return (
    <div className="tool-call">
      <div className="tool-call__header" onClick={() => setOpen((o) => !o)}>
        <div className="icon-well" style={{ background: 'var(--indigo-light)' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6.5 2.5L3 6l3.5 3.5M9.5 2.5L13 6 9.5 9.5M5 14h6" stroke="var(--indigo)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="tool-call__label">{label}{done ? '' : '…'}</span>
        {done ? (
          <svg className="tool-call__check" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <div className="tool-call__spinner" />
        )}
        <svg className={`thinking__chevron ${open ? 'thinking__chevron--open' : ''}`} viewBox="0 0 7 12" fill="none">
          <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className={`tool-call__body ${open ? 'tool-call__body--open' : ''}`}>
        <div className="tool-call__body-inner">
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
        </div>
      </div>
    </div>
  )
}
