import Section from '../ui/Section.jsx'
import { renderRich } from '../../utils/renderRich.jsx'
import { problem } from '../../data/content.js'
import styles from './Problem.module.css'

export default function Problem() {
  return (
    <Section bordered>
      <div className={styles.row}>
        <h2 className={styles.heading}>{problem.heading}</h2>
        <div className={styles.body}>
          {problem.paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {renderRich(paragraph, { strong: styles.strong })}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}
