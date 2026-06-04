import styles from './Card.module.css'

/**
 * Surface primitive used by stats, packages and case studies.
 *
 * @param {'raised'|'dark'} [variant='raised'] - light paper card or ink card.
 * @param {'md'|'lg'} [radius='lg'] - corner rounding.
 * @param {'sm'|'md'|'lg'} [padding='md'] - inner spacing.
 * @param {'none'|'lift'|'lift-accent'} [hover='none'] - hover interaction.
 */
export default function Card({
  variant = 'raised',
  radius = 'lg',
  padding = 'md',
  hover = 'none',
  className = '',
  children,
  ...rest
}) {
  const hoverClass = { none: '', lift: styles.lift, 'lift-accent': styles.liftAccent }[hover]
  const classes = [
    styles.card,
    styles[variant],
    styles[`radius-${radius}`],
    styles[`pad-${padding}`],
    hoverClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
