import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Contact } from '../components'
import { useReveal } from '../useReveal'

function GuidanceNote() {
  useEffect(() => {
    document.title =
      'Turning cycle data into guidance without overclaiming · Mona Fouad'
  }, [])
  useReveal()

  return (
    <>
      <article className="px-6 pt-20 pb-24 sm:px-10 sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-3xl">
          <div className="reveal">
            <div className="flex items-baseline justify-between gap-6">
              <p className="mf-eyebrow">Notes · Cicla</p>
              <span className="mf-dim text-xs font-medium tabular-nums">
                Aug 2026
              </span>
            </div>
            <h1 className="mf-h1 mt-8 text-3xl leading-[1.1] sm:text-4xl">
              Turning cycle data into guidance{' '}
              <em className="mf-em">without overclaiming</em>.
            </h1>
          </div>

          <div className="mt-14 space-y-12">
            <NoteBlock label="The problem">
              <p>
                Cicla needed to turn cycle timing, daily logs, and previous
                patterns into useful guidance, without assuming that every
                woman experiences the same phase in the same way.
              </p>
            </NoteBlock>

            <NoteBlock label="Why it's harder than it looks">
              <p>
                Cycle phase provides context, not an answer. Two women in the
                same phase can report completely different energy, symptoms,
                appetite, or training capacity; the same woman can experience
                one cycle differently from the next. And the data is
                imperfect: days go unlogged, first-time users arrive with no
                history, signals contradict the expected pattern.
              </p>
              <p>
                So the system had to keep three things separate: what is
                generally associated with the current phase, what the user is
                reporting right now, and what Cicla has observed across her own
                previous cycles. And it had to know when there wasn&rsquo;t
                enough evidence to say anything useful at all.
              </p>
            </NoteBlock>

            <NoteBlock label="What I rejected">
              <p>
                A phase-based lookup table (luteal user, luteal guidance) was
                predictable and easy to test, but too generic to feel personal.
                Letting each part of the product interpret data independently
                risked repetitive, even contradictory messages between
                movement, food, home, and patterns. And generating the core
                interpretation through unrestricted AI output would be hard to
                reproduce, verify, and constrain. In a health product,
                confident language quickly implies more certainty than the
                data supports.
              </p>
            </NoteBlock>

            <NoteBlock label="The solution">
              <p>
                One canonical synthesis layer turns all of Cicla&rsquo;s
                signals into structured guidance. The engine normalises cycle
                context, current logs, and historical patterns, evaluates which
                observations are sufficiently supported, and produces
                candidates that are prioritised by relevance, recency, and
                usefulness. Repeats are suppressed, and when the evidence is
                too weak, the engine returns no personal interpretation at all.
              </p>
              <p>
                The interface never receives an unrestricted paragraph. It
                receives structured information that controls what Cicla
                observed, which context supports it, how confidently it may be
                presented, whether there is a relevant action, and where in the
                product it belongs. Home, planning, and patterns can present
                things differently, but none of them independently decides what
                the data means.
              </p>
              <p>
                The language follows the same rule. Cicla says something
                &ldquo;matches&rdquo; or &ldquo;may be connected&rdquo; when
                the evidence supports that wording. It never presents a
                phase-based assumption as a fact about the user.
              </p>
            </NoteBlock>

            <NoteBlock label="How it's tested">
              <p>
                The engine is tested as a decision system, not a collection of
                functions: phase boundaries, missing logs, first-cycle users,
                incomplete previous cycles, conflicting signals, updated and
                deleted entries, duplicate candidates, and the states where no
                interpretation should be shown. The same inputs must produce
                the same results, and changing one signal must update the
                output without touching unrelated guidance.
              </p>
              <p>
                Integrity guards keep product surfaces from quietly growing
                their own interpretation paths, and end-to-end tests verify
                that selected guidance reaches the right interface and responds
                when the underlying data changes. The goal is not for Cicla to
                sound intelligent in every state. It is that when Cicla says
                something, the product can justify why.
              </p>
            </NoteBlock>
          </div>

          <div className="reveal mt-16 flex flex-wrap gap-x-10 gap-y-4">
            <Link
              to="/cicla"
              className="mf-textlink group inline-flex items-center gap-2 text-base font-medium"
            >
              <span aria-hidden="true" className="mf-arrow rotate-180">
                →
              </span>
              The Cicla case study
            </Link>
            <Link
              to="/notes"
              className="mf-textlink group inline-flex items-center gap-2 text-base font-medium"
            >
              All notes
              <span aria-hidden="true" className="mf-arrow">
                →
              </span>
            </Link>
          </div>
        </div>
      </article>

      <Contact />
    </>
  )
}

function NoteBlock({
  label,
  children,
}: {
  readonly label: string
  readonly children: React.ReactNode
}) {
  return (
    <div className="reveal">
      <p className="mf-label mf-label-accent mb-4">{label}</p>
      <div className="mf-muted space-y-5 text-base leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export default GuidanceNote
