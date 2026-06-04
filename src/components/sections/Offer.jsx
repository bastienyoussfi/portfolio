import { Fragment } from 'react'
import Section from '../ui/Section.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Reveal from '../ui/Reveal.jsx'
import Package from './Package.jsx'
import { offer } from '../../data/content.js'
import styles from './Offer.module.css'

export default function Offer() {
  return (
    <Section id="offer" bordered>
      <SectionHeading title={offer.title} intro={offer.intro} />

      <div className={styles.packages}>
        {offer.packages.map((pkg) => (
          <Reveal key={pkg.title}>
            <Package {...pkg} />
          </Reveal>
        ))}
      </div>

      <p className={styles.flow}>
        {/* Odd fragments are the emphasized milestones. */}
        {offer.flow.map((part, index) =>
          index % 2 === 1 ? (
            <b key={index} className={styles.flowMark}>
              {part}
            </b>
          ) : (
            <Fragment key={index}>{part}</Fragment>
          ),
        )}
      </p>
    </Section>
  )
}
