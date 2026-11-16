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
   (cicla_app/src/pages/DevHomeV2/components/CycleDisc.tsx, re-read
   2026-11-16): same canvas geometry (a 244 space drawn tight to the
   rings), ring radii and stroke taper, phase arc walk, butt caps, the
   day-1 boundary gap at 12 o'clock, the projected (lighter) days after
   today on the outer ring, ring colours from ciclaPhases, dot with
   phase-tinted halo, day ticks while interacting, the two-level Satoshi
   centre readout ("cycle day" over the number), pointer-to-day-and-ring
   math with midpoint ring bands, and keyboard slider semantics.

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
  { radius: 84, strokeWidth: 7, alpha: 0.5 },
  { radius: 62, strokeWidth: 4, alpha: 0.34 },
]
/* The drawing space is tight to the rings (outer stroke 113, dot 116,
   ticks 120): a 244 square leaves a 2px margin, as in the app. */
const SIZE = 244
const CENTER = 122
/* Day 1 starts at 12 o'clock: a hairline gap of the same visible width on
   every ring marks where one cycle ends and the next begins. */
const BOUNDARY_GAP_PX = 2.5
/* Outer ring only: days after today are a projection at this share of the
   phase colour; elapsed days keep the full ring colour. */
const PROJECTED_ALPHA = 0.62
/* Centre readout and interaction ticks: the app's primary ink. */
const READOUT_INK = '#F7F6F4'

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
    /* The outer ring splits at the end of today: elapsed in full colour,
       the days still ahead as a quieter projection. */
    const elapsedEnd = baseAngle + Math.min(cycleDay, cycleLength) * wedgeSpan
    RINGS.forEach((ring, ringIndex) => {
      ctx.lineWidth = ring.strokeWidth
      const halfGap = BOUNDARY_GAP_PX / 2 / ring.radius
      const cycleStart = baseAngle + halfGap
      const cycleEnd = baseAngle + Math.PI * 2 - halfGap
      const stroke = (
        arcPhase: CyclePhase,
        alpha: number,
        a0: number,
        a1: number
      ) => {
        const start = Math.max(a0, cycleStart)
        const end = Math.min(a1, cycleEnd, sweepEnd)
        if (end <= start) return
        ctx.strokeStyle = hexToRgba(phaseToken(arcPhase).ring, alpha)
        ctx.beginPath()
        ctx.arc(CENTER, CENTER, ring.radius, start, end)
        ctx.stroke()
      }
      phaseArcsRef.current.forEach((arc) => {
        const start = baseAngle + (arc.start - 1) * wedgeSpan
        const end = baseAngle + arc.end * wedgeSpan
        if (ringIndex > 0) {
          stroke(arc.phase, ring.alpha, start, end)
          return
        }
        stroke(arc.phase, ring.alpha, start, Math.min(end, elapsedEnd))
        stroke(
          arc.phase,
          ring.alpha * PROJECTED_ALPHA,
          Math.max(start, elapsedEnd),
          end
        )
      })
    })

    if (isInteracting && progress >= 1) {
      ctx.strokeStyle = hexToRgba(READOUT_INK, 0.5)
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

    /* The app's two-level readout: a quiet lowercase "cycle day" label over
       the number, regular weight, sized in visual px (the canvas is drawn
       at SIZE and scaled to displaySize). Portfolio adaptation: the number
       follows the marker's selected day (the app anchors it to today), so
       the readout, the nudge and the card colour always agree. */
    const sans = "'Satoshi', sans-serif"
    const toLogical = SIZE / (displaySize ?? SIZE)
    const labelPx = 12 * toLogical
    const numberPx = 26 * toLogical
    const gap = 4 * toLogical
    const label = 'cycle day'
    const value = String(selectedDay)
    const typo = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.font = `400 ${labelPx}px ${sans}`
    typo.letterSpacing = `${0.06 * labelPx}px`
    const lm = ctx.measureText(label)
    const labelAscent = lm.actualBoundingBoxAscent
    const labelHeight = labelAscent + lm.actualBoundingBoxDescent
    ctx.font = `400 ${numberPx}px ${sans}`
    typo.letterSpacing = '0px'
    const numberAscent = ctx.measureText(value).actualBoundingBoxAscent
    const top = CENTER - (labelHeight + gap + numberAscent) / 2
    ctx.fillStyle = READOUT_INK
    ctx.fillText(value, CENTER, top + labelHeight + gap + numberAscent)
    ctx.font = `400 ${labelPx}px ${sans}`
    typo.letterSpacing = `${0.06 * labelPx}px`
    ctx.fillStyle = hexToRgba(READOUT_INK, 0.8)
    ctx.fillText(label, CENTER, top + labelAscent)
    typo.letterSpacing = '0px'

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

  /* The canvas rasterises text with whatever face is loaded at draw time;
     once Satoshi settles, repaint the finished disc (the app does the same). */
  useEffect(() => {
    let live = true
    void document.fonts?.ready.then(() => {
      if (live && introDoneRef.current) draw(1)
    })
    return () => {
      live = false
    }
  }, [draw])

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
