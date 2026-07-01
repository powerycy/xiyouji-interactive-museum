# v2 Scene Draft Rejection Notes

Ten images were generated during the first v2 scene-chain implementation pass and then rejected before product integration.

Reason:

- Core character likeness and constraints drifted too far from the existing chapter character sheets.
- Sun Wukong, Tang Seng, Zhu Bajie, and Sha Seng did not reliably preserve the approved base/chapter-state visual rules.
- Several scenes over-stylized costumes or equipment, which would weaken continuity across the chapter.

Decision:

- Do not reference these images from `content/chapters/chapter-027.seed.json`.
- Do not use them as `/chapter/027` runtime assets.
- Do not commit the rejected bitmap files into this repository. They were about 28 MB total and are not needed by runtime code.
- Keep this note as the negative QA record for the next asset pass.

Rejected filenames:

- `scene-027-01-baihuling-road-v2.png`
- `scene-027-02-demon-motive-v2.png`
- `scene-027-03-first-disguise-v2.png`
- `scene-027-04-wukong-returns-v2.png`
- `scene-027-05-bajie-instigation-v2.png`
- `scene-027-06-second-disguise-v2.png`
- `scene-027-07-third-disguise-v2.png`
- `scene-027-08-skeleton-reveal-v2.png`
- `scene-027-09-banish-wukong-v2.png`
- `scene-027-10-chapter-review-v2.png`

Next asset pass must start from:

- `content/characters/*.base.json`
- `content/chapters/027/characters/*.state.json`
- `public/assets/chapters/027/characters/*-v1.png`
- `docs/ART_DIRECTION.md`

Preferred correction approach:

- Lock character sheets first.
- Generate or compose scenes with those sheets as strong references.
- If generated scenes cannot preserve character consistency, use a layered approach: approved character art plus separately generated backgrounds, props, atmosphere, and detail plates.
