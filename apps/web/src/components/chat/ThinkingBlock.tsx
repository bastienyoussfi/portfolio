import { useState } from 'react'
import TextShimmer from './TextShimmer'

interface Props {
  thinking: string
  isActive: boolean
}

const BrainIcon = (
  <svg viewBox="0 0 16 16" fill="none">
    <path
      d="M5.5 14v-1.3A5 5 0 0 1 3 8a5 5 0 0 1 10 0 5 5 0 0 1-2.5 4.7V14M6 10h4M7 12h2"
      stroke="var(--purple)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
)

export default function ThinkingBlock({ thinking, isActive }: Props) {
  const [open, setOpen] = useState(isActive)

  return (
    <div className="thinking">
      <div className="thinking__header" onClick={() => setOpen((o) => !o)}>
        <div className="thinking__icon-well">
          {isActive ? <div className="thinking__sparkle" /> : BrainIcon}
        </div>
        <span className="thinking__label">
          {isActive ? (
            <TextShimmer duration={3} spread={25}>Agent thinking</TextShimmer>
          ) : (
            'Thought process'
          )}
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
