# FASHIONROCKSTAR.ONLINE

Multi-page editorial portfolio using HTML, CSS and vanilla JavaScript. Netlify serves the repository root. The working branch is `development`; `main` is production.

## SYSTEM ACCESS

The homepage now opens with a native HTML/CSS/JavaScript entry sequence, implemented in `assets/css/system-access.css` and `assets/js/system-access.js`. The existing HOME markup, media, navigation and other pages are retained. The small integration in `assets/js/landing.js` pauses the hero video behind the entry screen and resumes its existing behavior when entry completes.

- INITIALIZE is the only path that calls audio playback. The first ten seconds of the supplied WAV were converted to the 201 KB `assets/audio/FASHIONROCKSTAR_ACCESS_GRANTED.mp3`; no voice generation or replacement recording is used. The original WAV and full MP3 remain preserved locally. The audio element uses `preload="none"` and has no autoplay attribute.
- Normal motion: activation, per-character Braille reconstruction, short interference bursts, a silver scan, ACCESS GRANTED, one 70ms flash, black, then HOME at 10 seconds. Audio fades during the final black beat and stops when HOME opens. SKIP and Escape stop audio and enter HOME immediately.
- Reduced motion: no glyph corruption, light beam or flash. A quiet opacity change leads to ACCESS GRANTED and HOME in two seconds. Changes to the motion preference during playback also complete safely.
- A successful completion or dismissal stores `sessionStorage.frsrSystemAccess = 'granted'`. Following navigation or refreshing HOME in the same tab does not replay it. If session storage cannot be read or written, the normal entry fails open to HOME.
- Force a replay with `/?system-access=1`. This query parameter is consumed immediately, leaving the remaining query parameters and fragment intact; it cannot accidentally replay on refresh. A fresh browser session can show the entry again.
- INITIALIZE and SKIP are semantic buttons. Keyboard focus moves through the sequence to the existing MENU button; Escape is always available. There is no custom focus loop. Without JavaScript, HOME remains available.
- Phone composition uses `100dvh`, safe-area insets, a narrower light beam and fewer peripheral labels. No new dependencies or background video were added for the entry.

Development review is on the existing `development` branch / draft PR #2. Do not merge or publish production until the preview is approved.

## Content

- Homepage: `index.html`, `assets/css/landing.css` and `assets/js/landing.js`.
- Entry: SYSTEM ACCESS precedes HOME once per tab/session. The previous fingerprint gate remains removed. See the SYSTEM ACCESS notes below.
- Portfolio: `work/index.html`; ten projects and their media are defined in `assets/js/projects-data.js`, rendered by `assets/js/projects.js`. Keep the gallery grid and project media order when replacing files. The September 15 import and pending owner-supplied metadata are documented in `docs/selected-work-import.md`.
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

- Completed: removed the fingerprint entrance and its assets; the normal homepage opens directly, including with the old `?entrance=1` URL. Removed decorative arrow glyphs across Home, Work, Services, Contact, Project and Inquiries. Braille navigation, logo, homepage animation, nine-dot indicator, project media and page content remain intact.
- Selected Work: titles stay visible over every tile on phone-width and touch screens; desktop hover and keyboard focus still reveal titles. Tiles remain ordinary links that open a project with one activation. Smaller paired-tile captions and wrapping preserve readability.
- Preservation: the clean `ca800094` working copy, including Git history, was archived and verified before this pass. The concurrent `be3020a` development commit was merged without discarding its caption or symbol changes. Work continues on `development`; `rescue-2026-09-08` remains unchanged.
- Checked: Chrome at 1440px, 390px and 320px; desktop hover; all eleven mobile tile titles without clipping; one-touch project opening with touch emulation; Visuals and Beauty filters; eight HTML routes and 144 local references. Profile, Issue 01, inquiry form behavior, project data and media are unchanged. These browser checks do not replace a physical-device test. Confirm that the existing Netlify production deploy identifies the final `main` commit.
- Remaining: actual Netlify Forms receipt still needs an authorized submission; supplied-content items above remain open. Domain configuration is outside this pass.

## Contact motion — September 8, 2026

- Added a rising reveal for the existing CONTACT wordmark, staggered directory entrances, scroll-triggered booking/footer entrances and responsive underline/hover motion. The latest saved Contact design, copy, link destinations and artwork are preserved.
- Motion plays once as each section enters view. Reduced-motion preferences disable it, keyboard focus immediately exposes the focused section, and content stays available if JavaScript is unavailable.
- Work is based on the latest `development` layout (`f6e4017`), after a verified local archive. Keep `rescue-2026-09-08` unchanged. Unpublished work on other pages is separate from this Contact update.
- Checked: Chrome at 1440px and 320px, staggered entrance states, keyboard focus during the entrance, reduced-motion mode, unchanged Contact content/destinations, 149 local references and JavaScript syntax. This pass is saved as a development preview; production is not changed.
- Remaining: the existing form-delivery and supplied-content checks above.
