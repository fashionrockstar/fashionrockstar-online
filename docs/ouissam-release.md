# OUISSAM Project 01 production release

The owner approved PR #19's verified reset preview on 2026-10-08. PR #19 was merged to development. This release is based on production commit acec8100531e3697fe0a1b2973525b3f444ae893 and carries only the approved catalogue reset from f731760.

The Work conflict is resolved by retaining production's surrounding document and replacing only the catalogue section. The approved larger two-tier mobile/desktop caption is reproduced with Work-scoped rules in project-media.css. Shared styles, homepage, booking and other routes stay byte-for-byte equal to the production base. Existing cover-continuity resources remain present; their numeric-ID transition handler declines the new slug and ordinary navigation remains usable.

The previous production overview/detail markup is archived alongside the development snapshot. All old media files remain intact. To undo this release, revert its release commit and deploy the revert.

Publish only the verified new production build for this release, retaining the current manual publication gate.
