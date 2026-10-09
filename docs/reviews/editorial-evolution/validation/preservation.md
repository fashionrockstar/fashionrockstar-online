# Final content and media preservation

Baseline: immutable Git main `b390752bb52c1a93d9f2cf0ac2c9b2abee6e35ad`.

**19/19 exhaustive source checks passed.** No unexpected wording, route, form or media changes.

- All 16 project records, order, metadata, credits, cover pairs, 100 source gallery items and 91 rendered gallery items are exactly preserved. The catalogue JS is byte-identical.
- All 16 Work tiles preserve exact title/details/discipline/URL values and ordered media attrs.
- All 496 existing binary assets retain their exact SHA-256 and byte sizes: 208,171,307 bytes preserved.
- Every original paragraph/stage title/scope/link for all 5 Services is unchanged. All primary-page main copy matches after case and whitespace normalization.
- About image source/srcset/dimensions/alt/caption and all existing approved About copy are unchanged. Issue contains exactly the original ISSUE 01, DIGITAL + PRINT, COMING SOON wording.
- Booking field names/types/constraints/options, native no-JS fallback, multi-select JS, honeypot/action/method, status/error/confirmation copy and budget labels/values are preserved. `booking.js` is byte-identical.
- Entry-loader JS/CSS, inline session/timing gate, loader SVG/logo markup, dormant entry experiment scripts, Netlify redirect config and gallery/media/cover-continuity logic remain byte-identical.
- The hero/video/fallback/playback portion of `landing.js` is byte-identical. Its Explore navigation portion adds the intentional browser-history restore reset.
- All local HTML asset dependencies and all 398 local catalogue image/video/poster/srcset destinations resolve. All primary navigation/submenu destinations and query values remain valid. External portfolio/social targets are preserved.

The only approved differences requiring normalization were the broken About portrait link (`id=13` → `id=call-her-angelina`) and Booking's decorative, aria-hidden ↗ character now drawn by CSS. The SEND INQUIRY wording is unchanged.

**Runtime content checks passed 32/32.** Each of the 16 project routes was rendered at desktop 1440×1000 and mobile 390×844. Every generated title/role/year/credit, ordered hero/gallery media source and previous/next URL exactly matches the baseline. No page errors occurred. Instagram embed script was intercepted; its direct media fallback and unchanged source URLs were verified without depending on the external embed.

Artifacts: current-inventory.json, current-preservation.json, final-preservation-comparison.json, desktop-runtime-project-preservation.json and mobile-runtime-project-preservation.json. Repeat source check with inventory.py --revision working --prefix /workspace/scratch/fashionrockstar-audit/current, then compare-preservation.py. These checks are read-only and do not submit real inquiries or deploy anything.
