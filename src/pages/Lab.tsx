import { useEffect } from 'react'
import { Contact } from '../components'
import { CICLA_UI_URL } from '../content'
import { StreamingReply } from '../components/lab/StreamingReply'
import streamingSource from '../components/lab/StreamingReply.tsx?raw'
import { PhaseWorlds } from '../components/cicla/PhaseWorlds'
import phaseWorldsSource from '../components/cicla/PhaseWorlds.tsx?raw'
import { useReveal } from '../useReveal'
import { Disclosure } from '../components/Disclosure'

function Lab() {
  useEffect(() => {
    document.title = 'Lab · Mona Fouad'
  }, [])
  useReveal()

  return (
    <>
      <section className="mf-section mf-section-intro">
        <div className="mf-shell">
          <div className="mf-enter">
            <p className="mf-eyebrow">Lab</p>
            <h1 className="mf-h1 mf-title-display mf-measure-max mf-lab-title">
              The states nobody <em className="mf-em">builds</em>.
            </h1>
            <p className="mf-muted mf-lede mf-measure">
              Interfaces are judged by their unhappy paths: the denied
              permission, the wrong frame, the reader who scrolled up. The
              Cicla case study makes that argument on iOS; these demos make it
              on the web. Built by hand on this site, live, with the source
              open.
            </p>
          </div>
        </div>
      </section>

      {/* 01 · Cicla Interface System */}
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell">
          <div className="mf-item-grid mf-reveal mf-seq">
            <div>
              <p className="mf-num mf-item-num">01</p>
              <h2 className="mf-h3 mf-title-item">
                Cicla Interface System
              </h2>
              <p className="mf-muted mf-item-copy">
                A snapshot of Cicla&rsquo;s interface components and rules,
                documented as an interactive system. Explore semantic phase
                contracts, resilient component states, keyboard behaviour,
                accessibility checks and the foundations designed for use by
                both developers and AI agents.
              </p>
              <p className="mf-dim mf-item-note">
                A point-in-time snapshot of Cicla&rsquo;s production interface
                components, captured in August 2026
              </p>
              <a
                href={CICLA_UI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mf-accent-deep mf-cta mf-cta-lg mf-item-cta"
              >
                <span className="mf-cta-underline">
                  Explore the interface system
                </span>
                <span aria-hidden="true" className="mf-arrow mf-accent">
                  ↗
                </span>
                <span className="mf-sr-only">(opens in a new tab)</span>
              </a>
            </div>
            <div className="mf-item-demo">
              <a
                href={CICLA_UI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mf-shotlink"
                aria-label="Open the Cicla Interface System Storybook (opens in a new tab)"
              >
                <img
                  src="/lab/cicla-interface-system.webp"
                  alt="The Cicla Interface System Storybook, open on its Overview page in the ovulatory green phase: a hero reading 'The interface behind Cicla', with Foundations, Components and Cicla Patterns in the sidebar"
                  loading="lazy"
                />
                <span className="mf-shotlink-hint" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 02 · Streaming */}
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell">
          <div className="mf-item-grid mf-reveal mf-seq">
            <div>
              <p className="mf-num mf-item-num">02</p>
              <h2 className="mf-h3 mf-title-item">
                Streaming output that doesn&rsquo;t jump
              </h2>
              <div className="mf-muted mf-item-copy mf-stack-sm">
                <p>
                  Built from scratch for this portfolio, this experiment
                  revisits streaming-response UI work I previously
                  implemented for an AI chatbot, extending it here to
                  explore layout stability, reader-controlled scrolling,
                  partial content, and interruption.
                </p>
                <p>
                  The reply streams inside its own fixed-height region, so the
                  page never moves, and following is consent-based: pinned
                  only while you are at the bottom, disengaged the moment you
                  scroll up. Markdown renders mid-parse (an unclosed fence is
                  a code block from the moment it opens) and Stop keeps every
                  token received.
                </p>
                <p>
                  Traded away: a deliberately tiny markdown grammar, and a
                  canned stream with simulated jitter instead of a live model.
                </p>
              </div>
              <p className="mf-dim mf-item-note">
                Lab experiment · informed by professional AI interface work
              </p>
              <Disclosure summary="Source" className="mf-item-cta mf-lab-disc">
                <pre className="mf-code mf-stream-source">
                  <code>{streamingSource}</code>
                </pre>
                <p className="mf-dim mf-micronote">
                  The component&rsquo;s full source, as built into this page.
                </p>
              </Disclosure>
            </div>
            <div className="mf-item-demo">
              <StreamingReply startInView />
            </div>
          </div>
        </div>
      </section>

      {/* 03 · Four phase worlds */}
      <section className="mf-rule-top mf-section mf-section-item">
        <div className="mf-shell">
          <div className="mf-item-grid mf-reveal mf-seq">
            <div>
              <p className="mf-num mf-item-num">03</p>
              <h2 className="mf-h3 mf-title-item">
                Four phase worlds, one visual system
              </h2>
              <div className="mf-muted mf-item-copy mf-stack-sm">
                <p>
                  Cicla&rsquo;s identity is an atmosphere system: four phase
                  worlds, each a flat surface colour with the same hue a few
                  shades lighter below one canonical wave. What stays
                  constant is everything structural — the wave silhouette,
                  the logotype, the composition, the type pairing. What
                  changes between worlds is only colour and the phase word.
                </p>
                <p>
                  The handover is the one animated moment — the app itself
                  never shows it, because a phase changes overnight. Exactly
                  one atmosphere is drawn at all times: between states its
                  two tones glide through OKLCH (so the in-betweens stay
                  believable colours, never the grey valley), the wave dips
                  gently and settles back into its fixed geometry, and the
                  phase word hands over in place. It always reads as one
                  world changing mood, never two worlds sharing the frame.
                </p>
                <p>
                  When the strip first appears it demonstrates the four
                  worlds once, then stops; from there the pointer owns it —
                  its horizontal position selects the phase, tap and drag do
                  the same on touch. The motion is deliberately restrained
                  to the three things the system actually changes: surface,
                  wave tone, word.
                </p>
                <p>
                  Traded away: any cycle-day progression (tracking UI is
                  what every cycle app already shows, and it would turn
                  brand motion back into product UI), a wave-shaped wipe
                  between worlds (it put two atmospheres on screen at once
                  and broke the one-identity reading), and an endless
                  ambient loop — the demonstration plays once, then waits
                  for the visitor.
                </p>
              </div>
              <p className="mf-dim mf-item-note">
                Brand-motion study · colours, wave and type ported from the
                Cicla app source
              </p>
              <Disclosure summary="Source" className="mf-item-cta mf-lab-disc">
                <pre className="mf-code mf-stream-source">
                  <code>{phaseWorldsSource}</code>
                </pre>
                <p className="mf-dim mf-micronote">
                  The component&rsquo;s full source, as built into this page.
                </p>
              </Disclosure>
            </div>
            <div className="mf-item-demo">
              <PhaseWorlds />
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}

export default Lab
