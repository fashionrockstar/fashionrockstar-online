# Services update — Codex handoff

## Scope

Work from the existing `development` branch of `fashionrockstar/fashionrockstar-online`. Do not merge into `main`, unlock production publishing, change DNS, or alter the homepage/loading sequence. Preserve uncommitted local work when synchronizing a Codex workspace.

The approved service order is Creative Direction, Photography, Videography, Styling, Beauty. The combined VISUALS service has been replaced by the two independent services. The full approved copy, including all twenty numbered stages and each project scope, is in `services/index.html`; do not abbreviate or rewrite it. Styling, Beauty and closing copy now reference the separate Photography and Videography services.

## Implementation

- `services/index.html`: approved introduction and closing, five native expandable sections, scoped stage headings and service-specific booking links. Dark presentation uses the existing white logo asset. No generated or stock imagery is used.
- `assets/css/services.css`: service-only typography and responsive layout. Uses the existing `--font-ui` stack at weight 700 for headings, not the serif typography from the AI mockups. Two-column details on desktop and one column on mobile; full-width links beneath. A short reveal is disabled for reduced motion.
- `assets/js/services.js`: exclusive disclosure fallback, fragment opening and legacy `#visuals`/`#video` aliases. No additional dependencies. The native disclosures remain operable without JavaScript; unsupported older browsers may allow several open at once.
- `booking/index.html`: adds the `videography` option to the existing `project-type` group. Existing `booking.js` discovers options from the DOM and preselects `?service=videography`; its validation, multi-selection, submission and slider code remain unchanged. Form name, field names, honeypot and destination are unchanged.

## Pending owner assets and metadata

Five service covers are still pending: Creative Direction, Photography, Videography, Styling and Beauty. The footer image is optional. Keep this text-first layout until the owner supplies or explicitly selects their real work; do not add empty image frames or AI mockup pictures.

Videography currently links to `/work/` with the honest label VIEW SELECTED WORK. The inspected portfolio filter set has no `videography` key and project tags do not establish videography credit. Do not fabricate project classifications from the presence of a video file. Confirm the relevant projects before adding a Videography filter. The other four service links preserve their existing filters. The existing portfolio's Visuals filter label is not changed by this pass; audit that label and its project credits when completing the portfolio split.

## Checks performed locally

- Five services, twenty stages, unique IDs and all approved paragraphs preserved.
- All five booking query destinations match form option values.
- JavaScript syntax checked with `node --check`.
- In-memory Chromium component tests at 1440, 390 and 320 pixels: open/close labels, keyboard activation, one-open behavior, JS exclusivity fallback and no horizontal overflow.
- Reduced-motion reveal disabled.
- Unit tests of the existing booking preselection excerpt: each service, Photography + Videography combined, and unknown query values.

The browser could not navigate to network or localhost pages in this chat. These checks used isolated in-memory component fixtures and a limited shared-style fixture; they are not a full-site browser QA pass. The final shared font, navigation, deep-link navigation, complete booking layout, Netlify deployment and live inquiry receipt still need verification. No form submissions were sent.

## Next Codex pass

Inspect local Git status before fetching changes; do not reset, clean, force-push or discard local work. Reconcile the development branch with the current workspace, review the actual Services page at desktop and phone widths, check fragment opening and all booking preselection links, and inspect the existing booking form with the sixth option (five services plus Other). Preserve all text and unrelated layouts. Report actual checks and any remaining failures. Keep production unchanged until the owner approves the preview.
