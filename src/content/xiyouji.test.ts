import { describe, expect, it } from "vitest";
import {
  chapter027,
  getContentIssues,
  getExplorationTotalWeight,
  getLabelById,
  getRequiredLabelIds,
  mapSeed
} from "./xiyouji";

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
});
