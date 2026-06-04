import Card from '../ui/Card.jsx'
import Screenshot from '../ui/Screenshot.jsx'
import styles from './Case.module.css'

/** A single case study card. */
export default function Case({ num, context, title, shot, problem, built, result }) {
  return (
    <Card radius="lg" padding="lg" className={styles.case}>
      <p className={styles.num}>{num}</p>
      <p className={styles.context}>{context}</p>
      <h3 className={styles.title}>{title}</h3>

      <Screenshot {...shot} />

      <div className={styles.columns}>
        <div className={styles.column}>
          <p className={styles.label}>Le problème</p>
          <p className={styles.text}>{problem}</p>
        </div>
        <div className={styles.column}>
          <p className={styles.label}>Ce que j'ai construit</p>
          <p className={styles.text}>{built}</p>
        </div>
      </div>

      <div className={styles.result}>
        <p className={styles.metric}>{result.metric}</p>
        <p className={styles.resultText}>{result.text}</p>
      </div>
    </Card>
  )
}
