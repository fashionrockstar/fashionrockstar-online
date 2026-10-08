# Mobile entrance verification

Verified homepage code commit `1b80f5b` in the Cloud Chrome browser using the real page in same-origin viewports at **390 × 844**, **430 × 932**, and **844 × 390**. The helper page is isolated from the homepage and is not linked from site navigation.

- The original six-second homepage animation remains present, muted, inline, and looping.
- During the entrance the video stays paused at time zero. At 390 × 844 the first post-loader sample was 0.090 seconds, confirming it starts after the loader closes.
- The loading logo's width and center matched the homepage video artwork with zero measured pixel difference at all three sizes.
- All three viewports had no horizontal overflow, and homepage video playback continued after loading.
- Returning home at 390 × 844 did not replay the loader; the original homepage animation still played.
- The initial harness sampled the outgoing document briefly during repeated navigation. It now ignores that document until the newly requested homepage appears. The quoted 0.090-second measurement came from the first blank-to-home load, unaffected by that issue.

These are responsive browser checks, not physical iPhone/Safari tests or device autoplay-policy emulation. No production homepage changes were needed for these sizes.
