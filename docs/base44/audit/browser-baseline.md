# FASHIONROCKSTAR baseline browser audit

Targets: public Netlify deployment https://benevolent-nasturtium-1b8dd7.netlify.app/ and exact GitHub source baseline b390752. Browser: Python Playwright with /usr/bin/chromium. Viewports: desktop 1440×1000, tablet 820×1180, mobile/touch 390×844.

The audit changed no checkout files and submitted no forms. All requested surfaces were captured: HOME first entry, looping hero, navigation; Selected Work; Services; About; Booking; Issue 01; and `/project/?id=brokenheart-runway-mad-2026`. Full-page screenshots were scrolled to load media and reveal content before acceptance, then inspected using view_image. Initial top screenshots preserve actual arrival state.

Artifacts:
- Live baseline: `/workspace/scratch/redesign-before-live/`, 57 PNGs plus route/interaction JSON.
- Exact source baseline: `/workspace/scratch/redesign-before-source/`, 46 PNGs plus route JSON.
- Prefixes: 10-desktop, 20-tablet, 30-mobile.
- Immutable source archive: `/workspace/scratch/source-baseline-b390752/`, served separately at http://127.0.0.1:4174/ for future comparisons.
- Detailed mobile observations: `30-mobile-audit.md` in the live artifact directory.

## Concrete findings

1. HOME hero is a full screen of brand motion with navigation in a second screen. Its only arrival affordance is a faint small dot scroll cue. Keep the authorized first-entry/loop behavior while making routes easier to discover and adding a clear navigation cue.
2. Selected Work provides a strong image/video mosaic but project names and disciplines appear on hover/focus rather than persistently. Touch browsing provides less information. The desktop page is approximately 16,150px tall; useful metadata and deliberate grouping would improve scanability without replacing the media.
3. Services on live uses long uppercase text in a right column; at tablet and mobile it leaves substantial empty left area and pushes the service list down. Expanded details keep two narrow text columns at phone widths. Source already improves the copy and numbers the services; preserve those improvements and stack expanded detail columns at narrow widths.
4. Booking has a clear three-field core and useful optional disclosure. Service selection relies on subtle brightness and replacing + with ×. A clearer selected state would aid touch use. The Send Inquiry arrow renders as a missing-glyph rectangle in both live/source Chromium screenshots; use a reliable icon glyph or drawn arrow.
5. Issue 01 is an almost empty off-white Coming Soon page. Preserve that honest status while offering existing publication-related editorial imagery or links, if those are in the approved scope.
6. Heading treatment varies between condensed Work/Issue and broader sans Services/About/Booking/project. Scale, rules, spacing, and labels could form a stronger common hierarchy while preserving page character.
7. About is the most composed current content page: statement/portrait pairing, founder section, contrasting publication band, work/booking CTAs. Preserve these relationships. The large wordmark uses a visibly soft raster; prefer a sufficiently large existing brand asset if available.
8. Project pages have useful role/year, native video controls, large sequential galleries, and Back/Previous/Next navigation. Preserve them. Some supplied landscape frames contain sideways images; do not rotate or reinterpret without explicit owner direction.
9. The live Netlify badge adds color to monochrome pages and overlaps lower-right content (including booking controls and mobile scroll cue). It is deployment chrome and absent in source screenshots.

## Confirmed source/live drift

Services differs materially. Live starts with three paragraphs beginning “FASHIONROCKSTAR WORKS ACROSS...” and unnumbered rows; source starts with two shorter paragraphs beginning “FASHIONROCKSTAR DEVELOPS VISUAL WORLDS...” and numbered rows. At mobile the source page is 1107px tall versus 1589px live, and choices begin around y=397 versus y=645. Source should remain the canonical redesign baseline.

About uses a numeric portrait link `/project/?id=13` while work cards use project slugs. This audit did not declare that link broken; maintain/verify alias compatibility in source work.

## Preserve

Mixed-type wordmark, Braille motif, black/white identity, ruled navigation, first-entry motion and looping hero, artwork/project ordering, work filters, accessible link labels, service disclosures and service-specific booking URLs, multiple-service inquiry selection, form names and Netlify behavior, original content/media, About publication contrast, Coming Soon status, video controls and gallery navigation.

## Verification limits

Requested routes returned real page content (HTTP 200), with no browser error pages. Captured flows showed no JavaScript page errors or horizontal overflow at any audited viewport. Final work/project full screenshots include loaded media. Form sending and external destinations were intentionally not exercised.
