# Adopted design and implementation specification

The website should read as a coherent fashion publication and creative studio: bold type, generous negative space, asymmetric image rhythm and quiet, deliberate transitions. The existing art, words, wordmark, Braille motif and first-entry film define its identity. This specification refines how those elements are presented.

This direction was adopted by Codex from the verified audit. The original user brief has been submitted to Base44, but no Base44 critique has been retrieved. Implementation is being reviewed on `redesign/editorial-evolution-20261009`, from source baseline `b390752`.

## Typography and visual language

Use the existing Neue Montreal family with Inter and system sans fallbacks. Major page and section headings use bold sans weight 700, tight tracking and short, strong line heights. Existing mixed-type brand assets remain intact. Do not replace the wordmark with a newly typeset interpretation or assume an additional licensed font is available.

Keep black, white and restrained cold-silver accents. Rules and muted metadata establish hierarchy without adding bright accent colors. About's existing publication contrast and Issue 01's light surface remain part of the page character. Large display text, readable body copy and small labels should have distinct scales; avoid giving every paragraph the same visual force as its heading.

The shared gutter and spacing scale are:

```css
--frsr-gutter: clamp(1.125rem, 4.5vw, 4.5rem);
--frsr-space-1: .75rem;
--frsr-space-2: 1.25rem;
--frsr-space-3: clamp(1.5rem, 3vw, 3rem);
--frsr-space-4: clamp(2rem, 4.5vw, 4.5rem);
--frsr-space-5: clamp(3rem, 6vw, 6rem);
--frsr-space-6: clamp(4rem, 8vw, 8rem);
--frsr-ease: cubic-bezier(.22, 1, .36, 1);
--frsr-duration-fast: 180ms;
--frsr-duration-base: 320ms;
--frsr-duration-reveal: 640ms;
```

Phone prose should remain readable around 14–16px. Form fields stay at least 16px, with comfortable touch areas. Responsive headings must accommodate long project names without horizontal overflow, clipped words or collisions with navigation. Test unusually short desktop viewports as well as narrow phones.

## Motion and resilience

Use one shared IntersectionObserver and the Web Animations API for editorial reveals. Start a reveal only when the target actually enters view; reveal each target once. A heading can lift a small distance while a restrained mask opens, and a content section can move approximately 16px with a short opacity transition. Use the shared 640ms duration and easing for the entrance.

The default document must be fully visible. Do not make CSS or page initialization hide content until JavaScript succeeds. If IntersectionObserver or the animation API is unavailable, content remains visible. Reduced motion displays content immediately and cancels active entrance effects if the preference changes. Keyboard focus cancels a reveal on the focused section; decoration must not obscure a focused link, control or heading. Cancel running animations on page exit, and handle restored pages without trapping content in a partial animation state.

Use 180ms for hover/focus feedback and 320ms for ordinary UI transitions. Preserve native disclosure semantics and independent video behavior. A section entrance must not delay a service selection, form response or navigation action. Avoid adding continuous decorative motion to content pages.

## Home

Preserve the existing first-entry treatment, video, WebP loop/fallback, media assets and hero timing/geometry.

Refine only the lower navigation's scale, type and rhythm so the route list feels connected to the interior pages. Keep its literal words, accessible English labels, Braille treatment and social targets. Make the existing navigation cue clearer within the authorized layout. Reset navigation/history state on exit or restoration where needed so returning to Home does not leave navigation visually trapped.

## Selected Work

Keep all 16 projects in the existing order, with the original row membership, images, video covers, natural aspect ratios, full artwork and embedded typography. Add rhythm by varying row insets and breathing room. Do not crop, reorder, rotate, replace or fabricate media to achieve asymmetry.

Keep the existing captions and their hover/focus/touch browsing behavior. The pause before exposing touch captions remains 240ms after scrolling stops. Touch users and keyboard users must be able to identify and open a project; a decorative reveal must not change the tap target or require a second gesture. Preserve filters, their URLs, hidden-empty-row behavior and unassigned campaign metadata.

## Project pages

Give the existing project title a bold, more deliberate header, and establish a readable relationship with its recorded role and year. Empty or unconfirmed metadata stays empty/unconfirmed. Preserve credits, hero cover order and the actual rendered gallery sequence.

Keep all native video controls, portrait/landscape dimensions, social embeds, accessible labels and Back/Previous/Next navigation. Previous/Next continues to wrap through the catalogue order. Existing hero/gallery deduplication is intentional and must remain unchanged. Never rotate supplied sideways frames without owner direction.

## Services

Consolidate the three existing CSS layers into one readable layout treatment. Preserve all five native `details` disclosures, every paragraph, the four stages per service, scope text and exact links. Keep one disclosure open at a time, native keyboard behavior, hash deep links and the existing alias handling.

On phones, use a single column for expanded service content with 14–16px prose and space between process stages. Remove the narrow two-column text treatment and excessive empty left margin. Larger layouts can maintain an asymmetric heading/content relationship. Owner-selected service photography is pending: solve the page with typography, rules and spacing rather than invented photographs.

## Booking

Improve visual selection, focus, validation, pending and confirmation feedback around the current form. Service selection should be visible at a glance through weight/rule/background treatment in addition to the existing symbol change. Use a reliable arrow drawing or supported glyph for the submit affordance; the audited diagonal arrow rendered as a missing-glyph box.

Do not change form field names, service values, required rules, query prefill, budgets, Netlify attributes, honeypot, serialization, request URL, timeout, duplicate protection or success/failure behavior. Preserve the honest distinction between an inquiry received and a booking separately confirmed. The complete contract is recorded in [inventory.md](inventory.md).

## About

Create stronger asymmetry between the existing statement, portrait, founder story and publication band using type scale and spacing. Preserve all words, Montréal biography facts, the portrait/responsive variants, caption, CTAs and the publication contrast. Do not manufacture a new biography or change existing photographs.

Correct the verified contextual link defect: the Call Her Angelina portrait currently targets retired `/project/?id=13`; its active destination is `/project/?id=call-her-angelina`. Record this intentional URL repair separately from preservation checks.

## Issue 01

Use sparse, bold publication typography and proportion to give the existing page intention. Preserve its exact content: `Issue 01`, `Digital + Print`, `Coming Soon`. No new artwork, release date, editorial description, checkout, preorder or availability claim is authorized. The blank space can remain expressive; it does not need invented content.

## Implementation boundaries

Use shared styling and motion modules for common rhythm while retaining each route's existing static HTML and behavior scripts. Be explicit about stylesheet order: Work does not inherit project-layout rules in the baseline. Avoid solving one page by unintentionally overriding another. Preserve static rendering and no-JavaScript access, including mobile navigation and native service/form fallbacks.

Keep every audited media binary unchanged. No new third-party design tools, backend resources or production deployment are required for this specification. Base44 is being used for design exploration and critique within the existing app; GitHub remains the implementation source.

## Acceptance evidence

Review every primary route at desktop 1440 × 1000, tablet 820 × 1180 and mobile 390 × 844; also check 320px width and short viewports where large titles are sensitive. Scroll Work and project galleries until lazy media has loaded before accepting full-page screenshots. Capture Home first entry, hero and lower navigation separately.

Confirm project order/content/media/form preservation against the JSON records. Check filter URLs, service disclosures and aliases, mobile navigation, keyboard focus, touch captions, Previous/Next wrapping and the corrected Angelina link. Confirm no broken media, JavaScript page errors, hidden unrevealed sections or horizontal overflow. Check reduced motion, no JavaScript and history restoration. Test inquiry success/failure/timeout through intercepted requests in a local or preview environment; do not send real inquiries.

Separate baseline audit evidence from after-change evidence. Record verified results and unresolved limits plainly before any merge or production publish.
