# Prepared Base44 context prompt

This prompt is ready for submission in the existing Base44 editor with the attached audit package. It has **not** been sent as the builder prompt in this session: the earlier builder call used the original user brief verbatim. The package itself could not be transferred through the gated remote sandbox.

---

Use the existing Base44 app `6ac89442c4a3114f40f16fad` as a creative design partner for the existing FASHIONROCKSTAR.ONLINE website. Return a written design critique and practical implementation specifications. Do not create another app, merge GitHub main, deploy the website or publish production. Do not modify backend resources or send real booking inquiries. Any visual exploration should remain reviewable inside this existing app.

The implementation source is https://github.com/fashionrockstar/fashionrockstar-online. The audited canonical baseline is GitHub main commit `b390752bb52c1a93d9f2cf0ac2c9b2abee6e35ad`; refinement work is isolated on `redesign/editorial-evolution-20261009`. The audited live site is https://benevolent-nasturtium-1b8dd7.netlify.app/. Source and live are different, especially Services; base implementation recommendations on the source baseline.

Read the attached inventory, browser audit, content/interaction audit, adopted specification and selected before screenshots. `baseline-inventory.json` and `baseline-preservation.json` are the exact preservation records. The 27 screenshots cover Home first entry, looping hero and navigation, and the top of Work, Services, About, Booking, Issue 01 and a representative project at desktop 1440 × 1000, tablet 820 × 1180 and mobile 390 × 844. They are verified before captures, not current production-after evidence. If you cannot access an attachment, say which one; do not claim to have inspected unavailable material.

Preserve the mixed-type wordmark, Braille motif, black/white identity, ruled navigation, original first-entry motion and Home video/WebP loop. Keep all existing words and media. Keep every route, every project in order, original image composition and responsive variants, video behavior, service content, gallery sequence, filtering and booking behavior. Do not invent artist credits, dates, scope, publication content or artwork. Do not crop or rotate original artworks.

The seven primary surfaces are `/`, `/work/`, `/project/?id=<slug>`, `/services/`, `/booking/`, `/about/` and `/issue-01/`. Legacy `/book/`, `/contact/` and `/inquiry/` continue to lead to `/booking/`. Maintain query/hash behavior and permanent Netlify redirects.

The 16 projects are, in exact Work/catalogue/Previous-Next order:

1. `brokenheart-runway-mad-2026`
2. `brokenheart-campaign`
3. `mansaworld`
4. `fashionrockstarmaxxing`
5. `kaine-basquiat-mural-2026`
6. `micaela-gomes-mad-2026`
7. `lees-broken-dolls`
8. `call-her-angelina`
9. `franck-anti-beauty-2026`
10. `sad-princess`
11. `blue`
12. `saint-jou-2016`
13. `lucas-issue-01-2025`
14. `brokenheart-issue-01-2025`
15. `in-god-i-trust`
16. `ouissam`

All 496 committed media/image/video/font/icon files have hashes in the inventory. Catalogue gallery arrays contain 100 items; the actual renderer presents 91 because it already deduplicates hero assets. Preserve that existing behavior. Brokenheart Campaign year/role/credits are unconfirmed; Fashionrockstarmaxxing cover metadata is provisional; Call Her Angelina shoot date is unconfirmed; Ouissam gallery order is unconfirmed. Do not fill these gaps.

The concrete audit findings to address are:

- Home's arrival navigation cue is faint. Preserve its entry film and hero; refine the lower route list and make its existing cue easier to discover.
- Work has strong media but inconsistent scan rhythm and hover-dependent metadata. Its long full-page capture is approximately 16,150px tall. Introduce controlled insets and spacing while preserving row membership, full artwork, original captions and ordering. Keep hover/focus/touch captions and the 240ms scroll-pause trigger.
- Services has three accumulated CSS layers and narrow two-column expanded text on phones. Preserve every word and all five native disclosures; consolidate styling and use a readable single-column phone layout. No owner-selected service images currently exist.
- Booking needs clearer service selection feedback and a reliable submit arrow. Improve presentation only. Keep the exact backend/form contract below.
- About needs stronger typographic hierarchy and asymmetry while retaining its statement/portrait, founder and publication relationships. Correct the verified portrait link from `/project/?id=13` to `/project/?id=call-her-angelina`.
- Project pages can use bolder title/role/year hierarchy. Preserve every gallery, native video control, embed and Back/Previous/Next behavior.
- Issue 01 contains only `Issue 01`, `Digital + Print`, `Coming Soon`. Make those existing words feel like a deliberate publication page. Do not add artwork, new copy, dates, shop or preorder flows.

The adopted system is Neue Montreal with Inter/system sans fallbacks, bold 700 headings, black/white/cold-silver restraint and a shared gutter `clamp(1.125rem, 4.5vw, 4.5rem)`. Spacing progresses from `.75rem` and `1.25rem` through `clamp(1.5rem, 3vw, 3rem)`, `clamp(2rem, 4.5vw, 4.5rem)`, `clamp(3rem, 6vw, 6rem)` and `clamp(4rem, 8vw, 8rem)`. Motion uses 180/320/640ms and `cubic-bezier(.22, 1, .36, 1)`.

Editorial entrance effects use a shared IntersectionObserver and Web Animations API. Reveal once, only on actual visibility. Content is visible by default; reduced motion, missing JavaScript/animation APIs and keyboard focus must never leave content hidden. Use restrained title lifts/masks and short section movement. Preserve independent video and disclosure behavior. Keep history restoration usable.

The Booking contract is fixed: Netlify form `booking`, POST `/booking/`, hidden `form-name=booking`, `data-netlify=true`, honeypot `company-website`; service values `creative-direction`, `photography`, `videography`, `styling`, `beauty` in that order. JavaScript provides multi-select checkboxes with at least one service; no-JavaScript keeps native radios. Preserve exact `?service=` prefill, required `name`, `email`, `project-details` with 3000-character limit, optional `company`, `timeline`, `budget`, and the recorded CAD budget options. Selected `project-type` values serialize comma-separated into an `application/x-www-form-urlencoded` request. Preserve the 20-second timeout, pending/received duplicate guards, same-origin OK response requirement, success focus/confirmation and retryable failure behavior. Confirmation remains “YOUR REQUEST HAS BEEN SENT. A BOOKING IS CONFIRMED SEPARATELY.”

Please return:

1. A prioritized critique tied to actual audited pages and screenshot evidence. Separate findings from assumptions.
2. A concise typographic and spacing specification, including heading/body/metadata scales, line heights, tracking, rules and responsive breakpoints.
3. Page-by-page layout guidance that can be implemented in this static HTML/CSS/JavaScript repository without changing content or media.
4. An interaction/motion specification with timing, triggers, focus behavior, reduced-motion and no-JavaScript fallbacks.
5. Any tensions or risks in the adopted direction, with a concrete alternative that honors the same preservation rules.
6. A short verification checklist covering desktop/tablet/mobile, touch and keyboard use, media loading, filters, disclosures, gallery navigation, history restoration and intercepted form requests.

Use the attached preservation records to identify any recommendation that would change recorded content. Keep unconfirmed facts unconfirmed. Return reviewable critique and specifications without production publishing.
