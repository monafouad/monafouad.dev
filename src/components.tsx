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
      <dt className="mf-label mf-label-dim mb-1.5">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}

export function Contact() {
  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28">
      <div className="reveal mx-auto max-w-3xl text-center">
        <p className="mf-eyebrow">Let&rsquo;s talk</p>
        <h2 className="mf-h2 mt-8 text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
          Building something that could use a{' '}
          <em className="mf-em">design engineer</em>?
        </h2>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${EMAIL}`}
            className="mf-pill-dark rounded-full px-7 py-3.5 text-sm font-medium"
          >
            {EMAIL}
          </a>
          <a
            href={LINKEDIN_URL}
            className="mf-pill-outline group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium"
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
