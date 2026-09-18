import { useEffect, useRef, useState } from 'react'
import { mixOklch } from '../../lib/oklch'
import {
  PHASE_LABEL,
  PHASE_ORDER,
  PHASE_SURFACE,
  PHASE_SURFACE_LIGHT,
  PHASE_WAVE_PATH,
  type CyclePhase,
} from './ciclaTokens'

/**
 * PhaseWorlds — a brand-motion study of Cicla's phase atmosphere
 * system, built only from real Cicla source (see ciclaTokens.ts for
 * the ported provenance):
 *
 * - Each world is the app's real two-tone atmosphere: flat
 *   PHASE_SURFACE above, PHASE_SURFACE_LIGHT below, divided by the
 *   canonical PhaseWave silhouette.
 * - The type is the brand's own pairing: the Satoshi "cicla."
 *   logotype and the Zodiak-italic phase word (the hero accent voice).
 *
 * One frame, four atmospheres. The composition never changes; only
 * the two surface tones, the phase word and the accent do. Exactly ONE
 * atmosphere is drawn at all times — between states its tones glide
 * through OKLCH (never the sRGB grey valley), the wave dips gently and
 * settles, and the phase word hands over in place.
 *
 * Motion: when the strip first enters the viewport it demonstrates the
 * four worlds once (~3.4s), then stops. From then on the visitor owns
 * it: the pointer's horizontal position — hover, drag, or tap —
 * selects the phase in quarters, tweened smoothly. Arrow keys work
 * from keyboard. prefers-reduced-motion skips the demonstration and
 * switches states instantly.
 */

const HOLD = 400
const TRANS = 600
const INTRO_TOTAL = 3 * (HOLD + TRANS) + HOLD

const smooth = (t: number) => t * t * (3 - 2 * t)

/* The intro timeline: hold each world, then ease to the next. */
function introPos(elapsed: number): number {
  const step = HOLD + TRANS
  const k = Math.floor(elapsed / step)
  if (k >= 3) return 3
  const local = elapsed - k * step
  if (local < HOLD) return k
  return k + smooth((local - HOLD) / TRANS)
}

interface Engine {
  engage: (idx: number) => void
  nudge: (delta: number) => void
}

export function PhaseWorlds({
  onPhaseChange,
}: {
  readonly onPhaseChange?: (phase: CyclePhase) => void
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const reducedFlag = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [pos, setPos] = useState(0)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      reducedFlag.current = media.matches
    }
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  /* The whole animation engine lives in one mount effect: the one-time
     intro demonstration, then the interactive tween toward whichever
     quarter the pointer (or keyboard) selects. */
  useEffect(() => {
    const S = {
      pos: 0,
      target: 0,
      mode: 'idle' as 'idle' | 'intro' | 'interactive',
      raf: 0,
      lastTs: 0,
      introStart: 0,
    }
    const commit = (p: number) => {
      S.pos = p
      setPos(p)
    }

    function tween(ts: number) {
      S.raf = 0
      const dt = S.lastTs ? ts - S.lastTs : 16
      S.lastTs = ts
      const nextPos = S.pos + (S.target - S.pos) * (1 - Math.exp(-dt / 110))
      if (Math.abs(S.target - nextPos) < 0.004) {
        commit(S.target)
        return
      }
      commit(nextPos)
      S.raf = requestAnimationFrame(tween)
    }

    function intro(ts: number) {
      S.raf = 0
      if (S.mode !== 'intro') return
      if (!S.introStart) S.introStart = ts
      const elapsed = ts - S.introStart
      commit(introPos(elapsed))
      if (elapsed >= INTRO_TOTAL) {
        S.mode = 'interactive'
        S.target = 3
        return
      }
      S.raf = requestAnimationFrame(intro)
    }

    const engage = (idx: number) => {
      S.mode = 'interactive'
      S.target = idx
      if (reducedFlag.current) {
        cancelAnimationFrame(S.raf)
        S.raf = 0
        commit(idx)
        return
      }
      if (!S.raf) {
        S.lastTs = 0
        S.raf = requestAnimationFrame(tween)
      }
    }
    const nudge = (delta: number) =>
      engage(Math.min(3, Math.max(0, S.target + delta)))
    engineRef.current = { engage, nudge }

    const el = hostRef.current
    let io: IntersectionObserver | null = null
    if (el && 'IntersectionObserver' in globalThis) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || S.mode !== 'idle') return
          io?.disconnect()
          if (reducedFlag.current) {
            S.mode = 'interactive'
            return
          }
          S.mode = 'intro'
          S.raf = requestAnimationFrame(intro)
        },
        { threshold: 0.5 }
      )
      io.observe(el)
    } else {
      S.mode = 'interactive'
    }

    return () => {
      io?.disconnect()
      cancelAnimationFrame(S.raf)
      engineRef.current = null
    }
  }, [])

  /* The pointer's horizontal position selects the phase in quarters. */
  const selectFromPointer = (e: React.PointerEvent) => {
    const el = hostRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const f = (e.clientX - rect.left) / rect.width
    engineRef.current?.engage(Math.min(3, Math.max(0, Math.floor(f * 4))))
  }

  /* Derived visual state: one atmosphere, gliding between tokens. */
  const iLow = Math.min(3, Math.floor(pos))
  const f = iLow >= 3 ? 0 : Math.min(1, Math.max(0, pos - iLow))
  const current = PHASE_ORDER[iLow]
  const next = PHASE_ORDER[Math.min(3, iLow + 1)]
  const surface =
    f > 0.001
      ? mixOklch(PHASE_SURFACE[current], PHASE_SURFACE[next], f)
      : PHASE_SURFACE[current]
  const light =
    f > 0.001
      ? mixOklch(PHASE_SURFACE_LIGHT[current], PHASE_SURFACE_LIGHT[next], f)
      : PHASE_SURFACE_LIGHT[current]
  const waveDrift = Math.sin(Math.PI * f) * 4
  const outO = 1 - Math.min(1, f / 0.55)
  const inO = Math.max(0, (f - 0.45) / 0.55)

  const shown: CyclePhase = f >= 0.5 ? next : current
  useEffect(() => {
    onPhaseChange?.(shown)
  }, [shown, onPhaseChange])

  return (
    <div
      ref={hostRef}
      className="mf-pw"
      style={{ background: surface, touchAction: 'pan-y' }}
      role="slider"
      aria-label="Cicla phase atmospheres"
      aria-valuemin={1}
      aria-valuemax={4}
      aria-valuenow={PHASE_ORDER.indexOf(shown) + 1}
      aria-valuetext={`${PHASE_LABEL[shown]} phase`}
      tabIndex={0}
      onPointerDown={selectFromPointer}
      onPointerMove={(e) => {
        if (e.pointerType === 'mouse' || e.buttons > 0) selectFromPointer(e)
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          engineRef.current?.nudge(1)
          e.preventDefault()
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          engineRef.current?.nudge(-1)
          e.preventDefault()
        }
      }}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="mf-pw-canvas"
      >
        <rect width="100" height="100" fill={surface} />
        <path
          d={PHASE_WAVE_PATH}
          fill={light}
          transform={`translate(0 ${waveDrift})`}
        />
      </svg>

      <div className="mf-pw-inner" aria-hidden="true">
        <span className="mf-pw-logo">cicla.</span>
        <span className="mf-pw-words">
          <em
            className="mf-pw-name"
            style={{
              opacity: outO,
              transform: `translateY(${(1 - outO) * -10}px)`,
            }}
          >
            {PHASE_LABEL[current]}
          </em>
          {f > 0.001 && (
            <em
              className="mf-pw-name mf-pw-name-next"
              style={{
                opacity: inO,
                transform: `translateY(${(1 - inO) * 10}px)`,
              }}
            >
              {PHASE_LABEL[next]}
            </em>
          )}
        </span>
      </div>
    </div>
  )
}
