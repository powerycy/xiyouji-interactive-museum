import { describe, expect, it } from "vitest";
import type { Chapter027V2AssetManifest } from "./types";
import { chapter027 } from "./xiyouji";
import {
  chapter027V2AssetManifest,
  getChapter027V2AssetReadiness,
  getExpectedChapter027V2RuntimeSrc,
  requiredChapter027V2SceneIds
} from "./chapter027V2Assets";

function createApprovedManifest(): Chapter027V2AssetManifest {
  return {
    ...chapter027V2AssetManifest,
    scenes: chapter027V2AssetManifest.scenes.map((scene) => ({
      ...scene,
      status: "approved",
      runtimeSrc: getExpectedChapter027V2RuntimeSrc(scene.fileName)
    }))
  };
}

describe("chapter 027 v2 asset manifest", () => {
  it("tracks the fixed 10 evidence-space mainline scenes", () => {
    expect(chapter027V2AssetManifest.chapterId).toBe("chapter-027");
    expect(chapter027V2AssetManifest.scenes.map((scene) => scene.sceneId)).toEqual(requiredChapter027V2SceneIds);
    expect(chapter027V2AssetManifest.scenes).toHaveLength(10);
  });

  it("allows sceneNodes only after all runtime assets are approved", () => {
    const readiness = getChapter027V2AssetReadiness(chapter027V2AssetManifest);

    expect(readiness.readyToEnableSceneNodes).toBe(true);
    expect(readiness.approvedCount).toBe(10);
    expect(readiness.missingCount).toBe(0);
    expect(readiness.invalidRuntimeScenes).toEqual([]);
    expect(readiness.hasRequiredOrder).toBe(true);
    expect(
      chapter027V2AssetManifest.scenes.every((scene) => scene.runtimeSrc === getExpectedChapter027V2RuntimeSrc(scene.fileName))
    ).toBe(true);
  });

  it("requires exact scene order, unique runtime paths, and approved runtime srcs", () => {
    const approved = createApprovedManifest();
    expect(getChapter027V2AssetReadiness(approved).readyToEnableSceneNodes).toBe(true);

    const swapped = {
      ...approved,
      scenes: [approved.scenes[1], approved.scenes[0], ...approved.scenes.slice(2)]
    };
    expect(getChapter027V2AssetReadiness(swapped).readyToEnableSceneNodes).toBe(false);
    expect(getChapter027V2AssetReadiness(swapped).hasRequiredOrder).toBe(false);

    const duplicatedPath = {
      ...approved,
      scenes: approved.scenes.map((scene, index) =>
        index === 1 ? { ...scene, runtimeSrc: approved.scenes[0].runtimeSrc } : scene
      )
    };
    expect(getChapter027V2AssetReadiness(duplicatedPath).readyToEnableSceneNodes).toBe(false);
    expect(getChapter027V2AssetReadiness(duplicatedPath).hasUniqueRuntimeSrcs).toBe(false);

    const rejectedPath = {
      ...approved,
      scenes: approved.scenes.map((scene, index) =>
        index === 0 ? { ...scene, runtimeSrc: "/assets/chapters/027/scenes/v2/rejected/scene-027-01.png" } : scene
      )
    };
    const rejectedReadiness = getChapter027V2AssetReadiness(rejectedPath);
    expect(rejectedReadiness.readyToEnableSceneNodes).toBe(false);
    expect(rejectedReadiness.invalidRuntimeScenes).toHaveLength(1);
    expect(rejectedReadiness.rejectedRuntimeScenes).toHaveLength(1);
  });

  it("binds every v2 scene asset brief to original-text labels and evidence excerpts", () => {
    const labelIds = new Set(chapter027.labels.map((label) => label.id));

    for (const scene of chapter027V2AssetManifest.scenes) {
      expect(scene.sourceEvidence.labelIds.length).toBeGreaterThan(0);
      expect(scene.sourceEvidence.originalExcerpt.length).toBeGreaterThan(12);
      expect(scene.sourceEvidence.imageBrief.length).toBeGreaterThan(12);
      expect(scene.sourceEvidence.rawLineStart).toBeGreaterThan(0);
      expect(scene.sourceEvidence.rawLineEnd).toBeGreaterThanOrEqual(scene.sourceEvidence.rawLineStart);

      for (const labelId of scene.sourceEvidence.labelIds) {
        expect(labelIds.has(labelId), `${scene.sceneId} references missing label ${labelId}`).toBe(true);
      }
    }
  });

  it("keeps the skeleton reveal and banishment source moments separate", () => {
    const skeletonReveal = chapter027V2AssetManifest.scenes.find((scene) => scene.sceneId === "scene-027-08-skeleton-reveal");
    const banishment = chapter027V2AssetManifest.scenes.find((scene) => scene.sceneId === "scene-027-09-banish-wukong");

    expect(skeletonReveal?.sourceEvidence.labelIds).toContain("label-027-final-kill");
    expect(skeletonReveal?.sourceEvidence.originalExcerpt).toContain("白骨夫人");
    expect(skeletonReveal?.sourceEvidence.originalExcerpt).not.toContain("貶書");

    expect(banishment?.sourceEvidence.labelIds).toContain("label-027-curse-banish");
    expect(banishment?.sourceEvidence.originalExcerpt).toContain("貶書");
    expect(banishment?.sourceEvidence.originalExcerpt).not.toContain("白骨夫人");
  });
});
