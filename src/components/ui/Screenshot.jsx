import styles from './Screenshot.module.css'

/**
 * Product screenshot frame: faux browser bar, corner badge and a placeholder
 * (icon + title + subtitle). Pass `src`/`alt` to drop in a real image later.
 */
export default function Screenshot({ badge, title, subtitle, icon = '▢', src, alt = '' }) {
  return (
    <figure className={styles.shot}>
      <div className={styles.bar} aria-hidden="true">
        <i className={styles.dot} />
        <i className={styles.dot} />
        <i className={styles.dot} />
      </div>

      {badge && <span className={styles.badge}>{badge}</span>}

      {src ? (
        <img className={styles.image} src={src} alt={alt} />
      ) : (
        <figcaption className={styles.placeholder}>
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
          <span className={styles.placeholderTitle}>{title}</span>
          <span className={styles.placeholderSubtitle}>{subtitle}</span>
        </figcaption>
      )}
    </figure>
  )
}
