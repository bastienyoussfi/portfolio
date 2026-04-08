import { Link } from 'react-router-dom'
import { contact } from '@/data'
import { useContactModal } from '@/hooks/useContactModal'

const SECTIONS = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '' },
]

export default function Footer() {
  const { open: openContact } = useContactModal()

  return (
    <footer className="footer">
      <nav className="footer__links">
        {SECTIONS.map((s) =>
          s.label === 'Contact' ? (
            <button key={s.label} className="footer__link" onClick={openContact}>
              {s.label}
            </button>
          ) : (
            <Link key={s.label} to={s.to} className="footer__link">
              {s.label}
            </Link>
          )
        )}
      </nav>
      <div className="footer__social">
        <a href={contact.github} target="_blank" rel="noopener noreferrer" className="footer__link">
          GitHub
        </a>
        <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="footer__link">
          X
        </a>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="footer__link">
          LinkedIn
        </a>
      </div>
    </footer>
  )
}
