# Codex handoff — approved cover continuity

## Request

The owner selected **Cover continuity**, reviewed the actual desktop/mobile previews, and asked: **“Tell codex to implement it.”** Finish integrating this approved motion into the website through a PR targeting `development`.

Repository: `fashionrockstar/fashionrockstar-online`.
Implementation branch: `codex/cover-continuity`.
Implementation commit: `4be14e2`.
Development base inspected for this handoff: `89700f521aa1c225c371a6d0d047b6e963ee6aee`.

The working code is already in this branch. Inspect and complete it; do not recreate the feature from a verbal description or introduce a new visual direction. Check the latest development changes and any applicable repository instructions first. Preserve concurrent work.

## Approved behavior

- In Selected Work, a clicked matching still photograph carries continuously into the existing project hero.
- Keep the photograph solid while the surrounding page fades; the project title enters shortly after motion begins.
- Duration: 680 ms. Easing: `cubic-bezier(.22, 1, .36, 1)`.
- Returning carries the same image back into its original Work position, retaining the discipline filter and scroll position.
- Preserve ordinary link behavior, one-tap mobile opening, keyboard activation, modifier clicks, and browser Back/Forward.
- Honor reduced-motion preferences. Native navigation remains available when motion is unsupported or cannot run reliably.
- Initial scope: matching still-image covers. Video, paired, mismatched, unloaded, or offscreen covers use ordinary navigation.

## Implementation and visual references

Source:
- `assets/css/cover-continuity.css`
- `assets/js/cover-continuity.js`
- `work/index.html`
- `project/index.html`

Actual browser recordings:
- [Desktop, 1440 × 1000](reviews/cover-continuity/desktop.mp4)
- [Mobile, 390 × 844](reviews/cover-continuity/mobile.mp4)

[Implementation and verification notes](reviews/cover-continuity/README.md).

The project hero preserves its existing layout: a full-width Work cover narrows/repositions into the hero. Do not redesign the page to make it expand artificially. Preserve all existing media, aspect ratios, text, typography, navigation, and layout. Keep HOME, first-entry intro, logo/silhouette video, ABOUT, SERVICES, and BOOKING outside this change. Do not reintroduce the rejected About V02 proposal from older documentation.

## Codex task

1. Review the existing implementation against the two recordings and approved behavior.
2. Verify the integration on the latest development base. Fix concrete defects with the smallest scoped patch.
3. Check desktop/mobile open and return, in-session filter changes, browser Back/Forward, direct project entry, modified/keyboard clicks, reduced motion, and graceful no-transition behavior. Check cached images, slow loading, and temporary transition-name cleanup.
4. Check Safari/iPhone behavior if that environment is available; accurately report unsupported or untested coverage. Avoid adding a new animation library unless an observed requirement makes it necessary.
5. Update this PR with any required fixes and a concise validation report. If the existing implementation is complete, report that clearly instead of manufacturing changes.
6. Deliver the implementation ready for development integration. This handoff does not authorize a merge into `main`, production publication, Netlify access changes, or domain changes.

## Verification already completed

Actual Chromium checks passed: desktop 1440 × 1000; mobile viewport/touch 390 × 844; matching cover transitions in both directions; retained in-session filter; exact return scroll; browser Back/Forward; no leaked transition names; reduced-motion and disabled-transition modes; video fallback; direct-entry navigation; no horizontal overflow in the tested project views; no JavaScript page errors. JavaScript syntax and whitespace checks passed.

The mobile recording is browser emulation, not a physical iPhone test. Safari, Firefox, physical devices, and real-network performance still need any applicable validation. Source timing and behavior are authoritative; the existing local-only font setup may use a fallback in recordings.
