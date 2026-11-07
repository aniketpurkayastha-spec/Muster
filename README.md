# Muster – Responsive Event Management Website (Bhubaneswar)

K Explore · Web Designing task. Browse upcoming campus events, search and filter them, view details and register.

**Live site:**https://github.com/aniketpurkayastha-spec
**Repo:** https://github.com/aniketpurkayastha-spec?tab=repositories

## Features
- Hero section with a live countdown to the next event
- Event cards with photo, date, venue, price and description (gradient fallback if an image fails to load)
- Search by name, venue or keyword + category filter chips
- Detail modal with registration form (name, email, phone, event)
- JavaScript validation with inline errors, duplicate check and confirmation message
- "My registrations" list saved in Local Storage, with cancel option
- End cards: about note, newsletter signup (validated) and contact cards (dummy phone, email, address)
- Dark / light mode (remembers choice, follows system default)
- Responsive: mobile, tablet, desktop (CSS Grid + media queries)
- Accessible basics: semantic HTML, native `<dialog>`, focus styles, reduced-motion support

## Tech
HTML5, CSS3 (variables, Grid, Flexbox), vanilla JavaScript. No build step.

## Run locally
Open `index.html` in a browser, or run `npx serve`.

## How it works
- `EVENTS` array in `script.js` is the data source. Add or edit events there.
- Registrations are stored under the `muster_regs` key in Local Storage.
- Validation rules live in the `rules` object: name (letters), email (pattern), phone (10-digit Indian mobile), event (required).
- Theme is a `data-theme` attribute on `<html>`; colours are CSS variables.

## Deploy
Push to GitHub, then connect the repo to Vercel/Netlify, or enable GitHub Pages (Settings → Pages → main branch).
