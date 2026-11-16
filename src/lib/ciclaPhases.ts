/**
 * Cicla's real phase palette. Single source of truth for this site:
 * PhaseMorph, the token table, FlashCompare and StateMatrix all read
 * from here. Do not duplicate these values elsewhere.
 *
 * Values read from the product source on 2026-11-16:
 *   cicla_app/src/lib/appColors.ts  (PHASE_COLOURS: ring, content, hero)
 * The app paints every phase-aware page in ONE solid content tone
 * (`content`, the CSS --phase-bg); the ring colour is the phase accent
 * (ring arcs, chart marks, the phase word). Re-check whenever the app
 * palette changes.
 */

export interface CiclaPhase {
  id: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal'
  label: string
  /** The solid page tone that tints every screen in this phase (content). */
  surface: string
  /** The phase accent: ring arcs drawn on the phase's own surface. */
  ring: string
}

export const CICLA_PHASES: CiclaPhase[] = [
  { id: 'menstrual', label: 'Menstrual', surface: '#504077', ring: '#806DB0' },
  { id: 'follicular', label: 'Follicular', surface: '#375B9C', ring: '#36B6ED' },
  { id: 'ovulatory', label: 'Ovulatory', surface: '#20685B', ring: '#58D6B6' },
  { id: 'luteal', label: 'Luteal', surface: '#85476A', ring: '#F45B8C' },
]
