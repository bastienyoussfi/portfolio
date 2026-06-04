import Card from './Card.jsx'
import { renderRich } from '../../utils/renderRich.jsx'
import styles from './Stat.module.css'

/**
 * Proof-bar stat: kicker label, big figure (which may contain accented
 * fragments), and a supporting detail line.
 *
 * @param {string} kicker
 * @param {Array} value - rich fragments, e.g. ['1 sem ', { text: '→', accent: true }]
 * @param {string} detail
 * @param {boolean} [dark]
 */
export default function Stat({ kicker, value, detail, dark = false }) {
  return (
    <Card
      variant={dark ? 'dark' : 'raised'}
      radius="md"
      padding="sm"
      hover="lift-accent"
      className={dark ? styles.dark : ''}
    >
      <p className={styles.kicker}>{kicker}</p>
      <p className={styles.value}>{renderRich(value, { accent: styles.accent })}</p>
      <p className={styles.detail}>{detail}</p>
    </Card>
  )
}
