import styles from './SectionHeading.module.css'

/** Big display title + optional muted intro paragraph (Cases, Offer). */
export default function SectionHeading({ title, intro, className = '' }) {
  return (
    <header className={[styles.heading, className].filter(Boolean).join(' ')}>
      <h2 className={styles.title}>{title}</h2>
      {intro && <p className={styles.intro}>{intro}</p>}
    </header>
  )
}
