# Read-only preservation verification

Run from the repository root with Python 3 and Git. Both scripts use only Python's standard library; no package installation, server, browser or network access is required. Git revision `b390752bb52c1a93d9f2cf0ac2c9b2abee6e35ad` must exist locally for original source comparisons.

```sh
python docs/reviews/editorial-evolution/validation/verify-preservation.py
```

The verifier automatically resolves the repository from its own location, reads `docs/base44/baseline-inventory.json` and `baseline-preservation.json`, and generates fresh current snapshots. It writes `current-inventory.json`, `current-preservation.json` and `final-preservation-comparison.json` under the system temporary directory's `fashionrockstar-preservation` folder. It exits 0 when all 19 checks pass and 1 when a check fails. Source files are read only.

To choose another report directory or baseline location:

```sh
python docs/reviews/editorial-evolution/validation/verify-preservation.py \
  --output-dir /tmp/fashionrockstar-preservation \
  --baseline-dir docs/base44
```

`--repo` accepts another checkout, and `--baseline-revision` overrides the immutable revision recorded by the baseline inventory.

To generate an inventory without comparing it:

```sh
python docs/reviews/editorial-evolution/validation/inventory.py \
  --revision working \
  --prefix /tmp/fashionrockstar-preservation/current
```

The 19 checks preserve all 16 project records and their order, credits, cover pairs, original and rendered gallery ordering; all 496 existing asset hashes; five Services' complete approved copy and links; About and Issue 01 wording/media; Booking fields, options, constraints, honeypot and submission code; original loader markup/timing and hero playback code; primary navigation and asset destinations. Page writing permits case and whitespace normalization. The only specific content exceptions are About's repaired Angelina project link and Booking's decorative, aria-hidden arrow replaced by CSS.

These source checks complement the recorded browser checks. They do not replace viewport, focus, motion, media playback or intercepted form-request validation, and they never submit an inquiry or deploy a site.
