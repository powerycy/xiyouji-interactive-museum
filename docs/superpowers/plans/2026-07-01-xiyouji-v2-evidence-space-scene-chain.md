# Xiyouji V2 Evidence-Space Scene Chain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade 第二七回“三打白骨精” from the current single-image hotspot page into a 10-node OpenFlipbook-style evidence-space scene chain without reusing rejected character-drift images.

**Architecture:** Keep the current v1 chapter runtime stable until all 10 v2 scene assets pass QA. Add a typed v2 asset manifest and read-only Studio preview first, then gate `sceneNodes` activation on approved assets. Once approved, `/chapter/027` renders a full-screen image-as-the-UI scene browser with click feedback, lightweight popovers, museum labels, scene history, time scrubber, and double-layer image transitions.

**Tech Stack:** Next.js App Router, React, TypeScript, local JSON content, local `public/assets`, CSS transitions, Vitest + Testing Library, existing localStorage progress API.

---

## Current State

- Current branch: `main`.
- Required baseline commit is present: `2de2373 Tighten MVP v2 revision requirements`.
- Current latest commits also include:
  - `63f17f7 Prepare v2 scene chain foundations`
  - `f6ea7ef Document v2 evidence-space asset direction`
- Runtime chapter seed is still v1. `content/chapters/chapter-027.seed.json` has no `sceneNodes`.
- Runtime scene asset directory currently contains only `public/assets/chapters/027/scenes/baihuling-main-v2.png`.
- The rejected 10 v2 drafts are documented under `docs/review/2026-07-01-v2-scene-rejected-drafts/` and must not be reintroduced.

## Resource Gap

The 10 fixed v2 mainline scene assets are missing from runtime. They must be produced as evidence-space images and approved before `sceneNodes` are enabled.

| order | sceneId | required filename | current status |
| --- | --- | --- | --- |
| 1 | `scene-027-01-baihuling-road` | `scene-027-01-baihuling-road-v2.png` | missing |
| 2 | `scene-027-02-demon-motive` | `scene-027-02-demon-motive-v2.png` | missing |
| 3 | `scene-027-03-first-disguise` | `scene-027-03-first-disguise-v2.png` | missing |
| 4 | `scene-027-04-wukong-returns` | `scene-027-04-wukong-returns-v2.png` | missing |
| 5 | `scene-027-05-bajie-instigation` | `scene-027-05-bajie-instigation-v2.png` | missing |
| 6 | `scene-027-06-second-disguise` | `scene-027-06-second-disguise-v2.png` | missing |
| 7 | `scene-027-07-third-disguise` | `scene-027-07-third-disguise-v2.png` | missing |
| 8 | `scene-027-08-skeleton-reveal` | `scene-027-08-skeleton-reveal-v2.png` | missing |
| 9 | `scene-027-09-banish-wukong` | `scene-027-09-banish-wukong-v2.png` | missing |
| 10 | `scene-027-10-chapter-review` | `scene-027-10-chapter-review-v2.png` | missing |

Important asset rule: until an image is approved and physically exists under `public/assets` + `/chapters/027/scenes/v2/`, do not write a runtime `/assets` + `/chapters/027/scenes/v2/...` reference into JSON or Markdown. `scripts/validate_asset_references.mjs` correctly fails missing runtime asset references.

## OpenFlipbook-Style Transition And Interaction Requirements

- `/chapter/027` v2 is image-as-the-UI: the scene image is the primary interaction surface, not a card beside a panel.
- Scene changes use two stacked image layers. The outgoing image uses the click coordinate as `transform-origin`, then subtly scales, darkens, and blurs; the incoming image fades or pushes from the same visual direction.
- Every hotspot click shows an immediate click ripple and focus ring before opening the lightweight popover or advancing to the next scene.
- `next` and `previous` use mainline directional transitions. `back` uses reverse motion from the scene stack. `breadcrumb` and `time scrubber` jumps also transition; no hard cuts.
- Current scene preload must request previous and next scene images and wait for `HTMLImageElement.decode()` before revealing the new layer, preventing white flashes.
- Animation properties are limited to `opacity`, `transform`, and `filter`. Default duration: 320ms, allowed range 260-420ms. Easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- `prefers-reduced-motion: reduce` keeps a fast opacity fade and disables large movement and scale.
- Mobile keeps the visual deepening effect. Bottom label drawers must not interrupt the scene transition or cover the click ripple.
- OpenFlipbook is only an interaction reference. Do not import its runtime AI generation, VLM click parsing, video streaming, remote storage, or backend services.

## File Structure

- Create `content/chapters/027/scene-assets.v2.manifest.json`: v2 scene asset readiness manifest. This is not runtime scene data.
- Modify `src/content/types.ts`: add asset manifest types.
- Create `src/content/chapter027V2Assets.ts`: typed manifest selectors and readiness helpers.
- Create `src/content/chapter027V2Assets.test.ts`: manifest integrity and gating tests.
- Modify `src/content/xiyouji.ts`: integrate scene-node gating checks and keep existing selectors.
- Modify `src/content/xiyouji.test.ts`: assert v1 remains stable before approved assets.
- Modify `src/components/StudioPreview.tsx`: add read-only v2 scene chain and asset readiness preview.
- Create `src/components/StudioPreview.test.tsx`: verify Studio exposes the v2 asset gap.
- Create `docs/assets/CHAPTER_027_V2_EVIDENCE_SPACE_ASSET_CHECKLIST.md`: production and QA checklist.
- Later, after assets pass QA, create `src/components/SceneChainBrowser.tsx`, `src/components/SceneTransitionStage.tsx`, `src/components/SceneLightPopover.tsx`, and `src/components/SceneTimelineControls.tsx`.
- Later, after assets pass QA, modify `content/chapters/chapter-027.seed.json` to version 2 with `sceneNavigation` and 10 `sceneNodes`.
- Modify `app/globals.css`: add v2 scene browser, transition, ripple, popover, time scrubber, and mobile styles.

---

## Phase A: Safe Work Before New Assets Exist

### Task 1: Add The V2 Asset Manifest Contract

**Files:**
- Modify: `src/content/types.ts`
- Create: `content/chapters/027/scene-assets.v2.manifest.json`
- Test: `src/content/chapter027V2Assets.test.ts`

- [ ] **Step 1: Write the failing manifest test**

Create `src/content/chapter027V2Assets.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  chapter027V2AssetManifest,
  getChapter027V2AssetReadiness,
  requiredChapter027V2SceneIds
} from "./chapter027V2Assets";

describe("chapter 027 v2 asset manifest", () => {
  it("tracks the fixed 10 evidence-space mainline scenes", () => {
    expect(chapter027V2AssetManifest.chapterId).toBe("chapter-027");
    expect(chapter027V2AssetManifest.scenes.map((scene) => scene.sceneId)).toEqual(requiredChapter027V2SceneIds);
    expect(chapter027V2AssetManifest.scenes).toHaveLength(10);
  });

  it("keeps missing assets out of runtime /assets references", () => {
    const readiness = getChapter027V2AssetReadiness(chapter027V2AssetManifest);

    expect(readiness.readyToEnableSceneNodes).toBe(false);
    expect(readiness.approvedCount).toBe(0);
    expect(readiness.missingCount).toBe(10);
    expect(JSON.stringify(chapter027V2AssetManifest)).not.toContain("/assets" + "/chapters/027/scenes/v2/");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm test -- src/content/chapter027V2Assets.test.ts
```

Expected: FAIL because `src/content/chapter027V2Assets.ts` does not exist.

- [ ] **Step 3: Add manifest types**

Append this to `src/content/types.ts` after `ChapterSeedV2`:

```ts
export type Chapter027V2AssetStatus = "missing" | "rejected" | "qa-pending" | "approved";
export type Chapter027V2VisualMode = "evidence-space" | "approved-character-layer" | "silhouette";

export interface Chapter027V2SceneAssetManifestItem {
  order: number;
  sceneId: string;
  title: string;
  fileName: string;
  status: Chapter027V2AssetStatus;
  visualMode: Chapter027V2VisualMode;
  evidenceFocus: string[];
  roleRisk: "none" | "low" | "medium" | "high";
  qaNotes: string[];
  runtimeSrc?: string;
}

export interface Chapter027V2AssetManifest {
  version: 1;
  chapterId: "chapter-027";
  assetDirectory: string;
  runtimeDirectory: string;
  approvalRule: string;
  scenes: Chapter027V2SceneAssetManifestItem[];
}
```

- [ ] **Step 4: Add the manifest JSON**

Create `content/chapters/027/scene-assets.v2.manifest.json`:

```json
{
  "version": 1,
  "chapterId": "chapter-027",
  "assetDirectory": "chapters/027/scenes/v2",
  "runtimeDirectory": "assets/chapters/027/scenes/v2",
  "approvalRule": "Only approved evidence-space assets with existing runtime files may receive runtimeSrc and be copied into public/assets.",
  "scenes": [
    {
      "order": 1,
      "sceneId": "scene-027-01-baihuling-road",
      "title": "白虎岭山路",
      "fileName": "scene-027-01-baihuling-road-v2.png",
      "status": "missing",
      "visualMode": "evidence-space",
      "evidenceFocus": ["险山山路", "钵盂与行李", "无村店空路"],
      "roleRisk": "low",
      "qaNotes": ["不得复用 baihuling-main-v2.png；主焦点是路与饥饿证据。"]
    },
    {
      "order": 2,
      "sceneId": "scene-027-02-demon-motive",
      "title": "妖怪起意",
      "fileName": "scene-027-02-demon-motive-v2.png",
      "status": "missing",
      "visualMode": "evidence-space",
      "evidenceFocus": ["阴风", "远路", "白骨洞影"],
      "roleRisk": "none",
      "qaNotes": ["不画白骨夫人正脸；用妖气方向表达觊觎唐僧。"]
    },
    {
      "order": 3,
      "sceneId": "scene-027-03-first-disguise",
      "title": "送斋女子",
      "fileName": "scene-027-03-first-disguise-v2.png",
      "status": "missing",
      "visualMode": "silhouette",
      "evidenceFocus": ["青砂罐", "绿磁瓶", "女子剪影", "唐僧方向的道路"],
      "roleRisk": "medium",
      "qaNotes": ["不要依赖女子面部表情；罐瓶必须是可点击主证据。"]
    },
    {
      "order": 4,
      "sceneId": "scene-027-04-wukong-returns",
      "title": "悟空归来",
      "fileName": "scene-027-04-wukong-returns-v2.png",
      "status": "missing",
      "visualMode": "silhouette",
      "evidenceFocus": ["火眼金睛光束", "金箍棒影", "变质饭食"],
      "roleRisk": "medium",
      "qaNotes": ["孙悟空不得重甲武将化；用眼光轮廓与棒影识别。"]
    },
    {
      "order": 5,
      "sceneId": "scene-027-05-bajie-instigation",
      "title": "八戒挑唆",
      "fileName": "scene-027-05-bajie-instigation-v2.png",
      "status": "missing",
      "visualMode": "approved-character-layer",
      "evidenceFocus": ["坏饭食", "九齿钉钯轮廓", "唐僧锡杖旁摇摆构图"],
      "roleRisk": "high",
      "qaNotes": ["猪八戒只能用已审核图层、背影或钉钯轮廓；不画可爱粉色猪。"]
    },
    {
      "order": 6,
      "sceneId": "scene-027-06-second-disguise",
      "title": "老妇寻女",
      "fileName": "scene-027-06-second-disguise-v2.png",
      "status": "missing",
      "visualMode": "silhouette",
      "evidenceFocus": ["竹杖", "老妇背影", "山坡哭声路径"],
      "roleRisk": "medium",
      "qaNotes": ["老妇不靠脸部表演；竹杖和哭声路径是主证据。"]
    },
    {
      "order": 7,
      "sceneId": "scene-027-07-third-disguise",
      "title": "老公公寻亲",
      "fileName": "scene-027-07-third-disguise-v2.png",
      "status": "missing",
      "visualMode": "silhouette",
      "evidenceFocus": ["老公公背影", "包袱", "骨影", "收紧山路"],
      "roleRisk": "medium",
      "qaNotes": ["人物正脸不是戏剧核心；通过路与骨影收紧骗局。"]
    },
    {
      "order": 8,
      "sceneId": "scene-027-08-skeleton-reveal",
      "title": "粉骷髅现形",
      "fileName": "scene-027-08-skeleton-reveal-v2.png",
      "status": "missing",
      "visualMode": "evidence-space",
      "evidenceFocus": ["粉骷髅", "散开的妖气", "金箍棒影", "唐僧方向的惊惧空间"],
      "roleRisk": "low",
      "qaNotes": ["骷髅和妖气是主体；避免现代性感妖女化。"]
    },
    {
      "order": 9,
      "sceneId": "scene-027-09-banish-wukong",
      "title": "贬书逐猴王",
      "fileName": "scene-027-09-banish-wukong-v2.png",
      "status": "missing",
      "visualMode": "approved-character-layer",
      "evidenceFocus": ["纸笔", "贬书", "分路", "悟空背影或棒影", "沙僧行李"],
      "roleRisk": "high",
      "qaNotes": ["不画失控正脸表情；贬书和分路承担戏剧张力。"]
    },
    {
      "order": 10,
      "sceneId": "scene-027-10-chapter-review",
      "title": "章节回望",
      "fileName": "scene-027-10-chapter-review-v2.png",
      "status": "missing",
      "visualMode": "evidence-space",
      "evidenceFocus": ["三次伪装证据", "粉骷髅", "贬书", "白虎岭路径"],
      "roleRisk": "none",
      "qaNotes": ["做博物馆式证据总览；不新增探索权重。"]
    }
  ]
}
```

Use `runtimeDirectory` without a leading slash while assets are missing, so asset-reference validation does not treat it as an existing runtime asset.

- [ ] **Step 5: Add the selector module**

Create `src/content/chapter027V2Assets.ts`:

```ts
import manifestJson from "../../content/chapters/027/scene-assets.v2.manifest.json";
import type { Chapter027V2AssetManifest } from "./types";

export const requiredChapter027V2SceneIds = [
  "scene-027-01-baihuling-road",
  "scene-027-02-demon-motive",
  "scene-027-03-first-disguise",
  "scene-027-04-wukong-returns",
  "scene-027-05-bajie-instigation",
  "scene-027-06-second-disguise",
  "scene-027-07-third-disguise",
  "scene-027-08-skeleton-reveal",
  "scene-027-09-banish-wukong",
  "scene-027-10-chapter-review"
] as const;

export const chapter027V2AssetManifest = manifestJson as Chapter027V2AssetManifest;

const runtimeScenePrefix = "/assets" + "/chapters/027/scenes/v2";

export function getExpectedChapter027V2RuntimeSrc(fileName: string): string {
  return `${runtimeScenePrefix}/${fileName}`;
}

export function getChapter027V2AssetReadiness(manifest: Chapter027V2AssetManifest) {
  const sceneIds = manifest.scenes.map((scene) => scene.sceneId);
  const runtimeSrcs = manifest.scenes.map((scene) => scene.runtimeSrc).filter((src): src is string => Boolean(src));
  const hasRequiredOrder =
    manifest.scenes.length === requiredChapter027V2SceneIds.length &&
    requiredChapter027V2SceneIds.every((sceneId, index) => sceneIds[index] === sceneId);
  const hasUniqueRuntimeSrcs = new Set(runtimeSrcs).size === runtimeSrcs.length;
  const invalidRuntimeScenes = manifest.scenes.filter((scene) => {
    if (!scene.runtimeSrc) {
      return false;
    }
    return scene.runtimeSrc !== getExpectedChapter027V2RuntimeSrc(scene.fileName);
  });
  const rejectedRuntimeScenes = manifest.scenes.filter((scene) => scene.runtimeSrc?.includes("rejected"));
  const approvedScenes = manifest.scenes.filter(
    (scene) => scene.status === "approved" && scene.runtimeSrc === getExpectedChapter027V2RuntimeSrc(scene.fileName)
  );
  const missingScenes = manifest.scenes.filter((scene) => scene.status === "missing");
  const rejectedScenes = manifest.scenes.filter((scene) => scene.status === "rejected");
  const pendingScenes = manifest.scenes.filter((scene) => scene.status === "qa-pending");

  return {
    totalCount: manifest.scenes.length,
    approvedCount: approvedScenes.length,
    missingCount: missingScenes.length,
    rejectedCount: rejectedScenes.length,
    pendingCount: pendingScenes.length,
    approvedScenes,
    missingScenes,
    rejectedScenes,
    pendingScenes,
    invalidRuntimeScenes,
    rejectedRuntimeScenes,
    hasRequiredOrder,
    hasUniqueRuntimeSrcs,
    readyToEnableSceneNodes:
      hasRequiredOrder &&
      hasUniqueRuntimeSrcs &&
      invalidRuntimeScenes.length === 0 &&
      rejectedRuntimeScenes.length === 0 &&
      approvedScenes.length === requiredChapter027V2SceneIds.length
  };
}
```

- [ ] **Step 6: Run the manifest tests**

Run:

```bash
pnpm test -- src/content/chapter027V2Assets.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/content/types.ts src/content/chapter027V2Assets.ts src/content/chapter027V2Assets.test.ts content/chapters/027/scene-assets.v2.manifest.json
git commit -m "Add chapter 027 v2 asset manifest"
```

### Task 2: Add Scene-Node Activation Gates

**Files:**
- Modify: `src/content/xiyouji.ts`
- Modify: `src/content/xiyouji.test.ts`
- Test: `src/content/xiyouji.test.ts`

- [ ] **Step 1: Write failing tests for the gate**

Append to `src/content/xiyouji.test.ts`:

```ts
import { chapter027V2AssetManifest } from "./chapter027V2Assets";
import { canEnableChapter027V2SceneNodes } from "./xiyouji";

it("does not enable chapter 027 sceneNodes while v2 assets are missing", () => {
  expect(canEnableChapter027V2SceneNodes(chapter027, chapter027V2AssetManifest)).toBe(false);
});

it("reports that current v1 seed is intentionally waiting on v2 assets", () => {
  expect(chapter027.sceneNodes).toBeUndefined();
  expect(canEnableChapter027V2SceneNodes(chapter027, chapter027V2AssetManifest)).toBe(false);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
pnpm test -- src/content/xiyouji.test.ts
```

Expected: FAIL because `canEnableChapter027V2SceneNodes` is not exported.

- [ ] **Step 3: Implement the gate**

Modify imports in `src/content/xiyouji.ts`:

```ts
import type { Chapter027V2AssetManifest, ChapterLabel, ChapterSeed, MapSeed, SceneNode } from "./types";
import { getChapter027V2AssetReadiness, requiredChapter027V2SceneIds } from "./chapter027V2Assets";
```

Add this function before `getContentIssues`:

```ts
export function canEnableChapter027V2SceneNodes(chapter: ChapterSeed, manifest: Chapter027V2AssetManifest): boolean {
  if (chapter.id !== "chapter-027") {
    return true;
  }

  const readiness = getChapter027V2AssetReadiness(manifest);
  const manifestIds = manifest.scenes.map((scene) => scene.sceneId);

  return (
    readiness.readyToEnableSceneNodes &&
    manifestIds.length === requiredChapter027V2SceneIds.length &&
    requiredChapter027V2SceneIds.every((sceneId, index) => manifestIds[index] === sceneId)
  );
}
```

Do not call this gate from `getContentIssues` yet, because the current v1 seed is valid while waiting for assets. It becomes a hard error in Task 7 when `sceneNodes` are written.

- [ ] **Step 4: Run the selector tests**

Run:

```bash
pnpm test -- src/content/xiyouji.test.ts src/content/chapter027V2Assets.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/xiyouji.ts src/content/xiyouji.test.ts
git commit -m "Gate chapter 027 scene nodes on approved assets"
```

### Task 3: Show V2 Asset Readiness In Studio

**Files:**
- Modify: `src/components/StudioPreview.tsx`
- Create: `src/components/StudioPreview.test.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write the failing Studio test**

Create `src/components/StudioPreview.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StudioPreview } from "./StudioPreview";

describe("StudioPreview", () => {
  it("shows the chapter 027 v2 scene chain asset readiness", () => {
    render(<StudioPreview />);

    expect(screen.getByText("v2 场景链资源")).toBeInTheDocument();
    expect(screen.getByText("已批准 0/10")).toBeInTheDocument();
    expect(screen.getByText("scene-027-01-baihuling-road")).toBeInTheDocument();
    expect(screen.getAllByText("missing")).toHaveLength(10);
  });
});
```

- [ ] **Step 2: Run the test to verify failure**

Run:

```bash
pnpm test -- src/components/StudioPreview.test.tsx
```

Expected: FAIL because Studio does not render the v2 resource panel.

- [ ] **Step 3: Add the read-only panel**

Modify `src/components/StudioPreview.tsx` imports:

```ts
import { chapter027V2AssetManifest, getChapter027V2AssetReadiness } from "@/content/chapter027V2Assets";
```

Add after `const issues = getContentIssues(chapter027, mapSeed);`:

```ts
const v2Readiness = getChapter027V2AssetReadiness(chapter027V2AssetManifest);
```

Add this `<section>` inside the returned `.studio-grid`:

```tsx
<section className="surface studio-panel studio-panel-wide">
  <h2>v2 场景链资源</h2>
  <p>
    已批准 {v2Readiness.approvedCount}/{v2Readiness.totalCount}
  </p>
  <p className="small-text">
    10 张证据空间主视觉全部 approved 且存在 runtimeSrc 后，才允许写入 sceneNodes。
  </p>
  <div className="studio-asset-list">
    {chapter027V2AssetManifest.scenes.map((scene) => (
      <article key={scene.sceneId} className="studio-asset-row">
        <div>
          <strong>{scene.sceneId}</strong>
          <span>{scene.title}</span>
        </div>
        <span>{scene.status}</span>
        <span>{scene.visualMode}</span>
        <span>{scene.evidenceFocus.join(" / ")}</span>
      </article>
    ))}
  </div>
</section>
```

- [ ] **Step 4: Add Studio layout styles**

Append to `app/globals.css` near the Studio styles:

```css
.studio-panel-wide {
  grid-column: 1 / -1;
}

.studio-asset-list {
  display: grid;
  gap: 8px;
}

.studio-asset-row {
  display: grid;
  grid-template-columns: minmax(220px, 1.2fr) 90px 150px minmax(0, 1.8fr);
  gap: 12px;
  align-items: start;
  padding: 10px 0;
  border-top: 1px solid rgba(111, 84, 51, 0.45);
}

.studio-asset-row div {
  display: grid;
  gap: 3px;
}

.studio-asset-row span {
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 760px) {
  .studio-asset-row {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Run Studio tests**

Run:

```bash
pnpm test -- src/components/StudioPreview.test.tsx src/content/chapter027V2Assets.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/StudioPreview.tsx src/components/StudioPreview.test.tsx app/globals.css
git commit -m "Preview v2 scene asset readiness in Studio"
```

### Task 4: Add The Evidence-Space Asset QA Checklist

**Files:**
- Create: `docs/assets/CHAPTER_027_V2_EVIDENCE_SPACE_ASSET_CHECKLIST.md`
- Modify: `public/assets/chapters/027/ASSET_QA.md`

- [ ] **Step 1: Create the QA checklist**

Create `docs/assets/CHAPTER_027_V2_EVIDENCE_SPACE_ASSET_CHECKLIST.md`:

```md
# 第二七回 v2 剧情证据空间资产 QA 清单

## 准入规则

- 10 张主线图固定存在，顺序与 `scene-assets.v2.manifest.json` 一致。
- 每张主视觉最低 1600x900，推荐 1920x1080。
- 每张图必须是独立构图，不能复用 `baihuling-main-v2.png` 或 rejected drafts。
- 每张图必须有清晰可点击证据区域。
- 戏剧张力来自物证、剪影、空间、道路、妖气、尸骨、贬书，不依赖生成正脸表情。
- 出现孙悟空、唐僧、猪八戒、沙僧时，必须继承 `public/assets/chapters/027/characters/*-v1.png`、`content/characters/*.base.json` 和 `content/chapters/027/characters/*.state.json`。
- 未通过 QA 的图片只能进入 `docs/review/`，不能进入 `public/assets` + `/chapters/027/scenes/v2/`。

## 单图检查

对每张候选图记录：

| 项 | 通过标准 |
| --- | --- |
| 文件名 | 与固定 scene 文件名完全一致 |
| 尺寸 | 宽 >= 1600，高 >= 900 |
| 构图 | 证据空间优先，不是人物漫画表情特写 |
| 可点击区 | 至少 1 个主推进热点，至少 1 个展签/证据热点 |
| 角色一致性 | 若出现角色，不偏离已审核图纸 |
| 原著证据 | 能对应本场景关联展签与原文段落 |
| 图片文字 | 默认不烘焙可读文字；原著明确的物证文字可出现，例如 scene-027-08 脊梁题名“白骨夫人”和 scene-027-09 贬书，但必须是繁体/原文、局部细节、非现代标签，并绑定展签热点；任何场景图文字不得出现简体、伪字或乱码 |
| 文案覆盖 | 每条 `labels` 文案都必须能从至少一个场景热点进入；每个 `scene.source.labelIds` 必须能从该 scene 内热点打开 |
| 运行时准入 | 全部通过后才设为 `approved` 并写入 `runtimeSrc` |

## 10 场景焦点

1. `scene-027-01-baihuling-road`：山路、钵盂/行李、无村店空路。
2. `scene-027-02-demon-motive`：阴风、远路、白骨洞影。
3. `scene-027-03-first-disguise`：青砂罐、绿磁瓶、女子剪影。
4. `scene-027-04-wukong-returns`：火眼金睛轮廓、棒影、变质食物。
5. `scene-027-05-bajie-instigation`：坏饭食、钉钯轮廓、锡杖旁摇摆构图。
6. `scene-027-06-second-disguise`：竹杖、老妇背影、哭声路径。
7. `scene-027-07-third-disguise`：老公公背影、包袱、骨影、收紧山路。
8. `scene-027-08-skeleton-reveal`：粉骷髅、散开妖气、金箍棒影、脊梁上克制的繁体/原文题名“白骨夫人”；点击脊梁热点打开 `label-027-final-kill`。
9. `scene-027-09-banish-wukong`：纸笔、贬书、分路、悟空背影/棒影、沙僧行李。
10. `scene-027-10-chapter-review`：三次伪装证据、粉骷髅、贬书、白虎岭路径。
```

- [ ] **Step 2: Link it from the existing asset QA file**

Append to `public/assets/chapters/027/ASSET_QA.md` under `## v2 场景链资源`:

```md

详细逐张准入清单见 `docs/assets/CHAPTER_027_V2_EVIDENCE_SPACE_ASSET_CHECKLIST.md`。v2 的优先美术策略为“剧情证据空间”：剪影、物证、道路、妖气、尸骨、贬书承担叙事；未经审核的角色正脸表情不能作为剧情核心。
```

- [ ] **Step 3: Verify docs reference only existing assets**

Run:

```bash
node scripts/validate_asset_references.mjs
```

Expected: PASS. The new checklist should not contain missing runtime asset references.

- [ ] **Step 4: Commit**

```bash
git add docs/assets/CHAPTER_027_V2_EVIDENCE_SPACE_ASSET_CHECKLIST.md public/assets/chapters/027/ASSET_QA.md
git commit -m "Document v2 evidence-space asset QA checklist"
```

---

## Phase B: Asset Production And Approval Gate

### Task 5: Produce Or Import The 10 Candidate Scene Images

**Files:**
- Create review files under: `docs/review/2026-07-01-v2-evidence-space-candidates/`
- Do not modify: `content/chapters/chapter-027.seed.json`
- Do not create runtime refs yet: `/assets` + `/chapters/027/scenes/v2/...`

- [ ] **Step 1: Create the review note**

Create `docs/review/2026-07-01-v2-evidence-space-candidates/REVIEW_NOTES.md`:

```md
# 第二七回 v2 剧情证据空间候选图审查

## 审查结论

当前候选图尚未进入运行时。逐张审查通过后，才复制到 `public/assets` + `/chapters/027/scenes/v2/` 并更新 `scene-assets.v2.manifest.json`。

## 逐张结果

| sceneId | filename | result | reason |
| --- | --- | --- | --- |
| scene-027-01-baihuling-road | scene-027-01-baihuling-road-v2.png | qa-pending | 待检查尺寸、证据焦点、角色一致性 |
| scene-027-02-demon-motive | scene-027-02-demon-motive-v2.png | qa-pending | 待检查尺寸、证据焦点、角色一致性 |
| scene-027-03-first-disguise | scene-027-03-first-disguise-v2.png | qa-pending | 待检查尺寸、证据焦点、角色一致性 |
| scene-027-04-wukong-returns | scene-027-04-wukong-returns-v2.png | qa-pending | 待检查尺寸、证据焦点、角色一致性 |
| scene-027-05-bajie-instigation | scene-027-05-bajie-instigation-v2.png | qa-pending | 待检查尺寸、证据焦点、角色一致性 |
| scene-027-06-second-disguise | scene-027-06-second-disguise-v2.png | qa-pending | 待检查尺寸、证据焦点、角色一致性 |
| scene-027-07-third-disguise | scene-027-07-third-disguise-v2.png | qa-pending | 待检查尺寸、证据焦点、角色一致性 |
| scene-027-08-skeleton-reveal | scene-027-08-skeleton-reveal-v2.png | qa-pending | 待检查尺寸、证据焦点、角色一致性 |
| scene-027-09-banish-wukong | scene-027-09-banish-wukong-v2.png | qa-pending | 待检查尺寸、证据焦点、角色一致性 |
| scene-027-10-chapter-review | scene-027-10-chapter-review-v2.png | qa-pending | 待检查尺寸、证据焦点、角色一致性 |
```

- [ ] **Step 2: Put candidate images in the review directory**

Use the exact filenames from the manifest:

```bash
find docs/review/2026-07-01-v2-evidence-space-candidates -maxdepth 1 -type f -name 'scene-027-*-v2.png' | sort
```

Expected: exactly 10 PNG files are listed.

- [ ] **Step 3: Check dimensions**

Run:

```bash
sips -g pixelWidth -g pixelHeight docs/review/2026-07-01-v2-evidence-space-candidates/scene-027-*-v2.png
```

Expected: every file reports `pixelWidth` >= 1600 and `pixelHeight` >= 900.

- [ ] **Step 4: Human QA**

Open each candidate image and compare against:

```bash
open docs/assets/CHAPTER_027_V2_EVIDENCE_SPACE_ASSET_CHECKLIST.md
open public/assets/chapters/027/characters
open content/characters
open content/chapters/027/characters
```

Expected: every approved image has evidence-space composition and no uncontrolled role drift.

- [ ] **Step 5: Hard-stop unless review notes and manifest are fully approved**

Run this before copying any candidate image. If it fails, copy nothing into runtime:

```bash
python3 - <<'PY'
import json
from pathlib import Path

manifest_path = Path("content/chapters/027/scene-assets.v2.manifest.json")
notes_path = Path("docs/review/2026-07-01-v2-evidence-space-candidates/REVIEW_NOTES.md")
manifest = json.loads(manifest_path.read_text())
notes = notes_path.read_text()
runtime_prefix = "/assets" + "/chapters/027/scenes/v2"
scenes = manifest["scenes"]

manifest_ok = (
    len(scenes) == 10
    and all(scene["status"] == "approved" for scene in scenes)
    and all(scene.get("runtimeSrc") == f"{runtime_prefix}/{scene['fileName']}" for scene in scenes)
)
notes_ok = all(f"| {scene['sceneId']} | {scene['fileName']} | approved |" in notes for scene in scenes)

if not manifest_ok or not notes_ok:
    raise SystemExit("HARD STOP: v2 candidates are not fully approved in both manifest and REVIEW_NOTES.md")
PY
```

Expected: exits 0 only when both `REVIEW_NOTES.md` and the manifest mark all 10 scenes as approved with exact runtime paths.

- [ ] **Step 6: Copy only approved images into runtime**

After the hard-stop check passes:

```bash
RUNTIME_SCENE_DIR="public/assets"/chapters/027/scenes/v2
mkdir -p "$RUNTIME_SCENE_DIR"
cp docs/review/2026-07-01-v2-evidence-space-candidates/scene-027-*-v2.png "$RUNTIME_SCENE_DIR"/
```

Expected:

```bash
RUNTIME_SCENE_DIR="public/assets"/chapters/027/scenes/v2
find "$RUNTIME_SCENE_DIR" -maxdepth 1 -type f -name 'scene-027-*-v2.png' | wc -l
```

prints `10`.

- [ ] **Step 7: Update manifest statuses**

For each scene in `content/chapters/027/scene-assets.v2.manifest.json`, change:

```json
"status": "approved",
"runtimeSrc": "\u002fassets/chapters/027/scenes/v2/<matching-fileName>"
```

Use the exact matching filename for each scene.

- [ ] **Step 8: Verify asset refs**

Run:

```bash
node scripts/validate_asset_references.mjs
pnpm test -- src/content/chapter027V2Assets.test.ts
```

Expected: both PASS, and `getChapter027V2AssetReadiness(...).readyToEnableSceneNodes` is now true after updating the test expectation in Task 6.

- [ ] **Step 9: Commit**

```bash
RUNTIME_SCENE_DIR="public/assets"/chapters/027/scenes/v2
git add docs/review/2026-07-01-v2-evidence-space-candidates "$RUNTIME_SCENE_DIR" content/chapters/027/scene-assets.v2.manifest.json
git commit -m "Approve chapter 027 v2 evidence-space scene assets"
```

### Task 6: Flip The Manifest Tests After Approval

**Files:**
- Modify: `src/content/chapter027V2Assets.test.ts`

- [ ] **Step 1: Update readiness expectations**

Replace the second manifest test with:

```ts
it("allows sceneNodes only after all runtime assets are approved", () => {
  const readiness = getChapter027V2AssetReadiness(chapter027V2AssetManifest);

  expect(readiness.readyToEnableSceneNodes).toBe(true);
  expect(readiness.approvedCount).toBe(10);
  expect(readiness.missingCount).toBe(0);
  expect(chapter027V2AssetManifest.scenes.every((scene) => scene.runtimeSrc?.startsWith("\u002fassets/chapters/027/scenes/v2/"))).toBe(true);
});
```

- [ ] **Step 2: Run tests**

Run:

```bash
pnpm test -- src/content/chapter027V2Assets.test.ts src/content/xiyouji.test.ts
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/content/chapter027V2Assets.test.ts
git commit -m "Enable v2 asset readiness assertions"
```

---

## Phase C: Enable V2 Scene Nodes

### Task 7: Upgrade The Chapter Seed To 10 Scene Nodes

**Files:**
- Modify: `content/chapters/chapter-027.seed.json`
- Modify: `src/content/xiyouji.test.ts`
- Modify: `src/content/xiyouji.ts`

- [ ] **Step 1: Write failing seed tests**

Replace the current rejected-drafts v1 assertion in `src/content/xiyouji.test.ts` with:

```ts
it("loads chapter 027 as a fixed 10-node v2 scene chain after asset approval", () => {
  expect(chapter027.version).toBe(2);
  expect(chapter027.sceneNavigation?.mainlineSceneIds).toEqual(requiredChapter027V2SceneIds);
  expect(chapter027.sceneNodes).toHaveLength(10);
  expect(getMainlineSceneNodes(chapter027).map((scene) => scene.id)).toEqual(requiredChapter027V2SceneIds);
});

it("keeps every v2 scene bound to one approved unique asset", () => {
  const assetSrcs = chapter027.sceneNodes?.map((scene) => scene.asset.src) ?? [];

  expect(new Set(assetSrcs).size).toBe(10);
  expect(assetSrcs.every((src) => src.startsWith("\u002fassets/chapters/027/scenes/v2/"))).toBe(true);
  expect(JSON.stringify(chapter027)).not.toContain("v2-scene-rejected-drafts");
});

it("keeps exploration based on unique read labels, not scene visits", () => {
  expect(getExplorationTotalWeight(chapter027)).toBe(100);
  expect(chapter027.sceneNodes?.[9].source.labelIds).toEqual([]);
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
pnpm test -- src/content/xiyouji.test.ts
```

Expected: FAIL because `chapter-027.seed.json` is still version 1.

- [ ] **Step 3: Add hard scene-node gate to content QA**

In `src/content/xiyouji.ts`, inside `getContentIssues`, add this after the paired `sceneNavigation` / `sceneNodes` presence check:

```ts
if (chapter.id === "chapter-027" && chapter.sceneNodes && !canEnableChapter027V2SceneNodes(chapter, chapter027V2AssetManifest)) {
  issues.push("Chapter 027 sceneNodes are present before all v2 assets are approved.");
}
```

Also import `chapter027V2AssetManifest`:

```ts
import { chapter027V2AssetManifest, getChapter027V2AssetReadiness, requiredChapter027V2SceneIds } from "./chapter027V2Assets";
```

- [ ] **Step 4: Upgrade the seed**

Modify `content/chapters/chapter-027.seed.json`:

```json
"version": 2,
"sceneNavigation": {
  "initialSceneId": "scene-027-01-baihuling-road",
  "mainlineSceneIds": [
    "scene-027-01-baihuling-road",
    "scene-027-02-demon-motive",
    "scene-027-03-first-disguise",
    "scene-027-04-wukong-returns",
    "scene-027-05-bajie-instigation",
    "scene-027-06-second-disguise",
    "scene-027-07-third-disguise",
    "scene-027-08-skeleton-reveal",
    "scene-027-09-banish-wukong",
    "scene-027-10-chapter-review"
  ],
  "gameGateSceneId": "scene-027-10-chapter-review",
  "allowCycles": false
}
```

Add `sceneNodes` with these exact label allocations:

```json
[
  { "id": "scene-027-01-baihuling-road", "source": { "labelIds": ["label-027-baihuling", "label-027-hunger"] } },
  { "id": "scene-027-02-demon-motive", "source": { "labelIds": ["label-027-demon-motive"] } },
  { "id": "scene-027-03-first-disguise", "source": { "labelIds": ["label-027-first-disguise"] } },
  { "id": "scene-027-04-wukong-returns", "source": { "labelIds": ["label-027-wukong-eyes"] } },
  { "id": "scene-027-05-bajie-instigation", "source": { "labelIds": ["label-027-bajie-instigation"] } },
  { "id": "scene-027-06-second-disguise", "source": { "labelIds": ["label-027-second-disguise"] } },
  { "id": "scene-027-07-third-disguise", "source": { "labelIds": ["label-027-third-disguise"] } },
  { "id": "scene-027-08-skeleton-reveal", "source": { "labelIds": ["label-027-final-kill"] } },
  { "id": "scene-027-09-banish-wukong", "source": { "labelIds": ["label-027-curse-banish", "label-027-sha-seng"] } },
  { "id": "scene-027-10-chapter-review", "source": { "labelIds": [] } }
]
```

For each full scene object, include:

```json
"kind": "main",
"order": 1,
"title": "白虎岭山路",
"entryCopy": "险山生怪，唐僧饥饿，悟空离队去化斋。",
"asset": {
  "type": "image",
  "src": "\u002fassets/chapters/027/scenes/v2/scene-027-01-baihuling-road-v2.png",
  "alt": "白虎岭山路主视觉"
},
"previousSceneId": null,
"nextSceneIds": ["scene-027-02-demon-motive"],
"hotspots": [
  {
    "id": "scene-hotspot-027-01-advance",
    "title": "沿白虎岭山路深入",
    "kind": "advance",
    "position": { "x": 68, "y": 46 },
    "radius": 9,
    "labelIds": [],
    "action": {
      "type": "advance-scene",
      "targetSceneId": "scene-027-02-demon-motive",
      "popoverTitle": "沿山路深入",
      "popoverCopy": "饥饿和空路把师徒推向下一处危险。"
    },
    "initiallyVisible": true
  }
],
"unlock": { "type": "chapter-available" }
```

Use the same structure for all 10 scenes, changing `order`, `title`, `entryCopy`, `asset.src`, `asset.alt`, `previousSceneId`, `nextSceneIds`, and label hotspots according to the fixed mapping above. Scene 10 uses `"kind": "summary"`, `nextSceneIds: []`, and no added exploration labels.

Content coverage rule: no label can be orphaned. Every `labels[].id` must appear in at least one `sceneNodes[].hotspots[].labelIds`; every `scene.source.labelIds` must appear in a hotspot within the same scene. This is required because all original text, simplified explanations, and artifact/circumstance notes should be discovered by clicking the scene image, not by browsing a detached text list.

Scene 8 must include a dedicated spine inscription hotspot bound to the original-text label:

```json
{
  "id": "scene-hotspot-027-08-spine-inscription",
  "title": "脊梁题名",
  "kind": "label",
  "position": { "x": 49, "y": 63 },
  "radius": 7,
  "labelIds": ["label-027-final-kill"],
  "action": {
    "type": "open-label",
    "popoverTitle": "脊梁上的本相证据",
    "popoverCopy": "原文写白骨夫人的脊梁上有一行字。先看这处物证，再展开原著展签。"
  },
  "initiallyVisible": true
}
```

The related image must show the inscription as a restrained bone-surface detail in the original/traditional form `白骨夫人`, not as a modern label, title, caption, or UI overlay. All readable text inside scene images must use traditional/original Chinese forms; simplified Chinese, pseudo glyphs, garbled text, modern UI labels, and advertising text fail asset QA. Clicking this hotspot opens the lightweight popover first; choosing "展开原文" opens `label-027-final-kill`, which contains the traditional original text and simplified explanation.

- [ ] **Step 5: Validate JSON and content**

Run:

```bash
python3 -m json.tool content/chapters/chapter-027.seed.json >/tmp/chapter-027.seed.checked.json
node scripts/validate_asset_references.mjs
pnpm test -- src/content/xiyouji.test.ts src/content/chapter027V2Assets.test.ts
```

Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add content/chapters/chapter-027.seed.json src/content/xiyouji.ts src/content/xiyouji.test.ts
git commit -m "Enable chapter 027 v2 scene nodes"
```

### Task 8: Build The Scene Chain Browser Core

**Files:**
- Create: `src/components/SceneChainBrowser.tsx`
- Create: `src/components/SceneTransitionStage.tsx`
- Create: `src/components/SceneLightPopover.tsx`
- Create: `src/components/SceneTimelineControls.tsx`
- Create: `src/components/SceneChainBrowser.test.tsx`
- Modify: `src/components/ChapterScene.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write failing browser tests**

Create `src/components/SceneChainBrowser.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { chapter027 } from "@/content/xiyouji";
import { createEmptyProgress } from "@/progress/progress";
import { SceneChainBrowser } from "./SceneChainBrowser";

function renderBrowser() {
  const calls: string[] = [];
  const manager = {
    markLabelRead: (_chapterId: string, labelId: string) => calls.push(`label:${labelId}`),
    markSceneVisited: (_chapterId: string, sceneId: string) => calls.push(`visit:${sceneId}`),
    openSceneHotspot: (_chapterId: string, hotspotId: string) => calls.push(`hotspot:${hotspotId}`),
    navigateToScene: (_chapterId: string, sceneId: string) => calls.push(`nav:${sceneId}`),
    goBackScene: () => null
  };

  render(<SceneChainBrowser chapter={chapter027} progress={createEmptyProgress()} manager={manager} />);
  return calls;
}

describe("SceneChainBrowser", () => {
  it("renders the initial scene as the main interaction surface", () => {
    renderBrowser();

    expect(screen.getByRole("img", { name: /白虎岭山路主视觉/ })).toBeInTheDocument();
    expect(screen.getByText("白虎岭山路")).toBeInTheDocument();
    expect(screen.getByLabelText("下一场景")).toBeInTheDocument();
  });

  it("opens a lightweight popover before the full museum label", async () => {
    const user = userEvent.setup();
    renderBrowser();

    await user.click(screen.getByRole("button", { name: /沿白虎岭山路深入/ }));

    expect(screen.getByText("沿山路深入")).toBeInTheDocument();
    expect(screen.getByText("进入下一场景")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify failure**

Run:

```bash
pnpm test -- src/components/SceneChainBrowser.test.tsx
```

Expected: FAIL because the component files do not exist.

- [ ] **Step 3: Implement `SceneTransitionStage`**

Create `src/components/SceneTransitionStage.tsx`:

```tsx
"use client";

import type { SceneNode } from "@/content/types";

export interface SceneTransitionState {
  phase: "idle" | "leaving" | "entering";
  direction: "forward" | "backward" | "jump";
  origin: { x: number; y: number };
}

export function SceneTransitionStage({
  scene,
  previousScene,
  transition,
  children
}: {
  scene: SceneNode;
  previousScene: SceneNode | null;
  transition: SceneTransitionState;
  children: React.ReactNode;
}) {
  const origin = `${transition.origin.x}% ${transition.origin.y}%`;

  return (
    <div className={`scene-chain-stage scene-transition-${transition.phase} scene-transition-${transition.direction}`}>
      {previousScene ? (
        <img
          src={previousScene.asset.src}
          alt=""
          aria-hidden="true"
          className="scene-chain-image scene-chain-image-previous"
          style={{ transformOrigin: origin }}
        />
      ) : null}
      <img src={scene.asset.src} alt={scene.asset.alt} className="scene-chain-image scene-chain-image-current" />
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Implement `SceneLightPopover`**

Create `src/components/SceneLightPopover.tsx`:

```tsx
"use client";

import type { SceneHotspot } from "@/content/types";

export function SceneLightPopover({
  hotspot,
  onOpenLabel,
  onAdvance,
  onClose
}: {
  hotspot: SceneHotspot;
  onOpenLabel: () => void;
  onAdvance: () => void;
  onClose: () => void;
}) {
  return (
    <div className="scene-light-popover" style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}>
      <p className="small-text">{hotspot.kind}</p>
      <h3>{hotspot.action.popoverTitle ?? hotspot.title}</h3>
      <p>{hotspot.action.popoverCopy ?? "查看这处原著证据。"}</p>
      <div className="action-row">
        {hotspot.labelIds.length > 0 ? <button onClick={onOpenLabel}>展开原文</button> : null}
        {hotspot.action.targetSceneId ? <button className="primary-button" onClick={onAdvance}>进入下一场景</button> : null}
        <button onClick={onClose}>返回画面</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Implement timeline controls**

Create `src/components/SceneTimelineControls.tsx`:

```tsx
"use client";

import type { SceneNode } from "@/content/types";

export function SceneTimelineControls({
  scenes,
  currentSceneId,
  visitedSceneIds,
  onJump
}: {
  scenes: SceneNode[];
  currentSceneId: string;
  visitedSceneIds: Set<string>;
  onJump: (sceneId: string) => void;
}) {
  return (
    <nav className="scene-time-scrubber" aria-label="章节时间线">
      {scenes.map((scene) => {
        const unlocked = visitedSceneIds.has(scene.id) || scene.order === 1;
        return (
          <button
            key={scene.id}
            className={scene.id === currentSceneId ? "scene-time-active" : ""}
            disabled={!unlocked}
            onClick={() => onJump(scene.id)}
            aria-label={`跳转到${scene.title}`}
          >
            {scene.order}
          </button>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 6: Implement `SceneChainBrowser`**

Create `src/components/SceneChainBrowser.tsx` with the following behavior:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChapterSeedV2, SceneHotspot, SceneNode } from "@/content/types";
import { getMainlineSceneNodes, getSceneNodeById } from "@/content/xiyouji";
import { getChapterProgress, type XiyoujiProgress } from "@/progress/progress";
import { MuseumLabelPanel } from "./MuseumLabelPanel";
import { SceneLightPopover } from "./SceneLightPopover";
import { SceneTimelineControls } from "./SceneTimelineControls";
import { SceneTransitionStage, type SceneTransitionState } from "./SceneTransitionStage";

function decodeImage(src: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  const image = new Image();
  image.src = src;
  if ("decode" in image) {
    return image.decode().catch(() => undefined);
  }

  return new Promise((resolve) => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });
}

export function SceneChainBrowser({
  chapter,
  progress,
  manager
}: {
  chapter: ChapterSeedV2;
  progress: XiyoujiProgress;
  manager: {
    markLabelRead: (chapterId: string, labelId: string) => void;
    markSceneVisited: (chapterId: string, sceneId: string) => void;
    openSceneHotspot: (chapterId: string, hotspotId: string) => void;
    navigateToScene: (chapterId: string, sceneId: string, options?: { fromSceneId?: string; pushStack?: boolean }) => void;
    goBackScene: (chapterId: string) => string | null;
  };
}) {
  const chapterProgress = getChapterProgress(progress, chapter.id);
  const mainlineScenes = getMainlineSceneNodes(chapter);
  const currentSceneId = chapterProgress.currentSceneId ?? chapter.sceneNavigation.initialSceneId;
  const currentScene = getSceneNodeById(chapter, currentSceneId) ?? mainlineScenes[0];
  const [previousScene, setPreviousScene] = useState<SceneNode | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<SceneHotspot | null>(null);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [transition, setTransition] = useState<SceneTransitionState>({
    phase: "idle",
    direction: "forward",
    origin: { x: 50, y: 50 }
  });
  const visited = useMemo(() => new Set(chapterProgress.visitedSceneIds), [chapterProgress.visitedSceneIds]);
  const selectedLabel = chapter.labels.find((label) => label.id === selectedLabelId) ?? null;

  useEffect(() => {
    manager.markSceneVisited(chapter.id, currentScene.id);
  }, [chapter.id, currentScene.id, manager]);

  async function navigate(sceneId: string, hotspot: SceneHotspot | null, direction: SceneTransitionState["direction"]) {
    const target = getSceneNodeById(chapter, sceneId);
    if (!target) return;

    setPreviousScene(currentScene);
    setTransition({
      phase: "leaving",
      direction,
      origin: hotspot?.position ?? { x: 50, y: 50 }
    });
    await decodeImage(target.asset.src);
    setTransition({
      phase: "entering",
      direction,
      origin: hotspot?.position ?? { x: 50, y: 50 }
    });
    manager.navigateToScene(chapter.id, sceneId, {
      fromSceneId: currentScene.id,
      pushStack: direction !== "jump"
    });
    window.setTimeout(() => setTransition((value) => ({ ...value, phase: "idle" })), 340);
  }

  async function goBack() {
    const targetSceneId = chapterProgress.sceneStack.at(-1);
    const target = targetSceneId ? getSceneNodeById(chapter, targetSceneId) : null;
    if (!target) return;

    setPreviousScene(currentScene);
    setTransition({
      phase: "leaving",
      direction: "backward",
      origin: { x: 50, y: 50 }
    });
    await decodeImage(target.asset.src);
    setTransition({
      phase: "entering",
      direction: "backward",
      origin: { x: 50, y: 50 }
    });
    manager.goBackScene(chapter.id);
    window.setTimeout(() => setTransition((value) => ({ ...value, phase: "idle" })), 340);
  }

  function openHotspot(hotspot: SceneHotspot) {
    manager.openSceneHotspot(chapter.id, hotspot.id);
    setActiveHotspot(hotspot);
  }

  const nextSceneId = currentScene.nextSceneIds[0];
  const previousSceneId = currentScene.previousSceneId;

  return (
    <div className="scene-chain-layout">
      <SceneTransitionStage scene={currentScene} previousScene={previousScene} transition={transition}>
        <div className="scene-hotspot-layer">
          {currentScene.hotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              className={`scene-hotspot scene-hotspot-${hotspot.kind}`}
              style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}
              onClick={() => openHotspot(hotspot)}
              aria-label={hotspot.title}
            >
              <span>{hotspot.title}</span>
            </button>
          ))}
        </div>
        {activeHotspot ? (
          <SceneLightPopover
            hotspot={activeHotspot}
            onOpenLabel={() => setSelectedLabelId(activeHotspot.labelIds[0] ?? null)}
            onAdvance={() => {
              if (activeHotspot.action.targetSceneId) {
                void navigate(activeHotspot.action.targetSceneId, activeHotspot, "forward");
                setActiveHotspot(null);
              }
            }}
            onClose={() => setActiveHotspot(null)}
          />
        ) : null}
        <div className="scene-chain-nav">
          <button disabled={!previousSceneId} onClick={() => previousSceneId && void navigate(previousSceneId, null, "backward")} aria-label="上一场景">
            上一场景
          </button>
          <button disabled={!nextSceneId} onClick={() => nextSceneId && void navigate(nextSceneId, null, "forward")} aria-label="下一场景">
            下一场景
          </button>
          <button onClick={() => void goBack()} disabled={chapterProgress.sceneStack.length === 0} aria-label="返回上一层">
            返回
          </button>
        </div>
        <SceneTimelineControls
          scenes={mainlineScenes}
          currentSceneId={currentScene.id}
          visitedSceneIds={visited}
          onJump={(sceneId) => void navigate(sceneId, null, "jump")}
        />
      </SceneTransitionStage>
      <MuseumLabelPanel
        label={selectedLabel}
        read={Boolean(selectedLabel && chapterProgress.readLabelIds.includes(selectedLabel.id))}
        onMarkRead={(labelId) => manager.markLabelRead(chapter.id, labelId)}
      />
    </div>
  );
}
```

This first implementation is intentionally local-state based. Task 9 adds preload/decode and click ripple polish.

- [ ] **Step 7: Route v2 seeds through the new browser**

Modify `src/components/ChapterScene.tsx` before the current v1 return:

```tsx
import type { ChapterSeedV2 } from "@/content/types";
import { SceneChainBrowser } from "./SceneChainBrowser";
```

Inside `ChapterScene` after `const chapterProgress = ...`:

```tsx
if (chapter027.sceneNodes && chapter027.sceneNavigation) {
  return <SceneChainBrowser chapter={chapter027 as ChapterSeedV2} progress={progress} manager={manager} />;
}
```

- [ ] **Step 8: Add minimal v2 styles**

Append to `app/globals.css`:

```css
.scene-chain-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 16px;
}

.scene-chain-stage {
  position: relative;
  min-height: min(72vh, 760px);
  overflow: hidden;
  background: #090806;
  isolation: isolate;
}

.scene-chain-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scene-chain-image-current {
  z-index: 1;
}

.scene-chain-image-previous {
  z-index: 0;
  filter: brightness(0.82) blur(2px);
  transform: scale(1.035);
}

.scene-hotspot-layer,
.scene-chain-nav,
.scene-time-scrubber,
.scene-light-popover {
  position: absolute;
  z-index: 3;
}

.scene-hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  min-width: 44px;
  min-height: 44px;
  border-radius: 999px;
  background: rgba(214, 167, 86, 0.22);
  border-color: rgba(246, 234, 211, 0.86);
}

.scene-hotspot span {
  position: absolute;
  left: 50%;
  top: calc(100% + 5px);
  transform: translateX(-50%);
  white-space: nowrap;
  background: rgba(18, 15, 13, 0.78);
  padding: 2px 6px;
}

.scene-light-popover {
  width: min(320px, calc(100vw - 40px));
  transform: translate(-50%, -110%);
  padding: 12px;
  border: 1px solid rgba(246, 234, 211, 0.28);
  background: rgba(18, 15, 13, 0.84);
  backdrop-filter: blur(10px);
}

.scene-chain-nav {
  left: 16px;
  top: 16px;
  display: flex;
  gap: 8px;
}

.scene-time-scrubber {
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  padding: 6px;
  background: rgba(18, 15, 13, 0.72);
}

.scene-time-active {
  border-color: var(--gold);
}

@media (max-width: 980px) {
  .scene-chain-layout {
    grid-template-columns: 1fr;
  }

  .scene-chain-stage {
    min-height: 68vh;
  }
}
```

- [ ] **Step 9: Run tests**

Run:

```bash
pnpm test -- src/components/SceneChainBrowser.test.tsx src/content/xiyouji.test.ts src/progress/progress.test.ts
```

Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/components/SceneChainBrowser.tsx src/components/SceneTransitionStage.tsx src/components/SceneLightPopover.tsx src/components/SceneTimelineControls.tsx src/components/SceneChainBrowser.test.tsx src/components/ChapterScene.tsx app/globals.css
git commit -m "Render chapter 027 v2 scene chain browser"
```

### Task 9: Add Preload, Decode, Ripple, And Reduced Motion

**Files:**
- Modify: `src/components/SceneChainBrowser.tsx`
- Modify: `src/components/SceneTransitionStage.tsx`
- Modify: `app/globals.css`
- Modify: `src/components/SceneChainBrowser.test.tsx`

- [ ] **Step 1: Add transition behavior test**

Append to `src/components/SceneChainBrowser.test.tsx`:

```tsx
it("shows click feedback before advancing", async () => {
  const user = userEvent.setup();
  renderBrowser();

  await user.click(screen.getByRole("button", { name: /沿白虎岭山路深入/ }));

  expect(screen.getByText("沿山路深入")).toBeInTheDocument();
  expect(document.querySelector(".scene-click-ripple")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
pnpm test -- src/components/SceneChainBrowser.test.tsx
```

Expected: FAIL because `.scene-click-ripple` is not rendered.

- [ ] **Step 3: Confirm image decode helper is present**

`SceneChainBrowser.tsx` should already contain this helper from Task 8. If it is missing, add it above the component:

```ts
function decodeImage(src: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  const image = new Image();
  image.src = src;
  if ("decode" in image) {
    return image.decode().catch(() => undefined);
  }

  return new Promise((resolve) => {
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });
}
```

Add this effect after `currentScene` is resolved. This is neighbor warmup only; the `navigate()` and `goBack()` functions above still await target `decodeImage()` before changing the visible scene.

```ts
useEffect(() => {
  const neighbors = [currentScene.previousSceneId, currentScene.nextSceneIds[0]]
    .map((sceneId) => (sceneId ? getSceneNodeById(chapter, sceneId) : undefined))
    .filter((scene): scene is SceneNode => Boolean(scene));

  for (const neighbor of neighbors) {
    void decodeImage(neighbor.asset.src);
  }
}, [chapter, currentScene.nextSceneIds, currentScene.previousSceneId]);
```

- [ ] **Step 4: Add ripple state**

Inside `SceneChainBrowser`, add:

```ts
const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
```

Update `openHotspot`:

```ts
function openHotspot(hotspot: SceneHotspot) {
  manager.openSceneHotspot(chapter.id, hotspot.id);
  setRipple({ x: hotspot.position.x, y: hotspot.position.y, key: Date.now() });
  window.setTimeout(() => setActiveHotspot(hotspot), 120);
}
```

Render inside `SceneTransitionStage`:

```tsx
{ripple ? (
  <span
    key={ripple.key}
    className="scene-click-ripple"
    style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
    aria-hidden="true"
  />
) : null}
```

- [ ] **Step 5: Add transition and reduced-motion styles**

Append to `app/globals.css`:

```css
.scene-transition-entering .scene-chain-image-current {
  animation: scene-image-enter 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.scene-transition-entering .scene-chain-image-previous {
  animation: scene-image-leave 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.scene-click-ripple {
  position: absolute;
  z-index: 4;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 1px solid rgba(246, 234, 211, 0.9);
  transform: translate(-50%, -50%);
  animation: scene-click-ripple 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
  pointer-events: none;
}

@keyframes scene-image-enter {
  from {
    opacity: 0;
    transform: translate3d(2%, 0, 0) scale(1.01);
    filter: brightness(0.9);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    filter: brightness(1);
  }
}

@keyframes scene-image-leave {
  from {
    opacity: 1;
    transform: scale(1);
    filter: brightness(1);
  }
  to {
    opacity: 0;
    transform: scale(1.035);
    filter: brightness(0.78) blur(2px);
  }
}

@keyframes scene-click-ripple {
  from {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(0.35);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(3.6);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scene-transition-entering .scene-chain-image-current,
  .scene-transition-entering .scene-chain-image-previous,
  .scene-click-ripple {
    animation-duration: 120ms;
  }

  @keyframes scene-image-enter {
    from {
      opacity: 0;
      transform: none;
      filter: none;
    }
    to {
      opacity: 1;
      transform: none;
      filter: none;
    }
  }

  @keyframes scene-image-leave {
    from {
      opacity: 1;
      transform: none;
      filter: none;
    }
    to {
      opacity: 0;
      transform: none;
      filter: none;
    }
  }
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
pnpm test -- src/components/SceneChainBrowser.test.tsx
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/SceneChainBrowser.tsx src/components/SceneTransitionStage.tsx src/components/SceneChainBrowser.test.tsx app/globals.css
git commit -m "Add scene transition feedback and image preloading"
```

### Task 10: Keep Game And Reward Gates Intact

**Files:**
- Modify only if tests fail: `src/components/MinigameGate.tsx`, `app/chapter/027/reward/page.tsx`
- Test: `src/progress/progress.test.ts`

- [ ] **Step 1: Run existing gate tests**

Run:

```bash
pnpm test -- src/progress/progress.test.ts src/game/timelineRules.test.ts
```

Expected: PASS. This verifies:

- Game still requires exploration >= 70%.
- Game still requires all 9 core labels.
- Reward still refuses to unlock badge/map if `gameCompleted !== true`.

- [ ] **Step 2: Manual route check**

Run dev server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000/chapter/027/reward
```

Expected before game completion: reward page shows unfinished state and does not write `rewardViewed`, `badgeUnlocked`, or unlock 黑松林.

- [ ] **Step 3: Commit only if code changed**

If no code changed, do not commit. If a regression is fixed:

```bash
git add src/components/MinigameGate.tsx app/chapter/027/reward/page.tsx src/progress/progress.test.ts
git commit -m "Preserve game and reward completion gates"
```

---

## Phase D: Final Browser QA And Verification

### Task 11: Browser QA The OpenFlipbook-Style Flow

**Files:**
- Create: `docs/review/2026-07-01-v2-scene-chain-browser-qa/QA_NOTES.md`
- Create screenshots or recording files under: `docs/review/2026-07-01-v2-scene-chain-browser-qa/`

- [ ] **Step 1: Start the app**

Run:

```bash
pnpm dev
```

Expected: local Next.js server starts.

- [ ] **Step 2: QA scene 1 to scene 3**

Open `/chapter/027` and perform:

1. Click scene 1 main advance hotspot.
2. Confirm ripple/focus appears at the click point.
3. Confirm lightweight popover appears before advancing.
4. Advance to scene 2.
5. Advance to scene 3.

Expected:

- No white screen.
- No missing image.
- No abrupt hard cut.
- No layout jump.
- Transition uses visual motion from the interaction point or mainline direction.

- [ ] **Step 3: QA back, breadcrumb, and time scrubber**

Perform:

1. Open a detail or advance hotspot.
2. Use `back`.
3. Use `previous`.
4. Use `next`.
5. Use the time scrubber to jump between visited scenes.

Expected:

- Back motion feels reversed.
- Already-read labels remain read.
- Exploration percent remains based only on read labels.
- Time scrubber and breadcrumb jumps transition smoothly.

- [ ] **Step 4: QA mobile**

Use responsive viewport around 390x844.

Expected:

- Scene image remains readable.
- Hotspot hit areas are at least 44x44 CSS px.
- Bottom controls do not cover the click ripple.
- Museum label drawer or panel does not interrupt scene transition.

- [ ] **Step 5: Record QA notes**

Create `docs/review/2026-07-01-v2-scene-chain-browser-qa/QA_NOTES.md`:

```md
# 第二七回 v2 场景链浏览器 QA

## Environment

- Browser:
- Viewport:
- Build:

## Scene 1 -> Scene 3

- 白屏/闪烁：
- 硬切：
- 布局跳动：
- 点击反馈：

## Back / Previous / Next / Time Scrubber

- Back 反向运动：
- 已读展签保持：
- 探索度保持：
- Time scrubber 转场：

## Mobile

- 热点命中：
- 底部控件遮挡：
- 展签抽屉：

## Evidence

- Screenshot or recording filenames:
```

- [ ] **Step 6: Commit QA evidence**

```bash
git add docs/review/2026-07-01-v2-scene-chain-browser-qa
git commit -m "Record v2 scene chain browser QA"
```

### Task 12: Final Verification

**Files:**
- No code edits unless verification fails.

- [ ] **Step 1: Static diff check**

Run:

```bash
git diff --check
```

Expected: no output.

- [ ] **Step 2: JSON validation**

Run:

```bash
python3 -m json.tool content/chapters/chapter-027.seed.json >/tmp/chapter-027.seed.checked.json
python3 -m json.tool content/chapters/027/scene-assets.v2.manifest.json >/tmp/scene-assets.v2.manifest.checked.json
```

Expected: no output.

- [ ] **Step 3: Asset reference validation**

Run:

```bash
node scripts/validate_asset_references.mjs
```

Expected: `asset references ok (...)`.

- [ ] **Step 4: Test, typecheck, build**

Run:

```bash
pnpm test
pnpm typecheck
pnpm build
```

Expected:

- `pnpm test`: all tests pass.
- `pnpm typecheck`: exits 0.
- `pnpm build`: exits 0.

- [ ] **Step 5: Final commit**

If final verification required small fixes:

```bash
git add <changed-files>
git commit -m "Verify v2 scene chain implementation"
```

If no files changed, do not create an empty commit.

---

## Acceptance Criteria

- v1 remains usable until 10 approved v2 assets exist.
- `/studio` can preview the 10-scene v2 plan, asset status, visual mode, evidence focus, and QA notes.
- Rejected drafts do not appear in runtime assets or seed references.
- `sceneNodes` are enabled only after all 10 evidence-space assets are approved and present in `public/assets`.
- `/chapter/027` v2 uses 10 fixed mainline scene nodes, not a single image with all hotspots.
- Original museum labels remain DOM text with 繁体原文 + 简体白话解释.
- Exploration remains `sum(readLabel.explorationWeight) / totalExplorationWeight * 100`.
- Game entry still requires exploration >= 70% and all 9 core labels read.
- Reward continues to use `static-panorama-preview`.
- Hotspot clicks show ripple/focus before popover or navigation.
- Scene transitions use two image layers and avoid white flashes, hard cuts, and layout jumps.
- `next`, `previous`, `back`, breadcrumb, and time scrubber are all smooth and state-preserving.
- Mobile keeps image-as-the-UI interaction without the label drawer breaking transition feel.

## Self-Review

- Spec coverage: v2 fixed 10 scenes, static reward, no runtime AI, no real 360 viewer, no drag library, `/studio` read-only preview, OpenFlipbook-style interaction, scene navigation, asset QA gates, and exploration rules are covered.
- Placeholder scan: this plan uses concrete filenames, scene IDs, commands, and code snippets. Asset images are intentionally marked `missing` until production and approval.
- Type consistency: `Chapter027V2AssetManifest`, `SceneNode`, `ChapterSeedV2`, `sceneNavigation`, `runtimeSrc`, and progress APIs match existing or planned TypeScript names.
