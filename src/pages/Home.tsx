import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Contact, Meta } from '../components'
import { CICLA_URL, EMAIL, LINKEDIN_URL } from '../content'
import { useReveal } from '../useReveal'

function Home() {
  useEffect(() => {
    document.title = 'Mona Fouad · Design Engineer'
  }, [])
  useReveal()

  return (
    <>
      {/* HERO */}
      <section id="top" className="px-6 pt-28 pb-24 sm:px-10 sm:pt-40 sm:pb-32">
        <div className="reveal mx-auto max-w-5xl">
          <p className="mf-eyebrow">Design Engineer · Zürich</p>
          <h1 className="mf-h1 mt-8 text-4xl leading-[1.06] sm:text-6xl md:text-7xl md:leading-[1.02]">
            I build the parts of a product
            <br className="hidden sm:block" /> people actually{' '}
            <em className="mf-em">feel</em>.
          </h1>

          <p className="mf-muted mt-9 max-w-xl text-base leading-relaxed sm:text-lg">
            Fifteen years of interface craft. Most recently: Cicla, a
            cycle-aware iOS product I designed, built, and shipped to
            TestFlight on my own.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 text-sm sm:text-base">
            <a href={`mailto:${EMAIL}`} className="mf-link">
              {EMAIL}
            </a>
            <span aria-hidden="true" className="mf-dot-sep">
              ●
            </span>
            <a href={LINKEDIN_URL} className="mf-link">
              LinkedIn
            </a>
          </div>

          <p className="mf-muted mt-12 inline-flex items-center text-xs font-medium uppercase tracking-[0.22em]">
            <span className="mf-dot-live mr-3 inline-block h-1.5 w-1.5 rounded-full" />
            Open to design engineer &amp; AI product engineer roles · Zürich or
            remote EU
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mf-soft px-6 py-24 sm:px-10 sm:py-32">
        <div className="reveal mx-auto max-w-4xl">
          <p className="mf-eyebrow">About</p>
          <p className="mf-statement mt-8 text-2xl leading-[1.3] sm:text-3xl md:text-4xl md:leading-[1.25]">
            I work between design and engineering, taking a vague product idea
            and shipping an interface that{' '}
            <em className="mf-em">feels right</em>.{' '}
            <span className="mf-muted">
              AI is my tooling. The product judgment, the taste, and the hundred
              small calls that make it cohere are mine.
            </span>
          </p>
          <div className="mt-10">
            <Link
              to="/about"
              className="mf-textlink group inline-flex items-center gap-2 text-base font-medium"
            >
              More about me
              <span aria-hidden="true" className="mf-arrow">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CICLA, FEATURED TEASER */}
      <section className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="reveal mb-10 flex items-baseline justify-between gap-6">
            <p className="mf-eyebrow">Selected work</p>
            <span className="mf-dim text-xs font-medium tabular-nums">
              Since 2026
            </span>
          </div>

          <div className="grid items-center gap-14 md:grid-cols-2 md:gap-16">
            <div className="reveal">
              <h2 className="mf-wordmark text-5xl leading-[0.95] sm:text-6xl">
                Cicla
              </h2>

              <p className="mf-muted mt-7 text-base leading-relaxed sm:text-lg">
                A cycle-aware body intelligence app, it reads food, mood,
                movement, fasting, and HealthKit signals together and
                interprets what they mean in the moment. Built solo, end to
                end. Now in TestFlight beta.
              </p>

              <dl className="mf-hairline mt-9 grid grid-cols-2 gap-x-8 gap-y-7 border-t pt-8 text-sm">
                <Meta label="Role" value="Solo founder & engineer" />
                <Meta label="Scope" value="Design · Frontend · Backend · AI" />
                <Meta label="Platform" value="iOS" />
                <Meta label="Status" value="TestFlight beta" />
              </dl>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  to="/cicla"
                  className="mf-accent-deep group inline-flex items-center gap-2 text-base font-medium"
                >
                  <span className="mf-cta-underline">Read the case study</span>
                  <span aria-hidden="true" className="mf-arrow-lg mf-accent">
                    →
                  </span>
                </Link>
                <a
                  href={CICLA_URL}
                  className="mf-textlink group inline-flex items-center gap-2 text-base font-medium"
                >
                  Visit cicla.app
                  <span aria-hidden="true" className="mf-arrow">
                    →
                  </span>
                </a>
              </div>
            </div>

            <figure className="reveal m-0 flex justify-center md:justify-end">
              <img
                src="/screenshots/home-menstrual.webp"
                alt="Cicla home screen, day 3, menstrual phase"
                className="mf-shot mf-screen max-h-[340px] w-auto object-contain sm:max-h-[380px]"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}

export default Home
