# FASHIONROCKSTAR.ONLINE

Multi-page editorial portfolio using HTML, CSS and vanilla JavaScript. Netlify serves the repository root. The working branch is `development`; `main` is production.

## Content

- Homepage: `index.html`, `assets/css/landing.css` and `assets/js/landing.js`.
- Mobile entrance: `assets/css/entrance.css` and `assets/js/entrance.js`. A decorative fingerprint hold with gesture-triggered sound; no biometric data is read. It appears once per session on phones. Use `/?entrance=1` to replay it for review. Enter site, Escape and assistive activation also dismiss it.
- Portfolio: `work/index.html`; five real projects and their media are defined in `assets/js/main.js`. Keep the gallery grid and project media order when replacing files.
- About: `about/index.html` and `assets/css/about.css`.
- Services: `services/index.html`; service fragments also link from Contact.
- Contact: `contact/index.html` and `assets/css/contact.css`.
- Booking: `book/index.html` and `assets/js/booking.js`. Preserve the Netlify form name and field names.
- Magazine: `issue-01/index.html`.

## Remaining supplied content

- Confirmed Instagram, LinkedIn and TikTok profile URLs. Replace the disabled social labels on Home and Contact with links; do not guess usernames.
- Original logo source for higher-resolution export. Existing logo assets remain in use.
- Neue Montreal Bold webfont. Interface labels use weight 700 with Inter as the current web fallback; a local installation of the requested face is supported. Add the provided webfont to the font-face rule once available.
- Additional Cargo project originals. The existing five real projects work; sample projects and stock detail galleries are excluded from navigation.
- Confirm ISSUE 01 availability and supply its final purchase or download destination before changing Coming Soon.

## Validation

Serve the repository root with a static server for local development. Validate internal routes, fragment links and asset references, then run `node --check` on changed JavaScript. The booking form requires Netlify Forms to receive submissions; a local static server cannot verify delivery. Do not send a test inquiry without explicit authorization.

The September 8 completion pass checked all eight HTML routes and 151 local references, JavaScript syntax, fingerprint hold/cancel/skip/mute behavior, session and blocked-storage behavior, and all five projects' previous/next links. These are source and simulated interaction checks, not a physical-phone or browser visual test.
