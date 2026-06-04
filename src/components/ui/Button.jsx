import styles from './Button.module.css'

/**
 * Link-styled button. All CTAs in the page are anchors, so this renders <a>.
 *
 * @param {'primary'|'white'|'ghost'} [variant='primary']
 */
export default function Button({ variant = 'primary', href = '#', className = '', children, ...rest }) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ')
  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  )
}
