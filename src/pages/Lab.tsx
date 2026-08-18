import { useEffect, useState } from 'react'
import { Contact } from '../components'
import { CICLA_UI_URL } from '../content'
import { StreamingReply } from '../components/lab/StreamingReply'
import streamingSource from '../components/lab/StreamingReply.tsx?raw'
import { useReveal } from '../useReveal'

function Lab() {
  useEffect(() => {
    document.title = 'Lab · Mona Fouad'
  }, [])
  useReveal()
  const [sourceOpen, setSourceOpen] = useState(false)

  return (
    <>
      <section className="mf-section mf-section-intro">
        <div className="mf-shell">
          <div className="mf-reveal">
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
          <div className="mf-item-grid">
            <div className="mf-reveal">
              <p className="mf-num mf-item-num">01</p>
              <h2 className="mf-h3 mf-title-item">
                Cicla Interface System
              </h2>
              <p className="mf-muted mf-item-copy">
                The production components and interface rules behind Cicla,
                documented as an interactive system. Explore semantic phase
                contracts, resilient component states, keyboard behaviour,
                accessibility checks and the foundations designed for use by
                both developers and AI agents.
              </p>
              <p className="mf-dim mf-item-note">
                Production system · components shipped in Cicla
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
            <div className="mf-reveal mf-item-demo">
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
          <div className="mf-item-grid">
            <div className="mf-reveal">
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
              <button
                type="button"
                className="mf-lab-chip mf-item-cta"
                aria-expanded={sourceOpen}
                aria-controls="lab-streaming-source"
                onClick={() => setSourceOpen((v) => !v)}
              >
                {sourceOpen ? 'Hide source' : 'View source'}
              </button>
            </div>
            <div className="mf-reveal mf-item-demo">
              <StreamingReply />
            </div>
          </div>
          <div id="lab-streaming-source" hidden={!sourceOpen}>
            <pre className="mf-code mf-stream-source">
              <code>{streamingSource}</code>
            </pre>
            <p className="mf-dim mf-micronote">
              The component&rsquo;s full source, as built into this page.
            </p>
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}

export default Lab
