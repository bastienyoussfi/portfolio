import { footer } from '../../data/content.js'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.brand}>{footer.brand}</span>
      <nav className={styles.links}>
        {footer.links.map((link) => (
          <a key={link.label} href={link.href} className={styles.link}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
