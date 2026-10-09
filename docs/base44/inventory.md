# Content, route and behavior preservation inventory

This inventory describes the immutable source baseline `b390752bb52c1a93d9f2cf0ac2c9b2abee6e35ad`. It distinguishes existing data from the intentional visual refinements. The full original copy, URLs, media arrays, form attributes and SHA-256 records are preserved in [baseline-inventory.json](baseline-inventory.json) and [baseline-preservation.json](baseline-preservation.json).

## Routes

| Surface | Canonical route | Preserve |
| --- | --- | --- |
| Home | `/` | First entry, hero film/WebP loop, lower route navigation, Braille and social links. |
| Selected Work | `/work/` | All 16 tiles, order, full artwork, covers, filters and caption interactions. |
| Project | `/project/?id=<slug>` | Recorded title, role, year, credits, covers, gallery and wraparound navigation. |
| Services | `/services/` | Five native disclosures, all copy/stages/scope, hash navigation and inquiry links. |
| Booking | `/booking/` | Existing Netlify form, field names, values, validation and submission contract. |
| About | `/about/` | Existing platform/founder/publication words, portrait, caption and CTAs. |
| Issue 01 | `/issue-01/` | `Issue 01`, `Digital + Print`, `Coming Soon`. |

Legacy `/book/`, `/contact/` and `/inquiry/` lead to `/booking/`. Client fallback replaces the URL while preserving query/hash; Netlify configuration provides permanent 301 redirects. Unknown or numeric project IDs currently redirect to Work. Mockup routes remain outside active navigation.

The documented intentional link repair changes only About’s Call Her Angelina portrait target from retired `/project/?id=13` to `/project/?id=call-her-angelina`. Preserve all other contextual destinations.

## All 16 projects, in exact order

The Work tile order matches catalogue order. Previous/Next wraps through this same sequence. Display titles below are the exact Work captions; project-page titles and all role/credit metadata are separately recorded in the JSON.

| Order | Exact Work title | Project ID | Gallery source / rendered |
| --- | --- | --- | --- |
| 1 | FASHIONROCKSTAR X BROKENHEART RUNWAY [M.A.D 26] | `brokenheart-runway-mad-2026` | 7 / 7 |
| 2 | FASHIONROCKSTAR X BROKENHEART [CAMPAIGN] | `brokenheart-campaign` | 0 / 0 |
| 3 | MANSAWORLD | `mansaworld` | 14 / 14 |
| 4 | FASHIONROCKSTARMAXXING | `fashionrockstarmaxxing` | 3 / 3 |
| 5 | KAINE BASQUIAT [MONTREALITY X MURAL 26] | `kaine-basquiat-mural-2026` | 8 / 8 |
| 6 | MICAELA GOMES [M.A.D 2026] | `micaela-gomes-mad-2026` | 4 / 4 |
| 7 | #LEE'S BROKEN DOLLS | `lees-broken-dolls` | 5 / 4 |
| 8 | CALL HER ANGELINA | `call-her-angelina` | 6 / 6 |
| 9 | FRANCK FOR ANTI-BEAUTY ISSUE 01 | `franck-anti-beauty-2026` | 2 / 1 |
| 10 | #SAD PRINCESS | `sad-princess` | 3 / 1 |
| 11 | BLUE | `blue` | 4 / 4 |
| 12 | "2016" — SAINT JOU | `saint-jou-2016` | 10 / 10 |
| 13 | LUCAS FOR FASHIONROCKSTAR ISSUE 01 | `lucas-issue-01-2025` | 5 / 4 |
| 14 | BROKENHEART FOR FASHIONROCKSTAR ISSUE 01 | `brokenheart-issue-01-2025` | 20 / 19 |
| 15 | IN GOD I TRUST | `in-god-i-trust` | 3 / 2 |
| 16 | OUISSAM | `ouissam` | 6 / 4 |

Each ID resolves at `/project/?id=<id>`. Preserve the exact Work discipline string, details caption, accessible image/link descriptions, cover/paired-cover ordering, responsive variants, videos and full embedded artwork.

| Project ID | Recorded project role | Recorded year |
| --- | --- | --- |
| `brokenheart-runway-mad-2026` | CREATIVE DIRECTOR – LEAD STYLIST | 2026 |
| `brokenheart-campaign` | (empty; unconfirmed) | (empty; unconfirmed) |
| `mansaworld` | PHOTOGRAPHY - CREATIVE DIRECTION | 2026 |
| `fashionrockstarmaxxing` | PHOTOGRAPHY – CREATIVE DIRECTION – STYLING | 2026 |
| `kaine-basquiat-mural-2026` | CREATIVE DIRECTION AND MAKEUP | 2026 |
| `micaela-gomes-mad-2026` | PHOTOGRAPHY - CREATIVE DIRECTION - SET DESIGN | 2026 |
| `lees-broken-dolls` | CREATIVE DIRECTION / PHOTOGRAPHY | 2026 |
| `call-her-angelina` | PHOTOGRAPHY / CREATIVE DIRECTION | (empty; unconfirmed) |
| `franck-anti-beauty-2026` | CREATIVE DIRECTION / PHOTOGRAPHY / BEAUTY | 2026 |
| `sad-princess` | CREATIVE DIRECTION / PHOTOGRAPHY | 2026 |
| `blue` | PHOTOGRAPHY – CREATIVE DIRECTION – SET DESIGN – STYLING | 2025 |
| `saint-jou-2016` | CREATIVE DIRECTION — VIDEOGRAPHY | 2025 |
| `lucas-issue-01-2025` | CREATIVE DIRECTION / PHOTOGRAPHY / STYLING | 2025 |
| `brokenheart-issue-01-2025` | CREATIVE DIRECTION / PHOTOGRAPHY / STYLING | 2025 |
| `in-god-i-trust` | CREATIVE DIRECTION / PHOTOGRAPHY / STYLING | 2025 |
| `ouissam` | CREATIVE DIRECTION / PHOTOGRAPHY | 2025 |

Do not interpret “2016” in the Saint Jou title as its shoot year: its recorded year is 2025. Brokenheart Campaign year, role and collaborator credits need confirmation; Fashionrockstarmaxxing has provisional cover metadata; Call Her Angelina has no confirmed shoot date; Ouissam gallery ordering remains explicitly unconfirmed. Existing pending flags and confirmation fields must remain intact.

## Work filters and galleries

Work’s visible filter order is All, Creative Direction, Styling, Visuals, Beauty. Exact query values are `all`, `creative-direction`, `styling`, `photography`, `beauty`. “Visuals” is the Work toolbar label for `photography`; shared navigation calls it Photography. Hidden empty rows stay hidden. Brokenheart Campaign intentionally has no assigned discipline and appears under All only. Videography’s Services related-work link intentionally points to unfiltered `/work/`.

Keep existing metadata visibility on hover, keyboard focus and touch browsing pause. The touch caption scroll-pause timing is 240ms. Preserve each card’s link and its entire natural image/video composition; do not crop or rearrange artwork to make a new grid.

The source gallery arrays contain 100 items and the existing renderer presents 91. Hero assets, including responsive equivalents, are intentionally excluded from the rendered gallery. Existing deduplications are Lee’s Broken Dolls 5→4, Franck 2→1, Sad Princess 3→1, Lucas 5→4, Brokenheart Issue 01 20→19, In God I Trust 3→2 and Ouissam 6→4. This is baseline behavior, not deletion during refinement. The JSON stores `gallery`, `headerCoverOrder` and `renderedGalleryOrder` separately.

Preserve native video controls, existing autoplay/muted/loop/inline cover behavior, audio handling, posters, lazy loading, source dimensions and social embeds. Some supplied landscape files contain sideways images; do not rotate or reinterpret them.

## Media and content

The baseline contains 496 committed media/image/video/font/icon assets totaling 208,171,307 bytes. Every audited source and asset file is individually SHA-256 recorded. Keep all media binaries unchanged. The JSON provides original file paths, responsive source sets, poster paths, alternative text, source file provenance and gallery order; it is the exact media list for this handoff.

About keeps the complete platform introduction, founder biography, Montréal location, publication copy, Call Her Angelina portrait/responsive media and caption, Explore the Work / Discover Issue 01 / Book Now / Back to Top destinations. Its existing light publication band contrasts with the dark page. Do not add founder facts or replace the portrait.

Issue 01 has only `Issue 01`, `Digital + Print`, `Coming Soon`. There is no approved release date, artwork, shop, preorder or new editorial copy. Preserve those words and their meaning.

Home keeps the original wordmark, Braille motif, first-entry treatment and hero loop. Preserve accessible English labels and the three social targets:

- Instagram: `https://www.instagram.com/fashionrockstar.online/`
- LinkedIn: `https://www.linkedin.com/in/zavyer-v%C3%A9giard-068680172/`
- TikTok: `https://www.tiktok.com/@fashionrockstar.online`

## Services

Each native disclosure has `name="services"`. JavaScript keeps one open, supports hash deep linking, recognizes `#visuals` → photography and `#video` → videography, updates the fragment on open/close and keeps newly opened content discoverable in the viewport. Each service retains its Overview, four numbered process stages and Project Scope paragraphs verbatim.

| Order / service | Four exact stage headings | Related-work target | Inquiry target |
| --- | --- | --- | --- |
| 1 / CREATIVE DIRECTION | 01 CONCEPT; 02 DEVELOPMENT; 03 EXECUTION; 04 POST-PRODUCTION | `/work/?filter=creative-direction` | `/booking/?service=creative-direction` |
| 2 / PHOTOGRAPHY | 01 STORYTELLING; 02 LIGHT; 03 IMAGE-MAKING; 04 POST-PRODUCTION | `/work/?filter=photography` | `/booking/?service=photography` |
| 3 / VIDEOGRAPHY | 01 NARRATIVE; 02 LIGHT + MOVEMENT; 03 FILMING; 04 EDITING + FINAL TREATMENT | `/work/` | `/booking/?service=videography` |
| 4 / STYLING | 01 DIRECTION; 02 LOOK DEVELOPMENT; 03 SOURCING + FITTINGS; 04 ON SET | `/work/?filter=styling` | `/booking/?service=styling` |
| 5 / BEAUTY | 01 DIRECTION; 02 LOOK DEVELOPMENT; 03 IMAGE + LIGHT; 04 ON SET | `/work/?filter=beauty` | `/booking/?service=beauty` |

The closing CTA leads to `/booking/`. Owner-selected Services images are pending; none currently exist on this page. Preserve exact source text and link labels from the JSON while solving readability with typography and layout.

## Booking: exact form contract

The form remains `name="booking"`, `method="post"`, `action="/booking/"`, `data-netlify="true"`, `data-netlify-honeypot="company-website"`. The hidden `form-name` value remains `booking`. The honeypot `company-website` stays a text field with `tabindex="-1"` and `autocomplete="off"`.

| Field name | Native type / attributes | Required / behavior |
| --- | --- | --- |
| `project-type` | Native radios; five exact service values below. | First native radio is required. With JS all five become checkboxes; at least one is required via custom validity. |
| `name` | Text; `autocomplete=name`. | Required. |
| `email` | Email; `inputmode=email`; `autocomplete=email`. | Required. |
| `project-details` | Textarea; `maxlength=3000`. | Required. |
| `company` | Text; `autocomplete=organization`. | Optional disclosure. |
| `timeline` | Text. | Optional disclosure. |
| `budget` | Select; exact options below. | Optional disclosure. |

Exact service order/values: Creative Direction `creative-direction`, Photography `photography`, Videography `videography`, Styling `styling`, Beauty `beauty`. `?service=<exact-value>` checks its matching option. Do not rename values or add a category.

| Budget value | Exact option text |
| --- | --- |
| `` | SELECT RANGE |
| `under-1000` | UNDER $1,000 CAD |
| `1000-3000` | $1,000–$3,000 CAD |
| `3000-7500` | $3,000–$7,500 CAD |
| `7500-plus` | $7,500+ CAD |
| `discuss` | TO BE DISCUSSED |

JavaScript collects all selected `project-type` values, joins them with commas into one field, encodes `URLSearchParams(formData)` and sends `fetch` POST `/booking/` with `application/x-www-form-urlencoded`. Timeout is 20 seconds through AbortController.

Pending and received guards prevent duplicate submissions. Fields and the button are disabled during a pending request. Success requires `response.ok` and a same-origin response URL; then project fields hide and the confirmation receives focus. A received submission cannot be resubmitted. Failure or timeout focuses the live status, restores the original disabled states and submit button, and permits retry. Preserve the failure text `SUBMISSION FAILED — PLEASE TRY AGAIN.`

Exact confirmation copy:

- `REQUEST STATUS / RECEIVED`
- `INQUIRY RECEIVED.`
- `YOUR REQUEST HAS BEEN SENT. A BOOKING IS CONFIRMED SEPARATELY.`

The optional disclosure remains `ADD PROJECT DETAILS OPTIONAL`; service and project sections retain their existing labels. All remaining label/placeholder text, IDs and attributes are recorded in the JSON. Presentation may improve selected, focus, validation, pending and confirmation states without changing their semantics.

Use intercepted requests in a local/preview environment for success, failure and timeout checks. Do not send a real inquiry or modify the production form backend.

## Review boundary

Visual changes may alter spacing, hierarchy, rhythm, rules and restrained entrance effects. They must preserve the records above. The documented Angelina URL repair is the explicit content-target exception. Compare before/after against the immutable baseline, and report any other intended content difference separately before adoption.
