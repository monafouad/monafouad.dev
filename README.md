# monafouad.com

Personal site / portfolio for Mona Fouad, design engineer.

Static site built with Vite + React + TypeScript + Tailwind v4, with
client-side routing via React Router.

- `/` : home (hero, about, Cicla teaser, contact)
- `/cicla` : Cicla case study (three decisions, design system, status)
- `/about` : the arc
- `/notes` : short essays; depth cut from the case study lives here
- `/lab` : experiments & pattern demos

`vercel.json` rewrites all paths to `index.html` so deep links like `/cicla`
resolve on Vercel.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

## Deploy to Vercel

1. Push this repo to GitHub: `gh repo create monafouad_site --source=. --private --push`
   (or create the repo manually and `git push -u origin main`).
2. Go to vercel.com → New Project → import the GitHub repo.
3. Vercel auto-detects Vite. Accept defaults. Deploy.
4. Add the custom domain in Vercel's project → Settings → Domains.

## Content edits

- **Email / links:** `src/content.ts`.
- **Positioning copy / availability:** `src/pages/Home.tsx`.
- **The three Cicla decisions:** the `decisions` array in `src/pages/Cicla.tsx`.
- **Screenshots:** replace the `bg-stone-200` placeholder divs with `<img>` tags
  pointing to images in `public/`.
- **Page title and meta description:** `index.html`.
