import styles from './Page.module.css'

/**
 * The floating "paper" canvas that holds the whole site. Renders the sticky
 * nav (outside the padded column) and wraps the page content in `.wrap`.
 */
export default function Page({ nav, children }) {
  return (
    <div className={styles.page}>
      {nav}
      <div className={styles.wrap}>{children}</div>
    </div>
  )
}
