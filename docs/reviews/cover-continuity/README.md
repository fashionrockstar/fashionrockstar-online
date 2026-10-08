# Cover continuity preview

Implementation on `codex/cover-continuity`, based on development commit `89700f521aa1c225c371a6d0d047b6e963ee6aee`. Validated October 8, 2026.

The approved Git bundle was imported with original commits `4be14e2` and `c7376e3` intact. All ten source-file SHA-256 hashes and the bundle hash matched the supplied manifest. The only subsequent implementation change corrects return scroll after a late font swap; the approved motion CSS and both page integrations are unchanged.

The selected still photograph carries from the Work list into its project hero. Returning carries it back to the originating filter and scroll position. The cover movement lasts 680 ms with a quick start and soft finish; the project heading enters just after the movement starts. Existing page geometry determines the movement, so a full-width Work cover narrows into the existing project hero.

## Recordings

- [Desktop, 1440 × 1000](desktop.mp4)
- [Mobile viewport, 390 × 844](mobile.mp4)

Fresh validation recordings: [desktop](desktop-validated.mp4) and [mobile](mobile-validated.mp4). Both recorded directions were checked for an active cover transition. The original recordings above remain unchanged. Sampled opening and return frames were compared with the approved recordings; the image continuity and existing hero geometry are retained.

These are recordings of the actual local website in Chromium. They show opening Call Her Angelina and returning through Back to Work. The mobile recordings use touch and a mobile viewport; they are not iPhone/Safari device tests. Existing local-only font declarations can produce different text metrics on Windows and in the original Linux recordings; typography source was not changed.

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

The original results remain in `verification.json` and `direct-entry-verification.json`.

## Integration validation

Fifteen scenarios passed in Chrome/Chromium 154.0.8037.98 and Playwright WebKit 26.5. Full results are in [validation-2026-10-08.json](validation-2026-10-08.json), with the reproducible [verify.cjs](verify.cjs) browser harness.

- Chromium and WebKit: desktop 1440 × 1000 and mobile/touch 390 × 844 open/return; in-session filter changes; Back/Forward; cleanup of temporary transition names; no project overflow or page errors.
- Chromium: keyboard Enter, Ctrl-click and middle-click; direct project entry; video and paired covers; mismatched images; offscreen return; blocked session storage; reduced motion; CSS-disabled transitions; simulated absence of the transition lifecycle events.
- Loading: cached images, delayed source images, and delayed destination images. Unavailable imagery uses native navigation without waiting for a transition.
- Scroll regression: disabled-motion return previously restored 6967 px and then shifted to 6821 px when local fonts loaded. It now settles at 6967 px. Pending font correction cancels on visitor input or page exit; a delayed-font test preserves the visitor's chosen 7417 px position.

The fix adds one correction after `document.fonts.ready`, only while fonts are loading. It cancels on wheel, touch, pointer, keyboard, or page exit. The movement remains 680 ms with `cubic-bezier(.22, 1, .36, 1)` and the approved title delay.

Run with Node.js and Playwright available to module resolution:

```sh
node docs/reviews/cover-continuity/verify.cjs
```

The harness uses installed Chrome plus Playwright WebKit/Firefox. Set `NODE_PATH` to an existing Playwright installation if needed. `COVER_CASES` accepts comma-separated case names for focused reruns; `COVER_OUTPUT` can redirect reports outside this directory. No animation library or website build dependency was added.

Firefox 153.0 could not launch on this Windows host (`spawn UNKNOWN`), so its coverage remains untested. WebKit is browser-engine coverage, not macOS Safari or physical iPhone coverage. Slow-network behavior was simulated locally; real-device/network performance remains untested. JavaScript syntax and Git whitespace checks passed. Delivery is a draft PR to `development`; no production publication is part of this change.
