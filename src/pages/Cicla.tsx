import { useEffect } from 'react'
import { Contact, Meta } from '../components'
import { CycleRing } from '../components/lab/CycleRing'
import { FlashCompare } from '../components/lab/FlashCompare'
import { StateMatrix } from '../components/lab/StateMatrix'
import { CICLA_UI_URL, CICLA_URL } from '../content'
import { CICLA_PHASES } from '../lib/ciclaPhases'
import { useReveal } from '../useReveal'

// Decision copy is final; do not edit it here.
const decisions = [
  {
    n: 1,
    title: 'Guide without becoming prescriptive',
    body: 'A fixed phase plan assumes every woman is the same; no guidance at all is useless. So: a starting point she can adjust (shorten, soften, move, skip), and her experience overrules the model at any moment. The app never tells her what her body is doing.',
  },
  {
    n: 2,
    title: 'A phase atmosphere that never flashes',
    body: 'For one frame during navigation, the wrong phase colour could appear: a bug that never shows in a screenshot and never crashes, so most builds ship it. Cicla treats it as a fixed contract. The wrong atmosphere is never painted, not even for one frame.',
  },
  {
    n: 3,
    title: 'HealthKit that is honest about denial',
    body: 'iOS never reports a denied health permission; the request resolves either way, so most apps claim "Connected" while seeing nothing. Cicla claims connection only after real data has been read. A health app earns the right to interpret your body by being exact about what it can see.',
  },
]

/* Decision 04's body and the code excerpt are Mona's to write, not
   generated. They stay hidden until real: flip these flags once the
   content is in; the decisions heading and counters follow the flag. */
const SHOW_DECISION_04 = false
const SHOW_CODE_EXCERPT = false
const DECISIONS_TOTAL = SHOW_DECISION_04 ? '04' : '03'

function Cicla() {
  useEffect(() => {
    document.title = 'Cicla case study · Mona Fouad'
  }, [])
  useReveal()

  return (
    <>
      {/* HEADER */}
      <section className="mf-section mf-section-head">
        <div className="mf-shell">
          <div className="mf-case-hero-grid">
            <div className="mf-reveal">
              <h1 className="mf-wordmark mf-wordmark-lg">
                Cicla
              </h1>

              <p className="mf-muted mf-lede mf-measure">
                I design, build, and ship Cicla alone: product, interface, and
                the engineering underneath. This page is about the
                engineering: the judgment calls, the failure states, and the
                system that keeps four colour worlds coherent. Cicla is a
                cycle-aware iOS app; see the product at{' '}
                <a href={CICLA_URL} className="mf-link">
                  cicla.app
                </a>
                .
              </p>

              <dl className="mf-meta-grid">
                <Meta label="Role" value="Solo founder & engineer" />
                <Meta label="Scope" value="Design · Frontend · Backend · AI" />
                <Meta label="Platform" value="iOS" />
                <Meta label="Status" value="TestFlight beta" />
              </dl>
            </div>

            {/* ONE hero image */}
            <div className="mf-reveal mf-teaser-figure">
              <img
                src="/screenshots/home-menstrual.webp"
                alt="Cicla home screen, day 3, menstrual phase"
                className="mf-shot mf-screen mf-shot-case"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CYCLE RING */}
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell">
          <div className="mf-case-grid">
            <div className="mf-reveal">
              <h2 className="mf-h2 mf-title-item mf-measure-wide">
                Three cycles, one <em className="mf-em">angle</em>.
              </h2>
              <p className="mf-muted mf-item-copy mf-measure">
                Each cycle closes its own circle, so the same angle is the
                same point in the cycle, whatever its length.
              </p>
            </div>
            <div className="mf-reveal mf-item-demo">
              <CycleRing />
            </div>
          </div>
        </div>
      </section>

      {/* DECISIONS */}
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell">
          <div className="mf-reveal">
            <h2 className="mf-h2 mf-title-item mf-measure-wide">
              {SHOW_DECISION_04 ? 'Four' : 'Three'} decisions worth{' '}
              <em className="mf-em">talking about</em>.
            </h2>
          </div>

          <div className="mf-decisions">
            {/* 01, text only */}
            <article className="mf-reveal">
              <p className="mf-num mf-item-num">
                01<span className="mf-num-total"> / {DECISIONS_TOTAL}</span>
              </p>
              <h3 className="mf-h3 mf-title-item">
                {decisions[0].title}
              </h3>
              <p className="mf-muted mf-item-copy">
                {decisions[0].body}
              </p>
            </article>

            {/* 02, with FlashCompare beside the text */}
            <article className="mf-decision-grid">
              <div className="mf-reveal">
                <p className="mf-num mf-item-num">
                  02<span className="mf-num-total"> / {DECISIONS_TOTAL}</span>
                </p>
                <h3 className="mf-h3 mf-title-item">
                  {decisions[1].title}
                </h3>
                <p className="mf-muted mf-item-copy">
                  {decisions[1].body}
                </p>
              </div>
              <div className="mf-reveal mf-item-demo">
                <FlashCompare />
              </div>
            </article>

            {/* 03, with StateMatrix beside the text */}
            <article className="mf-decision-grid">
              <div className="mf-reveal">
                <p className="mf-num mf-item-num">
                  03<span className="mf-num-total"> / {DECISIONS_TOTAL}</span>
                </p>
                <h3 className="mf-h3 mf-title-item">
                  {decisions[2].title}
                </h3>
                <p className="mf-muted mf-item-copy">
                  {decisions[2].body}
                </p>
              </div>
              <div className="mf-reveal mf-item-demo">
                <StateMatrix />
                <p className="mf-dim mf-footnote">
                  Placeholder card; the states and the palette are the real ones.
                </p>
              </div>
            </article>

            {/* 04, the ring alignment choice; body copy is Mona's to write */}
            {SHOW_DECISION_04 && (
            <article className="mf-reveal">
              <p className="mf-num mf-item-num">
                04<span className="mf-num-total"> / {DECISIONS_TOTAL}</span>
              </p>
              <h3 className="mf-h3 mf-title-item">
                One angle, three cycle lengths
              </h3>
              <p className="mf-dim mf-item-copy mf-todo">
                TODO(mona): write this decision yourself: the proportional
                alignment behind the cycle ring above (same angle = same cycle
                fraction, so phase boundaries align while day counts differ),
                what the alternative was, and why this one wins. The title
                above is provisional; rewrite it too.
              </p>
            </article>
            )}
          </div>
        </div>
      </section>

      {/* COLOUR TOKENS */}
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell">
          <div className="mf-reveal">
            <h2 className="mf-h2 mf-title-item mf-measure-wide">
              The four phase worlds, as <em className="mf-em">data</em>.
            </h2>
          </div>
          <div className="mf-reveal mf-table-scroll">
            <table className="mf-token-table">
              <thead>
                <tr className="mf-token-head">
                  <th>Phase</th>
                  <th>Surface</th>
                  <th>Ring</th>
                </tr>
              </thead>
              <tbody>
                {CICLA_PHASES.map((phase) => (
                  <tr key={phase.id}>
                    <td>{phase.label}</td>
                    <td>
                      <span className="mf-swatch-pair">
                        <span
                          aria-hidden="true"
                          className="mf-swatch"
                          style={{ background: phase.surface }}
                        />
                        <code>{phase.surface}</code>
                      </span>
                    </td>
                    <td>
                      <span className="mf-swatch-pair">
                        <span
                          aria-hidden="true"
                          className="mf-swatch mf-swatch-round"
                          style={{ background: phase.ring }}
                        />
                        <code>{phase.ring}</code>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mf-dim mf-reveal mf-footnote">
            From the app source (lib/phase.ts); the ring pair is the surface
            hue lightened for on-surface contrast. One file drives the table,
            the ring, and both demos.
          </p>
          <div className="mf-reveal mf-item-cta">
            <a
              href={CICLA_UI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mf-accent-deep mf-cta mf-cta-lg"
            >
              <span className="mf-cta-underline">
                Explore the complete Cicla Interface System
              </span>
              <span aria-hidden="true" className="mf-arrow mf-accent">
                ↗
              </span>
              <span className="mf-sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      {/* CODE EXCERPT */}
      {SHOW_CODE_EXCERPT && (
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell">
          <div className="mf-reveal">
            <h2 className="mf-h2 mf-title-item mf-measure-wide">
              An invalid phase colour does not{' '}
              <em className="mf-em">typecheck</em>.
            </h2>
          </div>
          <div className="mf-reveal mf-excerpt">
            <pre className="mf-code">
              <code>
                <span className="mf-tok-c">
                  {'// TODO(mona): paste the real phase-enforcement code from\n'}
                </span>
                <span className="mf-tok-c">
                  {'// cicla_app: the CyclePhase union plus a colour map keyed\n'}
                </span>
                <span className="mf-tok-c">
                  {'// by it (Record<CyclePhase, string>), 8 to 12 lines,\n'}
                </span>
                <span className="mf-tok-c">
                  {'// verbatim. A fifth phase or loose colour string fails\n'}
                </span>
                <span className="mf-tok-c">{'// to typecheck.\n'}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>
      )}

      {/* STATUS */}
      <section className="mf-section mf-section-item">
        <div className="mf-reveal mf-shell-narrow">
          <h2 className="mf-h3 mf-title-status">
            Where it stands
          </h2>
          <p className="mf-muted mf-item-copy">
            Cicla is in TestFlight beta, preparing for its first external
            testers. Real usage will replace assumptions from here. The same
            restraint governs the numbers: computed food targets are clamped
            to a health floor for calories and protein that deliberately wins
            over any weight goal.
          </p>
          {/* <div className="mf-item-cta">
            <Link
              to="/notes/guidance-without-overclaiming"
              className="mf-accent-deep mf-cta mf-cta-lg"
            >
              <span className="mf-cta-underline">
                Deeper: turning cycle data into guidance without overclaiming
              </span>
              <span aria-hidden="true" className="mf-arrow-lg mf-accent">
                →
              </span>
            </Link>
          </div> */}
        </div>
      </section>

      <Contact />
    </>
  )
}

export default Cicla
