# Portrait preview derivatives

These JPEGs are browser derivatives of the supplied `face 1.6.tif`
(4000 × 6000) and `FACE ZAVYER copy(1).png` (1365 × 2048).
The original TIFF and PNG are not published in this directory.

| File | Dimensions | Bytes |
| --- | --- | ---: |
| negative-480.jpg | 480 × 720 | 39,212 |
| negative-960.jpg | 960 × 1440 | 144,725 |
| xray-480.jpg | 480 × 720 | 39,674 |
| xray-960.jpg | 960 × 1440 | 131,579 |

The pair was inspected at matching normalized coordinates: the hairline,
eyes and chin already register. No feature warping or generated detail was
added. Both sizes are downsampled, not restored or upscaled artwork.

The query-only renderer in `assets/js/face-preview.js` applies the same edge
feather, scan window and local strip displacement to both placements.
JPEG export uses high-quality bicubic resampling at quality 85. The smaller
pair totals 78,886 bytes; the larger pair totals 276,304 bytes.
