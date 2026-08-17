import { useEffect } from 'react'
import { Contact } from '../components'
import { useReveal } from '../useReveal'

function About() {
  useEffect(() => {
    document.title = 'About · Mona Fouad'
  }, [])
  useReveal()

  return (
    <>
      <section className="px-6 pt-20 pb-24 sm:px-10 sm:pt-28 sm:pb-32">
        <div className="reveal mx-auto max-w-4xl">
          <p className="mf-eyebrow">About</p>
          <h1 className="mf-h1 mt-8 max-w-3xl text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
            Fifteen years on the side of software{' '}
            <em className="mf-em">people touch</em>.
          </h1>

          <div className="mf-muted mt-14 max-w-2xl space-y-7 text-base leading-relaxed sm:text-lg">
            <p>
              I started in software in Barcelona with a Microsoft certification
              in C#, and quickly learned what actually pulled me: the visual,
              user-facing side of technology, where programming meets
              creativity. That led me into frontend engineering, first across
              product companies and agencies in Barcelona, then in Switzerland
              at Arpia. There, in a strong frontend team, I built reusable
              design systems in Storybook, helped a three-person team rebuild
              a client website from AngularJS to React in about three months,
              and created AI-powered experiences involving voice,
              transcription, and dynamic model output.
            </p>
            <p>
              With Cicla, I took the next step: independently shaping and
              shipping a complete iOS product from concept to TestFlight.
              Product design, frontend, backend services, integrations, and
              testing, in an AI-native workflow.
            </p>
            <p>
              I want more of that work, in small, ambitious teams where product
              judgment matters and engineers influence the experience from the
              first idea through production. I&rsquo;m especially drawn to
              products that pair complex technology with interfaces that feel
              thoughtful, clear, and human.
            </p>
            <p>
              I care about the details people notice without being able to name
              them: whether an interaction arrives at the right moment, whether
              motion helps rather than distracts, whether the whole product
              feels like it was made by one coherent mind.
            </p>
            <p>
              My deepest expertise is design and frontend engineering.
              I&rsquo;m not an ML researcher or an infrastructure specialist.
              I build the pragmatic backend a product needs with managed
              services and AI assistance, and I stay accountable for
              everything that ships.
            </p>
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}

export default About
