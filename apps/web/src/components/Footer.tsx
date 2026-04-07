import { Link } from 'react-router-dom'
import { contact } from '@/data'

const SECTIONS = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/#contact' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <nav className="footer__links">
        {SECTIONS.map((s) => (
          <Link key={s.label} to={s.to} className="footer__link">
            {s.label}
          </Link>
        ))}
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
