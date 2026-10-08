# Codex handoff — Services mobile layout matching desktop

## Request and existing implementation

Zavyer requested: “Size better the text in the service section for mobile”, then clarified: “Make it the same as my browser on pc appearance”. After the revised preview, Zavyer asked to send it to Codex.

Repository: `fashionrockstar/fashionrockstar-online`.
Work from the latest `development` branch. The mobile layout is already implemented in commit `f0e82daf4a5e3b8fa86b710fc86675462c211a35`, in `assets/css/services.css`. Review and verify this implementation; do not rebuild it from scratch or restore the superseded single-column mobile proposal.

## Visual references

These are actual Chromium screenshots of the repository, not generated mockups:
- [Desktop reference, 1440px](references/services-mobile/desktop-reference.png)
- [Mobile overview, 390px](references/services-mobile/mobile-overview-390.png)
- [Mobile open service, 390px](references/services-mobile/mobile-details-390.png)

The screenshots are a visual target; the source CSS is the implementation. The desktop reference has Creative Direction open.

## Required appearance

- Keep the desktop composition on phones: SERVICES heading on the left, introductory copy on the right.
- Service names and VIEW DETAILS / CLOSE DETAILS controls share a row; controls stay right aligned, with the existing plus/minus behavior.
- Open services retain two columns: overview and project scope on the left, numbered stages on the right, separated by the thin vertical rule. Links span beneath both columns.
- Preserve the desktop closing composition with headline left and copy right.
- Reuse the existing font stack, uppercase presentation, weights, tracking, thin dividers and monochrome colors. Scale typography and spacing for phone widths; do not apply a fixed desktop viewport or page-wide transform/zoom.
- Keep the current compact transparent mobile navigation. No gray panels, new imagery, icons or emojis.
- Preserve all approved wording, five services and twenty stages. Do not abbreviate the introduction or rewrite the service descriptions.

## Scope and safeguards

Primary file: `assets/css/services.css`, mobile media query up to 760px.
Related markup and behavior: `services/index.html`, `assets/js/services.js`.
Shared styles and navigation: `assets/css/styles.css`, `assets/js/main.js`.

Keep any adjustments scoped to Services mobile layout. Preserve desktop rendering, disclosure semantics, links, form destinations and all unrelated pages, HOME video/fingerprint behavior and project assets. Check local status and latest branch changes before editing; preserve uncommitted work and concurrent ABOUT/BOOKING/project tasks.

## Verification already completed

Headless Chromium using the actual local site:
- 320, 390, 430, 760 and 1440px viewports.
- All five disclosures open and remain mutually exclusive.
- No horizontal page overflow or clipped headings/paragraphs in those states.
- 200% root text enlargement at 320px: no horizontal page overflow.
- No page JavaScript errors.
- The 1440px open-service screenshot is byte-identical to the pre-change desktop screenshot.
- `git diff --check` clean.

These are browser-emulation checks, not a physical iPhone/Safari test.

## Codex next action and delivery

1. Inspect the existing commit and compare the real rendered mobile page with the supplied references.
2. Verify mobile navigation, disclosure open/close, reading order, keyboard operation, 200% enlarged text, and service booking/related-work links. Do not send any inquiry form.
3. Check responsive wrapping and readability in an iPhone/Safari environment if available; report that limitation if unavailable.
4. If fixes are needed, make the smallest Services-scoped patch on a branch from `development` and open a draft PR targeting `development`, with screenshots and actual checks. If no fixes are needed, report that the existing implementation passes; do not manufacture a code change.
5. Keep production publication pending explicit owner approval. Do not merge into main, publish Netlify, unlock auto publishing, or change domains/access settings for this handoff.

## Publication state at handoff

The final two-column mobile revision is on `development`. The earlier one-column mobile revision `ac280ba` was pushed to `main`, but publishing it was blocked by automatic approval review. It is superseded and must not be published as this requested layout.

The last production release verified in this conversation was `c8259cc`, containing the approved navigation/footer changes. Recheck current branch/deploy state before any future explicitly authorized publication. This “send to Codex” request is a review/implementation handoff, not publication authorization.
