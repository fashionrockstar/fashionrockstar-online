# Opening and return motion fix — 8 October 2026

Implementation: `1587fb4d106c2936db341000f46512314a0daad4`, on PR 14.

A project hero may select a different responsive file from the Work cover. The old arrival check cancelled the native transition while that file was loading, even though a usable outgoing photograph had already been captured. The return was more likely to work because the image was cached.

The transition now animates the existing outgoing photograph into the destination rectangle. A loading destination does not cancel it. The source snapshot remains solid until the destination decodes, with an upper bound of 1.8 seconds. The approved movement remains 680 ms. Reduced motion, unsupported navigation, invalid/mismatched media and offscreen sources retain their existing fallback.

Verified on the deployed Netlify preview in the cloud Chrome browser: a first visit to KAINE BASQUIAT from its loaded Work cover, return via Back to work, browser Back and Forward, restored cover position, no leaked transition names, and loading-state cleanup. Successful native `ready` events were observed through the DOM `data-cover-motion` marker in both directions. This pass did not run physical mobile/Safari testing.

`node docs/reviews/cover-continuity/cold-arrival.test.cjs` passes isolated lifecycle regressions for cold opening and return, image decode/error, reduced motion, stale/mismatched journeys, scroll restoration, the bounded hold, and cleanup. These simulated lifecycle checks do not replace browser verification.

Preview: https://deploy-preview-14--benevolent-nasturtium-1b8dd7.netlify.app/work/
