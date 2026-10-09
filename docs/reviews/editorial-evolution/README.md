# Editorial evolution — review

This branch refines the existing FASHIONROCKSTAR website from production `main`
at `b390752bb52c1a93d9f2cf0ac2c9b2abee6e35ad`. It keeps the native static
architecture and approved identity. The public Netlify site differed from
GitHub main during the audit, so the canonical before comparison uses that
immutable source revision.

Branch: `redesign/editorial-evolution-20261009`. The owner must approve before
merging main or publishing production.

Open [the interactive before/after comparison](index.html) on the branch preview.
It includes 27 pairs: nine surfaces/states at desktop 1440×1000, tablet
820×1180 and mobile 390×844. Original PNGs are unchanged. Home animation/video
frames differ with capture timing; the preserved behavior was tested separately.

## Major changes

| Surface | Result and reason |
| --- | --- |
| Shared system | Bold Neue Montreal/Inter typography, a responsive gutter/spacing scale, cold-silver rules and clear keyboard focus unify the existing pages. All interior routes gain consistent accessible skip navigation. The existing local-only Neue Montreal declaration is retained; visitors without the installed face use the existing fallback. |
| Home | The original entry, video, hero geometry and mobile loop remain intact. Lower Explore navigation now shares the bold type system and clearer numbered rhythm. Restored labels are readable; fresh hover/focus and touch activation retain Braille behavior. |
| Selected Work | A split oversized masthead, understated filters and varying row insets create an editorial rhythm. Complete artwork, natural aspect ratios and all 16 projects stay in their original order. Captions still appear on desktop hover/focus and after a 240ms browsing pause on touch. |
| Projects | Bold titles, responsive long-name fitting, offset role/year information, gallery spacing and quieter navigation strengthen hierarchy. Native media and cover continuity stay intact. A positioned social-film container fixes Instagram's loading-frame overflow. |
| Services | Expressive indexed headings and asymmetric desktop details distinguish service names from prose. Expanded mobile content uses a readable single column. Conflicting CSS generations and the duplicate reveal observer are consolidated; disclosure animation releases its height after completion so resizing works. All five services retain every paragraph, stage, scope and link. |
| Booking | The original minimal two-part form uses stronger selected/focused/invalid field feedback and deliberate graphite spacing. The missing submit-arrow glyph is drawn with CSS. Existing submission code and form contract stay unchanged. |
| About | The brand masthead, statement, existing portrait, founder biography and publication band receive stronger scale, asymmetry and spacing. The retired Angelina portrait link now points to its active project slug. |
| Issue 01 | Existing ISSUE 01, DIGITAL + PRINT and COMING SOON become a sparse typographic publication composition. No new release details or artwork were added. |
| Motion | One IntersectionObserver and native Web Animations utility reveal sections only on entry, once, using shared 180/320/640ms timing and easing. Static content starts visible; reduced motion, keyboard focus and history restoration remain usable. No animation library, framework migration or scroll hijacking was introduced. |

## Preservation

[The exhaustive report](validation/preservation.md) records 19/19 source checks
and 32/32 rendered project-content checks. All 496 original media/image/video
assets retain their SHA-256 hashes and byte sizes, totaling 208,171,307 bytes.
The catalogue, galleries, credits, cover pairs, 398 local catalogue media
references and project ordering are unchanged. All approved primary copy is
preserved after case/whitespace normalization.

Entry-loader assets, inline entry logic/markup, the hero playback engine,
`booking.js`, project media controllers, cover continuity and Netlify config
remain byte-identical. Intentional link/decoration repairs are documented above.

## Validation

Browser review used Chromium at 320, 390, 820 and 1440px, including ordinary,
reduced-motion and no-JavaScript modes. It covered every primary route and all
16 project routes, images, media dimensions, filters/query URLs, captions,
native modified/middle-click navigation, circular previous/next links, keyboard
navigation, disclosure hashes/aliases, resize and browser history. Work/project
galleries were scrolled to load offscreen media before visual acceptance.

Home was checked with a fresh session, a returning session, reduced motion and
unavailable storage. Its mobile WebP loop and resume behavior were observed.
The first-entry treatment and hero engine were preserved from source, rather
than recreated.

Booking success, HTTP/network failure, retry, abort timeout, pending duplicate
guard, field retention, confirmation focus and multi-service serialization were
tested through intercepted localhost requests. No real inquiry was sent. This
tests client behavior; live delivery and third-party embed availability depend
on their existing services.

The retained no-JavaScript project fallback links back to the static Work page;
project galleries still require the existing JavaScript renderer. The browser
font and screenshot passes wait for font readiness and completed entrance
animations. A transient headless paint artifact was corrected by recapturing
the affected image after repaint; the source and working controls were verified.

Evidence files in [validation/](validation/) include preservation, every-project
runtime content, Services/Booking interactions and mocked requests, native
disclosure resizing, motion/history and cover continuity results. A portable
read-only preservation verifier is included there. The final independent browser run passes 158/158 checks with no JavaScript
errors or missing local HTTP resources. Syntax checks and `git diff --check` pass.

## Base44

[The complete handoff](../../base44/README.md) includes the audit, inventory,
preservation constraints, actual source screenshots, adopted design specification
and a ready-to-submit context prompt. The original user brief was accepted
verbatim by the connected builder for the existing Base44 app. Direct sandbox
access returned `PREMIUM_REQUIRED`, so the full audit package was prepared
locally and was not transferred. No builder critique or completed implementation
was retrieved or used as evidence. Native work continued in GitHub.

## Local review

From the repository root, run:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/` for the website, or
`http://127.0.0.1:4173/docs/reviews/editorial-evolution/` for the screenshot
comparison. No build step or new runtime dependency is required.

## Review boundaries

The GitHub branch and Netlify Deploy Preview are review artifacts. No merge,
production deploy, host configuration change or real form submission is part
of this work. Review the interactive preview for motion and touch behavior;
screenshots establish visual composition and preservation context.
