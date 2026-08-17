import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { EMAIL, LINKEDIN_URL } from './content'
import About from './pages/About'
import Cicla from './pages/Cicla'
import GuidanceNote from './pages/GuidanceNote'
import Home from './pages/Home'
import Lab from './pages/Lab'
import Notes from './pages/Notes'

// Reset scroll when navigating between pages (browser back/forward keeps its
// own restoration behaviour).
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <div className="mf-page min-h-screen antialiased">
      <ScrollToTop />

      {/* NAV */}
      <nav className="px-6 pt-8 sm:px-10 sm:pt-9">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <Link to="/" className="mf-ink text-sm font-medium tracking-tight">
            Mona Fouad
          </Link>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link to="/cicla" className="mf-textlink">
              Cicla
            </Link>
            <Link to="/lab" className="mf-textlink">
              Lab
            </Link>
            {/* Notes returns here once it has real content; the route stays
                live. */}
            <a
              href={`mailto:${EMAIL}`}
              className="mf-textlink group inline-flex items-center gap-2"
            >
              Get in touch
              <span aria-hidden="true" className="mf-arrow">
                →
              </span>
            </a>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cicla" element={<Cicla />} />
        <Route path="/about" element={<About />} />
        <Route path="/notes" element={<Notes />} />
        <Route
          path="/notes/guidance-without-overclaiming"
          element={<GuidanceNote />}
        />
        <Route path="/lab" element={<Lab />} />
        <Route path="*" element={<Home />} />
      </Routes>

      {/* FOOTER */}
      <footer className="mf-hairline border-t px-6 py-10 sm:px-10">
        <div className="mf-dim mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-3 text-xs">
          <span>Mona Fouad · Zürich / remote EU</span>
          <span>Open to design engineer &amp; AI product engineer roles</span>
          <span className="flex items-center gap-5">
            <a href={`mailto:${EMAIL}`} className="mf-textlink">
              Email
            </a>
            <a href={LINKEDIN_URL} className="mf-textlink">
              LinkedIn
            </a>
            <span className="tabular-nums">© 2026</span>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App
