import Reveal from './Reveal.jsx'
import styles from './Section.module.css'

/**
 * A page section: consistent vertical rhythm, optional top divider, and a
 * built-in reveal-on-scroll. Pass `bordered` for the hairline separator.
 */
export default function Section({ id, bordered = false, className = '', children, ...rest }) {
  const classes = [styles.section, bordered ? styles.bordered : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Reveal as="section" id={id} className={classes} {...rest}>
      {children}
    </Reveal>
  )
}
