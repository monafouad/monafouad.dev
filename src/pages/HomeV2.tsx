import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CICLA_UI_URL,
  CICLA_URL,
  EMAIL,
  EXPERIENCE_LINKS,
  LINKEDIN_URL,
} from '../content'
import { CycleDisc } from '../components/cicla/CycleDisc'
import {
  getPhaseForDay,
  type CyclePhase,
} from '../components/cicla/ciclaTokens'
import { CICLA_PHASES } from '../lib/ciclaPhases'
import { StreamingReply } from '../components/lab/StreamingReply'
import streamingSource from '../components/lab/StreamingReply.tsx?raw'
import { useReveal } from '../useReveal'

/* HomeV2: the one-page portfolio at /v2. Every section shares the
   Experience grid: a label column left (same width as the dates
   column), content right. The disc is the real Cicla CycleDisc port;
   dragging it recolours the card with the app's 0.3s ease. */

const CYCLE_DAY = 17
const CYCLE_LENGTH = 28

/* cicla_app/src/lib/insightSynthesis.ts, baseline variant per phase */
const NUDGE: Record<CyclePhase, string> = {
  menstrual: 'You’re on your period.',
  follicular:
    'You’re in your follicular stretch, when energy often starts to lift.',
  ovulatory:
    'You’re around your ovulatory window, often a higher-energy stretch.',
  luteal: 'You’re in your luteal stretch, the run-up to your period.',
}

const EXPERIENCE = [
  {
    slug: 'phoeniqs',
    dates: '2023 to 2025',
    title: 'PHOENIQS, Zürich',
    body: 'Conversational AI interfaces with streamed responses, voice capture and transcription. Rebuilt the Vision Apartments site from AngularJS to React.',
  },
  {
    slug: 'whitehatgaming',
    dates: '2019 to 2023',
    title: 'White Hat Gaming, remote',
    body: 'Payment interface for Sightline Play+, shipped for US casino launches on a fixed date. An operational dashboard built from nothing for people who use it all day.',
  },
  {
    slug: 'delectatech',
    dates: '2018 to 2019',
    title: 'Delectatech, Barcelona',
    body: 'Frontend and visual style guide for a food-data analytics product.',
  },
  {
    slug: 'suntransfers',
    dates: '2014 to 2016',
    title: 'Suntransfers, Barcelona',
    body: 'Rebuilt the booking site from legacy desktop to responsive, owned the design, and A/B tested homepage search with marketing.',
  },
  {
    slug: 'lastminute',
    dates: '2011 to 2014',
    title: 'Lastminute, Barcelona',
    body: 'Made the local site responsive.',
  },
]

const NAV_SECTIONS = ['cicla', 'lab', 'experience'] as const

function HomeV2() {
  useEffect(() => {
    document.title = 'Mona Fouad, Design Engineer'
  }, [])
  useReveal()
  const [sourceOpen, setSourceOpen] = useState(false)

  /* The hero cascade plays on every open (including SPA navigation back to
     this page), so browsing always gets a deliberate entrance. Skipped
     under reduced motion. */
  const [animateHero] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  /* Nav active-section indicator: an underline that slides between the
     anchor links as the matching section crosses a viewport band. */
  const navLinksRef = useRef<HTMLDivElement>(null)
  const [activeSec, setActiveSec] = useState<string | null>(null)
  const [ind, setInd] = useState({ x: 0, w: 0, on: false })
  useEffect(() => {
    if (!('IntersectionObserver' in globalThis)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          if (entry.isIntersecting) setActiveSec(id)
          else setActiveSec((prev) => (prev === id ? null : prev))
        })
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    )
    NAV_SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const wrap = navLinksRef.current
    if (!wrap) return
    const update = () => {
      if (!activeSec) {
        setInd((s) => ({ ...s, on: false }))
        return
      }
      const a = wrap.querySelector<HTMLElement>(`a[href="#${activeSec}"]`)
      if (!a) return
      setInd({ x: a.offsetLeft, w: a.offsetWidth, on: true })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [activeSec])

  /* Phase-world drag: the inspected day's phase owns the card. */
  const [selDay, setSelDay] = useState(CYCLE_DAY)
  const worldPhase = getPhaseForDay(selDay, CYCLE_LENGTH)
  const world =
    CICLA_PHASES.find((p) => p.id === worldPhase) ?? CICLA_PHASES[0]

  /* Experience accordion: one entry open at a time. On desktop the open
     entry follows the pointer, driven by pointermove on the LIST (which
     fires only on real pointer motion), so a heading sliding under a
     stationary cursor can never switch entries. Keyboard focus opens the
     entry; tapping toggles it on touch.

     Height stability: the list reserves a min-height of (all headings) +
     (tallest description) once. A flex-grow spacer at the end fills the
     remainder, so as a panel opens the spacer shrinks by exactly the same
     amount every frame, by layout rather than a competing transition. The
     section below therefore never moves, even mid- or interrupted
     transition. The reserve is recomputed on font load and on
     container-width change, never on open/close. */
  const [activeXp, setActiveXp] = useState<number | null>(null)
  const activeXpRef = useRef<number | null>(null)
  const setXp = (i: number | null) => {
    activeXpRef.current = i
    setActiveXp(i)
  }
  const xpListRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const list = xpListRef.current
    if (!list) return
    let lastW = -1
    const measure = () => {
      list.style.minHeight = ''
      const hs = Array.from(
        list.querySelectorAll<HTMLElement>('.mfv2-xp-body'),
        (el) => el.getBoundingClientRect().height
      )
      const max = hs.length ? Math.max(...hs) : 0
      const ai = activeXpRef.current
      const natural = list.getBoundingClientRect().height
      const base = natural - (ai != null ? hs[ai] ?? 0 : 0)
      list.style.minHeight = `${Math.ceil(base + max)}px`
    }
    const raf = requestAnimationFrame(() => {
      lastW = list.getBoundingClientRect().width
      measure()
    })
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      if (Math.abs(w - lastW) < 0.5) return
      lastW = w
      requestAnimationFrame(measure)
    })
    ro.observe(list)
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => requestAnimationFrame(measure))
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])
  const onXpPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const row = (e.target as HTMLElement).closest<HTMLElement>('.mfv2-xp-row')
    if (!row) return
    const i = Number(row.dataset.xp)
    if (!Number.isNaN(i) && activeXpRef.current !== i) setXp(i)
  }

  return (
    <div className={animateHero ? 'mfv2 mfv2-hero-in' : 'mfv2'}>
      {/* NAV: name left, three anchors right, sliding active indicator. */}
      <nav className="mf-nav">
        <div className="mf-shell mf-nav-row">
          <a href="#top" className="mf-ink mf-nav-brand">
            Mona Fouad
          </a>
          <div ref={navLinksRef} className="mf-nav-links mfv2-nav-links">
            <a href="#cicla" className="mf-textlink">
              Cicla
            </a>
            <a href="#lab" className="mf-textlink">
              Lab
            </a>
            <a href="#experience" className="mf-textlink">
              Experience
            </a>
            <span
              aria-hidden="true"
              className="mfv2-nav-ind"
              style={{
                transform: `translateX(${ind.x}px)`,
                width: ind.w,
                opacity: ind.on ? 1 : 0,
              }}
            />
          </div>
        </div>
      </nav>

      {/* 1 · HERO */}
      <section id="top" className="mf-section mf-section-hero">
        <div className="mf-shell mfv2-hero-seq">
          <h1 className="mf-h1 mf-hero-title">
            I build the parts of a product
            <br className="mf-hero-br" /> people actually{' '}
            <em className="mf-em">feel</em>.
          </h1>
          <p className="mf-muted mf-lede mf-hero-copy">
            Fifteen years of frontend across customer products, payments and
            AI interfaces. Now building Cicla, a cycle-aware iOS app, alone.
          </p>
          <p className="mfv2-hero-links">
            <a href="#cicla" className="mf-link">
              Cicla
            </a>
            <span aria-hidden="true" className="mfv2-sep">
              ·
            </span>
            <a href={`mailto:${EMAIL}`} className="mf-link">
              Email
            </a>
            <span aria-hidden="true" className="mfv2-sep">
              ·
            </span>
            <a href={LINKEDIN_URL} className="mf-link">
              LinkedIn
            </a>
          </p>
        </div>
      </section>

      {/* 2 · CICLA: one card in the content column; the card is the
          phase world, the page behind only carries the scroll tint. */}
      <section
        id="cicla"
        className="mf-rule-top mf-section mf-section-block"
      >
        <div className="mf-shell mfv2-sec mf-reveal mf-seq">
          <p className="mf-eyebrow mfv2-sec-label">
            Cicla
          </p>
          <div>
            <div className="mfv2-card" style={{ background: world.surface }}>
              <div className="mfv2-disc-wrap">
                <CycleDisc
                  phase={getPhaseForDay(CYCLE_DAY, CYCLE_LENGTH)}
                  cycleDay={CYCLE_DAY}
                  cycleLength={CYCLE_LENGTH}
                  displaySize={200}
                  onDaySelect={(day) => setSelDay(day)}
                />
                <p className="mfv2-disc-hint" aria-hidden="true">
                  Drag the ring, or focus it and use arrow keys. The card
                  follows the selected day&rsquo;s phase.
                </p>
              </div>
              <div className="mfv2-card-text">
              <p key={worldPhase} className="mfv2-nudge mfv2-nudge-in">
                {NUDGE[worldPhase]}
              </p>
              <p className="mf-lede mfv2-cicla-line">
                Cycle-aware wellness for iOS. Designed, built and shipped
                alone.
              </p>
              <p className="mfv2-links">
                <a href={CICLA_URL} className="mfv2-world-link mf-cta">
                  Visit cicla.app
                  <span aria-hidden="true" className="mfv2-world-arrow">
                    →
                  </span>
                </a>
                <a
                  href={CICLA_UI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mfv2-world-link mf-cta"
                >
                  Interface system
                  <span aria-hidden="true" className="mfv2-world-arrow">
                    ↗
                  </span>
                  <span className="mf-sr-only">(opens in a new tab)</span>
                </a>
                <Link to="/cicla" className="mfv2-world-link mf-cta">
                  Read more
                  <span aria-hidden="true" className="mfv2-world-arrow">
                    →
                  </span>
                </Link>
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · LAB: title and line in the label column, demo right. */}
      <section id="lab" className="mf-rule-top mf-section mf-section-block">
        <div className="mf-shell mfv2-sec mf-reveal mf-seq">
          <p className="mf-eyebrow mfv2-sec-label">Lab</p>
          <div>
            <h2 className="mf-h3 mf-title-item">
              Streaming output that doesn&rsquo;t jump
            </h2>
            <p className="mf-muted mf-lede mf-measure mfv2-lab-line">
              Pins to the bottom only while you are there; scroll up and it
              lets go.
            </p>
            <div className="mfv2-lab-demo">
              <StreamingReply startInView />
            </div>
            <button
              type="button"
              className="mf-lab-chip mfv2-source-btn"
              aria-expanded={sourceOpen}
              aria-controls="mfv2-streaming-source"
              onClick={() => setSourceOpen((v) => !v)}
            >
              {sourceOpen ? 'Hide source' : 'View source'}
            </button>
            <div id="mfv2-streaming-source" hidden={!sourceOpen}>
              <pre className="mf-code mf-stream-source">
                <code>{streamingSource}</code>
              </pre>
            </div>
            {/* TODO: motion piece slot, to be built by hand later.
                Intentionally renders nothing yet. */}
          </div>
        </div>
      </section>

      {/* 4 · EXPERIENCE: rows reuse the same grid columns, so the
          section label and the dates share one column. */}
      <section
        id="experience"
        className="mf-rule-top mf-section mf-section-block"
      >
        <div className="mf-shell">
          <div className="mfv2-sec mf-reveal">
            <p className="mf-eyebrow mfv2-sec-label">
              Experience
            </p>
            <span aria-hidden="true" />
          </div>

          <div
            ref={xpListRef}
            className="mfv2-xp mf-reveal"
            onPointerMove={onXpPointerMove}
          >
            {EXPERIENCE.map((job, i) => {
              const meta = EXPERIENCE_LINKS[job.slug]
              const open = activeXp === i
              const preview = meta?.image ? (
                <figure className="mfv2-xp-preview" aria-hidden="true">
                  {meta.imageUrl ? (
                    <a href={meta.imageUrl} tabIndex={-1}>
                      <img src={meta.image} alt="" loading="lazy" />
                    </a>
                  ) : (
                    <img src={meta.image} alt="" loading="lazy" />
                  )}
                  {meta.caption && (
                    <figcaption className="mfv2-xp-cap">
                      {meta.caption}
                    </figcaption>
                  )}
                </figure>
              ) : null
              return (
                <div
                  key={job.slug}
                  className="mfv2-xp-row"
                  data-active={open}
                  data-xp={i}
                  onClick={() => setXp(activeXp === i ? null : i)}
                >
                  <p className="mfv2-xp-dates">{job.dates}</p>
                  <div className="mfv2-xp-main">
                    <h2 className="mfv2-xp-title">
                      {meta?.url ? (
                        <a
                          href={meta.url}
                          className="mfv2-xp-link"
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => {
                            if (e.target.matches(':focus-visible')) setXp(i)
                          }}
                        >
                          {job.title}
                        </a>
                      ) : (
                        job.title
                      )}
                    </h2>
                    <div className="mfv2-xp-panel">
                      <div className="mfv2-xp-clip">
                        <p className="mf-muted mfv2-xp-body">{job.body}</p>
                      </div>
                    </div>
                  </div>
                  {preview}
                </div>
              )
            })}
            <div aria-hidden="true" className="mfv2-xp-spacer" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mf-footer">
        <div className="mf-shell mf-footer-row">
          <span>Mona Fouad · Zürich</span>
          <span className="mf-footer-links">
            <a href={`mailto:${EMAIL}`} className="mf-textlink">
              {EMAIL}
            </a>
            <a href={LINKEDIN_URL} className="mf-textlink">
              LinkedIn
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default HomeV2
