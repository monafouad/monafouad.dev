export const EMAIL = 'fouad.mona@gmail.com'
export const CICLA_URL = 'https://cicla.app'
export const CICLA_UI_URL = 'https://ui.monafouad.dev'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/mona-fouad-frontend'

/* /v2 experience rows. url: company site (TODO(mona): verify these
   guessed domains). preview: drop an image into /public/experience/
   and set image (plus optional imageUrl and caption) to activate the
   hover preview; rows without an image render plain. */
export interface ExperiencePreview {
  url?: string
  image?: string
  imageUrl?: string
  caption?: string
}
export const EXPERIENCE_LINKS: Record<string, ExperiencePreview> = {
  phoeniqs: { url: 'https://phoeniqs.com' },
  whitehatgaming: { url: 'https://whitehatgaming.com' },
  delectatech: { url: 'https://delectatech.com' },
  suntransfers: { url: 'https://www.suntransfers.com' },
  lastminute: { url: 'https://www.lastminute.com' },
}
