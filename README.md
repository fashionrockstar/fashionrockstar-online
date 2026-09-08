# FASHIONROCKSTAR.ONLINE

Multi-page editorial portfolio using HTML, CSS and vanilla JavaScript. Netlify serves the repository root. The working branch is `development`; `main` is production.

## Content

- Homepage: `index.html`, `assets/css/landing.css` and `assets/js/landing.js`.
- Entry: visitors arrive directly on the normal homepage on all devices; the fingerprint gate and its sound effect have been removed.
- Portfolio: `work/index.html`; five real projects and their media are defined in `assets/js/main.js`. Keep the gallery grid and project media order when replacing files.
- Profile: `about/index.html` and `assets/css/about.css`; the `/about/` address is unchanged.
- Services: `services/index.html`.
- Contact: `contact/index.html` and `assets/css/contact.css`.
- Project inquiries: `book/index.html` and `assets/js/booking.js`. Preserve the `/book/` address, Netlify form name and field names.
- Magazine: `issue-01/index.html`.

## Confirmed social profiles

Confirmed by Zavyer on September 8, 2026. Use these exact destinations on Home and Contact.

| Profile | URL |
| --- | --- |
| Instagram | https://www.instagram.com/fashionrockstar.online/ |
| LinkedIn | https://www.linkedin.com/in/zavyer-v%C3%A9giard-068680172/ |
| TikTok | https://www.tiktok.com/@fashionrockstar.online |

## Remaining supplied content

- Original logo source for higher-resolution export. Existing logo assets remain in use.
- Neue Montreal Bold webfont. Interface labels use weight 700 with Inter as the current web fallback; a local installation of the requested face is supported. Add the provided webfont to the font-face rule once available.
- Additional Cargo project originals. The existing five real projects work; sample projects and stock detail galleries are excluded from navigation.
- Confirm ISSUE 01 availability and supply its final purchase or download destination before changing Coming Soon.

## Validation

Serve the repository root with a static server for local development. Validate internal routes, fragment links and asset references, then run `node --check` on changed JavaScript. The booking form requires Netlify Forms to receive submissions; a local static server cannot verify delivery. Do not send a test inquiry without explicit authorization.

The September 8 completion pass checked all eight HTML routes and 151 local references, JavaScript syntax, fingerprint hold/cancel/skip/mute behavior, session and blocked-storage behavior, and all five projects' previous/next links. These are source and simulated interaction checks, not a physical-phone or browser visual test.

## Resume note — September 8, 2026

- Completed: PROFILE labels at `/about/`; INQUIRIES links, accessible names and decorative Braille; PROJECT INQUIRIES heading and SEND INQUIRY submit/retry labels at `/book/`; Contact simplified into two desktop columns and one phone column, retaining email, project inquiries, the three confirmed social links and Montreal. The services list was removed from Contact.
- Preservation: ten local copies, including Git history and uncommitted/untracked files, were archived and verified before synchronization. Original working folders remain intact. The isolated working copy retains the older local commit `d7476bf` on `preserved-local-d7476bf`; the newer shared baseline is `037f8864`. Do not alter `rescue-2026-09-08`, reset destructively or force-push.
- Checked: browser layouts at desktop and phone widths; navigation; required fields and invalid email; local simulated success/error responses, retained form values and SEND INQUIRY after retry or edit. Local tests do not prove delivery through Netlify Forms.
- Remaining: confirm actual inquiry receipt in Netlify Forms with an authorized submission, connect/verify the custom domain separately, and supply the remaining content listed above. Keep using the existing Netlify site; its production deployment must identify the final `main` commit before publication is reported as verified.

## Mobile cleanup — September 8, 2026

- Completed: removed the fingerprint entrance and its assets; the normal homepage opens directly, including with the old `?entrance=1` URL. Removed decorative emoji-capable diagonal arrows across the site. Braille navigation, logo, homepage animation, nine-dot indicator, project media and page content remain intact.
- Selected Work: titles stay visible over every tile on phone-width and touch screens; desktop hover and keyboard focus still reveal titles. Tiles remain ordinary links that open a project with one activation.
- Preservation: the clean `ca800094` working copy, including Git history, was archived and verified before this pass. Work continues on `development`; `rescue-2026-09-08` remains unchanged.
- Checked: Chrome at 1440px, 390px and 320px; desktop hover; all eleven mobile tile titles without clipping; one-touch project opening with touch emulation; Visuals and Beauty filters; eight HTML routes and 144 local references. Profile, Issue 01, inquiry form, project data and media are unchanged. These browser checks do not replace a physical-device test. Confirm that the existing Netlify production deploy identifies the final `main` commit.
- Remaining: actual Netlify Forms receipt still needs an authorized submission; supplied-content items above remain open. Domain configuration is outside this pass.
