import styles from './Eyebrow.module.css'

/** Small uppercase accent label sitting above a heading. */
export default function Eyebrow({ children, className = '' }) {
  return <p className={[styles.eyebrow, className].filter(Boolean).join(' ')}>{children}</p>
}
