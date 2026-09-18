/**
 * Real Cicla tokens, ported verbatim from cicla_app (the only source of
 * truth for the brand). Nothing here is invented:
 *
 * - CyclePhase, RING_HEX, PHASE_LABEL:  cicla_app/src/lib/phase.ts
 * - PHASE_SURFACE, PHASE_SURFACE_LIGHT: cicla_app/src/lib/phaseBackgrounds.ts
 *   (the flat upper / lighter lower sections of the two-tone phase canvas)
 * - PHASE_WAVE_PATH:                    cicla_app/src/components/layout/
 *   PhaseWave.tsx (the ONE canonical wave silhouette)
 * - getPhaseForDay:                     cicla_app/src/lib/cycleEngine.ts
 *   (getScaledPhaseBoundaries — 5 / 13 / 15 reference boundaries)
 * - PHASE_SPAN:                         the reference 28-day phase lengths
 *   those boundaries produce (5 / 8 / 2 / 13)
 */
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal'

export const PHASE_ORDER: readonly CyclePhase[] = [
  'menstrual',
  'follicular',
  'ovulatory',
  'luteal',
]

export const PHASE_LABEL: Record<CyclePhase, string> = {
  menstrual: 'Menstrual',
  follicular: 'Follicular',
  ovulatory: 'Ovulatory',
  luteal: 'Luteal',
}

export const PHASE_SURFACE: Record<CyclePhase, string> = {
  menstrual: '#742F54',
  follicular: '#41679F',
  ovulatory: '#2D8B72',
  luteal: '#C35B32',
}

export const PHASE_SURFACE_LIGHT: Record<CyclePhase, string> = {
  menstrual: '#84365F',
  follicular: '#4771AE',
  ovulatory: '#329A7E',
  luteal: '#CD653C',
}

export const RING_HEX: Record<CyclePhase, string> = {
  menstrual: '#F56AAF',
  follicular: '#8FB6FF',
  ovulatory: '#68E0C4',
  luteal: '#FFC07A',
}

export const PHASE_WAVE_PATH = 'M0,42 C32,41 58,25 100,20 L100,100 L0,100 Z'

export const PHASE_SPAN: readonly number[] = [5, 8, 2, 13]

export function getPhaseForDay(
  dayInCycle: number,
  cycleLength: number
): CyclePhase {
  const scale = cycleLength / 28
  if (dayInCycle <= Math.round(5 * scale)) return 'menstrual'
  if (dayInCycle <= Math.round(13 * scale)) return 'follicular'
  if (dayInCycle <= Math.round(15 * scale)) return 'ovulatory'
  return 'luteal'
}
