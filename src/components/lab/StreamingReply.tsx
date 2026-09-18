import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/* Token-by-token streaming without the usual failures: the reply grows
   inside its own fixed-height scroll region so the page never shifts;
   scroll anchoring is consent-based (pinned only while you are at the
   bottom, one scroll up disengages it); markdown renders mid-parse (an
   unclosed code fence is a code block from the moment it opens); Stop is
   honoured instantly and keeps the partial reply. The stream is canned
   and self-contained: no network, no model, no dependencies. */

const SCRIPT = `Streaming text is easy; streaming **interface** is the hard part. Three states nobody budgets for: the reader who scrolled up, the markdown that has not finished parsing, and the person who wants it to stop.

This demo pins to the bottom only while you are already there. Scroll up mid-stream and it lets go immediately; a **Jump to latest** chip waits instead of wrestling the scrollbar from you.

\`\`\`ts
// An unclosed fence must already BE a code block,
// not a paragraph that flips into one later.
const pinned = () =>
  el.scrollHeight - el.scrollTop - el.clientHeight < 4
el.addEventListener('scroll', () => {
  autoFollow = pinned()
})
\`\`\`

Notice the fence above rendered as code the moment it opened, while it was still incomplete. Layout never jumped: the region owns its own scrollbar, so the page around it never moves. And \`Stop\` keeps every token you already received.`

// Word-ish chunks with punctuation attached, streamed with jitter.
const CHUNKS = SCRIPT.match(/\S+\s*/g) ?? []

type Status = 'streaming' | 'stopped' | 'done'

function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  let rest = text
  let k = 0
  const marker = /\*\*(.+?)\*\*|`([^`]+)`/s
  while (rest.length > 0) {
    const m = marker.exec(rest)
    if (!m) {
      out.push(rest)
      break
    }
    if (m.index > 0) out.push(rest.slice(0, m.index))
    if (m[1] !== undefined) {
      out.push(<strong key={`${keyBase}-${k}`}>{m[1]}</strong>)
    } else {
      out.push(
        <code key={`${keyBase}-${k}`} className="mf-stream-icode">
          {m[2]}
        </code>
      )
    }
    k += 1
    rest = rest.slice(m.index + m[0].length)
  }
  return out
}

/**
 * Minimal incremental markdown: paragraphs, bold, inline code, fenced
 * code blocks. Unclosed markers stay literal text until their closer
 * arrives; an unclosed fence renders as an open code block immediately.
 */
function MarkdownStream({ text }: { readonly text: string }) {
  const parts = text.split('```')
  return (
    <>
      {parts.map((part, i) => {
        const key = `seg-${i}`
        if (i % 2 === 1) {
          const nl = part.indexOf('\n')
          const body = nl === -1 ? '' : part.slice(nl + 1)
          return (
            <pre key={key} className="mf-stream-code">
              <code>{body}</code>
            </pre>
          )
        }
        return part
          .split(/\n{2,}/)
          .filter((p) => p.trim().length > 0)
          .map((para, j) => (
            <p key={`${key}-${j}`}>{renderInline(para, `${key}-${j}`)}</p>
          ))
      })}
    </>
  )
}

export function StreamingReply({
  startInView = false,
}: {
  /** Begin streaming when the region enters the viewport instead of on
      mount, so the demo is seen from its first token. */
  readonly startInView?: boolean
} = {}) {
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState<Status>('streaming')
  const [armed, setArmed] = useState(!startInView)
  const [pinned, setPinned] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef(true)
  const autoScrollRef = useRef(false)
  const timerRef = useRef(0)

  const setPin = (value: boolean) => {
    pinnedRef.current = value
    setPinned(value)
  }

  const text = CHUNKS.slice(0, count).join('')

  // Arm on viewport entry when startInView is set.
  useEffect(() => {
    if (armed) return
    const el = scrollRef.current
    if (!el || !('IntersectionObserver' in globalThis)) {
      setArmed(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [armed])

  // Drive the stream: one chunk per tick with jitter, like a real model.
  useEffect(() => {
    if (!armed || status !== 'streaming' || count >= CHUNKS.length) return
    timerRef.current = window.setTimeout(() => {
      const next = count + 1
      setCount(next)
      if (next >= CHUNKS.length) setStatus('done')
    }, 30 + Math.random() * 80)
    return () => window.clearTimeout(timerRef.current)
  }, [armed, count, status])

  // Follow the stream only while the reader is at the bottom.
  useEffect(() => {
    const el = scrollRef.current
    if (el && pinnedRef.current) {
      autoScrollRef.current = true
      el.scrollTop = el.scrollHeight
    }
  }, [text])

  /* Unpinning is INTENT-based, not scroll-event-based: a wheel-up, a
     touch drag, or a scroll key disengages auto-follow immediately,
     before any scroll event can race the next chunk's auto-scroll.
     The scroll event only re-pins when the reader reaches the bottom
     again (and ignores our own programmatic scrolls via the flag). */
  const unpin = () => {
    if (pinnedRef.current) setPin(false)
  }

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    if (autoScrollRef.current) {
      autoScrollRef.current = false
      return
    }
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 4
    if (atBottom !== pinnedRef.current) setPin(atBottom)
  }

  const onRegionKeyDown = (e: React.KeyboardEvent) => {
    if (['ArrowUp', 'PageUp', 'Home'].includes(e.key)) unpin()
  }

  const jumpToLatest = () => {
    const el = scrollRef.current
    if (!el) return
    setPin(true)
    autoScrollRef.current = true
    el.scrollTop = el.scrollHeight
  }

  const stop = () => {
    window.clearTimeout(timerRef.current)
    setStatus('stopped')
  }

  const replay = () => {
    window.clearTimeout(timerRef.current)
    setCount(0)
    pinnedRef.current = true
    setPinned(true)
    setStatus('streaming')
  }

  return (
    <div className="mf-stream">
      <div className="mf-stream-frame">
        <div
          ref={scrollRef}
          className="mf-stream-scroll"
          onScroll={onScroll}
          onWheel={(e) => {
            if (e.deltaY < 0) unpin()
          }}
          onTouchMove={unpin}
          onKeyDown={onRegionKeyDown}
          tabIndex={0}
          role="log"
          aria-label="Streaming reply, sample content"
        >
          <MarkdownStream text={text} />
          {status === 'streaming' && (
            <span className="mf-stream-caret" aria-hidden="true" />
          )}
          {status === 'stopped' && (
            <p className="mf-stream-note">Stopped. Partial reply kept.</p>
          )}
        </div>
        {!pinned && (
          <button
            type="button"
            className="mf-lab-chip mf-stream-jump"
            onClick={jumpToLatest}
          >
            Jump to latest ↓
          </button>
        )}
      </div>
      <div className="mf-stream-controls">
        <button type="button" className="mf-lab-chip" onClick={replay}>
          Replay
        </button>
        <button
          type="button"
          className="mf-lab-chip"
          onClick={stop}
          disabled={status !== 'streaming'}
        >
          Stop
        </button>
        <span className="mf-dim mf-hint" role="status" aria-live="polite">
          {status === 'streaming'
            ? 'Streaming, canned sample, simulated timing'
            : status === 'stopped'
              ? 'Stopped by you; partial reply kept'
              : 'Done'}
        </span>
      </div>
    </div>
  )
}
