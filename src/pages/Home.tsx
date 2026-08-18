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
      <section id="top" className="mf-section mf-section-hero">
        <div className="mf-reveal mf-stagger mf-shell">
          <p className="mf-eyebrow">Design Engineer</p>
          <h1 className="mf-h1 mf-hero-title">
            I build the parts of a product
            <br className="mf-hero-br" /> people actually{' '}
            <em className="mf-em">feel</em>.
          </h1>

          {/* DRAFT(mona): AI-domain claim, option B from the drafts. Edit
              freely; the first two sentences are your original copy. */}
          <p className="mf-muted mf-lede mf-hero-copy">
            Fifteen years of interface craft. Most recently: Cicla, a
            cycle-aware iOS product I designed, built, and shipped to
            TestFlight on my own. Alongside it: AI product interfaces, where
            streaming, voice, and model output meet an interface that
            can&rsquo;t assume the answer.
          </p>

          <div className="mf-hero-links">
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

          <p className="mf-muted mf-hero-status">
            Zürich · Remote
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mf-soft mf-section mf-section-band">
        <div className="mf-reveal mf-stagger mf-shell-narrow">
          <p className="mf-eyebrow">About</p>
          <p className="mf-statement mf-statement-lg">
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
      <section className="mf-section mf-section-band">
        <div className="mf-shell">
          <div className="mf-reveal mf-kicker">
            <p className="mf-eyebrow">Selected work</p>
          </div>

          <div className="mf-teaser-grid">
            <div className="mf-reveal mf-stagger">
              <h2 className="mf-wordmark mf-wordmark-lg">
                Cicla
              </h2>

              <p className="mf-muted mf-lede">
                A cycle-aware body intelligence app, it reads food, mood,
                movement, fasting, and HealthKit signals together and
                interprets what they mean in the moment. Built solo, end to
                end. Now in TestFlight beta.
              </p>

              <dl className="mf-meta-grid">
                <Meta label="Role" value="Solo founder & engineer" />
                <Meta label="Scope" value="Design · Frontend · Backend · AI" />
                <Meta label="Platform" value="iOS" />
                <Meta label="Status" value="TestFlight beta" />
              </dl>

              <div className="mf-teaser-actions">
                <Link
                  to="/cicla"
                  className="mf-accent-deep mf-cta mf-cta-lg"
                >
                  <span className="mf-cta-underline">Read the case study</span>
                  <span aria-hidden="true" className="mf-arrow-lg mf-accent">
                    →
                  </span>
                </Link>
                <a
                  href={CICLA_URL}
                  className="mf-textlink mf-cta mf-cta-lg"
                >
                  Visit cicla.app
                  <span aria-hidden="true" className="mf-arrow">
                    →
                  </span>
                </a>
              </div>
            </div>

            <figure className="mf-reveal mf-teaser-figure">
              <img
                src="/screenshots/home-menstrual.webp"
                alt="Cicla home screen, day 3, menstrual phase"
                className="mf-shot mf-screen mf-shot-home"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* LAB, supporting evidence */}
      <section className="mf-rule-top mf-section mf-section-block">
        <div className="mf-shell">
          <div className="mf-reveal mf-stagger">
            <p className="mf-eyebrow">Lab</p>
            <h2 className="mf-h3 mf-title-item mf-measure-wide mf-teaser-title">
              The states nobody <em className="mf-em">builds</em>.
            </h2>
            {/* DRAFT(mona): trimmed option C, the claim beside its evidence.
                Edit freely. */}
            <p className="mf-muted mf-item-copy mf-measure">
              AI product interfaces are their own discipline: streaming that
              doesn&rsquo;t jump, output nobody can predict. The Lab is where
              I work on those states.
            </p>
            <div className="mf-teaser-items">
              <div>
                <h3 className="mf-ink mf-item-subtitle">
                  Cicla Interface System
                </h3>
                <p className="mf-muted mf-item-blurb">
                  The production components behind Cicla, documented in
                  Storybook.
                </p>
              </div>
              <div>
                <h3 className="mf-ink mf-item-subtitle">
                  Streaming output that doesn&rsquo;t jump
                </h3>
                <p className="mf-muted mf-item-blurb">
                  Token streaming with consent-based scroll anchoring and
                  markdown that renders mid-parse.
                </p>
              </div>
            </div>
            <div className="mf-teaser-more">
              <Link
                to="/lab"
                className="mf-textlink mf-cta mf-cta-lg"
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
