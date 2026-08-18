import { useEffect, useRef, useState } from 'react'
import { EMAIL, LINKEDIN_URL } from '../content'

/* The header contact panel: a native <dialog>, centred on desktop and a
   bottom sheet on mobile (CSS only, no gestures). showModal() provides
   focus trapping, Escape handling, an inert background, and focus return
   to the trigger; this component adds backdrop-click dismissal and a
   copy action whose outcome is announced politely, never silently. */

type CopyState = 'idle' | 'copied' | 'failed'

export function ContactPanel({
  open,
  onClose,
}: {
  readonly open: boolean
  readonly onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [copy, setCopy] = useState<CopyState>('idle')
  const resetTimer = useRef(0)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setCopy('idle')
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  const copyEmail = async () => {
    window.clearTimeout(resetTimer.current)
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopy('copied')
      resetTimer.current = window.setTimeout(() => setCopy('idle'), 2400)
    } catch {
      // The address stays visible and selectable above, so the failure
      // message points there instead of dead-ending.
      setCopy('failed')
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="mf-dialog"
      aria-labelledby="contact-panel-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <div className="mf-dialog-body">
        <h2 id="contact-panel-title" className="mf-eyebrow">
          Get in touch
        </h2>
        <p className="mf-ink mf-dialog-email">
          {EMAIL}
        </p>
        <div className="mf-dialog-actions">
          <button type="button" className="mf-lab-chip" onClick={copyEmail}>
            {copy === 'copied' ? 'Copied' : 'Copy email'}
          </button>
          <a
            href={`mailto:${EMAIL}`}
            className="mf-lab-chip mf-cta"
          >
            Write an email
            <span aria-hidden="true" className="mf-arrow">
              →
            </span>
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mf-lab-chip mf-cta"
          >
            LinkedIn
            <span aria-hidden="true" className="mf-arrow">
              ↗
            </span>
            <span className="mf-sr-only">(opens in a new tab)</span>
          </a>
        </div>
        <p
          className="mf-dim mf-dialog-status"
          role="status"
          aria-live="polite"
        >
          {copy === 'copied'
            ? 'Email address copied.'
            : copy === 'failed'
              ? 'Copying failed. Select the address above and copy it manually.'
              : ''}
        </p>
        <div className="mf-dialog-close">
          <button type="button" className="mf-lab-chip" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}
