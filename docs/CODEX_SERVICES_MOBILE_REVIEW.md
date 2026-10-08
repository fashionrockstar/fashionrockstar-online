# Services mobile review — October 8, 2026

Reviewed issue #12 against development commit `89700f521aa1c225c371a6d0d047b6e963ee6aee`, including the existing implementation in `f0e82daf4a5e3b8fa86b710fc86675462c211a35` and all three handoff screenshots.

## Finding and patch

At 320px with the root font enlarged from 16px to 32px, the implicit columns of the overview, scope and stage grids grew beyond their assigned columns. Open-service document widths measured 397–429px. The inline control also left about one character of width for a service title.

Five added CSS declarations, all within the existing Services mobile media query, constrain the nested grids and let a summary control wrap when enlarged text requires it. Normal phone layouts retain the title/control row and split details composition. Copy, fonts, navigation, markup, JavaScript, five services and twenty stages are preserved.

## Completed checks

- Local Chromium, 900px viewport height, widths 320, 390, 430, 760, 761 and 1440: closed overview plus each of the five open services, exclusive disclosure behavior, close operation, horizontal page overflow and nested text/container overflow. All 36 measured states pass after the patch.
- 320px with 200% root text: closed overview and all five open services. Document width stays 320px; Services copy remains inside its columns. This is text enlargement, not a physical-device test or browser page zoom.
- Each summary opens with Space, closes with Enter, retains focus and displays a 2px focus outline. Native disclosure semantics and the source reading sequence are preserved.
- Mobile navigation: transparent compact menu, Selected Work submenu, Escape with focus return, outside dismissal, and Tab traversal that dismisses the menu when focus reaches Services content.
- Each service booking link opens the booking page with exactly its corresponding service checked. Each related-work link activates the matching filter; Videography intentionally opens All. No form was submitted.
- No JavaScript exceptions or warning/error console entries during the interaction/link checks. Reduced-motion mode was used for stable screenshots; normal-motion disclosure checks were also completed before the patch.
- Before/after screenshots of the 1440px desktop open state and both 390px mobile reference states have identical decoded pixels in the same browser environment. The handoff's composition was visually compared; exact pixel identity with screenshots from a different font/browser environment is not claimed.
- `git diff --check` passes. The code patch changes only `assets/css/services.css`; additional files are review evidence.

## Evidence

- [390px overview](references/services-mobile/codex-review/mobile-overview-390.png)
- [390px expanded Creative Direction](references/services-mobile/codex-review/mobile-details-390.png)
- [1440px desktop](references/services-mobile/codex-review/desktop-1440.png)
- [320px enlarged text before](references/services-mobile/codex-review/text-200-320-before.png)
- [320px enlarged text after](references/services-mobile/codex-review/text-200-320-after.png)
- [320px shared-header overlap](references/services-mobile/codex-review/text-200-320-header.png)
- [Measured results](references/services-mobile/codex-review/check-results.json)

## Remaining limitations

The shared header's Menu and logo overlap at 320px with a 32px root font. This pre-existing shared-navigation finding remains outside this Services CSS patch; the whole-page enlarged-text review therefore has an outstanding header issue. It is separate from the service-detail overflow fixed here.

Physical iPhone and Safari were unavailable in this Windows environment. Chromium emulation does not establish Safari behavior. The two-column enlarged-text layout wraps words into short lines, so a physical-device reading check remains useful.

Delivery is a draft PR targeting `development`. Production approval remains separate; no main push, merge, Netlify publication, domain or access change was performed.
