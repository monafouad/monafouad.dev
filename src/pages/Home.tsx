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
        <div className="reveal mf-stagger mx-auto max-w-5xl">
          <p className="mf-eyebrow">Design Engineer · Zürich</p>
          <h1 className="mf-h1 mt-8 text-4xl leading-[1.06] sm:text-6xl md:text-7xl md:leading-[1.02]">
            I build the parts of a product
            <br className="hidden sm:block" /> people actually{' '}
            <em className="mf-em">feel</em>.
          </h1>

          {/* DRAFT(mona): AI-domain claim, option B from the drafts. Edit
              freely; the first two sentences are your original copy. */}
          <p className="mf-muted mt-9 max-w-xl text-base leading-relaxed sm:text-lg">
            Fifteen years of interface craft. Most recently: Cicla, a
            cycle-aware iOS product I designed, built, and shipped to
            TestFlight on my own. Alongside it: AI product interfaces, where
            streaming, voice, and model output meet an interface that
            can&rsquo;t assume the answer.
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
            <span aria-hidden="true" className="mf-dot-sep">
              ●
            </span>
            <a href="/cv" className="mf-link">
              CV
            </a>
          </div>

          <p className="mf-muted mt-12 inline-flex items-center text-xs font-medium uppercase tracking-[0.22em]">
            <span className="mf-dot-live mr-3 inline-block h-1.5 w-1.5 rounded-full" />
            Open to design engineer &amp; AI product engineer roles, permanent
            or contract · Zürich or remote EU
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mf-soft px-6 py-24 sm:px-10 sm:py-32">
        <div className="reveal mf-stagger mx-auto max-w-4xl">
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
         
        </div>
      </section>

      {/* CICLA, FEATURED TEASER */}
      <section className="px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="reveal mb-10">
            <p className="mf-eyebrow">Selected work</p>
          </div>

          <div className="grid items-center gap-14 md:grid-cols-2 md:gap-16">
            <div className="reveal mf-stagger">
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

      {/* LAB, supporting evidence */}
      <section className="mf-hairline border-t px-6 py-20 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="reveal mf-stagger">
            <p className="mf-eyebrow">Lab</p>
            <h2 className="mf-h3 mt-6 max-w-2xl text-2xl leading-[1.15] sm:text-3xl">
              The states nobody <em className="mf-em">builds</em>.
            </h2>
            {/* DRAFT(mona): trimmed option C, the claim beside its evidence.
                Edit freely. */}
            <p className="mf-muted mt-5 max-w-xl text-[0.97rem] leading-relaxed sm:text-base">
              AI product interfaces are their own discipline: streaming that
              doesn&rsquo;t jump, output nobody can predict. The Lab is where
              I work on those states.
            </p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mf-ink text-base font-semibold">
                  Streaming output that doesn&rsquo;t jump
                </h3>
                <p className="mf-muted mt-2 text-sm leading-relaxed">
                  Token streaming with consent-based scroll anchoring and
                  markdown that renders mid-parse.
                </p>
              </div>
              <div>
                <h3 className="mf-ink text-base font-semibold">
                  Cicla Interface System
                </h3>
                <p className="mf-muted mt-2 text-sm leading-relaxed">
                  The production components behind Cicla, documented in
                  Storybook.
                </p>
              </div>
            </div>
            <div className="mt-9">
              <Link
                to="/lab"
                className="mf-textlink group inline-flex items-center gap-2 text-base font-medium"
              >
                Everything in the Lab
                <span aria-hidden="true" className="mf-arrow">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}

export default Home
