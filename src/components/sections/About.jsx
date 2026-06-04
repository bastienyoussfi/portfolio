import Section from '../ui/Section.jsx'
import Avatar from '../ui/Avatar.jsx'
import { about } from '../../data/content.js'
import styles from './About.module.css'

export default function About() {
  return (
    <Section id="about" bordered>
      <div className={styles.row}>
        <Avatar initials={about.initials} />
        <div>
          <h2 className={styles.name}>{about.name}</h2>
          <p className={styles.bio}>{about.bio}</p>
          <div className={styles.links}>
            {about.links.map((link) => (
              <a key={link.label} href={link.href} className={styles.link}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
