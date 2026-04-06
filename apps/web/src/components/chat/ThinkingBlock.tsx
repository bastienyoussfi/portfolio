import { useState } from 'react'

interface Props {
  thinking: string
  isActive: boolean
}

export default function ThinkingBlock({ thinking, isActive }: Props) {
  const [open, setOpen] = useState(isActive)

  return (
    <div className="thinking">
      <div className="thinking__header" onClick={() => setOpen((o) => !o)}>
        {isActive && (
          <div className="thinking__dots">
            <div className="thinking__dot" />
            <div className="thinking__dot" />
            <div className="thinking__dot" />
          </div>
        )}
        <span className="thinking__label">
          {isActive ? 'Thinking…' : 'Thought process'}
        </span>
        <svg
          className={`thinking__chevron ${open ? 'thinking__chevron--open' : ''}`}
          viewBox="0 0 7 12"
          fill="none"
        >
          <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className={`thinking__body ${open ? 'thinking__body--open' : ''}`}>
        <div className="thinking__body-inner">
          {thinking && <div className="thinking__text">{thinking}</div>}
        </div>
      </div>
    </div>
  )
}
