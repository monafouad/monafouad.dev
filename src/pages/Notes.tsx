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
      <section className="mf-section mf-section-lead">
        <div className="mf-shell-narrow">
          <div className="mf-reveal">
            <p className="mf-eyebrow">Notes</p>
            <h1 className="mf-h1 mf-title-display mf-measure-max">
              Short writing on decisions{' '}
              <em className="mf-em">worth keeping</em>.
            </h1>
            <p className="mf-muted mf-lede mf-measure mf-notes-lede">
              The thinking behind the work, one problem at a time. Infrequent
              and specific.
            </p>
          </div>

          <div className="mf-note-list">
            {notes.map((note) => (
              <Link
                key={note.to}
                to={note.to}
                className="mf-note-card"
              >
                <p className="mf-dim mf-note-date">
                  {note.date}
                </p>
                <h2 className="mf-h3 mf-title-item mf-note-title">
                  {note.title}
                </h2>
                <p className="mf-muted mf-note-line">
                  {note.line}
                </p>
                <p className="mf-accent-deep mf-cta mf-note-more">
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
