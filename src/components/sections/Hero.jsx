import Reveal from '../ui/Reveal.jsx'
import Eyebrow from '../ui/Eyebrow.jsx'
import Button from '../ui/Button.jsx'
import Stat from '../ui/Stat.jsx'
import { renderRich } from '../../utils/renderRich.jsx'
import { hero } from '../../data/content.js'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <Reveal as="section" className={styles.hero}>
      <Eyebrow>{hero.eyebrow}</Eyebrow>

      <h1 className={styles.title}>{renderRich(hero.title, { highlight: styles.highlight })}</h1>

      <p className={styles.subtitle}>{hero.subtitle}</p>

      <div className={styles.actions}>
        <Button variant="primary" href={hero.primaryCta.href}>
          {hero.primaryCta.label}
        </Button>
        <Button variant="ghost" href={hero.secondaryCta.href}>
          {hero.secondaryCta.label}
        </Button>
      </div>

      <div className={styles.proof}>
        {hero.stats.map((stat) => (
          <Reveal key={stat.kicker}>
            <Stat {...stat} />
          </Reveal>
        ))}
      </div>
    </Reveal>
  )
}
