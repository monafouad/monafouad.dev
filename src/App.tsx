import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { ContactPanel } from './components/ContactPanel'
import { EMAIL, LINKEDIN_URL } from './content'
import About from './pages/About'
import Cicla from './pages/Cicla'
import GuidanceNote from './pages/GuidanceNote'
import HomeV2 from './pages/HomeV2'
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
  const { pathname } = useLocation()
  const [contactOpen, setContactOpen] = useState(false)
  /* The one-page portfolio home and its Cicla read-more page bring their
     own nav and footer, so the shared shell chrome is skipped for those
     routes. (/v2 only ever redirects to /.) */
  const isV2 =
    pathname === '/' || pathname === '/cicla' || pathname === '/v2'
  /* Pages that carry their own coordinated entrance (the home hero
     cascade, the Cicla/Lab openings) must not also run the route-level
     fade, or the two independent entrances read as a double start. */
  const ownEntrance = isV2 || pathname === '/lab'
  return (
    <div className="mf-page">
      <ScrollToTop />
      <Analytics />

      {/* NAV */}
      {!isV2 && (
      <nav className="mf-nav">
        <div className="mf-shell mf-nav-row">
          <Link to="/" className="mf-ink mf-nav-brand">
            Mona Fouad
          </Link>
          <div className="mf-nav-links">
            <Link to="/cicla" className="mf-textlink">
              Cicla
            </Link>
            <Link to="/lab" className="mf-textlink">
              Lab
            </Link>
            {/* Notes returns here once it has real content; the route stays
                live. */}
            <button
              type="button"
              className="mf-textlink mf-cta"
              aria-haspopup="dialog"
              onClick={() => setContactOpen(true)}
            >
              Get in touch
              <span aria-hidden="true" className="mf-arrow">
                →
              </span>
            </button>
          </div>
        </div>
      </nav>
      )}

      {!isV2 && (
        <ContactPanel
          open={contactOpen}
          onClose={() => setContactOpen(false)}
        />
      )}

      {/* Keyed by path: each page enters with a quiet fade-up. */}
      <div
        key={pathname}
        className={ownEntrance ? 'mf-route mf-route-own' : 'mf-route'}
      >
        <Routes>
          <Route path="/" element={<HomeV2 />} />
          <Route path="/v2" element={<Navigate to="/" replace />} />
          <Route path="/cicla" element={<Cicla />} />
          <Route path="/about" element={<About />} />
          <Route path="/notes" element={<Notes />} />
          <Route
            path="/notes/guidance-without-overclaiming"
            element={<GuidanceNote />}
          />
          <Route path="/lab" element={<Lab />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* FOOTER */}
      {!isV2 && (
      <footer className="mf-footer">
        <div className="mf-shell mf-footer-row">
          <span>Mona Fouad · Zürich</span>
          <span>
            Design engineering, interfaces, motion, and AI product
            development.
          </span>
          <span className="mf-footer-links">
            <a href={`mailto:${EMAIL}`} className="mf-textlink">
              Email
            </a>

            <a href={LINKEDIN_URL} className="mf-textlink">
              LinkedIn
            </a>
            <span className="mf-footer-year">© 2026</span>
          </span>
        </div>
      </footer>
      )}
    </div>
  )
}

export default App
