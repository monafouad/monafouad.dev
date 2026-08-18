import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { CICLA_PHASES } from '../../lib/ciclaPhases'
import {
  RING_CYCLES,
  correspondingDay,
  phaseForDay,
} from '../../lib/cycleRingData'
import type { PhaseId } from '../../lib/cycleRingData'
import { mixOklch } from '../../lib/oklch'

/* The app's cycle ring, rebuilt for the web as SVG: three concentric
   cycles (outer = current), phase arcs from the shared tokens, a
   scrubbable day marker, and click-to-inspect logged days. Self-contained
   for reuse; all colour comes from ciclaPhases.ts, all data from
   cycleRingData.ts. */

const SIZE = 340
const C = SIZE / 2
const TAU = Math.PI * 2
// Outer → inner, echoing the app disc's taper: current cycle strongest.
const RINGS = [
  { r: 130, w: 15 },
  { r: 101, w: 10 },
  { r: 78, w: 6 },
]
const RING_DIM = [1, 0.6, 0.42]

const phaseToken = (id: PhaseId) =>
  CICLA_PHASES.find((p) => p.id === id) ?? CICLA_PHASES[0]

const fracAngle = (f: number) => f * TAU - Math.PI / 2
const px = (r: number, a: number) => C + r * Math.cos(a)
const py = (r: number, a: number) => C + r * Math.sin(a)

function arcPath(r: number, f0: number, f1: number): string {
  const a0 = fracAngle(f0)
  const a1 = fracAngle(f1)
  const large = f1 - f0 > 0.5 ? 1 : 0
  return `M ${px(r, a0)} ${py(r, a0)} A ${r} ${r} 0 ${large} 1 ${px(r, a1)} ${py(r, a1)}`
}

interface DayRef {
  cycle: number
  day: number
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n))

export function CycleRing() {
  const current = RING_CYCLES[0]
  const [selectedDay, setSelectedDay] = useState(17)
  const [hovered, setHovered] = useState<DayRef | null>(null)
  const [inspected, setInspected] = useState<DayRef | null>(null)
  const [markerFocused, setMarkerFocused] = useState(false)
  const [tableOpen, setTableOpen] = useState(false)
  // Roving tabindex per ring: which day currently holds the tab stop.
  const [rovingDay, setRovingDay] = useState<number[]>([1, 1, 1])
  const svgRef = useRef<SVGSVGElement>(null)
  const cellRefs = useRef(new Map<string, SVGPathElement>())
  const scrubbing = useRef(false)
  const scrubMoved = useRef(false)
  const pendingFocus = useRef<string | null>(null)

  const selectedPhase = phaseForDay(selectedDay, current.length)
  const surface = phaseToken(selectedPhase).surface

  // Surface tint: tween between phase surfaces in OKLCH (perceptually
  // uniform, no muddy sRGB midpoints). Instant under reduced motion.
  const surfaceDivRef = useRef<HTMLDivElement>(null)
  const shownSurface = useRef(surface)
  const tintRaf = useRef(0)
  const reducedRef = useRef(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = media.matches
    const onChange = () => {
      reducedRef.current = media.matches
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  // Initial paint of the surface, before first frame; the tween effect
  // owns every change after that. The background is never set in render,
  // so mid-tween re-renders cannot snap it to the target colour.
  useLayoutEffect(() => {
    if (surfaceDivRef.current)
      surfaceDivRef.current.style.background = shownSurface.current
  }, [])

  useEffect(() => {
    const el = surfaceDivRef.current
    if (!el) return
    cancelAnimationFrame(tintRaf.current)
    const from = shownSurface.current
    if (from === surface) return
    if (reducedRef.current) {
      shownSurface.current = surface
      el.style.background = surface
      return
    }
    const DURATION = 400
    let start: number | null = null
    const frame = (now: number) => {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / DURATION)
      const eased = 1 - (1 - t) ** 2
      shownSurface.current = mixOklch(from, surface, eased)
      el.style.background = shownSurface.current
      if (t < 1) tintRaf.current = requestAnimationFrame(frame)
    }
    tintRaf.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(tintRaf.current)
  }, [surface])

  // Phase arc segments per cycle, from the shared boundary rule.
  const segments = useMemo(
    () =>
      RING_CYCLES.map((cycle) => {
        const segs: { phase: PhaseId; from: number; to: number }[] = []
        for (let day = 1; day <= cycle.length; day += 1) {
          const phase = phaseForDay(day, cycle.length)
          const last = segs[segs.length - 1]
          if (last && last.phase === phase) last.to = day
          else segs.push({ phase, from: day, to: day })
        }
        return segs
      }),
    []
  )

  useEffect(() => {
    if (pendingFocus.current) {
      cellRefs.current.get(pendingFocus.current)?.focus()
      pendingFocus.current = null
    }
  })

  const dayFromPointer = (e: React.PointerEvent) => {
    const svg = svgRef.current
    if (!svg) return selectedDay
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * SIZE - C
    const y = ((e.clientY - rect.top) / rect.height) * SIZE - C
    const f = ((Math.atan2(y, x) + Math.PI / 2 + TAU) % TAU) / TAU
    return clamp(Math.floor(f * current.length) + 1, 1, current.length)
  }

  const beginScrub = (e: React.PointerEvent) => {
    scrubbing.current = true
    scrubMoved.current = false
    svgRef.current?.setPointerCapture(e.pointerId)
    setSelectedDay(dayFromPointer(e))
  }

  const moveScrub = (e: React.PointerEvent) => {
    if (!scrubbing.current) return
    scrubMoved.current = true
    setSelectedDay(dayFromPointer(e))
  }

  const endScrub = () => {
    scrubbing.current = false
  }

  const stepDay = (delta: number) =>
    setSelectedDay((d) => clamp(d + delta, 1, current.length))

  const sliderKeys = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') stepDay(1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') stepDay(-1)
    else if (e.key === 'Home') setSelectedDay(1)
    else if (e.key === 'End') setSelectedDay(current.length)
    else return
    e.preventDefault()
  }

  const cellKeys = (cycleIdx: number, day: number) => (e: React.KeyboardEvent) => {
    const length = RING_CYCLES[cycleIdx].length
    let next: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = clamp(day + 1, 1, length)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown')
      next = clamp(day - 1, 1, length)
    else if (e.key === 'Home') next = 1
    else if (e.key === 'End') next = length
    else if (e.key === 'Enter' || e.key === ' ') {
      inspect(cycleIdx, day)
      e.preventDefault()
      return
    } else if (e.key === 'Escape') {
      setInspected(null)
      return
    } else return
    e.preventDefault()
    setRovingDay((r) => r.map((d, i) => (i === cycleIdx ? next : d)))
    pendingFocus.current = `${cycleIdx}-${next}`
    setHovered({ cycle: cycleIdx, day: next })
  }

  const inspect = (cycle: number, day: number) => {
    setInspected({ cycle, day })
    if (cycle === 0) setSelectedDay(day)
  }

  const markerAngle = fracAngle((selectedDay - 0.5) / current.length)
  const inspectedCycle = inspected ? RING_CYCLES[inspected.cycle] : null
  const inspectedLogs = inspected
    ? (inspectedCycle?.logs[inspected.day] ?? [])
    : []

  const phaseLabelOf = (id: PhaseId) => phaseToken(id).label

  return (
    <div className="mf-cring">
      <div ref={surfaceDivRef} className="mf-cring-surface">
        <svg
          ref={svgRef}
          className="mf-cring-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          onPointerMove={moveScrub}
          onPointerUp={endScrub}
          onPointerCancel={endScrub}
          onPointerLeave={() => setHovered(null)}
          aria-hidden={undefined}
        >
          {/* Phase arcs, three cycles */}
          {RING_CYCLES.map((cycle, i) => (
            <g key={cycle.id} opacity={RING_DIM[i]}>
              {segments[i].map((seg) => (
                <path
                  key={`${cycle.id}-${seg.phase}`}
                  d={arcPath(
                    RINGS[i].r,
                    (seg.from - 1) / cycle.length,
                    seg.to / cycle.length
                  )}
                  fill="none"
                  stroke={phaseToken(seg.phase).ring}
                  strokeWidth={RINGS[i].w}
                />
              ))}
            </g>
          ))}

          {/* Cross-ring correspondence highlight (follows hover and focus) */}
          {hovered &&
            RING_CYCLES.map((cycle, i) => {
              const day =
                i === hovered.cycle
                  ? hovered.day
                  : correspondingDay(
                      hovered.day,
                      RING_CYCLES[hovered.cycle].length,
                      cycle.length
                    )
              return (
                <path
                  key={`hl-${cycle.id}`}
                  d={arcPath(
                    RINGS[i].r,
                    (day - 1) / cycle.length,
                    day / cycle.length
                  )}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={RINGS[i].w + 3}
                  opacity={i === hovered.cycle ? 0.95 : 0.65}
                  pointerEvents="none"
                />
              )
            })}

          {/* Day hit cells: roving tabindex per ring, Enter inspects */}
          {RING_CYCLES.map((cycle, i) => (
            <g
              key={`cells-${cycle.id}`}
              role="group"
              aria-label={`${cycle.label}, ${cycle.length} days`}
            >
              {Array.from({ length: cycle.length }, (_, d) => {
                const day = d + 1
                const phase = phaseForDay(day, cycle.length)
                const corr =
                  i === 0
                    ? ''
                    : `, corresponds to day ${correspondingDay(day, cycle.length, current.length)} of the current cycle`
                const key = `${i}-${day}`
                return (
                  <path
                    key={key}
                    ref={(el) => {
                      if (el) cellRefs.current.set(key, el)
                      else cellRefs.current.delete(key)
                    }}
                    d={arcPath(
                      RINGS[i].r,
                      (day - 1) / cycle.length,
                      day / cycle.length
                    )}
                    className="mf-cring-cell"
                    fill="none"
                    stroke="transparent"
                    strokeWidth={RINGS[i].w + 9}
                    role="button"
                    tabIndex={rovingDay[i] === day ? 0 : -1}
                    aria-label={`${cycle.label}, day ${day} of ${cycle.length}, ${phaseLabelOf(phase)} phase${corr}${cycle.logs[day] ? ', has logs' : ''}`}
                    aria-expanded={
                      inspected?.cycle === i && inspected.day === day
                    }
                    aria-controls="mf-cring-panel"
                    style={i === 0 ? { touchAction: 'none' } : undefined}
                    onPointerEnter={() => setHovered({ cycle: i, day })}
                    onPointerDown={i === 0 ? beginScrub : undefined}
                    onClick={() => {
                      if (scrubMoved.current) return
                      inspect(i, day)
                    }}
                    onFocus={() => setHovered({ cycle: i, day })}
                    onBlur={() => setHovered(null)}
                    onKeyDown={cellKeys(i, day)}
                  />
                )
              })}
            </g>
          ))}

          {/* Scrub marker: the slider */}
          <g
            role="slider"
            aria-label="Current cycle day"
            aria-valuemin={1}
            aria-valuemax={current.length}
            aria-valuenow={selectedDay}
            aria-valuetext={`Day ${selectedDay}, ${phaseLabelOf(selectedPhase)} phase`}
            tabIndex={0}
            className="mf-cring-marker"
            style={{ touchAction: 'none' }}
            onKeyDown={sliderKeys}
            onPointerDown={beginScrub}
            onFocus={() => setMarkerFocused(true)}
            onBlur={() => setMarkerFocused(false)}
          >
            {markerFocused && (
              <circle
                cx={px(RINGS[0].r, markerAngle)}
                cy={py(RINGS[0].r, markerAngle)}
                r={14}
                fill="none"
                stroke="#ffffff"
                strokeWidth={2}
                opacity={0.9}
              />
            )}
            <circle
              cx={px(RINGS[0].r, markerAngle)}
              cy={py(RINGS[0].r, markerAngle)}
              r={7}
              fill="#ffffff"
            />
          </g>
        </svg>

        <p className="mf-cring-center" aria-hidden="true">
          <span className="mf-cring-day">Day {selectedDay}</span>
          <span className="mf-cring-phase">{phaseLabelOf(selectedPhase)}</span>
        </p>
      </div>

      <p className="mf-dim mf-cring-caption">
        Outer ring: {current.label.toLowerCase()} ({current.length} days) ·
        middle: {RING_CYCLES[1].label.toLowerCase()} ({RING_CYCLES[1].length})
        · inner: {RING_CYCLES[2].label.toLowerCase()} ({RING_CYCLES[2].length}
        ). Drag or use arrow keys on the marker; click any day for its logs.
      </p>

      <div id="mf-cring-panel" hidden={!inspected}>
        {inspected && inspectedCycle && (
          <div className="mf-cring-panel">
            <p className="mf-label mf-label-accent mf-cring-label">
              {inspectedCycle.label} · Day {inspected.day} ·{' '}
              {phaseLabelOf(phaseForDay(inspected.day, inspectedCycle.length))}
            </p>
            {inspectedLogs.length > 0 ? (
              <ul className="mf-cring-loglist">
                {inspectedLogs.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="mf-muted mf-cring-empty">Nothing logged this day.</p>
            )}
            <p className="mf-dim mf-micronote">Synthetic sample data.</p>
            <button
              type="button"
              className="mf-lab-chip mf-cring-close"
              onClick={() => setInspected(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>

      <div>
        <button
          type="button"
          className="mf-lab-chip"
          aria-expanded={tableOpen}
          aria-controls="mf-cring-table"
          onClick={() => setTableOpen((v) => !v)}
        >
          {tableOpen ? 'Hide table view' : 'View as table'}
        </button>
        <div id="mf-cring-table" hidden={!tableOpen} className="mf-cring-table">
          <table>
            <caption className="mf-sr-only">
              The same three cycles as a linear table
            </caption>
            <thead>
              <tr>
                <th scope="col">Cycle</th>
                <th scope="col">Day</th>
                <th scope="col">Phase</th>
                <th scope="col">Logged</th>
              </tr>
            </thead>
            {RING_CYCLES.map((cycle) => (
              <tbody key={cycle.id}>
                {Array.from({ length: cycle.length }, (_, d) => {
                  const day = d + 1
                  return (
                    <tr key={day}>
                      {day === 1 && (
                        <th scope="rowgroup" rowSpan={cycle.length}>
                          {cycle.label}
                        </th>
                      )}
                      <td>{day}</td>
                      <td>{phaseLabelOf(phaseForDay(day, cycle.length))}</td>
                      <td>{cycle.logs[day]?.join('; ') ?? ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </div>
  )
}
