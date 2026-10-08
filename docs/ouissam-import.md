# OUISSAM — issue #5

Direct-link development preview: `/project/?id=16`. This branch adds only OUISSAM. Photography, 2025, CREATIVE DIRECTION, PHOTOGRAPHY and MODEL — OUISSAM are retained as supplied. Optional description is absent.

## Media and blockers

No matching originals exist in the development repository or this task's supplied workspace. Canonical external embeds preserve the submission order:

1. Hero/selected cover: https://www.instagram.com/reel/DJ-jQgKMg8-/ (submitted with `?stkn=MXZkZWJicHdhcnRpcQ==`). This is a reel, not a locally hosted MP4.
2. Gallery: https://www.instagram.com/p/DKExmNJOOMf/ (submitted with `?stkn=aHhxZ20waG1rZGIx`). Browser inspection shows a carousel with a Next control. The whole post is embedded; it is not treated as a single photo. Its complete original sequence and total count require supplied originals.

Each embed retains its direct Instagram viewing link if external loading fails. The reel leads the page and is not duplicated in the gallery. Portrait media uses contained, responsive presentation. Instagram controls playback inside its external player; native hosted playback, sound preservation and the moving WORK cover remain unimplemented until originals arrive.

The project is `listed: false`. No blank, broken or substitute WORK tile is added; existing public previous/next navigation skips this direct-link preview. The missing cover is a blocker, not a completed gallery.

## Complete after originals are supplied

1. Supply the selected reel with its original sound, a suitable portrait poster, and every approved image/video from the second post in carousel order.
2. Archive original filenames and hashes outside the published site. Export responsive WebP copies up to 640, 1280 and 2400px without upscaling/cropping/grading. Make a fast-start MP4 and poster with full framing and sound preserved; record provenance, dimensions and accurate descriptions.
3. Replace the hero with that reel, using existing native playback controls on the project page. Put the second post's complete ordered sequence in `gallery`. Retain `display: "portrait"`; never add the hero reel a second time.
4. Add one existing-style natural WORK tile for id 16 with `data-disciplines="creative-direction photography"`, using the existing `data-cover-video` controller, real MP4 and portrait poster. This preserves muted looping, offscreen pause, reduced-motion poster fallback and title interactions. Change `listed` to true only when the original cover is present.
5. Verify both filters, click-through, mobile pause-to-reveal, desktop hover/keyboard focus, playback controls, natural proportions and all asset requests. Keep the PR in draft while originals are missing.

No production deployment or merge is part of this change.

## Validation

JavaScript syntax, whitespace, unique ID, exact metadata/reference order and local asset checks pass. All 14 existing project records and the WORK markup, filter/title controller, global styles, media playback controller, homepage and Netlify configuration are unchanged. The renderer shared by these separate drafts preserves the existing last project's desktop geometry and public navigation.

Both external embeds rendered at 1440px, 390px and 320px with named iframes, contained widths and no horizontal overflow. The second source exposes the carousel's Next control. With Instagram blocked, both direct links remain usable; fallback links are keyboard accessible. The external reel's Play control was inspected, but sustained OUISSAM playback was not independently confirmed. A hosted moving cover, full local gallery and native sound/playback still require originals.
