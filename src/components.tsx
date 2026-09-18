import { EMAIL, LINKEDIN_URL } from './content'

export function Meta({
  label,
  value,
}: {
  readonly label: string
  readonly value: string
}) {
  return (
    <div>
      <dt className="mf-label mf-label-dim mf-meta-label">{label}</dt>
      <dd className="mf-meta-value">{value}</dd>
    </div>
  )
}

export function Contact() {
  return (
    <section className="mf-section mf-section-cta">
      <div className="mf-reveal mf-stagger mf-shell-tight mf-center">
        <h2 className="mf-h2 mf-title-display">
          Get in touch
        </h2>
        <div className="mf-contact-actions">
          <a href={`mailto:${EMAIL}`} className="mf-pill mf-pill-dark">
            {EMAIL}
          </a>
          <a
            href={LINKEDIN_URL}
            className="mf-pill mf-pill-outline mf-cta"
          >
            LinkedIn
            <span aria-hidden="true" className="mf-arrow">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
