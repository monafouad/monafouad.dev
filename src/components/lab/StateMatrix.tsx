import { useState } from 'react'
import type { ReactNode } from 'react'
import { CICLA_PHASES } from '../../lib/ciclaPhases'
import type { CiclaPhase } from '../../lib/ciclaPhases'

/* TODO(mona): these cells render a placeholder health-connection card,
   not the real Cicla component (importing the app's components would
   couple this site's build to the app repo). Swap MiniCard for the real
   component if that coupling ever becomes acceptable. The states below
   are the product's real ones. */

interface MatrixState {
  id: string
  label: string
  render: (phase: CiclaPhase) => ReactNode
}

const LONG_TEXT =
  'Sync sleep, weight, resting heart rate, activity, workouts, cycle logs and anything else HealthKit exposes from iPhone and Apple Watch, every morning'

// Extend this array to add rows; each state is one entry.
const MATRIX_STATES: MatrixState[] = [
  {
    id: 'default',
    label: 'Default',
    render: () => <p className="mf-mini-body">Synced this morning · 7 days</p>,
  },
  {
    id: 'loading',
    label: 'Loading',
    render: () => (
      <>
        <span className="mf-mini-skel" style={{ width: '70%' }} />
        <span className="mf-mini-skel" style={{ width: '45%' }} />
        <span className="mf-sr-only">Loading</span>
      </>
    ),
  },
  {
    id: 'denied',
    label: 'Permission denied',
    render: () => (
      <p className="mf-mini-body">
        <span className="mf-mini-chip">No access</span> iOS never reports
        denial; the card must.
      </p>
    ),
  },
  {
    id: 'empty',
    label: 'Empty',
    render: () => <p className="mf-mini-body">Nothing synced yet.</p>,
  },
  {
    id: 'error',
    label: 'Error',
    render: () => <p className="mf-mini-body">Couldn&rsquo;t read data.</p>,
  },
  {
    id: 'overflow',
    label: 'Long content',
    render: () => <p className="mf-mini-body mf-mini-clamp">{LONG_TEXT}</p>,
  },
]

function MiniCard({
  phase,
  children,
}: {
  readonly phase: CiclaPhase
  readonly children: ReactNode
}) {
  return (
    <div className="mf-mini" style={{ borderTopColor: phase.surface }}>
      <p className="mf-mini-title">Apple Health</p>
      {children}
    </div>
  )
}

/**
 * Every state the connection card must survive, one legible column at a
 * time; the chips switch which phase world tints the cards. Driven by one
 * data array; extend MATRIX_STATES to add rows.
 */
export function StateMatrix() {
  const [phaseId, setPhaseId] = useState<CiclaPhase['id']>('menstrual')
  const phase =
    CICLA_PHASES.find((p) => p.id === phaseId) ?? CICLA_PHASES[0]

  return (
    <div className="mf-smx">
      <div
        className="mf-lab-chips"
        style={{ justifyContent: 'flex-start' }}
        role="group"
        aria-label="Phase world for the state column"
      >
        {CICLA_PHASES.map((p) => (
          <button
            key={p.id}
            type="button"
            className="mf-lab-chip"
            aria-pressed={p.id === phaseId}
            onClick={() => setPhaseId(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="mf-smx-list">
        {MATRIX_STATES.map((state) => (
          <div key={state.id} className="mf-smx-row">
            <p className="mf-label mf-label-dim">{state.label}</p>
            <MiniCard phase={phase}>{state.render(phase)}</MiniCard>
          </div>
        ))}
      </div>
    </div>
  )
}
