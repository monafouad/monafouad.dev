import { useEffect } from 'react'

// Reveal-on-scroll: lift + fade each .mf-reveal element in once it enters
// view. Call from every page component so newly mounted routes get observed.
export function useReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('.mf-reveal')
    )
    if (!('IntersectionObserver' in globalThis)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            obs.unobserve(e.target)
          }
        })
      },
      // Pre-trigger 12% below the fold at threshold 0: the fade starts
      // before the element is visible, so a section heading is never still
      // faded while readable. The old late threshold read as the beige
      // bands "clipping" their first line.
      { rootMargin: '0px 0px 12% 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
