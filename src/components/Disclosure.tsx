import { useId, useState } from 'react'
import type { ReactNode } from 'react'

/* A disclosure with a smooth open/close: the region animates its height
   via grid-template-rows (0fr to 1fr), so there is no fixed max-height to
   guess and the transition stays smooth at any content size. A real button
   drives it (aria-expanded + aria-controls); under reduced motion the CSS
   drops the transition but the toggle still works. */
export function Disclosure({
  summary,
  children,
  className,
}: {
  readonly summary: string
  readonly children: ReactNode
  readonly className?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className={`mf-disc${className ? ' ' + className : ''}`} data-open={open}>
      <button
        type="button"
        className="mf-disc-summary"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="mf-disc-mark" aria-hidden="true" />
        {summary}
      </button>
      <div id={id} className="mf-disc-region" role="region" inert={!open}>
        <div className="mf-disc-inner">{children}</div>
      </div>
    </div>
  )
}
