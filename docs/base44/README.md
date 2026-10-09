# FASHIONROCKSTAR.ONLINE — Base44 design handoff

This package records the website audit, preservation requirements and editorial direction for the existing FASHIONROCKSTAR website. It gives Base44 enough concrete context to critique the design and return useful specifications for the GitHub implementation.

The canonical source is [fashionrockstar/fashionrockstar-online](https://github.com/fashionrockstar/fashionrockstar-online), GitHub main at `b390752bb52c1a93d9f2cf0ac2c9b2abee6e35ad`. Refinement work is isolated on `redesign/editorial-evolution-20261009`. The audited public deployment is <https://benevolent-nasturtium-1b8dd7.netlify.app/>. Source and live differed at audit time; use the source baseline for implementation decisions.

## Base44 integration status — 9 October 2026

The existing Base44 app is `6ac89442c4a3114f40f16fad`. Its editor is <https://app.base44.com/apps/6ac89442c4a3114f40f16fad/editor/preview>.

| Step | Observed result |
| --- | --- |
| App selection | Existing app selected; branch discovery returned main only. |
| Remote sandbox inspection | `base44_list_directory` returned `PREMIUM_REQUIRED`; external coding agents require the Builder plan. |
| Original brief | The built-in `edit_base44_app` tool accepted the original user brief verbatim for this existing app. |
| Audit package transfer | Blocked by the sandbox access gate. The documents, inventory and screenshots in this folder were prepared locally and were **not transferred to the Base44 sandbox**. |
| Builder status and response | Status/conversation reading tools are unavailable in this session. Acceptance of the request does not verify completion. No returned Base44 critique or specification is claimed. |
| Production website | This handoff does not merge GitHub main, deploy the website or publish production changes. |

The adopted specification below is a Codex design decision informed by the audit. It is not attributed to a Base44 response. The prepared context prompt is a separate handoff document; it was not substituted for the exact original brief already sent through the builder tool.

## Read in this order

| File | Purpose |
| --- | --- |
| [inventory.md](inventory.md) | Routes, all 16 projects, original media/content and precise booking invariants. |
| [audit/browser-baseline.md](audit/browser-baseline.md) | Browser observations, source/live drift and verification limits. |
| [audit/content-and-interactions.md](audit/content-and-interactions.md) | Complete content and interaction audit against the immutable source revision. |
| [design-and-implementation-spec.md](design-and-implementation-spec.md) | Adopted typography, spacing, motion and page treatments; implementation and acceptance requirements. |
| [base44-context-prompt.md](base44-context-prompt.md) | Ready-to-submit request for critique and practical specifications, with no production publishing. |
| [baseline-inventory.json](baseline-inventory.json) | Exact route copy, catalogue, galleries, services, form attributes and source/asset hashes. |
| [baseline-preservation.json](baseline-preservation.json) | Machine-readable preservation surfaces and media hashes. |
| [screenshots/README.md](screenshots/README.md) | Links to the validated source-baseline desktop, tablet and mobile captures. |
| [screenshots/manifest.json](screenshots/manifest.json) | Screenshot provenance, viewports, sizes and SHA-256 hashes. |

## Screenshot scope and evidence

The 27 unchanged PNGs show the top of Work, Services, About, Booking, Issue 01 and a representative project at all three viewports, plus Home first entry, looping hero and navigation. They total 3,293,611 bytes (3.14 MiB). The very long full-page Work captures are intentionally excluded from this compact package; the complete source inventory retains every project and media reference.

Desktop is 1440 × 1000, tablet 820 × 1180 and mobile/touch 390 × 844. The capture agents validated the source baseline against `b390752`; their full-page audit loaded offscreen media before acceptance. Top captures retain actual arrival state. These are before screenshots, not evidence of the completed refinement. The browser audit did not send inquiries or exercise external destinations.

## How to use this package

Open the existing Base44 editor and submit [the context prompt](base44-context-prompt.md) with the linked documents and screenshot attachments through a supported editor attachment workflow. If that workflow cannot accept the whole package, submit the inventory, audit findings and specification as text, and attach the representative screenshots in small groups. Do not describe local files as uploaded until transfer is confirmed.

Request a written critique and implementation specification. Review the response against the preservation inventory before adopting recommendations in GitHub. Any design exploration belongs in the existing Base44 app; implementation remains on the isolated GitHub branch. Production merging and publishing are separate actions outside this review package.
