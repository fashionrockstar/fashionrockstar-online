# FASHIONROCKSTAR.ONLINE

Multi-page editorial portfolio using HTML, CSS and vanilla JavaScript. Netlify serves the repository root. The working branch is `development`; `main` is production.

## Home entry — September 23, 2026

At the owner's request, the SYSTEM ACCESS pre-home screen is removed. Visitors arrive directly on the existing HOME, without INITIALIZE, the entry sequence, its narration controls, or a session gate. The old `?system-access=1` query no longer starts an entry sequence.

`index.html` no longer loads the SYSTEM ACCESS stylesheet or script, and `assets/js/landing.js` no longer waits for that sequence. The existing HOME markup, logo video, navigation, social links, Braille links, reduced-motion behavior and other pages are preserved. The former entry's unused CSS/JavaScript and supplied audio file remain in the repository for reference; they are not loaded by HOME. Do not reintroduce this screen without a new explicit approval.

Development review uses the existing `development` branch preview at https://development--benevolent-nasturtium-1b8dd7.netlify.app. Do not merge or publish production until the preview is approved.

## Content

### Booking layout — October 8, 2026

`/booking/` uses an oversized BOOKING title and contact/social links beside a compact graphite form. Services, name, email and message are visible; company, timeline and budget remain available in the native “Add project details” disclosure. The existing Netlify field names, service preselection, multi-service submission, slide/click/keyboard send behavior, failure retry and sent confirmation are preserved. Mobile stacks the heading and form; reduced-motion settings disable the entrance animation.

Validated in Chromium at 320, 390, 768, 1024, 1440 and 1920 pixels, with local simulated success and failure responses, slider cancellation/completion, validation, optional-field serialization and no-JavaScript fallback. No live inquiry was sent. Review on the `development` preview before any production merge.

- Homepage: `index.html`, `assets/css/landing.css` and `assets/js/landing.js`.
- Entry: visitors arrive directly on HOME on all devices. SYSTEM ACCESS and the previous fingerprint gate are inactive.
- Portfolio: `work/index.html`; ten projects and their media are defined in `assets/js/projects-data.js`, rendered by `assets/js/projects.js`. Keep the gallery grid and project media order when replacing files. The September 15 import and pending owner-supplied metadata are documented in `docs/selected-work-import.md`.
- Profile: `about/index.html` and `assets/css/about.css`; the `/about/` address is unchanged.
- Services: `services/index.html`.
- Booking: `booking/index.html`, `assets/css/book.css` and `assets/js/booking.js`. `/booking/` is the canonical contact and project inquiry destination. Preserve the Netlify form name and field names.
- Legacy `/book/`, `/contact/` and `/inquiry/` addresses redirect to `/booking/`; static fallback pages preserve query strings and fragments when JavaScript is available.
- Booking services support multiple selections with JavaScript and submit one comma-separated `project-type` value to the existing Netlify form. Without JavaScript, native radios preserve required single-service validation.
- Magazine: `issue-01/index.html`.

## Confirmed social profiles

Confirmed by Zavyer on September 8, 2026. Use these exact destinations on Home.

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

## ABOUT rebuild — October 8, 2026

Rebuilt `/about/` as a shorter editorial introduction: the existing logo, a clear platform description, the existing Call Her Angelina photograph linked to its project, a founder biography, and an ISSUE 01 section with its current Coming Soon status. Copy is uppercase and uses the existing Neue Montreal/Inter UI font stack. The Neue Montreal webfont is still awaiting an owner-supplied file.

The previous sticky opening and scroll-driven paragraph sequence are removed, together with the unused `assets/js/about.js`. Content stays visible in normal document flow. Motion is limited to a brief logo entrance and hover feedback, with reduced-motion support. Navigation still uses the shared script; a no-JavaScript mobile fallback is scoped to ABOUT.

Checked in Chromium at 1440, 768, 390 and 320 pixels: no horizontal overflow, images loaded, no page errors, mobile menu and Escape, no-JavaScript navigation and reduced motion. All local links and image sources resolve. This update targets `development`; production approval remains separate.

## Selected Work mobile refinement — October 8, 2026

The owner's latest direction replaces the September always-visible mobile captions. Project titles now stay hidden until mouse hover, keyboard focus, or a first touch/pen tap. A second tap on that project opens it. Scrolling, tapping elsewhere, switching filters, Escape, resize and page restoration clear the touch preview. Links retain their accessible names and native keyboard/modified-click behaviour. Without JavaScript, project links still open normally.

The mobile Selected Work title now uses the desktop's proportional 13vw scale, with smaller discipline filters and project captions. Changes are scoped to Work; the gallery layout and desktop typography are retained. Checked in Chromium at 320, 390, 430, 768 and 1440 pixels, using the site's existing fonts, plus emulated touch preview/navigation, filter reset, scrolling, desktop hover and keyboard activation. No horizontal overflow or page errors. Production remains separate from this development update.

## Selected Work scroll titles — October 8, 2026

The owner's follow-up replaces the two-tap preview with automatic title reveals while scrolling on phone/touch layouts. Titles fade in when projects enter the viewport's reading area and fade out when they leave. Project links open with one tap again. The approved typography, gallery layout, desktop hover and keyboard focus are retained. The viewport observer refreshes after filtering, device-mode changes and back navigation; reduced motion uses the existing site-wide setting.

## Selected Work hover-like mobile browsing — October 8, 2026

The owner's clarification replaces the immediate viewport reveal. On touchscreens, titles start hidden and stay hidden during scrolling. After scrolling pauses for 240ms, only the project crossing the viewport centre receives the existing title fade. Movement hides it again. Filter changes, resize, page departure/restoration and device-mode changes reset the state. Native one-tap links, desktop hover, keyboard focus and approved typography/layout are retained. Verified in Chromium with touch emulation: clean arrival, delayed fade after pausing, continuous-scroll suppression, one visible title, one-tap navigation and clean back navigation.
