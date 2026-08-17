/**
 * Synthetic cycle data for the CycleRing rebuild. One file, typed, easy
 * to swap. Every log entry is prefixed "Sample" on purpose: this is
 * obviously fictional demo data, not real health data.
 *
 * Cycle lengths vary (28 / 31 / 26) deliberately: that is what makes the
 * proportional angular alignment visible.
 */

export interface RingCycle {
  id: 'current' | 'previous' | 'twoAgo'
  label: string
  length: number
  /** Sparse day → log lines. Days without an entry logged nothing. */
  logs: Readonly<Record<number, readonly string[]>>
}

export const RING_CYCLES: readonly RingCycle[] = [
  {
    id: 'current',
    label: 'Current cycle',
    length: 28,
    logs: {
      2: ['Sample · gentle walk, 20 min', 'Sample · feel: slow start'],
      5: ['Sample · iron-rich lunch logged'],
      9: ['Sample · strength session, short'],
      14: ['Sample · long walk', 'Sample · feel: high energy'],
      17: ['Sample · feel: steady'],
      22: ['Sample · yoga, 30 min', 'Sample · earlier night'],
    },
  },
  {
    id: 'previous',
    label: 'Previous cycle',
    length: 31,
    logs: {
      3: ['Sample · rest day'],
      8: ['Sample · cycle ride, easy'],
      15: ['Sample · feel: strong week'],
      21: ['Sample · steady pace run'],
      26: ['Sample · feel: winding down', 'Sample · short stretch'],
    },
  },
  {
    id: 'twoAgo',
    label: 'Two cycles ago',
    length: 26,
    logs: {
      4: ['Sample · warm meal, early night'],
      11: ['Sample · swim, 25 min'],
      13: ['Sample · feel: peak day'],
      20: ['Sample · gentle movement only'],
    },
  },
]

export type PhaseId = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal'

/**
 * Phase for a day, using the app's real scaled-boundary rule
 * (cicla_app/src/lib/cycleEngine.ts, getScaledPhaseBoundaries): the
 * 28-day reference boundaries (5 / 13 / 15) scale with cycle length.
 */
export function phaseForDay(day: number, length: number): PhaseId {
  const s = length / 28
  if (day <= Math.round(5 * s)) return 'menstrual'
  if (day <= Math.round(13 * s)) return 'follicular'
  if (day <= Math.round(15 * s)) return 'ovulatory'
  return 'luteal'
}

/**
 * Cross-ring correspondence under proportional alignment.
 * Rule: nearest whole day by the source day's MIDPOINT cycle fraction,
 * round half up, clamped to [1, toLength]. Example: day 14 of 28 is
 * fraction 0.482, which lands at 15.44 on a 31-day cycle → day 15.
 * The same rule drives the hover highlight and the accessible names.
 */
export function correspondingDay(
  day: number,
  fromLength: number,
  toLength: number
): number {
  const fraction = (day - 0.5) / fromLength
  return Math.min(toLength, Math.max(1, Math.round(fraction * toLength + 0.5)))
}
