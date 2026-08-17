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
      <section className="px-6 pt-16 pb-14 sm:px-10 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="reveal">
            <p className="mf-eyebrow">Lab</p>
            <h1 className="mf-h1 mt-7 max-w-3xl text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
              The states nobody <em className="mf-em">builds</em>.
            </h1>
            <p className="mf-muted mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
              Interfaces are judged by their unhappy paths: the denied
              permission, the wrong frame, the reader who scrolled up. The
              Cicla case study makes that argument on iOS; these demos make it
              on the web. Built by hand on this site, live, with the source
              open.
            </p>
          </div>
        </div>
      </section>

      {/* 01 · Streaming */}
      <section className="mf-hairline border-t px-6 py-14 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14">
            <div className="reveal">
              <p className="mf-num mb-4 text-xl">01</p>
              <h2 className="mf-h3 text-2xl leading-[1.15] sm:text-3xl">
                Streaming output that doesn&rsquo;t jump
              </h2>
              <div className="mf-muted mt-5 max-w-2xl space-y-4 text-[0.97rem] leading-relaxed sm:text-base">
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
              <button
                type="button"
                className="mf-lab-chip mt-6"
                aria-expanded={sourceOpen}
                aria-controls="lab-streaming-source"
                onClick={() => setSourceOpen((v) => !v)}
              >
                {sourceOpen ? 'Hide source' : 'View source'}
              </button>
            </div>
            <div className="reveal min-w-0">
              <StreamingReply />
            </div>
          </div>
          <div id="lab-streaming-source" hidden={!sourceOpen}>
            <pre className="mf-code mf-stream-source">
              <code>{streamingSource}</code>
            </pre>
            <p className="mf-dim mt-3 text-xs">
              The component&rsquo;s full source, as built into this page.
            </p>
          </div>
        </div>
      </section>

      {/* 02 · Cicla Interface System */}
      <section className="mf-hairline border-t px-6 py-14 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-10 lg:grid-cols-[2fr_3fr] lg:gap-14">
            <div className="reveal">
              <p className="mf-num mb-4 text-xl">02</p>
              <h2 className="mf-h3 text-2xl leading-[1.15] sm:text-3xl">
                Cicla Interface System
              </h2>
              <p className="mf-muted mt-5 max-w-2xl text-[0.97rem] leading-relaxed sm:text-base">
                The production components and interface rules behind Cicla,
                documented as an interactive system. Explore semantic phase
                contracts, resilient component states, keyboard behaviour,
                accessibility checks and the foundations designed for use by
                both developers and AI agents.
              </p>
              <p className="mf-dim mt-4 text-xs">
                React · TypeScript · Storybook
              </p>
              <a
                href={CICLA_UI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mf-accent-deep group mt-6 inline-flex items-center gap-2 text-base font-medium"
              >
                <span className="mf-cta-underline">
                  Explore the interface system
                </span>
                <span aria-hidden="true" className="mf-arrow mf-accent">
                  ↗
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
            <div className="reveal min-w-0">
              <a
                href={CICLA_UI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mf-shotlink"
                aria-label="Open the Cicla Interface System Storybook (opens in a new tab)"
              >
                <img
                  src="/lab/cicla-interface-system.webp"
                  alt="The Cicla Interface System Storybook, open on its Overview page: a phase-tinted hero reading 'The interface behind Cicla', with Foundations, Components and Cicla Patterns in the sidebar"
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

      <Contact />
    </>
  )
}

export default Lab
