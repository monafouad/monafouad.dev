import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CICLA_UI_URL, CICLA_URL, EMAIL, LINKEDIN_URL } from '../content'
import { useReveal } from '../useReveal'
import { Disclosure } from '../components/Disclosure'

/* Cicla case study. Every product and engineering claim is verified against
   current cicla_app source; exhibits are captured from the real app driven
   over a stateful mocked network (never live user data). The three exhibits
   are interactive: the Patterns toggle, the "Trace the flow" replay, and the
   fasting recording with real chapter seek. */

const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Chapter 1 flow diagram; the active branch follows the toggle. */
function Chapter1Diagram({ active }: { active: 'forming' | 'repeated' }) {
  return (
    <div className="mf-cs-diagram" role="img" aria-label="How a symptom log becomes a displayed observation: daily symptom logs are grouped by symptom and cycle phase; two or more days in the same phase this cycle surface as Forming this cycle, while the same symptom and phase repeating across two or more cycles becomes Repeated in your logs, with confidence rising at three or more cycles.">
      <div className="mf-cs-node">Daily symptom logs</div>
      <span className="mf-cs-flow" aria-hidden="true">↓</span>
      <div className="mf-cs-node">Grouped by symptom + cycle phase</div>
      <span className="mf-cs-flow" aria-hidden="true">↓</span>
      <div className="mf-cs-branch">
        <div className="mf-cs-arm" data-active={active === 'forming'}>
          <p className="mf-cs-cond">≥ 2 days, same phase, this cycle</p>
          <div className="mf-cs-node mf-cs-node-out">Forming this cycle</div>
        </div>
        <div className="mf-cs-arm" data-active={active === 'repeated'}>
          <p className="mf-cs-cond">Same symptom + phase across ≥ 2 cycles</p>
          <div className="mf-cs-node mf-cs-node-out">Repeated in your logs</div>
          <p className="mf-cs-note">3+ cycles &rarr; higher confidence</p>
        </div>
      </div>
    </div>
  )
}

/* Fasting recording chapters: real seek points in fasting-journey.mp4. */
const FAST_CHAPTERS = [
  { label: 'Ready', t: 0 },
  { label: 'Start', t: 4.2 },
  { label: 'Active', t: 6.5 },
  { label: 'Ends', t: 7.6 },
  { label: 'Log a meal', t: 10.4 },
  { label: 'Saved', t: 12.8 },
]

function Cicla() {
  useEffect(() => {
    document.title = 'Cicla case study · Mona Fouad'
  }, [])
  useReveal()

  /* Exhibit 1 — Patterns toggle. The visitor switches between the two
     states by tapping; a gentle crossfade, no auto-cycling. */
  const [ch1, setCh1] = useState<'forming' | 'repeated'>('forming')
  const pickCh1 = (v: 'forming' | 'repeated') => setCh1(v)

  /* Exhibit 2 — Trace the flow. A controlled, replayable sequence:
     0 idle (diagram readable, nothing highlighted), 1 shared context,
     2 the six pillars with the three that render the synthesis, 3 the
     synthesis step and the example output it produces on Feel. */
  const [trace, setTrace] = useState(0)
  const traceTimers = useRef<number[]>([])
  const clearTrace = () =>
    traceTimers.current.forEach((t) => window.clearTimeout(t))
  const runTrace = () => {
    clearTrace()
    traceTimers.current = []
    if (reduceMotion()) {
      setTrace(3)
      return
    }
    setTrace(0)
    ;[1, 2, 3].forEach((s, i) => {
      traceTimers.current.push(
        window.setTimeout(() => setTrace(s), 240 + i * 780)
      )
    })
  }
  useEffect(() => () => clearTrace(), [])
  const traceLabel = ['', 'Shared context', 'Six pillars, three render it', 'Synthesis, and its output on Feel'][trace]

  /* Exhibit 3 — fasting recording with real chapter seek. */
  const videoRef = useRef<HTMLVideoElement>(null)
  const [chapter, setChapter] = useState(0)
  const seek = (i: number) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = FAST_CHAPTERS[i].t + 0.02
    setChapter(i)
    void v.play().catch(() => {})
  }
  const onTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    let idx = 0
    FAST_CHAPTERS.forEach((c, i) => {
      if (v.currentTime >= c.t - 0.05) idx = i
    })
    setChapter(idx)
  }

  const pillars = ['Home', 'Food', 'Move', 'Feel', 'Fast', 'Patterns']
  const rendersSynthesis = (p: string) =>
    p === 'Home' || p === 'Feel' || p === 'Patterns'

  return (
    <div className="mf-cs-page">
      {/* NAV */}
      <nav className="mf-nav">
        <div className="mf-shell mf-nav-row">
          <Link to="/" className="mf-ink mf-nav-brand">
            Mona Fouad
          </Link>
          <div className="mf-nav-links">
            <Link to="/" className="mf-textlink">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </nav>

      {/* OPENING — cascades in on load */}
      <section className="mf-section mf-section-head">
        <div className="mf-shell">
          <div className="mf-case-hero-grid mf-enter">
            <div>
              <h1 className="mf-wordmark mf-wordmark-lg">Cicla</h1>
              <p className="mf-muted mf-lede mf-measure">
                Cicla is a cycle-aware wellness app for iOS: it reads where
                someone is in their cycle and adapts food, movement, fasting
                and reflection around it. I own the product decisions, the
                interface design and the engineering. The hard part is
                coherence, making one day&rsquo;s logs, the current phase and
                months of history behave as one understandable product rather
                than four disconnected trackers. See it at{' '}
                <a href={CICLA_URL} className="mf-link">
                  cicla.app
                </a>
                .
              </p>
              <p className="mf-dim mf-case-meta">
                Solo founder and engineer · iOS · TestFlight.
              </p>
            </div>
            <div className="mf-teaser-figure">
              <img
                src="/cicla/hero.png"
                alt="A Cicla home screen for the current day, showing the cycle phase and the day's plan"
                className="mf-shot mf-screen mf-shot-case"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 1 — Patterns toggle */}
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell">
          <div className="mf-reveal mf-seq mf-cs-head">
            <p className="mf-num mf-item-num">Chapter 1</p>
            <h2 className="mf-h2 mf-title-item mf-measure-wide">
              When does a log become a pattern?
            </h2>
            <p className="mf-muted mf-item-copy mf-measure">
              A single hard day is not a pattern, and treating it like one
              would make the app cry wolf. So detection has two tiers. Within
              the current cycle, a symptom logged on two or more days of the
              same phase surfaces as forming, clearly marked as early. Only
              when the same symptom repeats in the same phase across two or
              more cycles does it become a repeated observation, its confidence
              rising once it holds across three or more.
            </p>
            <p className="mf-muted mf-item-copy mf-measure">
              Each repeated observation opens to its own evidence: the cycles
              it appeared in, the cycle-day window, and per-cycle dots you can
              count. Confidence here is the app&rsquo;s classification of how
              much was logged, not a medical judgement, and nothing implies
              cause.
            </p>
          </div>

          <div className="mf-reveal mf-cs-stage">
            <div className="mf-cs-stage-visual">
              <div
                className="mf-cs-toggle"
                role="group"
                aria-label="Compare the two detection states"
              >
                <button
                  type="button"
                  className="mf-cs-toggle-btn"
                  aria-pressed={ch1 === 'forming'}
                  onClick={() => pickCh1('forming')}
                >
                  Forming this cycle
                </button>
                <button
                  type="button"
                  className="mf-cs-toggle-btn"
                  aria-pressed={ch1 === 'repeated'}
                  onClick={() => pickCh1('repeated')}
                >
                  Repeated across cycles
                </button>
                <span
                  aria-hidden="true"
                  className="mf-cs-toggle-ind"
                  style={{
                    transform: ch1 === 'repeated' ? 'translateX(100%)' : 'none',
                  }}
                />
              </div>
              <figure className="mf-cs-figure">
                <div className="mf-cs-phone mf-cs-phone-switch">
                  <img
                    src="/cicla/patterns-forming.png"
                    className={ch1 === 'forming' ? 'is-active' : ''}
                    aria-hidden={ch1 !== 'forming'}
                    alt="The Patterns screen with a 'Forming this cycle' section: lower energy clustering in the luteal window over three days, and cravings logged twice, marked as still early."
                    loading="lazy"
                  />
                  <img
                    src="/cicla/patterns-repeated.png"
                    className={ch1 === 'repeated' ? 'is-active' : ''}
                    aria-hidden={ch1 !== 'repeated'}
                    alt="A repeated pattern detail: low energy logged in luteal days 21 to 22 across three of three cycles, with an evidence table and per-cycle dots for this cycle, one cycle ago and two cycles ago."
                    loading="lazy"
                  />
                </div>
                <figcaption className="mf-cs-cap">
                  <span className="mf-cs-demo">Demo data</span>{' '}
                  {ch1 === 'forming'
                    ? 'Forming this cycle: early signals, marked as still building.'
                    : 'Repeated in your logs: the same observation opened to its per-cycle evidence.'}
                </figcaption>
              </figure>
            </div>
            <div className="mf-cs-stage-aside">
              <Chapter1Diagram active={ch1} />
              <p className="mf-cs-stage-note" aria-live="polite">
                {ch1 === 'forming'
                  ? 'Forming: a symptom on two or more days of the same phase, within the current cycle. It is shown, but clearly marked as early.'
                  : 'Repeated: the same symptom and phase across two or more cycles. Confidence rises once it holds across three or more, and it opens to per-cycle evidence.'}
              </p>
              <p className="mf-cs-hint">Tap a state to compare.</p>
            </div>
          </div>

          <Disclosure summary="Implementation detail" className="mf-reveal">
            <div className="mf-cs-details-body mf-measure">
              <p>
                <code>detectEmergingObservations</code> groups the current
                cycle&rsquo;s logs by symptom and phase and surfaces any with
                at least two days (<code>EMERGING_MIN_DAYS = 2</code>), always
                labelled emerging. <code>detectCyclePatterns</code> groups
                across cycles by <code>{'`${kind}:${phase}`'}</code> and keeps
                those repeating in at least two cycles (
                <code>PATTERN_MIN_CYCLES = 2</code>); confidence is{' '}
                <code>low | medium | high</code>, reaching high at three or
                more cycles.
              </p>
              <p>
                <code>buildPatternsModel</code> (patternsModel.ts) assembles
                the model; <code>PatternsPage</code> renders the rows inline
                and <code>PatternDetailPage</code> draws the per-cycle evidence
                dots. The real Patterns page is exercised under test in{' '}
                <code>formingPatterns.test.tsx</code>.
              </p>
            </div>
          </Disclosure>
        </div>
      </section>

      {/* CHAPTER 2 — Trace the flow */}
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell">
          <div className="mf-reveal mf-seq mf-cs-head">
            <p className="mf-num mf-item-num">Chapter 2</p>
            <h2 className="mf-h2 mf-title-item mf-measure-wide">
              One system, different jobs
            </h2>
            <p className="mf-muted mf-item-copy mf-measure">
              Earlier, several interpretation engines each produced their own
              read of the same day. They overlapped, competed and could
              disagree from one screen to the next. I consolidated the
              displayed intelligence into a single path: one shared context
              assembles the day once, and one synthesis step turns it into the
              words a screen shows.
            </p>
            <p className="mf-muted mf-item-copy mf-measure">
              The shared context feeds all six pillars, but the synthesis read
              is rendered on only three, Home, Feel and Patterns. Food, Move
              and Fast read the same context and derive their own guidance, so
              the daily read is never duplicated. Trace the flow to watch one
              value travel from the shared context to the words on Feel.
            </p>
          </div>

          <div className="mf-reveal mf-cs-arch" data-step={trace}>
            <div className="mf-cs-arch-side">
              <p className="mf-cs-arch-label">Before</p>
              <p className="mf-cs-arch-cluster" aria-hidden="true">
                <span>hormonalStateEngine</span>
                <span>ciclaMessagingEngine</span>
                <span>interpretationEngine</span>
                <span>insightCoordinator</span>
                <span>nutrition / sleep /</span>
                <span>exercise / weight</span>
              </p>
              <p className="mf-cs-arch-caption">
                Several interpretation engines, each with its own read of the
                same day, overlapping and able to disagree from screen to
                screen.
              </p>
            </div>
            <div className="mf-cs-arch-side">
              <div className="mf-cs-arch-top">
                <p className="mf-cs-arch-label">After</p>
                <button
                  type="button"
                  className="mf-cs-replay"
                  onClick={runTrace}
                  aria-describedby="mf-cs-trace-status"
                >
                  <span className="mf-cs-replay-icon" aria-hidden="true">
                    ↻
                  </span>
                  {trace === 0 ? 'Trace the flow' : 'Replay'}
                </button>
              </div>
              <div className="mf-cs-flowchart">
                <div
                  className={`mf-cs-fnode${trace >= 1 ? ' is-lit' : ''}`}
                >
                  useTodayContext
                  <span className="mf-cs-fsub">one shared daily context</span>
                </div>
                <span
                  className={`mf-cs-fdown${trace >= 2 ? ' is-lit' : ''}`}
                  aria-hidden="true"
                >
                  ↓ feeds all six
                </span>
                <ul
                  className="mf-cs-pillars"
                  aria-label="The six pillar screens the shared context feeds"
                >
                  {pillars.map((p) => {
                    const on = rendersSynthesis(p)
                    return (
                      <li
                        key={p}
                        className={`mf-cs-pillar${on ? ' mf-cs-pillar-on' : ''}${
                          trace >= 2 && on ? ' is-lit' : ''
                        }${trace >= 2 ? ' is-fed' : ''}`}
                      >
                        {p}
                      </li>
                    )
                  })}
                </ul>
                <span
                  className={`mf-cs-fdown${trace >= 3 ? ' is-lit' : ''}`}
                  aria-hidden="true"
                >
                  ↓ three render the synthesis
                </span>
                <div
                  className={`mf-cs-fnode mf-cs-fnode-syn${
                    trace >= 3 ? ' is-lit' : ''
                  }`}
                >
                  insightSynthesis
                  <span className="mf-cs-fsub">via useDailySynthesis</span>
                </div>
                <div
                  className={`mf-cs-foutput${trace >= 3 ? ' is-shown' : ''}`}
                >
                  &ldquo;Your mood looks more sensitive today&rdquo;
                  <span className="mf-cs-fsub">
                    rendered on Feel, under &ldquo;Cicla heard you&rdquo;
                  </span>
                </div>
              </div>
              <p
                id="mf-cs-trace-status"
                className="mf-cs-arch-caption"
                aria-live="polite"
              >
                {trace === 0
                  ? 'One shared context feeds six pillars; the written read is rendered on three. Trace the flow to follow it.'
                  : `Step ${trace} of 3 — ${traceLabel}.`}
              </p>
            </div>
          </div>

          <Disclosure summary="Implementation detail" className="mf-reveal">
            <div className="mf-cs-details-body mf-measure">
              <p>
                Path: <code>useTodayContext</code> &rarr;{' '}
                <code>useDailySynthesis</code> &rarr;{' '}
                <code>insightSynthesis.ts</code>. The consolidation removed
                nine separate interpretation modules in one commit (Engine
                Cleanup), among them <code>hormonalStateEngine</code>,{' '}
                <code>ciclaMessagingEngine</code>,{' '}
                <code>interpretationEngine</code>,{' '}
                <code>insightCoordinator</code> and the per-domain nutrition,
                sleep, exercise and weight engines; a later product decision
                retired the Coach and Habits features, including three server
                edge-function sources.
              </p>
              <p>
                A guard test (<code>insightEngineCanonical.test.ts</code>, run
                in <code>verify:integrity</code>) fails if live code imports
                any of the retired modules. One honest limit: the old{' '}
                <code>daily_insights</code> table still exists in the database,
                unused and reader-less, holding historical rows; it was left in
                place, not removed.
              </p>
            </div>
          </Disclosure>
        </div>
      </section>

      {/* CHAPTER 3 — Fasting journey with chapter seek */}
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell">
          <div className="mf-reveal mf-seq mf-cs-head">
            <p className="mf-num mf-item-num">Chapter 3</p>
            <h2 className="mf-h2 mf-title-item mf-measure-wide">
              From finishing a fast to logging a meal
            </h2>
            <p className="mf-muted mf-item-copy mf-measure">
              Fasting and food are separate screens, but ending a fast and
              eating are one moment. This is that handoff, end to end. Use the
              chapters to jump to Start, the eating window opening, or the meal
              being logged; the active chapter follows playback.
            </p>
          </div>

          <div className="mf-reveal mf-cs-stage">
            <div className="mf-cs-stage-visual">
              <figure className="mf-cs-figure">
                <div className="mf-cs-phone mf-cs-phone-sm">
                  <video
                    ref={videoRef}
                    className="mf-cs-video"
                    controls
                    preload="metadata"
                    playsInline
                    poster="/cicla/fasting-poster.png"
                    onTimeUpdate={onTimeUpdate}
                    aria-label="A screen recording of the fasting journey: from the ready timer, starting a fast, the active countdown fast-forwarded to 45 minutes, ending it, the eating window opening, then 'Log a meal in Food' opening the Add food sheet and saving a meal."
                  >
                    <source src="/cicla/fasting-journey.mp4" type="video/mp4" />
                    <source src="/cicla/fasting-journey.webm" type="video/webm" />
                  </video>
                </div>
                <figcaption className="mf-cs-cap">
                  <span className="mf-cs-demo">Demo data</span> Elapsed time is
                  fast-forwarded.
                </figcaption>
              </figure>
            </div>
            <div className="mf-cs-stage-aside">
              <div
                className="mf-cs-chapters"
                role="group"
                aria-label="Jump to a moment in the recording"
              >
                {FAST_CHAPTERS.map((c, i) => (
                  <button
                    key={c.label}
                    type="button"
                    className="mf-cs-chapter"
                    aria-pressed={chapter === i}
                    onClick={() => seek(i)}
                  >
                    <span className="mf-cs-chapter-dot" aria-hidden="true" />
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="mf-cs-decisions">
                <div className="mf-cs-decision">
                  <h3 className="mf-h3 mf-title-item">Clear states, kept on reload</h3>
                  <p className="mf-muted mf-item-copy">
                    The instrument is ready, active or done, derived from
                    whether an open fast exists rather than stored as a flag. A
                    reload rebuilds a running timer from its start time.
                  </p>
                </div>
                <div className="mf-cs-decision">
                  <h3 className="mf-h3 mf-title-item">The existing food logger, reused</h3>
                  <p className="mf-muted mf-item-copy">
                    When the window opens, &ldquo;Log a meal in Food&rdquo;
                    opens the same Add food sheet the Food screen opens itself.
                    There is no fasting-specific duplicate to keep in sync.
                  </p>
                </div>
                <div className="mf-cs-decision">
                  <h3 className="mf-h3 mf-title-item">One task across two screens</h3>
                  <p className="mf-muted mf-item-copy">
                    The handoff carries its intent as one-shot navigation
                    state, so the sheet opens once; a refresh or a back step
                    never reopens it.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mf-reveal mf-cs-stage mf-cs-stage-flip">
            <div className="mf-cs-stage-aside">
              <h3 className="mf-h3 mf-title-item">A supporting case: tracking-only</h3>
              <p className="mf-muted mf-item-copy">
                If someone indicates a condition such as diabetes, Fast
                switches to tracking-only. It records the window they choose,
                stops offering suggestions and points to their care team. It
                changes wording and suppresses suggestions; it enforces nothing
                and makes no medical claim.
              </p>
            </div>
            <div className="mf-cs-stage-visual">
              <figure className="mf-cs-figure">
                <div className="mf-cs-phone mf-cs-phone-sm">
                  <img
                    src="/cicla/fasting-tracking-only.png"
                    alt="The Fast screen in tracking-only mode: a line explaining that fasting with diabetes needs guidance from a care team so Cicla only tracks, the saved window labelled as a tracking setting the user chose, and a note that Cicla does not suggest changes."
                    loading="lazy"
                  />
                </div>
                <figcaption className="mf-cs-cap">
                  <span className="mf-cs-demo">Demo data</span> Tracking-only
                  mode.
                </figcaption>
              </figure>
            </div>
          </div>

          <Disclosure
            summary="Implementation and verification detail"
            className="mf-reveal"
          >
            <div className="mf-cs-details-body mf-measure">
              <p>
                The state is <code>InstrumentView</code> (
                <code>ready | active | done</code>) derived in{' '}
                <code>FastingPage</code>; the open database row (no end time)
                is what survives a reload, and the timer is recomputed from its
                start. <code>firstMealBridge</code> is a pure function whose
                result the page turns into navigation to{' '}
                <code>/nutrition</code> with one-shot{' '}
                <code>{'{ openLogger: true }'}</code> state, opening the same{' '}
                <code>FoodSheet</code> the in-page &ldquo;Add food&rdquo; button
                opens.
              </p>
              <p>
                Verified end to end with the real app driven over a stateful
                mocked network (Playwright <code>page.route</code> and{' '}
                <code>page.clock</code>), not against live Supabase. The
                recording is fast-forwarded; the timer jump is a real clock
                advance, not an edit.
              </p>
            </div>
          </Disclosure>
        </div>
      </section>

      {/* CLOSING EVIDENCE */}
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell mf-reveal mf-cs-closing">
          <p className="mf-muted mf-item-copy mf-measure">
            The interface behind these screens is documented separately as an
            interactive system.
          </p>
          <a
            href={CICLA_UI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mf-accent-deep mf-cta mf-cta-lg"
          >
            <span className="mf-cta-underline">Interface system</span>
            <span aria-hidden="true" className="mf-arrow mf-accent">
              ↗
            </span>
            <span className="mf-sr-only">(opens in a new tab)</span>
          </a>
          <p className="mf-dim mf-cs-snapshot">
            A point-in-time snapshot of Cicla&rsquo;s production interface
            components, captured in August 2026.
          </p>
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

export default Cicla
