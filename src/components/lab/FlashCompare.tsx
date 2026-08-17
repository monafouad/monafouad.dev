import { useEffect, useRef, useState } from 'react'
import { CICLA_PHASES } from '../../lib/ciclaPhases'

/* The real bug and the real fix, from the app's AtmosphericPage: the
   loading sentinel is the follicular default, so a naive mount could
   paint a menstrual user a follicular frame. The app's fix is a
   last-rendered-phase cache: during the resolve window the atmosphere
   she was ALREADY looking at holds, so a world she was never in is
   never painted. The right panel reproduces that holding behaviour. */
const RESOLVED = CICLA_PHASES[0] // menstrual, the phase that resolves
const SENTINEL = CICLA_PHASES[1] // follicular, the app's loading default
const PREVIOUS = CICLA_PHASES[3] // luteal, the screen she navigated from
const RESOLVE_MS = 260 // artificial async resolve time at 1×

const SPEEDS = [
  { label: '1×', factor: 1 },
  { label: '4×', factor: 4 },
  { label: '10×', factor: 10 },
]

type PanelPhase = 'held' | 'sentinel' | 'resolved'

const SCREEN_TOKENS: Record<PanelPhase, (typeof CICLA_PHASES)[number]> = {
  held: PREVIOUS,
  sentinel: SENTINEL,
  resolved: RESOLVED,
}

function MiniScreen({ state }: { readonly state: PanelPhase }) {
  const token = SCREEN_TOKENS[state]
  return (
    <div className="mf-flash-screen" style={{ background: token.surface }}>
      <span className="mf-flash-skel" style={{ width: '55%' }} />
      <span className="mf-flash-skel" style={{ width: '80%' }} />
      <span className="mf-flash-disc" style={{ borderColor: token.ring }} />
      <span className="mf-flash-skel" style={{ width: '70%' }} />
    </div>
  )
}

/**
 * Side-by-side replay of the wrong-colour flash. Naive: mounts on the
 * follicular sentinel and corrects late. Fixed: holds the atmosphere the
 * user was already looking at (the app's last-rendered-phase cache) until
 * the phase resolves, so the first NEW paint is already correct. Slow
 * motion included because at real speed the flash is a single frame.
 * Under prefers-reduced-motion the two first-paint states render
 * statically.
 */
export function FlashCompare() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [factor, setFactor] = useState(4)
  const [naive, setNaive] = useState<PanelPhase>('sentinel')
  const [fixed, setFixed] = useState<PanelPhase>('held')
  const [running, setRunning] = useState(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
      timersRef.current.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  const replay = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
    const delay = RESOLVE_MS * factor
    setRunning(true)
    setNaive('sentinel')
    setFixed('held')
    timersRef.current.push(
      window.setTimeout(() => {
        setNaive('resolved')
        setFixed('resolved')
        setRunning(false)
      }, delay)
    )
  }

  const naiveCaption = (
    <figcaption className="mf-flash-cap">
      <strong>Naive:</strong> mounts on the follicular loading default, then
      corrects to menstrual when her data resolves. That correction is the
      flash: a world she was never in.
    </figcaption>
  )
  const fixedCaption = (
    <figcaption className="mf-flash-cap">
      <strong>Resolved before paint:</strong> the luteal atmosphere she was
      already looking at holds until the phase is known, so the first new
      paint is already correct. Nothing she was never in ever appears.
    </figcaption>
  )

  if (reduced) {
    return (
      <div className="mf-flash-root">
        <div className="mf-flash">
          <figure className="mf-flash-panel">
            <MiniScreen state="sentinel" />
            {naiveCaption}
          </figure>
          <figure className="mf-flash-panel">
            <MiniScreen state="held" />
            {fixedCaption}
          </figure>
        </div>
        <p className="mf-lab-caption" style={{ textAlign: 'left' }}>
          Reduced motion: showing each version&rsquo;s first paint instead of
          replaying the correction.
        </p>
      </div>
    )
  }

  return (
    <div className="mf-flash-root">
      <div className="mf-flash">
        <figure className="mf-flash-panel">
          <MiniScreen state={naive} />
          {naiveCaption}
        </figure>
        <figure className="mf-flash-panel">
          <MiniScreen state={fixed} />
          {fixedCaption}
        </figure>
      </div>
      <div className="mf-flash-controls">
        <button
          type="button"
          className="mf-lab-chip"
          onClick={replay}
          disabled={running}
        >
          Replay
        </button>
        <fieldset className="mf-flash-speeds">
          <legend className="sr-only">Replay speed</legend>
          {SPEEDS.map((s) => (
            <label key={s.factor} className="mf-flash-speed">
              <input
                type="radio"
                name="flash-speed"
                checked={factor === s.factor}
                onChange={() => setFactor(s.factor)}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </fieldset>
        <span className="mf-dim text-xs">
          slow motion; at 1× the flash is a single frame
        </span>
      </div>
    </div>
  )
}
