/**
 * Cicla's real phase palette. Single source of truth for this site:
 * PhaseMorph, the token table, FlashCompare and StateMatrix all read
 * from here. Do not duplicate these values elsewhere.
 *
 * Values read from the product source on 2026-08-17:
 *   cicla_app/src/lib/phase.ts  (PHASE_HEX, RING_HEX)
 * Ring colours are the surface hue lightened (~+0.30 HSL lightness) so
 * ring arcs keep contrast against their own phase's deep background.
 *
 * TODO(mona): confirm these match the app before publishing, and
 * re-check whenever the app palette changes.
 */

export interface CiclaPhase {
  id: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal'
  label: string
  /** Deep surface colour that tints every screen in this phase. */
  surface: string
  /** Lightened ring pair, for arcs drawn on the phase's own surface. */
  ring: string
}

export const CICLA_PHASES: CiclaPhase[] = [
  { id: 'menstrual', label: 'Menstrual', surface: '#6E2050', ring: '#F56AAF' },
  { id: 'follicular', label: 'Follicular', surface: '#2E5596', ring: '#8FB6FF' },
  { id: 'ovulatory', label: 'Ovulatory', surface: '#218A6E', ring: '#68E0C4' },
  { id: 'luteal', label: 'Luteal', surface: '#B84A24', ring: '#FFC07A' },
]
