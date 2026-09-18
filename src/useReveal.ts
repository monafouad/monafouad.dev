import { useEffect } from 'react'

/* Reveal-on-scroll, visible by default.
   Content renders visible; this hook only hides an element (by setting
   data-reveal="pending") when an IntersectionObserver is available AND
   the element starts below the fold. The observer flips it to "in" as
   it approaches. Two failsafes guarantee nothing can stay invisible:
   a working observer reports every observed element at least once
   (immediately, intersecting or not), so anything unreported shortly
   after arming is revealed; and every armed element is revealed
   unconditionally after a few seconds. Elements this hook never saw
   (added later, e.g. by hot reload) are simply never hidden. */
export function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in globalThis)) return
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('.mf-reveal')
    )
    const seen = new WeakSet<Element>()
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          seen.add(e.target)
          if (e.isIntersecting) {
            e.target.setAttribute('data-reveal', 'in')
            obs.unobserve(e.target)
          }
        })
      },
      // Pre-trigger 12% below the fold at threshold 0: the fade starts
      // before the element is visible, so a section heading is never
      // still faded while readable.
      { rootMargin: '0px 0px 12% 0px', threshold: 0 }
    )
    const armed: HTMLElement[] = []
    els.forEach((el) => {
      if (el.getAttribute('data-reveal') === 'in') return
      const belowFold = el.getBoundingClientRect().top > window.innerHeight
      if (belowFold || el.getAttribute('data-reveal') === 'pending') {
        el.setAttribute('data-reveal', 'pending')
        armed.push(el)
        io.observe(el)
      }
    })
    const reveal = (el: HTMLElement) => el.setAttribute('data-reveal', 'in')
    // Failsafe 1: unreported after 1.5s means unobserved; unhide.
    const unreported = window.setTimeout(() => {
      armed.forEach((el) => {
        if (!seen.has(el)) reveal(el)
      })
    }, 1500)
    // Failsafe 2: nothing stays hidden past a few seconds, period.
    const deadline = window.setTimeout(() => {
      armed.forEach(reveal)
      io.disconnect()
    }, 3000)
    return () => {
      window.clearTimeout(unreported)
      window.clearTimeout(deadline)
      io.disconnect()
    }
  }, [])
}
