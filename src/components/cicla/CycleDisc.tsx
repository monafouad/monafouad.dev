import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { CICLA_PHASES } from '../../lib/ciclaPhases'
import type { CiclaPhase } from '../../lib/ciclaPhases'
import { getPhaseForDay, type CyclePhase } from './ciclaTokens'

/* A faithful port of the real Cicla CycleDisc
   (cicla_app/src/pages/DevHomeV2/components/CycleDisc.tsx): same
   canvas geometry, ring radii and stroke taper, phase arc walk, butt
   caps, RING_HEX colours, dot with phase-tinted halo, day ticks while
   interacting, Satoshi centre readout, pointer-to-day-and-ring math
   with midpoint ring bands, and keyboard slider semantics.

   The app's 1100ms easeOutCubic intro sweep is ported and armed when
   the disc enters the viewport (reduced motion draws complete
   immediately). The app's 6s breath loop is the one omission, kept
   out so the page never runs an endless ambient animation.

   Phase boundaries come from the app's getScaledPhaseBoundaries rule
   (5 / 13 / 15 at the 28-day reference), as ported in ciclaPhases /
   cycleRingData. */

const phaseToken = (id: CyclePhase): CiclaPhase =>
  CICLA_PHASES.find((p) => p.id === id) ?? CICLA_PHASES[0]

const PHASE_LABEL: Record<CyclePhase, string> = {
  menstrual: 'Menstrual',
  follicular: 'Follicular',
  ovulatory: 'Ovulatory',
  luteal: 'Luteal',
}

interface Ring {
  readonly radius: number
  readonly strokeWidth: number
  readonly alpha: number
}

/* Outer to inner, exactly the app's taper: current cycle strongest. */
const RINGS: ReadonlyArray<Ring> = [
  { radius: 108, strokeWidth: 10, alpha: 1 },
  { radius: 84, strokeWidth: 7, alpha: 0.6 },
  { radius: 62, strokeWidth: 4, alpha: 0.4 },
]
const SIZE = 260
const CENTER = 130

function computePhaseArcs(
  cycleLength: number
): ReadonlyArray<{ phase: CyclePhase; start: number; end: number }> {
  if (cycleLength < 1) return []
  const arcs: Array<{ phase: CyclePhase; start: number; end: number }> = []
  let current = getPhaseForDay(1, cycleLength)
  let runStart = 1
  for (let day = 2; day <= cycleLength; day++) {
    const next = getPhaseForDay(day, cycleLength)
    if (next !== current) {
      arcs.push({ phase: current, start: runStart, end: day - 1 })
      current = next
      runStart = day
    }
  }
  arcs.push({ phase: current, start: runStart, end: cycleLength })
  return arcs
}

function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace('#', '')
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  const r = Number.parseInt(h.slice(0, 2), 16)
  const g = Number.parseInt(h.slice(2, 4), 16)
  const b = Number.parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function CycleDisc({
  phase,
  cycleDay,
  cycleLength,
  onDaySelect,
  displaySize,
}: {
  readonly phase: CyclePhase
  readonly cycleDay: number
  readonly cycleLength: number
  readonly onDaySelect?: (day: number, ring: number, fromUser: boolean) => void
  readonly displaySize?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [selectedDay, setSelectedDay] = useState<number>(cycleDay)
  const [selectedRing, setSelectedRing] = useState<0 | 1 | 2>(0)
  const [isInteracting, setIsInteracting] = useState(false)
  const fromUserRef = useRef(false)

  const lastNotifiedRef = useRef<string | null>(null)
  useEffect(() => {
    const key = `${selectedDay}:${selectedRing}`
    if (lastNotifiedRef.current === key) return
    lastNotifiedRef.current = key
    onDaySelect?.(selectedDay, selectedRing, fromUserRef.current)
  }, [selectedDay, selectedRing, onDaySelect])

  const phaseArcsRef = useRef(computePhaseArcs(cycleLength))

  /* Draw at a given intro progress (0 empty, 1 full), the app's sweep:
     arcs reveal clockwise from the top; dot and centre readout fade in
     over the last 30%. At progress 1 this is the steady render. */
  const draw = useCallback((progress: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const display = displaySize ?? SIZE
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    canvas.style.width = `${display}px`
    canvas.style.height = `${display}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, SIZE, SIZE)

    const wedgeSpan = (Math.PI * 2) / cycleLength
    const baseAngle = -Math.PI / 2
    const sweepEnd = baseAngle + progress * Math.PI * 2

    ctx.lineCap = 'butt'
    RINGS.forEach((ring) => {
      ctx.lineWidth = ring.strokeWidth
      phaseArcsRef.current.forEach((arc) => {
        const start = baseAngle + (arc.start - 1) * wedgeSpan
        const fullEnd = baseAngle + arc.end * wedgeSpan
        const end = Math.min(fullEnd, sweepEnd)
        if (end <= start) return
        ctx.strokeStyle = hexToRgba(phaseToken(arc.phase).ring, ring.alpha)
        ctx.beginPath()
        ctx.arc(CENTER, CENTER, ring.radius, start, end)
        ctx.stroke()
      })
    })

    if (isInteracting) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 1
      const tickInner = RINGS[0].radius + RINGS[0].strokeWidth / 2 + 3
      const tickOuter = tickInner + 4
      for (let day = 1; day <= cycleLength; day++) {
        const angle = baseAngle + (day - 1) * wedgeSpan
        ctx.beginPath()
        ctx.moveTo(
          CENTER + tickInner * Math.cos(angle),
          CENTER + tickInner * Math.sin(angle)
        )
        ctx.lineTo(
          CENTER + tickOuter * Math.cos(angle),
          CENTER + tickOuter * Math.sin(angle)
        )
        ctx.stroke()
      }
    }

    const displayPhase: CyclePhase =
      selectedDay === cycleDay ? phase : getPhaseForDay(selectedDay, cycleLength)

    const uiAlpha = Math.min(Math.max((progress - 0.7) / 0.3, 0), 1)
    if (uiAlpha <= 0) return
    ctx.save()
    ctx.globalAlpha = uiAlpha

    const dotAngle = baseAngle + (selectedDay - 0.5) * wedgeSpan
    const dotRadius = RINGS[selectedRing].radius
    const dotX = CENTER + dotRadius * Math.cos(dotAngle)
    const dotY = CENTER + dotRadius * Math.sin(dotAngle)

    ctx.beginPath()
    ctx.arc(dotX, dotY, 8, 0, Math.PI * 2)
    ctx.fillStyle = hexToRgba(phaseToken(displayPhase).ring, 0.28)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    /* Portfolio adaptation: the centre readout follows the marker's
       selected day (the app anchors it to today), so the readout, the
       nudge and the card colour always agree. */
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '600 18px Satoshi, sans-serif'
    ctx.fillText(`Day ${selectedDay}`, CENTER, CENTER - 8)

    const labelPx = Math.round(10 * (SIZE / (displaySize ?? SIZE)))
    ctx.font = `500 ${labelPx}px Satoshi, sans-serif`
    ctx.fillText(PHASE_LABEL[displayPhase].toUpperCase(), CENTER, CENTER + 10)

    ctx.restore()
  }, [cycleLength, cycleDay, phase, selectedDay, selectedRing, isInteracting, displaySize])

  /* Intro sweep, the app's 1100ms easeOutCubic, armed on viewport
     entry; reduced motion draws full immediately. Once done, every
     dep change redraws at full. */
  const introStartRef = useRef<number | null>(null)
  const introRafRef = useRef(0)
  const introDoneRef = useRef(false)
  const [introArmed, setIntroArmed] = useState(false)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !('IntersectionObserver' in globalThis)) {
      setIntroArmed(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntroArmed(true)
          io.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    io.observe(canvas)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (introDoneRef.current || reduce) {
      introDoneRef.current = true
      draw(1)
      return
    }
    if (!introArmed) {
      draw(0)
      return
    }
    const DURATION = 1100
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (ts: number) => {
      if (introStartRef.current === null) introStartRef.current = ts
      const t = Math.min((ts - introStartRef.current) / DURATION, 1)
      draw(easeOutCubic(t))
      if (t < 1) {
        introRafRef.current = requestAnimationFrame(step)
      } else {
        introDoneRef.current = true
      }
    }
    introRafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(introRafRef.current)
  }, [draw, introArmed])

  const pointFromPointer = useCallback(
    (
      e: ReactPointerEvent<HTMLCanvasElement>
    ): { day: number; ring: 0 | 1 | 2 } | null => {
      const canvas = canvasRef.current
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return null

      const cx = ((e.clientX - rect.left) / rect.width) * SIZE - CENTER
      const cy = ((e.clientY - rect.top) / rect.height) * SIZE - CENTER
      let angle = Math.atan2(cy, cx) + Math.PI / 2
      if (angle < 0) angle += Math.PI * 2
      const day = Math.max(
        1,
        Math.min(
          cycleLength,
          Math.floor((angle / (Math.PI * 2)) * cycleLength) + 1
        )
      )
      const dist = Math.sqrt(cx * cx + cy * cy)
      const outerMid = (RINGS[0].radius + RINGS[1].radius) / 2
      const midInner = (RINGS[1].radius + RINGS[2].radius) / 2
      const ring: 0 | 1 | 2 = dist >= outerMid ? 0 : dist >= midInner ? 1 : 2
      return { day, ring }
    },
    [cycleLength]
  )

  const updateFromPointer = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const point = pointFromPointer(e)
      if (point === null) return
      fromUserRef.current = true
      setSelectedDay(point.day)
      setSelectedRing(point.ring)
    },
    [pointFromPointer]
  )

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      setIsInteracting(true)
      try {
        ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
      } catch {
        /* setPointerCapture can throw on detached elements; ignore. */
      }
      updateFromPointer(e)
    },
    [updateFromPointer]
  )
  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!isInteracting) return
      updateFromPointer(e)
    },
    [isInteracting, updateFromPointer]
  )
  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      setIsInteracting(false)
      try {
        ;(e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId)
      } catch {
        /* releasePointerCapture can throw if not captured; ignore. */
      }
    },
    []
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLCanvasElement>) => {
      let next: number | null = null
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        next = selectedDay >= cycleLength ? 1 : selectedDay + 1
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        next = selectedDay <= 1 ? cycleLength : selectedDay - 1
      } else if (e.key === 'Home') {
        next = 1
      } else if (e.key === 'End') {
        next = cycleLength
      }
      if (next === null) return
      e.preventDefault()
      fromUserRef.current = true
      setIsInteracting(true)
      setSelectedDay(next)
    },
    [selectedDay, cycleLength]
  )
  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (
      ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(
        e.key
      )
    )
      setIsInteracting(false)
  }, [])

  const selectedPhase: CyclePhase =
    selectedDay === cycleDay ? phase : getPhaseForDay(selectedDay, cycleLength)

  return (
    <div className="mfv2-disc">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={() => setIsInteracting(false)}
        aria-label={`Cycle disc, day ${selectedDay}, ${selectedPhase} phase. Drag the dot to inspect other days.`}
        role="slider"
        aria-valuemin={1}
        aria-valuemax={cycleLength}
        aria-valuenow={selectedDay}
        aria-valuetext={`Day ${selectedDay}, ${PHASE_LABEL[selectedPhase]} phase`}
        tabIndex={0}
        style={{
          touchAction: 'none',
          cursor: isInteracting ? 'grabbing' : 'grab',
        }}
      />
    </div>
  )
}
