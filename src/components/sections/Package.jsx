import Card from '../ui/Card.jsx'
import styles from './Package.module.css'

/** One offer package card. `featured` paints it on the ink surface. */
export default function Package({ step, title, description, tag, featured = false }) {
  return (
    <Card
      variant={featured ? 'dark' : 'raised'}
      radius="lg"
      padding="md"
      hover="lift"
      className={[styles.package, featured ? styles.featured : ''].filter(Boolean).join(' ')}
    >
      <p className={styles.step}>{step}</p>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <p className={styles.tag}>{tag}</p>
    </Card>
  )
}
