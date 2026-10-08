# FASHIONROCKSTAR — ABOUT / Codex implementation handoff (V02)
Updated: 2026-10-08. Status: design approved for Codex implementation; do not publish to production.

## Repository and source of truth
- Repository: `fashionrockstar/fashionrockstar-online`
- Start from latest `development` branch and open a new feature branch. Submit a PR back to `development`, not `main`.
- Real page: `about/index.html`; scoped styles: `assets/css/about.css`; sitewide assets/navigation `assets/css/styles.css`, `assets/js/main.js`.
- **LOCAL REFERENCE IN REPO:** `docs/references/ABOUT_UI_V02_REFERENCE.html`. Open this file in a browser to inspect the approved layout and tab behavior. This is a design/reference study, **not** production-ready code. It includes an inline copy of the logo. Use existing logo assets in the real page.
- Visual review board: https://firefly.adobe.com/boards/id/urn:aaid:sc:US:858151d1-745e-49c2-ab21-66417d1cb0e1
- Design previews in the board show the overview, selected tab, ISSUE 01 paper treatment, and mobile.
- The reference uses a simplified header; **preserve the real current global site-header and its existing Selected Work submenu**, rather than replacing the global nav with the prototype nav.

## Intent — artist first, not an agency
FASHIONROCKSTAR is the artist identity of Zavyer Vegiard, not originally a creative platform/agency. Zavyer already had years of experience in fashion, a personal visual identity, and visual-art interests before adopting the name. An early creative shoot with Kelly Vivet prompted the idea of a magazine; the name followed and became the identity under which Zavyer shared independent imagery. Zavyer was self-taught in photography, Photoshop, lighting and editing, actively pitched creative collaborators early on, and later formed longer-lasting partnerships. ISSUE 01 returns to the original concept of a tangible magazine. Artistic values: personal freedom, self-expression without approval, subverting conventional expectations of fashion/beauty/art, eliciting reactions and questions.

No fake years, manufactured milestones, claims of formal photo education, or mistaken suggestion that the identity started with SSENSE. Retail experience should not dominate. Do not invent clients or visuals.

## Scope
Implement the approved editorial ABOUT V02 design on /about/ only. The whole explanation of FASHIONROCKSTAR **must be visible at the top without tapping or clicking**. Then provide four accessible interactive chapters / tabs. Keep large original logo, crisp monochrome typography, negative space, artist-led story, and publication contrast section. No emojis anywhere in site content, tab labels, labels or UI.

## Layout
1. **Hero / intro**: existing global header, thin ABOUT / MONTRÉAL CANADA label row, large genuine FASHIONROCKSTAR logo (current assets; no replacement fake logo), large left-column headline and smaller right-column explanation. White/silver on near-black background. Desktop asymmetrical grid. No intrusive video, stock photos or decorative HUD.
2. **Editorial statement**: restrained full-bleed/off-white inversion with oversized, real headline: "THE FREEDOM TO BE YOURSELF." A structural visual pause, not a generic quote box.
3. **The story**: heading "THE STORY." followed by large four-column numbered tabs on desktop; two-column (2x2) grid on mobile. Selected tab inverts to off-white; thin dividing rules; larger numeral + compact label. Tabs: 01 THE BEGINNING, 02 THE ARTIST, 03 THE WORK, 04 ISSUE 01. Exactly one panel is visible at a time.
4. **Selected chapter**: desktop two-column typography/narrative grid, very large left-side chapter word and smaller right story. Chapter words: ORIGIN, VISION, WORK, PRINT. Match spacing/pacing from reference. Only ISSUE 01 panel uses the warm off-white "paper" inversion. Do not construct nested panels that look like form cards.
5. **Footer**: "FOR PROJECTS & COLLABORATIONS" and prominent "BOOK NOW" linking to `/booking/`; minimal back-to-top. Keep real site navigation consistent.

## Approved page copy (keep wording substantially intact; correct typographic apostrophes if necessary)
### Hero
Headline: **FASHIONROCKSTAR IS THE ARTISTIC IDENTITY OF ZAVYER VEGIARD.**

Paragraph 1: SHAPED BY YEARS IN FASHION AND A PERSONAL VISUAL LANGUAGE, THE NAME EMERGED FROM AN IDEA TO MAKE A MAGAZINE. IT BECAME THE HOME FOR ZAVYER'S PHOTOGRAPHY, STYLING, BEAUTY, CREATIVE DIRECTION AND COLLABORATIONS.

Paragraph 2: AT ITS CORE IS FREEDOM — TO BE YOURSELF WITHOUT SEEKING APPROVAL, TO RESIST EXPECTATIONS, AND TO CREATE IMAGES THAT MAKE PEOPLE QUESTION WHAT ART, FASHION AND BEAUTY CAN BE.

Statement: **THE FREEDOM TO BE YOURSELF.**

### Tab 01 THE BEGINNING
Giant word: ORIGIN
Title: THE IDEA CAME BEFORE THE NAME.
AFTER YEARS WORKING IN FASHION, AN EARLY CREATIVE SHOOT WITH KELLY VIVET LED TO A SUGGESTION: PRESENT THE IMAGES AT AN EVENT. ZAVYER IMAGINED SOMETHING ELSE — A MAGAZINE.
LOOKING FOR A NAME THAT FELT PERSONAL BUT COULD HOLD THE WORK, ZAVYER FOUND INSPIRATION IN THE ROCK-STAR ATTITUDE ASSOCIATED WITH FIGURES LIKE KATE MOSS. FASHIONROCKSTAR BECAME THE NAME USED ONLINE TO SHARE THE WORK THAT FOLLOWED.

### Tab 02 THE ARTIST
Giant word: VISION
Title: THE VISION WAS THERE BEFORE THE TOOLS.
DRAWING, DEVELOPING A PERSONAL STYLE AND BORROWING A FATHER'S CAMERA WERE EARLY FORMS OF EXPRESSION. THE RUNWAY WORLDS OF MUGLER, ALEXANDER MCQUEEN AND JOHN GALLIANO DEEPENED THE FASCINATION.
THE DESIRED IMAGE WAS ALREADY CLEAR. ZAVYER LEARNED PHOTOGRAPHY, LIGHTING AND RETOUCHING INDEPENDENTLY TO BRING THAT VISION INTO FOCUS.

### Tab 03 THE WORK
Giant word: WORK
Title: IDEAS BECAME IMAGES THROUGH COLLABORATION.
EARLY PROJECTS BEGAN WITH DIRECT MESSAGES AND PITCHES TO ARTISTS, MODELS AND BRANDS. EACH ONE OFFERED A WAY TO EXPERIMENT, REFINE THE CRAFT AND MAKE AN EXISTING VISION REAL.
TODAY, THE WORK SPANS EDITORIALS, CAMPAIGNS, ARTIST IMAGERY AND RUNWAY PROJECTS, INCLUDING LONG-TERM CREATIVE RELATIONSHIPS THAT CONTINUE TO OPEN NEW POSSIBILITIES.
CTA: VIEW SELECTED WORK -> `/work/`

### Tab 04 ISSUE 01
Giant word: PRINT
Title: THE ORIGINAL IDEA, IN A FORM YOU CAN HOLD.
THE IDEA OF A MAGAZINE IS WHERE FASHIONROCKSTAR BEGAN. ISSUE 01 RETURNS TO THAT BEGINNING, BRINGING TOGETHER THE ARTISTS, PROJECTS AND COLLABORATIONS THAT HAVE SHAPED THE IDENTITY.
THE PUBLICATION OFFERS SOMETHING BEYOND A SOCIAL MEDIA POST — AN OBJECT TO TOUCH, KEEP AND RETURN TO.
CTA: DISCOVER ISSUE 01 -> `/issue-01/`

## Interaction and accessibility
- Use semantic buttons with `role=tab`, `aria-selected`, `aria-controls`, tab panel `role=tabpanel` and `aria-labelledby`. One active tab has `tabIndex=0`; inactive ones -1.
- Clicking/tapping switches panels without navigation or page reload; preserve scroll position. Arrow keys switch tabs; Home selects first, End last; focus visible. Do not rely on hover for content on mobile.
- Initial tab = 01 / THE BEGINNING.
- Honor `prefers-reduced-motion`, and provide no-JavaScript readable fallbacks (do not accidentally hide the entire story without JS).
- Interactive states must be clear at 320/360/390/768/1024/1440 px. No horizontal overflow, clipped titles, unintentional full-screen blocking, or page jumps.
- Minor fades (under 350 ms) are okay, but no synthetic glitch, digital HUD, neon, progress bars, emojis, 3D, or purposeless motion. Preserve user scroll behavior.
- Correct meta description to describe an artist identity, not the "independent creative platform founded by..." copy currently in the page.
- Keep semantic heading hierarchy (one H1). Use existing Neue Montreal 700 where correctly loaded/licensed; do not add a new serif or generic sci-fi font. If Neue Montreal cannot load, report the blocker and retain clean fallback without claiming it is loaded.
- Ensure hover/keyboard styles do not interfere with existing global mobile navigation, submenu interactions, focus treatment or skip link.

## Implementation boundaries
- Do not refactor or modify HOME, WORK, BOOKING, ISSUE 01, intro/video/fingerprint/loading, or production settings.
- Do not push directly to `main`, auto-merge, or deploy production.
- Do not replace logo assets or alter project photographs.
- Images within story chapters are optional **only when real, already-approved photographs with correct project attribution are identified**. The approved V02 is typographic and can ship without added story photographs. Never generate fake/editorial placeholders.
- Prefer scoped `about.css` and `assets/js/about.js` for tab logic; add reference to `about/index.html`. Avoid touching `main.js` unless integration truly requires it.
- The local reference HTML is an interaction/style sample. Integrate with existing site rather than embedding it as a full standalone page.

## Codex deliverables & validation
1. Implement ABOUT in a feature branch based on development; open a reviewable PR targeting `development`.
2. Provide desktop (1440) and mobile (390, 360) screenshots/video or direct preview for comparison with the reference board.
3. Test all tabs via click, touch/viewport, arrow keys, Home/End; verify active state and aria association. Test navigation links and existing mobile menu/submenu.
4. Test scrolling, reduced motion, narrow screen overflow and fonts; ensure content is visible/reachable without JavaScript.
5. Summarize files changed and any deviations from the approved design. Do **not** merge without user review.

## Definition of done
On /about/, first load communicates "FASHIONROCKSTAR IS THE ARTISTIC IDENTITY OF ZAVYER VEGIARD" directly; below it visitors can explore the exact four editorial chapters in responsive keyboard-accessible tabs; ISSUE 01 has the off-white paper visual treatment; the existing global site header, work navigation, booking link, homepage and production are unchanged; no emojis anywhere.
