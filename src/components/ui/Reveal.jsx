import { useReveal } from '../../hooks/useReveal.js'
import styles from './Reveal.module.css'

/**
 * Wraps children in a fade-and-rise reveal that triggers on scroll.
 * `as` lets you keep semantic markup (section, div, article...).
 */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const { ref, visible } = useReveal()
  const classes = [styles.reveal, visible ? styles.in : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  )
}
