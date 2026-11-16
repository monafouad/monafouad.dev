/**
 * Real Cicla tokens, ported verbatim from cicla_app (the only source of
 * truth for the brand). Nothing here is invented. Re-read 2026-11-16:
 *
 * - CyclePhase, PHASE_LABEL:            cicla_app/src/lib/phase.ts
 * - RING_HEX, PHASE_SURFACE,
 *   PHASE_SURFACE_LIGHT:                cicla_app/src/lib/appColors.ts
 *   (PHASE_COLOURS: `hero` is the darker block behind Home's title and
 *   ring, `content` the page tone every phase-aware page is painted in;
 *   the app draws them as two flat tones, hero above, content below)
 * - PHASE_WAVE_PATH:                    historical. The app's hero edge
 *   is now a straight diagonal cut (heroBackground.config.ts, Home only);
 *   the wave silhouette survives here only for the PhaseWorlds study.
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

/** PHASE_COLOURS[phase].hero: the darker tone above the edge. */
export const PHASE_SURFACE: Record<CyclePhase, string> = {
  menstrual: '#47396A',
  follicular: '#2B4F8C',
  ovulatory: '#185B51',
  luteal: '#77405F',
}

/** PHASE_COLOURS[phase].content: the page tone below the edge. */
export const PHASE_SURFACE_LIGHT: Record<CyclePhase, string> = {
  menstrual: '#504077',
  follicular: '#375B9C',
  ovulatory: '#20685B',
  luteal: '#85476A',
}

/** PHASE_COLOURS[phase].ring: the phase accent. */
export const RING_HEX: Record<CyclePhase, string> = {
  menstrual: '#806DB0',
  follicular: '#36B6ED',
  ovulatory: '#58D6B6',
  luteal: '#F45B8C',
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
