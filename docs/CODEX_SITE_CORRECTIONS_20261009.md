# SITE CORRECTIONS — DEVELOPMENT REVIEW

ABOUT is absent from the six active page menus. `/about` and `/about/*` use forced 302 redirects to Home; the original ABOUT page remains unchanged for recovery.

The review branch is `codex/site-corrections-20261009`, based on development commit `0046210f57ea9f9d473b9e6b3495b17c1ed9c91f`. The current main runtime was read at `b390752bb52c1a93d9f2cf0ac2c9b2abee6e35ad`; its page code is selectively restored without merging the branches or importing the separate editorial redesign.

## Changes

- Home: restore the existing simple logo loader, video playback coordination, original mobile WebP loop and reduced-motion still fallback. Remove ABOUT from Explore. The obsolete biometric gate is no longer loaded.
- Work/project: restore the existing cover-continuity runtime and project-media styling. Keep the development catalogue and rendering code unchanged, including all sixteen projects, natural proportions and header-media deduplication.
- Services: reconcile the current main presentation and restrained disclosure motion. Preserve all five disciplines and twenty stages. Retain the mobile two-column composition while allowing text and controls to wrap at 200% text. Show VIEW DETAILS/CLOSE DETAILS labels on mobile. Explicitly hide closed disclosure bodies so cached layouts cannot widen a resized viewport.
- Navigation: remove ABOUT; keep the compact transparent mobile menu. Prevent logo/menu overlap at 320px with enlarged text. When JavaScript is disabled, expose the four primary destinations directly.
- Booking: reconcile the current main page, including visible send control, optional details, same-origin Netlify submission, disabled pending fields, failure recovery and received confirmation. Preserve every registered field name and service preselection.
- ISSUE 01: add the verified artist-led description. Preserve DIGITAL + PRINT and COMING SOON; do not invent a release date or purchase destination.

## Preservation checks

Project data, project rendering, original project media and the original ABOUT source match the development baseline. All 275 local media references in the sixteen-project data resolve. Both restored Home image assets match their existing main-branch Git objects. The shared development typography/caption rules remain intact apart from the narrow mobile header and no-JavaScript navigation additions.

## Verification

Chromium checks cover all sixteen desktop project routes, matching gallery counts, three mobile project variants, natural cover proportions, Work filtering and project return positioning. All six active HTML pages have no ABOUT link and all their referenced local assets resolve.

Services passed five disclosures at 320, 390, 760, 761 and 1440px, plus all five at 320px with text enlarged to 200%. The menu stays transparent and allows document scrolling; Escape closes both menu and discipline disclosure and returns focus. Mobile navigation also exposes its four destinations without JavaScript.

Booking was exercised only against the local simulator: required-field validation, multiple services, optional-field serialization, disabled pending state, HTTP 500 recovery retaining all input, keyboard retry, HTTP 200 confirmation and duplicate-submission protection. Two synthetic requests stayed on `127.0.0.1`; no live inquiry was submitted. The submit control is reachable at both 1440×900 and 1440×650.

Home releases the initial entry, plays the original 3840×2160 video on desktop and uses the existing 1280×720 original animation on mobile. Escape removes entry input blocking. Reduced motion selects a still image and pauses playback. The ABOUT route redirects locally to Home.

Nine loaded scripts pass Node syntax checks; `git diff --check` passes. Detailed results and screenshots are in `references/site-corrections-20261009/`.

## Review limits

The repository does not supply a Neue Montreal webfont file. Existing font declarations and fallbacks are preserved. Netlify form registration was verified, but real delivery and email receipt were not tested. Browser coverage is Chromium on Windows, including responsive emulation; physical Safari/iPhone coverage remains unverified.

The production deploy was locked at `6ac87d48a0599700081b9756`, serving commit `61e121b6332835409f7ee42af91b287311d31085`. This work does not unlock or publish it, modify `main`, merge a pull request, or change domain/access settings.
