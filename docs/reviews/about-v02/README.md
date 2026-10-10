# ABOUT V02 review

Implemented for Issue #10 from the approved handoff and interactive HTML reference. The feature branch includes the latest `development` base, `f0e82da` (Services mobile refinements). Runtime changes are limited to `about/index.html`, `assets/css/about.css`, and the new `assets/js/about.js`.

The full artist introduction is visible before the story controls. Four numbered chapters switch in place, with an off-white ISSUE 01 panel, direct Work/publication links, and the Booking footer. The original logo assets and shared header markup are preserved. Shared CSS, navigation JavaScript, other pages, imagery and production configuration are unchanged.

## Visual comparison

Left: approved repository HTML. Right: implementation, retaining the real site header. Desktop captures originate at 1440 pixels and are scaled to 50% in the paired images; mobile captures retain their original pixel widths. The Firefly board link redirected to `boards/not-found`, so it could not be inspected; the approved repository reference is the comparison source.

| View | Comparison |
| --- | --- |
| Desktop / THE BEGINNING, 1440 | [Open screenshot](comparison-1440.jpg) |
| Mobile / THE BEGINNING, 390 | [Open screenshot](comparison-390.jpg) |
| Mobile / THE BEGINNING, 360 | [Open screenshot](comparison-360.jpg) |
| Desktop / ISSUE 01, 1440 | [Open screenshot](comparison-print-1440.jpg) |
| Mobile / ISSUE 01, 390 | [Open screenshot](comparison-print-390.jpg) |

## Validation

- All four chapters at 320, 360, 390, 768, 1024 and 1440: no horizontal overflow, overflowing heading text, clipped content, or extra visible panels; exactly one tab stop and active chapter. Desktop has four tab columns; mobile has a two-column grid.
- Arrow keys in both directions, Home, End and wraparound at desktop and mobile widths: correct selection, focus and visible outline. Native button activation works; modified browser shortcuts remain available. Panel height stays constant while switching, preserving scroll position.
- Real emulated touch events at 390: all four tabs activate without navigation. This is browser emulation, not a physical-device test.
- Reduced motion: transitions and animations disabled; scrolling uses `auto`.
- JavaScript disabled at 320 and 390: all four chapters, links, mobile navigation and discipline links are readable; inactive tab controls are hidden.
- Mobile menu, Selected Work submenu, Escape focus return, outside dismissal, focus dismissal, Photography filter link and back navigation passed. Existing desktop header links to Home, Services, Work, Booking and ISSUE 01 passed. Work/publication chapter links, Booking footer and skip-to-content target passed. No inquiry was submitted.
- Exact approved ten paragraphs and four chapter titles verified; one H1, artist-first description, unchanged header markup, and 19 local asset/route references checked. JavaScript syntax and `git diff --check` passed. No page errors were observed.

Detailed results are in [validation.json](validation.json).

## Implementation differences

The existing site font stack renders **Inter Bold** in the tested browser. The repository has a local Neue Montreal rule but no supplied webfont file; Neue Montreal is not claimed to be loaded. The current fallback remains in use.

Small-screen headline sizes are reduced below 370 pixels to keep the complete words inside their columns. The tallest chapter height is reserved at each width to prevent scroll jumps; shorter chapters retain blank space at the bottom. The real site header replaces the reference's simplified header. The layout uses semantic H1/H2/H3 headings and readable chapter content before JavaScript enhancement.

This change is submitted for review against `development`. It has not been merged or published to production.
