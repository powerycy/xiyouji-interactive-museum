import { describe, expect, it } from "vitest";
import { chapter027, mapSeed } from "@/content/xiyouji";
import {
  createEmptyProgress,
  createMemoryStorage,
  createProgressManager,
  getChapterProgress,
  getGameGate,
  getNodeState
} from "./progress";

describe("progress manager", () => {
  it("falls back to a clean v1 progress shape", () => {
    const progress = createEmptyProgress();
    expect(progress.version).toBe(1);
    expect(getChapterProgress(progress, "chapter-027").readLabelIds).toEqual([]);
  });

  it("persists read labels and calculates game gate with both unlock conditions", () => {
    const manager = createProgressManager(createMemoryStorage());

    for (const labelId of chapter027.minigame.unlockRequirement.requiredReadLabelIds.slice(0, 8)) {
      manager.markLabelRead("chapter-027", labelId);
    }

    const partialGate = getGameGate(chapter027, manager.getSnapshot());
    expect(partialGate.unlocked).toBe(false);
    expect(partialGate.requiredReadCount).toBe(8);

    manager.markLabelRead("chapter-027", chapter027.minigame.unlockRequirement.requiredReadLabelIds[8]);
    const fullGate = getGameGate(chapter027, manager.getSnapshot());
    expect(fullGate.unlocked).toBe(true);
    expect(fullGate.explorationPercent).toBeGreaterThanOrEqual(70);
    expect(fullGate.requiredReadCount).toBe(9);
  });

  it("does not unlock reward state until reward is viewed after game completion", () => {
    const manager = createProgressManager(createMemoryStorage());
    manager.markRewardViewed(chapter027, mapSeed);
    expect(getChapterProgress(manager.getSnapshot(), "chapter-027").badgeUnlocked).toBe(false);
    expect(getNodeState(mapSeed.nodes.find((node) => node.id === "heisonglin")!, manager.getSnapshot())).toBe("locked");

    manager.markGameCompleted("chapter-027");
    manager.markRewardViewed(chapter027, mapSeed);
    expect(getChapterProgress(manager.getSnapshot(), "chapter-027").badgeUnlocked).toBe(true);
    expect(getNodeState(mapSeed.nodes.find((node) => node.id === "heisonglin")!, manager.getSnapshot())).toBe("preview");
  });

  it("uses in-memory storage when browser storage is unavailable", () => {
    const manager = createProgressManager(null);
    manager.markLabelRead("chapter-027", "label-027-hunger");
    expect(getChapterProgress(manager.getSnapshot(), "chapter-027").readLabelIds).toContain("label-027-hunger");
  });
});
