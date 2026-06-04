import Section from '../ui/Section.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Reveal from '../ui/Reveal.jsx'
import Case from './Case.jsx'
import { cases } from '../../data/content.js'

export default function Cases() {
  return (
    <Section id="cases" bordered>
      <SectionHeading title={cases.title} intro={cases.intro} />
      {cases.items.map((item) => (
        <Reveal key={item.num}>
          <Case {...item} />
        </Reveal>
      ))}
    </Section>
  )
}
