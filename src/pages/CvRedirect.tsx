import { useEffect } from 'react'

/**
 * Stable CV URL: /cv always points at the current PDF, so the handed-out
 * link never breaks when the file is updated.
 *
 * To update the CV: replace public/CV_Mona_Fouad_Design_Engineer.pdf,
 * keeping the same filename. If you rename it, update CV_FILE here and
 * the redirect in vercel.json to match.
 */
const CV_FILE = '/CV_Mona_Fouad_Design_Engineer.pdf'

function CvRedirect() {
  useEffect(() => {
    window.location.replace(CV_FILE)
  }, [])

  return (
    <section className="mf-section mf-section-slim">
      <p className="mf-muted mf-shell mf-cv-note">
        Opening the CV.{' '}
        <a href={CV_FILE} className="mf-link">
          Download directly
        </a>{' '}
        if nothing happens.
      </p>
    </section>
  )
}

export default CvRedirect
