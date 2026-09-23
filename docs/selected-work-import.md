# Selected Work package — September 15, 2026

Source: the supplied WeTransfer archive (50 files). Original archive and extracted files are preserved outside the published repository. File hashes and derivative mapping are in selected-work-media-manifest.json.

## Content decisions

- Order: runway (id 1), campaign (id 6), Micaela (id 2), MOONBOI (id 7), Kaine (id 5), MANSAWORLD (id 3) MZRABELLE (id 4) FASHIONROCKSTARMAXXING (id 8) BLUE (id 9) and CFBA 2026 (id 10), with one Work entry per project.
- At the owner's request, MANSAWORLD's four Work tiles and MZRABELLE's three Work tiles were consolidated into one entry each. They use their established project covers, fr4.jpg and _DSC9338-copy.jpg. Both existing project pages, metadata and complete galleries remain unchanged.
- Runway uses the user's established title, 2026, CREATIVE DIRECTOR – LEAD STYLIST and supplied COVER.mp4. Seven supplied gallery photos.
- Campaign uses the top-level supplied folder title. The two vertical Adobe Express videos are the selected covers, shown side by side on Work. The project opens with both films and native playback controls, followed by all three photos in filename order.
- Micaela retains the established title, year, role and hero because no COVER or replacement metadata was supplied. A film supplied on September 23 through https://adobe.ly/46AYGeP appears after the hero and before the three supplied images, whose order is preserved. At the owner's request it autoplays muted and loops while visible, with no native player toolbar. Click, Enter or Space toggles playback; manual pause is respected. Hidden/offscreen video pauses, and reduced motion uses the poster until manually played. The website hosts its own MP4 and poster. Adobe labels its public rendition 1080p, but the encoded file is 720 × 404 at 30 fps, 21.067 seconds, H.264 with stereo AAC audio. Both streams are copied without recompression into a fast-start MP4, preserving the entire film and audio. The retrieved rendition is archived locally; original downloading is disabled on the Adobe share. See micaela-video-media-manifest.json for provenance and hashes.
- MOONBOI uses the selected 15 - Copie.jpg cover. Its remaining 25 photos, including the former 1.jpg cover, follow in natural numeric filename order.
- Kaine uses the supplied folder title and COVER .jpg, established year/role and seven supplied gallery images.
- Kaine also includes one film after the cover and before its existing gallery photos: https://www.instagram.com/reel/DZVRQytRlJW/ . The owner confirmed https://vt.tiktok.com/ZSq4599eK/ is the same video; it is an alternate viewing link, not a second gallery item. The Instagram embed loads only on this project page, with direct links to both platforms kept available if embedding is blocked. External playback could not be independently verified during this update.
- Files such as 4.jpg and 4 (1).jpg remain distinct. Source filenames are retained in the data/manifest; web filenames are stable normalized derivatives.
- No collaborator credit sheet, project descriptions or other text files were supplied. No credits or descriptions have been invented.

## Needs owner confirmation before production

The owner selected both Campaign videos and MOONBOI's 15 - Copie.jpg on September 15. These choices are implemented on development. [The visual cover review](cover-review.html) labels all three selected files and retains every alternative for inspection. Inspecting an alternative does not change the website.

| Project | Selected cover | Missing year | Missing role | Missing collaborator credits |
| --- | --- | --- | --- | --- |
| FASHIONROCKSTAR X BROKENHEART [CAMPAIGN] | `Adobe Express - 0F06E6AD-3EE5-4400-930F-2F902A7400DC (2) (1).mov` and `Adobe Express - A4B71AD0-4D9E-4646-BB70-8DA29CBA2864 (1).mp4` | Not supplied | Not supplied | Not supplied |
| MOONBOI | `15 - Copie.jpg` | Not supplied | Not supplied | Not supplied |

All these unknown metadata fields remain omitted on the project pages. Collaborator credits for the other projects were also absent and have not been invented. Development deployment can proceed with these review items open; production remains pending owner approval.

## Media

### Portfolio layout update — September 23, 2026

Project titles now use the existing clean UI sans-serif family rather than the condensed display face. Work is a centered two-column grid on desktop and one column on mobile; titles remain visible beneath each cover. Consistent media frames preserve the complete images and paired Campaign videos without cropping. Project pages use compact headings, left-aligned role information, the year on the right, and more space between media. All project text, ordering, source files, navigation and other pages remain intact. These changes are isolated in project-layout.css. Source and playback-controller checks pass; live visual verification remains outstanding because browser automation was unavailable.

47 images exported at up to 640, 1280 and 2400px width, WebP quality 87, EXIF orientation applied and source framing preserved. All source images are sRGB. No crops, grading or sharpening added. Three videos use H.264 CRF 19, original frame rate, maximum width 1080, original audio, MP4 fast-start and poster fallbacks. Work covers play muted and loop only while visible; reduced motion uses posters. Full project videos have native sound/playback controls and no autoplay. The Campaign films sit side by side on desktop and stack on mobile project pages to keep controls usable. Gallery media is lazy-loaded. Each supplied file appears once across its project's covers and gallery; previous covers are retained in their galleries.

## FASHIONROCKSTARMAXXING addition — September 15, 2026

The four separately attached photos form the next project after MZRABELLE (id 8). Title: FASHIONROCKSTARMAXXING. The provisional cover is `1.jpg`, awaiting owner review. Gallery order follows the supplied attachment order: `2 (1).jpg`, `2.jpg`, `3 (2).jpg`. The two files named 2 are distinct photographs and both remain included.

The owner confirmed 2026 and PHOTOGRAPHY – CREATIVE DIRECTION – STYLING. The project appears under Visuals, Creative Direction and Styling in the Work filters. Collaborator credits remain unconfirmed and omitted. No description or credits have been invented. The provisional cover and collaborator credits do not block the development preview.

The originals are preserved locally in `work/project-sources/fashionrockstarmaxxing/originals`, outside the published repository. Their hashes and 12 responsive WebP copies are recorded separately in `fashionrockstarmaxxing-media-manifest.json`; the original 50-file transfer manifest is unchanged. Copies use widths 640, 1280 and 2400px, quality 87 and source framing/color treatment. The cover loads eagerly on the project page; the remaining photos load lazily. No cropping, retouching, grading or sharpening was applied.


## BLUE addition — September 15, 2026

The owner supplied BLUE (2025), with the role PHOTOGRAPHY – CREATIVE DIRECTION – SET DESIGN – STYLING. It follows FASHIONROCKSTARMAXXING in Work (id 9), and appears under the existing Visuals, Creative Direction and Styling filters.

Preserve this explicit attachment order, without numeric re-sorting: `FASHIONROCKSTAR 0135.png` (cover), `FASHIONROCKSTAR 0136.png`, `FASHIONROCKSTAR 0139.png`, `FASHIONROCKSTAR 0138.png`, `FASHIONROCKSTAR 0137.png`. Each supplied editorial layout stays intact, including its white space, rotated imagery, collages, printed credits and blue-grey treatment.

Credits transcribed from the first layout: CREATIVE DIRECTION — FASHIONROCKSTAR; PHOTOGRAPHY ASSISTANT — LEE RIDORE; MODELS — ZAVYER VEGIARD, H.VICK FONTUS. The owner's supplied role appears separately in the project header. No description or additional credits were invented.

All five source PNGs are preserved locally in `work/project-sources/blue/originals`, outside the published repository. `blue-media-manifest.json` records their hashes, source order and 15 website copies at 640, 1280 and 2400px width (WebP quality 90). No crop, recoloring, retouching or rearrangement was applied. The first layout is the project cover; the four remaining layouts are lazy-loaded gallery images.

## CFBA 2026 addition — September 15, 2026

The owner supplied the title CFBA 2026 - FASHIONROCKSTAR X BROKENHEART, year 2026 and role CREATIVE DIRECTION - LEAD STYLING. This is a separate project after BLUE (id 10), appearing under Creative Direction and Styling. Existing Brokenheart Runway and Campaign projects remain intact.

Cover: `JOU.jpg` (printed look 01). The gallery follows the printed look numbers 02–10: `LOOK2 copy.png` through `LOOK10 copy.png`. LOOK9 precedes LOOK10 despite their reversed upload positions. All ten sheets retain their complete layouts, negative-image treatment, typography and directional views.

Model credits are transcribed from the sheets: SAINT JOU, UNKOWNPIGG, NINA, FRANCK, ANNA, LOVE, CIRQUE COSMIC, LEONARD, ANOUK and KILLBILLKAPRI. UNKOWNPIGG retains the supplied spelling. Credits stay printed in each image and are available as text on the project page. No other credits or descriptions were invented.

The ten original files are retained locally in `work/project-sources/cfba-2026/originals`, outside the published repository. `cfba-2026-media-manifest.json` records source hashes, look numbers, model credits and 30 WebP copies at 640, 1280 and 2400px width (quality 90). No crop, recoloring or rearrangement was applied. The project cover loads eagerly and nine gallery sheets load lazily.
