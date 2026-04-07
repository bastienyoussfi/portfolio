import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { contact } from '@/data'
import { useContactModal } from '@/hooks/useContactModal'

const SECTIONS = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'projects', label: 'Projects', to: '/projects' },
  { id: 'blog', label: 'Blog', to: '/blog' },
  { id: 'contact', label: 'Contact', to: '' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { open: openContact } = useContactModal()

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return (
    <header className="header" data-open={isOpen}>
      {/* Centered nav pill */}
      <nav className="header__nav">
        <a href={contact.github} target="_blank" rel="noopener noreferrer" className="header__icon" aria-label="GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="header__icon" aria-label="X">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="header__icon" aria-label="LinkedIn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        {/* Menu button */}
        <button
          className="header__menu-btn"
          onClick={() => setIsOpen(o => !o)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <span className="header__menu-line" />
          <span className="header__menu-line" />
          <span className="header__menu-line" />
        </button>
      </nav>

      {/* Page selector overlay — always mounted for exit animation */}
      <div className="header__overlay" aria-hidden={!isOpen}>
        <nav className="header__overlay-nav">
          {SECTIONS.map((s, i) =>
            s.id === 'contact' ? (
              <button
                key={s.id}
                className="header__overlay-link"
                style={{ transitionDelay: isOpen ? `${i * 50}ms` : `${(SECTIONS.length - 1 - i) * 30}ms` }}
                tabIndex={isOpen ? 0 : -1}
                onClick={() => { close(); openContact() }}
              >
                {s.label}
              </button>
            ) : (
              <Link
                key={s.id}
                to={s.to}
                className="header__overlay-link"
                style={{ transitionDelay: isOpen ? `${i * 50}ms` : `${(SECTIONS.length - 1 - i) * 30}ms` }}
                tabIndex={isOpen ? 0 : -1}
                onClick={close}
              >
                {s.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
