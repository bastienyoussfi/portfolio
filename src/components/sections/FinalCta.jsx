import Reveal from '../ui/Reveal.jsx'
import Button from '../ui/Button.jsx'
import { finalCta } from '../../data/content.js'
import styles from './FinalCta.module.css'

export default function FinalCta() {
  return (
    <Reveal as="section" id="contact" className={styles.final}>
      <div className={styles.block}>
        <h2 className={styles.heading}>{finalCta.heading}</h2>
        <p className={styles.text}>{finalCta.text}</p>
        <Button variant="white" href={finalCta.cta.href} className={styles.cta}>
          {finalCta.cta.label}
        </Button>
      </div>
    </Reveal>
  )
}
