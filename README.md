# FASHIONROCKSTAR.ONLINE

Multi-page editorial portfolio using HTML, CSS and vanilla JavaScript. Netlify serves the repository root. The working branch is `development`; `main` is production.

## SYSTEM ACCESS

The homepage now opens with a native HTML/CSS/JavaScript entry sequence, implemented in `assets/css/system-access.css` and `assets/js/system-access.js`. The existing HOME markup, media, navigation and other pages are retained. The small integration in `assets/js/landing.js` pauses the hero video behind the entry screen and resumes its existing behavior when entry completes.

- INITIALIZE calls `play()` directly within the user gesture. The complete supplied recording is served as `assets/audio/FASHIONROCKSTAR_ACCESS_GRANTED.mp3` (147.757 seconds, 1,773,967 bytes, mono MP3 at 96 kbps). No trimming, fades, voice generation or replacement speech are applied. The original WAV and a higher-bitrate MP3 remain preserved locally. The audio element uses `preload="none"` and has no autoplay attribute.
- One persistent audio element lives directly under the document body, outside the entry layer. Automatic entry to HOME, SKIP and Escape dismiss only the visuals: none pause, restart, seek or change the recording's volume. A separate MUTE/UNMUTE control remains available until the recording naturally finishes; muting preserves its timeline.
- The central signal field concentrates five displaced image/data slices, two horizontal smears and temporary signal bands within a 54vw × 44vh region (94vw on phones). Beam position drives corruption, exposure and broken silver reflections together. Displacement reaches 88px on desktop and 43px on phones; smears reach four times their original width. The official identity stays small and stationary between bursts. All motion is native DOM/CSS/JavaScript; there is no canvas, new dependency, or video background.
- Normal timing after INITIALIZE: near-black until 0.6 s; a minor tear at 1.8 s; independently resolving Braille/data and irregular corruption bursts at 2.4–3.4 s; clean signal until the primary scan at 4–6.3 s. A 400 ms overload at 5.02–5.42 s contains two hard signal cuts and local exposure spikes, then restores the identity immediately. Black at 6.5 s precedes ACCESS GRANTED at 6.8 s. Its scan approaches at 7 s, reaches center at 8.35 s and expands into one full white flash at 8.7–8.82 s. A 280 ms pure-black hold ends with the hard HOME reveal at 9.1 s. Early visuals follow `audio.currentTime` within 100 ms of the wall clock; the terminal sequence uses its own wall-clock timing so audio buffering cannot extend the intro.
- The exact existing transparent `assets/images/hero-logo-white.png` asset is used at its original proportions. Desktop identity width is `clamp(260px, 25vw, 440px)`; mobile is `74vw`. It never grows during the sequence. A CSS cover replaces only the asset's embedded Braille region with live DOM data; the cover was verified to touch zero letter pixels. The underlying image is unchanged. A vector or larger official source remains preferable for unusually dense displays.
- Interface labels inherit the site's existing `--font-ui`, weight and sizing system. Per the owner's instruction, the existing Neue Montreal / Inter / Helvetica Neue / Arial fallback remains unchanged until licensed webfont files are supplied. No substitute font files are added or downloaded.
- Reduced motion: no reconstruction cycling, light beam, slices, texture or flash. A static identity leads to ACCESS GRANTED and HOME in two seconds while the full recording continues. Changes to the motion preference during playback also complete safely.
- A successful completion or dismissal stores `sessionStorage.frsrSystemAccess = 'granted'`. Following navigation or refreshing HOME in the same tab does not replay it. If session storage cannot be read or written, the normal entry fails open to HOME.
- Force a replay with `/?system-access=1`. This query parameter is consumed immediately, leaving the remaining query parameters and fragment intact; it cannot accidentally replay on refresh. A fresh browser session can show the entry again.
- INITIALIZE, SKIP and MUTE/UNMUTE are semantic buttons. Keyboard focus moves through the sequence to the existing MENU button; Escape is always available. There is no custom focus loop. Without JavaScript, HOME remains available.
- This is a multi-page site, not an SPA. The SYSTEM ACCESS to HOME transition reveals the existing document without navigation and preserves playback. Opening a different page unloads that document and ends playback; returning to HOME never restarts narration. Existing routes and navigation are retained.
- Phone composition uses `100dvh`, safe-area insets, centered minimal metadata, smaller corruption offsets, a narrower light beam and a two-line ACCESS / GRANTED frame. No new dependencies or background video were added for the entry.
- The supplied 7.072-second Higgsfield render is the primary visual reference for the concentrated horizontal damage, broken metallic scanning light and clean-to-overload rhythm. The native sequence follows the owner's interactive timing; the video is not embedded or served as a background.

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
