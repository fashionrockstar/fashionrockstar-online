# HOME MOTION — 2026-10-09

Home keeps the original 4K artwork, full-screen placement, fingerprint, nine dots, oversized five-link navigation, exact English/Braille literals and social footer. This enhancement adapts the accessible Base44 source into native CSS and JavaScript; it adds no dependencies or sections.

## Source and scope

- Base: development `0046210f57ea9f9d473b9e6b3495b17c1ed9c91f`.
- Inspected live Base44 `Home.jsx`, `HeroVideo.jsx`, `ExploreNav.jsx`, `lib/motion.js` in app `6ac89442c4a3114f40f16fad`.
- Adapted its `cubic-bezier(.16, 1, .3, 1)`, masked lettering, expanding dividers, individual Braille transitions and 2.4-second / 120ms staggered dot wave.
- Preview #2 is an older six-link Home. The latest written handoff and current development require SELECTED WORK / SERVICES / BOOKING / ISSUE 01 / ABOUT plus biometric access. Those approved development elements are retained.
- Shared `styles.css`, original `landing.css`, other pages and all media remain unchanged. Home HTML differs only by two asset includes.
- The earlier draft PR #48 is separate and unmerged; its removal of biometric/About is not included here.

## Resulting behavior

1. The existing hold and interruption interaction remains. Grant starts video preparation, waits for a rendered/decoded frame or the original static fallback, then releases the fingerprint with a thin cold-silver light movement and small fingerprint refraction. The overlay stops intercepting input as the handoff begins. Escape and Skip fail open; all handoff timers are cleared.
2. The original muted, inline, six-second 3840×2160 video loops with `object-fit: contain`. A ready video fades in over 900ms. Media failure / autoplay rejection opens the original static logo; returning Home reuses the session grant.
3. Passive scroll observation drives a small hero opacity change and cue fade without translating or resizing artwork. Dot animation pauses when Home is hidden or the hero leaves view. The nine-dot link scrolls to the existing navigation without snapping.
4. Stationary rows trigger lettering masks and 0.18em translation as they enter view, with 90ms row stagger and 800ms divider expansion. Hidden rows reserve their original space. Keyboard focus reveals a row immediately.
5. Each approved Braille literal receives character opacity / translation transitions. English remains the sole sizing layer. Desktop hover, keyboard focus and touch activate Braille. Pointer navigation remains native on desktop; ordinary touch gets 160ms feedback. Keyboard, modified clicks and reduced-motion activation retain immediate native navigation. Back clears transient activation.

## Validation

- Chrome desktop 1440×900 and mobile emulation 390×844 / 320×740.
- Settled desktop glyph positions match unchanged development exactly. Font size, hero geometry and navigation row bounds also match at desktop and 390px. At 320px all Braille literals fit their rows and document width equals viewport width after reload.
- Initial scroll position: zero navigation rows revealed. Partial scroll: first two rows revealed, remaining three masked. Final scroll: all five rows and divider lines visible.
- Hold completion, interrupted hold, Escape, touch feedback, hover Braille, keyboard focus/navigation, all five routes, Home return and browser Back verified.
- Original video ready state, 4K intrinsic size, muted inline/loop attributes, continued playback and static media failure fallback verified.
- Reduced motion: original static logo, stationary dots, immediately visible rows and immediate link activation. JavaScript disabled: original fallback logo and functional original anchors remain.
- All three JavaScript files pass syntax checks. Original markup equality and Home-only file scope verified; other pages remain byte-identical to the development base.
- Mobile checks use Chrome emulation. Physical iOS/Safari testing is not claimed.

## Review

Use the development Home normally, then scroll or activate the nine dots. To deliberately replay the fingerprint in the same tab, append `?biometric-access=1`. No production publication or main merge is part of this change.
