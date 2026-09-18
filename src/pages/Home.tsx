import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CICLA_URL } from '../content'
import { FlashCompare } from '../components/lab/FlashCompare'
import { useReveal } from '../useReveal'

/* ── Lab stream ───────────────────────────────────────────────────────
   A short line that types itself in, inline in the section, once, when
   it first enters the viewport. A live hint at the streaming study —
   the full demo lives on /lab. */
const LAB_LINE =
  'Streaming, scroll anchoring, partial states, interruption.'

function LabStream() {
  const hostRef = useRef<HTMLParagraphElement>(null)
  const [count, setCount] = useState(0)
  const [playing, setPlaying] = useState(false)
  const startedRef = useRef(false)
  const timerRef = useRef(0)

  useEffect(() => {
    const el = hostRef.current
    if (!el || !('IntersectionObserver' in globalThis)) {
      setCount(LAB_LINE.length)
      return
    }
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return
        startedRef.current = true
        if (reduced) setCount(LAB_LINE.length)
        else setPlaying(true)
        io.disconnect()
      },
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!playing || count >= LAB_LINE.length) return
    timerRef.current = window.setTimeout(() => {
      const next = count + 1
      setCount(next)
      if (next >= LAB_LINE.length) setPlaying(false)
    }, 16 + Math.random() * 40)
    return () => window.clearTimeout(timerRef.current)
  }, [playing, count])

  return (
    <p ref={hostRef} className="mf-muted mf-lab-stream" aria-hidden="true">
      {LAB_LINE.slice(0, count)}
      {playing && <span className="mf-stream-caret" />}
    </p>
  )
}

function Home() {
  useEffect(() => {
    document.title = 'Mona Fouad · Design Engineer'
  }, [])
  useReveal()

  return (
    <>
      {/* HERO: cascades in on load (mount entrance, not scroll-gated, so the
          first viewport is never static). Skipped under reduced motion. */}
      <section id="top" className="mf-section mf-section-hero">
        <div className="mf-enter mf-shell">
          <h1 className="mf-h1 mf-hero-title">
            I build the parts of a product
            <br className="mf-hero-br" /> people actually{' '}
            <em className="mf-em">feel</em>.
          </h1>

          <p className="mf-muted mf-lede mf-hero-copy">
            Design engineer working across interfaces, motion and the code
            that makes them feel right.
          </p>
        </div>
      </section>

      {/* CICLA — a concise real-product teaser; /cicla owns the depth */}
      <section className="mf-section mf-section-band mf-cicla">
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
                Cycle-aware iOS product, in TestFlight
              </p>

              <div className="mf-teaser-actions">
                <Link
                  to="/cicla"
                  className="mf-accent-deep mf-cta mf-cta-lg"
                >
                  <span className="mf-cta-underline">View case study</span>
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
                src="/screenshots/home-ovulatory.webp"
                alt="Cicla home screen in the ovulatory phase: the cycle rings and today's guidance"
                className="mf-shot mf-screen mf-shot-home mf-shot-hover"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* LAB — the interaction proof, as concise live previews */}
      <section className="mf-rule-top mf-section mf-section-block">
        <div className="mf-shell">
          <div className="mf-reveal mf-stagger">
            <h2 className="mf-wordmark mf-wordmark-lg">
              Lab
            </h2>

            <p className="mf-muted mf-lede mf-measure">
              Interface experiments and technical studies.
            </p>
          </div>

          <div className="mf-labprev-grid">
            <div className="mf-reveal mf-labprev">
              <h3 className="mf-h3 mf-title-item">
                Streaming output that doesn&rsquo;t jump
              </h3>
              <LabStream />
              <p className="mf-labprev-more">
                <Link to="/lab" className="mf-textlink mf-cta">
                  Open the study
                  <span aria-hidden="true" className="mf-arrow">
                    →
                  </span>
                </Link>
              </p>
            </div>

            <div className="mf-reveal mf-labprev">
              <h3 className="mf-h3 mf-title-item">
                A phase atmosphere that never flashes
              </h3>
              <div className="mf-labprev-demo">
                <FlashCompare />
              </div>
              <p className="mf-labprev-more">
                <Link to="/cicla" className="mf-textlink mf-cta">
                  See it in the case study
                  <span aria-hidden="true" className="mf-arrow">
                    →
                  </span>
                </Link>
              </p>
            </div>
          </div>

          <div className="mf-reveal mf-teaser-more">
            <Link
              to="/lab"
              className="mf-accent-deep mf-cta mf-cta-lg"
            >
              <span className="mf-cta-underline">Explore the Lab</span>
              <span aria-hidden="true" className="mf-arrow-lg mf-accent">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Earlier work: provenance only, one quiet line */}
      <section className="mf-rule-top mf-section mf-section-slim">
        <div className="mf-shell">
          <p className="mf-dim mf-earlier">
            Earlier product work across PHOENIQS, White Hat Gaming,
            Suntransfers, Lastminute and Delectatech.
          </p>
        </div>
      </section>
    </>
  )
}

export default Home
