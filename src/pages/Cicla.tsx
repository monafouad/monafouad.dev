import { useEffect } from 'react'
// import { Link } from 'react-router-dom'
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
      <section className="px-6 pt-16 pb-12 sm:px-10 sm:pt-20 sm:pb-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 md:grid-cols-[3fr_2fr] md:gap-16">
            <div className="reveal">
              <h1 className="mf-wordmark text-5xl leading-[0.95] sm:text-6xl">
                Cicla
              </h1>

              <p className="mf-muted mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
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

              <dl className="mf-hairline mt-9 grid grid-cols-2 gap-x-8 gap-y-7 border-t pt-8 text-sm">
                <Meta label="Role" value="Solo founder & engineer" />
                <Meta label="Scope" value="Design · Frontend · Backend · AI" />
                <Meta label="Platform" value="iOS" />
                <Meta label="Status" value="TestFlight beta" />
              </dl>
            </div>

            {/* ONE hero image */}
            <div className="reveal flex justify-center md:justify-end">
              <img
                src="/screenshots/home-menstrual.webp"
                alt="Cicla home screen, day 3, menstrual phase"
                className="mf-shot mf-screen max-h-[400px] w-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CYCLE RING */}
      <section className="mf-hairline border-t px-6 py-14 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-10 md:grid-cols-[2fr_3fr] md:gap-14">
            <div className="reveal">
              <h2 className="mf-h2 max-w-2xl text-2xl leading-[1.15] sm:text-3xl">
                Three cycles, one <em className="mf-em">angle</em>.
              </h2>
              <p className="mf-muted mt-5 max-w-xl text-[0.97rem] leading-relaxed sm:text-base">
                Each cycle closes its own circle, so the same angle is the
                same point in the cycle, whatever its length.
              </p>
            </div>
            <div className="reveal min-w-0">
              <CycleRing />
            </div>
          </div>
        </div>
      </section>

      {/* DECISIONS */}
      <section className="mf-hairline border-t px-6 py-14 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="reveal">
            <h2 className="mf-h2 max-w-2xl text-2xl leading-[1.15] sm:text-3xl">
              {SHOW_DECISION_04 ? 'Four' : 'Three'} decisions worth{' '}
              <em className="mf-em">talking about</em>.
            </h2>
          </div>

          <div className="mt-10 space-y-14 sm:space-y-16">
            {/* 01, text only */}
            <article className="reveal">
              <p className="mf-num mb-4 text-xl">
                01<span className="mf-num-total"> / {DECISIONS_TOTAL}</span>
              </p>
              <h3 className="mf-h3 text-2xl leading-[1.15] sm:text-3xl">
                {decisions[0].title}
              </h3>
              <p className="mf-muted mt-5 max-w-2xl text-[0.97rem] leading-relaxed sm:text-base">
                {decisions[0].body}
              </p>
            </article>

            {/* 02, with FlashCompare beside the text */}
            <article className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="reveal">
                <p className="mf-num mb-4 text-xl">
                  02<span className="mf-num-total"> / {DECISIONS_TOTAL}</span>
                </p>
                <h3 className="mf-h3 text-2xl leading-[1.15] sm:text-3xl">
                  {decisions[1].title}
                </h3>
                <p className="mf-muted mt-5 max-w-2xl text-[0.97rem] leading-relaxed sm:text-base">
                  {decisions[1].body}
                </p>
              </div>
              <div className="reveal min-w-0">
                <FlashCompare />
              </div>
            </article>

            {/* 03, with StateMatrix beside the text */}
            <article className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="reveal">
                <p className="mf-num mb-4 text-xl">
                  03<span className="mf-num-total"> / {DECISIONS_TOTAL}</span>
                </p>
                <h3 className="mf-h3 text-2xl leading-[1.15] sm:text-3xl">
                  {decisions[2].title}
                </h3>
                <p className="mf-muted mt-5 max-w-2xl text-[0.97rem] leading-relaxed sm:text-base">
                  {decisions[2].body}
                </p>
              </div>
              <div className="reveal min-w-0">
                <StateMatrix />
                <p className="mf-dim mt-4 text-xs leading-relaxed">
                  Placeholder card; the states and the palette are the real ones.
                </p>
              </div>
            </article>

            {/* 04, the ring alignment choice; body copy is Mona's to write */}
            {SHOW_DECISION_04 && (
            <article className="reveal">
              <p className="mf-num mb-4 text-xl">
                04<span className="mf-num-total"> / {DECISIONS_TOTAL}</span>
              </p>
              <h3 className="mf-h3 text-2xl leading-[1.15] sm:text-3xl">
                One angle, three cycle lengths
              </h3>
              <p className="mf-dim mt-5 max-w-2xl text-[0.97rem] italic leading-relaxed sm:text-base">
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
      <section className="mf-hairline border-t px-6 py-14 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="reveal">
            <h2 className="mf-h2 max-w-2xl text-2xl leading-[1.15] sm:text-3xl">
              The four phase worlds, as <em className="mf-em">data</em>.
            </h2>
          </div>
          <div className="reveal mt-8 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="mf-dim text-[0.62rem] font-semibold uppercase tracking-[0.16em]">
                  <th className="py-2 pr-4 font-semibold">Phase</th>
                  <th className="py-2 pr-4 font-semibold">Surface</th>
                  <th className="py-2 font-semibold">Ring</th>
                </tr>
              </thead>
              <tbody>
                {CICLA_PHASES.map((phase) => (
                  <tr key={phase.id} className="mf-hairline border-t">
                    <td className="py-2.5 pr-4 font-medium">{phase.label}</td>
                    <td className="py-2.5 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-block h-4 w-4 rounded"
                          style={{ background: phase.surface }}
                        />
                        <code className="text-xs">{phase.surface}</code>
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-block h-4 w-4 rounded-full"
                          style={{ background: phase.ring }}
                        />
                        <code className="text-xs">{phase.ring}</code>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mf-dim reveal mt-4 text-xs leading-relaxed">
            From the app source (lib/phase.ts); the ring pair is the surface
            hue lightened for on-surface contrast. One file drives the table,
            the ring, and both demos.
          </p>
          <div className="reveal mt-6">
            <a
              href={CICLA_UI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mf-accent-deep group inline-flex items-center gap-2 text-base font-medium"
            >
              <span className="mf-cta-underline">
                Explore the complete Cicla Interface System
              </span>
              <span aria-hidden="true" className="mf-arrow mf-accent">
                ↗
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      {/* CODE EXCERPT */}
      {SHOW_CODE_EXCERPT && (
      <section className="mf-hairline border-t px-6 py-14 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="reveal">
            <h2 className="mf-h2 max-w-2xl text-2xl leading-[1.15] sm:text-3xl">
              An invalid phase colour does not{' '}
              <em className="mf-em">typecheck</em>.
            </h2>
          </div>
          <div className="reveal mt-10 max-w-2xl">
            <pre className="mf-code">
              <code>
                <span className="tok-c">
                  {'// TODO(mona): paste the real phase-enforcement code from\n'}
                </span>
                <span className="tok-c">
                  {'// cicla_app: the CyclePhase union plus a colour map keyed\n'}
                </span>
                <span className="tok-c">
                  {'// by it (Record<CyclePhase, string>), 8 to 12 lines,\n'}
                </span>
                <span className="tok-c">
                  {'// verbatim. A fifth phase or loose colour string fails\n'}
                </span>
                <span className="tok-c">{'// to typecheck.\n'}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>
      )}

      {/* STATUS */}
      <section className="px-6 py-14 sm:px-10 sm:py-16">
        <div className="reveal mx-auto max-w-4xl">
          <h2 className="mf-h3 text-xl leading-[1.2] sm:text-2xl">
            Where it stands
          </h2>
          <p className="mf-muted mt-5 max-w-2xl text-[0.97rem] leading-relaxed sm:text-base">
            Cicla is in TestFlight beta, preparing for its first external
            testers. Real usage will replace assumptions from here. The same
            restraint governs the numbers: computed food targets are clamped
            to a health floor for calories and protein that deliberately wins
            over any weight goal.
          </p>
          {/* <div className="mt-8">
            <Link
              to="/notes/guidance-without-overclaiming"
              className="mf-accent-deep group inline-flex items-center gap-2 text-base font-medium"
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
