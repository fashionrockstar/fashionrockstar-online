# #SADPRINCESS — issue #4

Direct-link development preview: `/project/?id=15`. This is a separate project from MZRABELLE: PINK SUMMER (id 4). The supplied year 2025, description, roles and credits are retained verbatim.

## Media blocker

No matching originals exist in the development repository or this task's supplied workspace. The only submitted reference is https://www.instagram.com/p/DUbH4qPDevV/?stkn=MjV1aWJybXNzdGI5 . The project uses the canonical permalink as an external Instagram embed with a persistent direct viewing link. It is not a hosted image or video. The post appears once, as the hero; no gallery count or additional order is inferred.

The project is `listed: false`: there is no empty, broken or substitute WORK tile, and existing previous/next navigation skips this preview. The WORK addition and complete local gallery remain blocked on the original cover and the complete approved media sequence. No images from MZRABELLE: PINK SUMMER have been reused.

## Complete after originals are supplied

1. Match the selected first media to the reference and confirm the full approved sequence, including any carousel items.
2. Preserve source filenames and hashes outside the published site. Export WebP widths up to 640, 1280 and 2400 without upscaling, cropping, grading or stretching; prepare MP4/posters only if video is supplied. Record dimensions, provenance and accurate alt descriptions.
3. Replace the provisional cover with the actual hosted media and put only the remaining ordered media in `gallery`. Keep `display: "portrait"`.
4. Add one existing-style `work-row--full work-row--imported` / `work-tile--natural` row in `work/index.html`, linking to id 15 with `data-disciplines="creative-direction photography"`. Use the real responsive cover, or the existing moving-cover controller if applicable. Change `listed` to true only with this cover present.
5. Verify both filters, desktop hover/keyboard title reveal, mobile pause-to-reveal, natural framing, local asset requests and navigation. Keep the pull request in draft until the media requirements are resolved.

No production deployment or merge is part of this change.

## Validation

JavaScript syntax, whitespace and local asset checks pass. All 14 existing project records and the WORK markup, filter/title controller, global styles, media playback controller, homepage and Netlify configuration are unchanged. The existing last project's header, hero, gallery and previous/next links match the development baseline at 1440px; preview id 15 is skipped by public navigation.

The external carousel rendered at desktop 1440px and mobile 390px, with one named iframe and a persistent viewing link. No horizontal overflow was observed. Blocking Instagram's requests leaves the viewing link available without any image/video asset request to a permalink. These checks validate a provisional external page, not a completed hosted gallery or a WORK tile.
