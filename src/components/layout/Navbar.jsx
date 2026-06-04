import { brand, nav } from '../../data/content.js'
import styles from './Navbar.module.css'

/** Sticky frosted pill navigation. */
export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.pill}>
        <span className={styles.brand}>{brand.name}</span>
        {nav.links.map((link) => (
          <a key={link.href} href={link.href} className={styles.link}>
            {link.label}
          </a>
        ))}
        <a href={nav.cta.href} className={styles.cta}>
          {nav.cta.label}
        </a>
      </div>
    </nav>
  )
}
