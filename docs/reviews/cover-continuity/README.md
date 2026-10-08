# Cover continuity preview

Local implementation on `codex/cover-continuity`, based on development commit `89700f5`. Prepared October 8, 2026.

The selected still photograph carries from the Work list into its project hero. Returning carries it back to the originating filter and scroll position. The cover movement lasts 680 ms with a quick start and soft finish; the project heading enters just after the movement starts. Existing page geometry determines the movement, so a full-width Work cover narrows into the existing project hero.

## Recordings

- [Desktop, 1440 × 1000](desktop.mp4)
- [Mobile viewport, 390 × 844](mobile.mp4)

These are recordings of the actual local website in Chromium. They show opening Call Her Angelina and returning through Back to Work. The mobile recording uses touch and a mobile viewport; it is not an iPhone/Safari device test. Existing local-only font declarations use the browser fallback when Neue Montreal is unavailable.

## Implementation

`assets/css/cover-continuity.css` and `assets/js/cover-continuity.js` are loaded only by Work and project pages. Native cross-document view transitions preserve ordinary links, modifier clicks, and browser navigation. Transition names are removed after snapshots so they do not persist in the browser cache.

Only a matching, loaded, visible still cover participates. Video, paired, mismatched, offscreen, and unavailable covers use normal navigation. Reduced-motion preferences disable the animation. A return image is promoted from lazy to eager before first render; a missing or undecoded image skips motion rather than delaying navigation. The originating Work state is stored in session storage. If storage is blocked, ordinary links remain available without the continuity enhancement.

## Verification

Chromium checks passed for:

- Opening and explicit return on desktop and mobile, with a cover animation in each direction.
- A filter changed during the session, retained on return.
- Exact return scroll position: desktop 7113 px; mobile 1806 px.
- Browser Back and Forward, with temporary transition names cleaned up.
- Reduced-motion mode and transitions disabled, with navigation and restoration intact.
- Video navigation falling back without a cover transition.
- Direct project entry followed by Services or Work, with no session history required.
- No horizontal overflow in either tested project viewport; no JavaScript page errors.

Detailed results are in `verification.json` and `direct-entry-verification.json`. JavaScript syntax and whitespace checks also passed. Safari, Firefox, physical devices, and real-network performance have not been tested. The source and recordings are local; this branch has not been uploaded or deployed.
