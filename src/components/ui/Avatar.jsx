import styles from './Avatar.module.css'

/** Circular gradient avatar showing initials. */
export default function Avatar({ initials }) {
  return (
    <div className={styles.avatar} aria-hidden="true">
      {initials}
    </div>
  )
}
