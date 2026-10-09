# Phase A content and interaction audit

Source: GitHub main checkout at `b390752bb52c1a93d9f2cf0ac2c9b2abee6e35ad`. Read-only audit; all generated files are under `/workspace/scratch/fashionrockstar-audit/`. Baseline inventory is reconstructed using `git show` so concurrent checkout changes cannot contaminate it.

## Preservation records

- `baseline-inventory.json`: route title/style/script/links, full Work tiles in order, complete active project catalogue with media order and actual rendered gallery order, complete Services paragraphs/stage titles/scope/links, Booking form fields/attributes/options/submission semantics, SHA-256 of all audited tracked source and asset files.
- `baseline-preservation.json`: content/media/form comparison surfaces plus binary hashes.
- `inventory.py`: regenerate against immutable baseline, or run `--revision working --prefix /workspace/scratch/fashionrockstar-audit/current` after changes.

The website has 7 primary surfaces: `/`, `/work/`, `/project/?id=<slug>`, `/services/`, `/booking/`, `/issue-01/`, `/about/`. Legacy `/book/`, `/contact/`, `/inquiry/` replace their URL with `/booking/` while preserving query/hash in client fallback. Netlify config sends all those legacy routes to `/booking/` with permanent 301 redirects. Mockups have standalone index routes and are excluded from the active navigation.

## Selected Work

16 Work tiles exactly match 16 active catalogue entries and their order. Order is: brokenheart-runway-mad-2026, brokenheart-campaign, mansaworld, fashionrockstarmaxxing, kaine-basquiat-mural-2026, micaela-gomes-mad-2026, lees-broken-dolls, call-her-angelina, franck-anti-beauty-2026, sad-princess, blue, saint-jou-2016, lucas-issue-01-2025, brokenheart-issue-01-2025, in-god-i-trust, ouissam.

Filters are All, Creative Direction, Styling, Visuals (`photography`), Beauty. Valid query filter values: all, creative-direction, styling, photography, beauty. Work tiles use discipline strings for filtering, and rows remain hidden when no tile matches. Photography is labelled Visuals only in the page toolbar; shared navigation calls it Photography. Video campaign intentionally has no assigned disciplines until metadata confirmation, and is visible only under All. Services' Videography related-work target intentionally goes to unfiltered `/work/`.

Projects preserve title, role, year, credit arrays, date/category and confirmation metadata. Actual rendered galleries omit any asset also used by the hero, including responsive variants. Baseline records both source gallery order and rendered gallery order so intentional existing deduplication is not mistaken for content deletion. Relevant deduplications: Lee's Broken Dolls 5→4, Franck 2→1, Sad Princess 3→1, Lucas 5→4, Brokenheart Issue 01 20→19, In God I Trust 3→2, Ouissam 6→4. Project Previous/Next wraps through the same order. Unknown or numeric IDs redirect to Work.

496 committed media/image/video/font/icon assets total 208,171,307 bytes, individually SHA-256 recorded. Source gallery arrays hold 100 items; rendered galleries have 91 (some are external social embeds). Hero pairs retain their cover ordering.

Metadata remains unconfirmed for Brokenheart Campaign, provisional cover metadata remains for Fashionrockstarmaxxing, Call Her Angelina has no confirmed shoot date, and Ouissam gallery ordering is explicitly unconfirmed. Do not invent these facts during modernization.

## Services

Five disclosures in current order: Creative Direction, Photography, Videography, Styling, Beauty. Each has Overview, 4 numbered process stages, Project Scope and two links. Every original paragraph/stage title and both link targets are in the inventory. Book links use exact `?service=` values matching Booking. The page closing CTA goes to `/booking/`.

Native details use `name="services"`; JS maintains one open disclosure, supports hash deep linking, recognizes `#visuals`→photography and `#video`→videography, updates the fragment on open/close, and restores visible placement when opening below the viewport. Owner-selected Services images are explicitly pending in a source comment. No service images currently exist in this page; use typography/layout without inventing service photographs.

## About and Issue 01

About has complete existing platform, founder and publication copy, one Call Her Angelina portrait with responsive media, Work/Issue/Booking CTAs and Back to Top. Source body makes the entire page weight 700; section labels at 11px and bold narrative weaken relative emphasis. Mobile stacks correctly at 760px and has 14–16px prose with a useful skip link and focus handling. Preserve words, biography facts, Montreal location, image and caption.

Found defect: About's image points to retired `/project/?id=13`, while the active destination is `/project/?id=call-her-angelina`. Current code redirects numeric IDs to Work. This is a broken contextual link; propose explicitly in report rather than silently treating the numeric link as intended content.

Issue 01 is a sparse existing page: heading `Issue 01`; metadata `Digital + Print`; status `Coming Soon`. Preserve that status; no release date, shop flow or new publication copy exists.

## Booking

Netlify static form `name=booking`, `method=post`, `action=/booking/`, hidden `form-name=booking`, `data-netlify=true`, honeypot `company-website`. Native no-JS service fields are radios; first is required. JS changes all five to checkboxes and validates at least one via custom validity. Services are Creative Direction, Photography, Videography, Styling, Beauty in that order. `?service=<exact-value>` checks the matching option.

Required: name (text/autocomplete=name), email (email/inputmode=email/autocomplete=email), project-details (textarea/maxlength=3000). Optional disclosure: company (autocomplete=organization), timeline text, budget select. Budget values and copy: empty SELECT RANGE; under-1000 UNDER $1,000 CAD; 1000-3000 $1,000–$3,000 CAD; 3000-7500 $3,000–$7,500 CAD; 7500-plus $7,500+ CAD; discuss TO BE DISCUSSED.

JS serializes selected project-type values into one comma-separated field, encodes URLSearchParams and fetches POST `/booking/` with application/x-www-form-urlencoded. Timeout 20s. Pending/received guards prevent duplicate submits; fields and button are disabled while pending. Successful HTTP response must be OK and same-origin, then project fields hide and the confirmation receives focus. Existing wording: REQUEST STATUS / RECEIVED; INQUIRY RECEIVED.; YOUR REQUEST HAS BEEN SENT. A BOOKING IS CONFIRMED SEPARATELY. Failed/timeout request focuses live status, restores fields and submit and permits retry. Submission should only be tested with intercepted requests in a local/preview environment; no real inquiry is needed.

## Hierarchy and mobile concerns

- Typography varies among Bebas Neue huge display titles on Work/Issue, modest Neue Montreal project titles (project-layout override), Services bold all-uppercase UI, and entirely bold About. One shared type system should clarify hierarchy while preserving exact words and image order.
- Work does not currently link `project-layout.css`; only project does. Thus current Work uses large titles and huge full-bleed natural media with metadata appearing on hover/focus/touch browsing pause, while project uses smaller editorial titles. Global typography fixes must account for the actual stylesheet list per route.
- Services CSS is 750 lines with base, Editorial Motion V2 and V3 overrides. Below 760px it deliberately retains the desktop two-column detail grid, with final body text down to 11px on 320–390px phones. Copy becomes two extremely narrow columns and process headings wrap frequently. A single-column phone detail layout with 14–16px text addresses real readability.
- Existing Services expands over 760ms and closes over 480ms, while nested content additionally animates with staggered delays. Reduced-motion handlers exist; preserve them and keyboard/native details behavior.
- Booking stacks below 1000px and name/email below 600px. Fields are already 16px with minimum 44px height, avoiding mobile zoom. Tiny service legend (9px) and optional/detail labels (10–11px) can be normalized. Existing large title has short viewport and wide desktop accommodation; do not eliminate those fallbacks inadvertently.
- Shared mobile menu is a compact in-flow disclosure. Menu entries are at least 48px and the Work submenu 44px. Closed nav is inert with JS. Without scripting only About currently declares navigation fallback; global mobile nav otherwise stays max-height 0. A shared no-JS fallback would improve resilience.
- Issue 01 uses huge display heading and a minimal split metadata row; mobile line-height accommodation exists. Any new editorial treatment should preserve the exact Coming Soon meaning and avoid fabricated publication release details.
- Home links use hidden braille `data-braille` display and aria labels, with literal English content preserved inside. Social profiles are Instagram fashionrockstar.online, Zavyer Vegiard LinkedIn, TikTok fashionrockstar.online.
