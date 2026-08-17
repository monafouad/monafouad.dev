import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Contact } from '../components'
import { useReveal } from '../useReveal'

interface Note {
  title: string
  line: string
  date: string
  to: string
}

const notes: Note[] = [
  {
    title: 'Turning cycle data into guidance without overclaiming',
    line: 'Designing the interpretation engine behind Cicla: what it says, what it refuses to say, and how that restraint is tested.',
    date: 'Aug 2026',
    to: '/notes/guidance-without-overclaiming',
  },
]

function Notes() {
  useEffect(() => {
    document.title = 'Notes · Mona Fouad'
  }, [])
  useReveal()

  return (
    <>
      <section className="px-6 pt-20 pb-24 sm:px-10 sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-4xl">
          <div className="reveal">
            <p className="mf-eyebrow">Notes</p>
            <h1 className="mf-h1 mt-8 max-w-3xl text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
              Short writing on decisions{' '}
              <em className="mf-em">worth keeping</em>.
            </h1>
            <p className="mf-muted mt-8 max-w-xl text-base leading-relaxed sm:text-lg">
              The thinking behind the work, one problem at a time. Infrequent
              and specific.
            </p>
          </div>

          <div className="mf-hairline mt-16 border-t">
            {notes.map((note) => (
              <Link
                key={note.to}
                to={note.to}
                className="mf-hairline group block border-b py-10"
              >
                <p className="mf-dim text-xs font-medium uppercase tracking-[0.18em]">
                  {note.date}
                </p>
                <h2 className="mf-h3 mt-4 text-2xl leading-[1.15] sm:text-3xl">
                  {note.title}
                </h2>
                <p className="mf-muted mt-4 max-w-2xl text-[0.97rem] leading-relaxed">
                  {note.line}
                </p>
                <p className="mf-accent-deep mt-5 inline-flex items-center gap-2 text-sm font-medium">
                  Read the note
                  <span aria-hidden="true" className="mf-arrow">
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}

export default Notes
