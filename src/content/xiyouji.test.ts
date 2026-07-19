import { describe, expect, it } from "vitest";
import {
  canEnableChapter027V2SceneNodes,
  chapter027,
  getContentIssues,
  getExplorationTotalWeight,
  getLabelById,
  getMainlineSceneNodes,
  getRequiredLabelIds,
  mapSeed
} from "./xiyouji";
import { chapter027V2AssetManifest, requiredChapter027V2SceneIds } from "./chapter027V2Assets";

describe("xiyouji content selectors", () => {
  it("loads the MVP map and Baihuling chapter", () => {
    expect(mapSeed.nodes.map((node) => node.id)).toContain("baihuling");
    expect(chapter027.id).toBe("chapter-027");
    expect(chapter027.scene.hotspots).toHaveLength(11);
  });

  it("calculates current seed weights and required labels", () => {
    expect(getExplorationTotalWeight(chapter027)).toBe(100);
    expect(getRequiredLabelIds(chapter027)).toHaveLength(9);
  });

  it("finds labels by id", () => {
    expect(getLabelById(chapter027, "label-027-hunger")?.title).toMatch(/饥饿|斋饭|唐僧/);
    expect(getLabelById(chapter027, "missing-label")).toBeUndefined();
  });

  it("reports no seed integrity issues for the current MVP data", () => {
    expect(getContentIssues(chapter027, mapSeed)).toEqual([]);
  });

  it("keeps every chapter label reachable from a scene hotspot", () => {
    const reachableLabelIds = new Set(chapter027.scene.hotspots.flatMap((hotspot) => hotspot.labelIds));

    expect(chapter027.labels.every((label) => reachableLabelIds.has(label.id))).toBe(true);
  });

  it("reports orphan labels that have no hotspot entry point", () => {
    const chapterWithOrphanLabel = {
      ...chapter027,
      scene: {
        ...chapter027.scene,
        hotspots: chapter027.scene.hotspots.map((hotspot) => ({
          ...hotspot,
          labelIds: hotspot.labelIds.filter((labelId) => labelId !== "label-027-final-kill")
        }))
      }
    };

    expect(getContentIssues(chapterWithOrphanLabel, mapSeed)).toContain(
      "Label label-027-final-kill is not reachable from a v1 hotspot."
    );
  });

  it("loads chapter 027 as a fixed 10-node v2 scene chain after asset approval", () => {
    expect(chapter027.version).toBe(2);
    expect(chapter027.scene.hotspots).toHaveLength(11);
    expect(chapter027.sceneNavigation?.mainlineSceneIds).toEqual(requiredChapter027V2SceneIds);
    expect(chapter027.sceneNodes).toHaveLength(10);
    expect(getMainlineSceneNodes(chapter027).map((scene) => scene.id)).toEqual(requiredChapter027V2SceneIds);
  });

  it("keeps every v2 scene bound to one approved unique asset", () => {
    const assetSrcs = chapter027.sceneNodes?.map((scene) => scene.asset.src) ?? [];

    expect(new Set(assetSrcs).size).toBe(10);
    expect(assetSrcs.every((src) => src.startsWith("/assets/chapters/027/scenes/v2/"))).toBe(true);
    expect(JSON.stringify(chapter027)).not.toContain("v2-scene-rejected-drafts");
  });

  it("keeps exploration based on unique read labels, not scene visits", () => {
    expect(getExplorationTotalWeight(chapter027)).toBe(100);
    expect(chapter027.sceneNodes?.[9].source.labelIds).toEqual([]);
  });

  it("enables chapter 027 sceneNodes only after v2 assets are approved", () => {
    expect(canEnableChapter027V2SceneNodes(chapter027, chapter027V2AssetManifest)).toBe(true);
  });

  it("keeps every chapter label reachable from a v2 scene hotspot", () => {
    const reachableLabelIds = new Set(chapter027.sceneNodes?.flatMap((scene) => scene.hotspots.flatMap((hotspot) => hotspot.labelIds)) ?? []);

    expect(chapter027.labels.every((label) => reachableLabelIds.has(label.id))).toBe(true);
  });
});
