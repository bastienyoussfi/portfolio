import Page from './components/layout/Page.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Hero from './components/sections/Hero.jsx'
import Problem from './components/sections/Problem.jsx'
import Cases from './components/sections/Cases.jsx'
import Offer from './components/sections/Offer.jsx'
import About from './components/sections/About.jsx'
import FinalCta from './components/sections/FinalCta.jsx'

export default function App() {
  return (
    <Page nav={<Navbar />}>
      <Hero />
      <Problem />
      <Cases />
      <Offer />
      <About />
      <FinalCta />
      <Footer />
    </Page>
  )
}
