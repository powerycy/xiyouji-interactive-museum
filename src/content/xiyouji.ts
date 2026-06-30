import chapter027Json from "../../content/chapters/chapter-027.seed.json";
import mapSeedJson from "../../content/map/map-nodes.seed.json";
import type { ChapterLabel, ChapterSeed, MapSeed } from "./types";

export const mapSeed = mapSeedJson as MapSeed;
export const chapter027 = chapter027Json as ChapterSeed;

export function getLabelById(chapter: ChapterSeed, labelId: string): ChapterLabel | undefined {
  return chapter.labels.find((label) => label.id === labelId);
}

export function getLabelsByIds(chapter: ChapterSeed, labelIds: string[]): ChapterLabel[] {
  return labelIds
    .map((labelId) => getLabelById(chapter, labelId))
    .filter((label): label is ChapterLabel => Boolean(label));
}

export function getRequiredLabelIds(chapter: ChapterSeed): string[] {
  return chapter.minigame.unlockRequirement.requiredReadLabelIds;
}

export function getExplorationTotalWeight(chapter: ChapterSeed): number {
  return chapter.labels.reduce((total, label) => total + label.explorationWeight, 0);
}

export function getReadWeight(chapter: ChapterSeed, readLabelIds: readonly string[]): number {
  const read = new Set(readLabelIds);
  return chapter.labels.reduce((total, label) => {
    return read.has(label.id) ? total + label.explorationWeight : total;
  }, 0);
}

export function getExplorationPercent(chapter: ChapterSeed, readLabelIds: readonly string[]): number {
  const total = getExplorationTotalWeight(chapter);
  if (total <= 0) {
    return 0;
  }
  return Math.round((getReadWeight(chapter, readLabelIds) / total) * 100);
}

export function getRequiredReadCount(chapter: ChapterSeed, readLabelIds: readonly string[]): number {
  const read = new Set(readLabelIds);
  return getRequiredLabelIds(chapter).filter((labelId) => read.has(labelId)).length;
}

export function getContentIssues(chapter: ChapterSeed, map: MapSeed): string[] {
  const issues: string[] = [];
  const labelIds = new Set(chapter.labels.map((label) => label.id));
  const evidenceIds = new Set(chapter.minigame.evidenceCards.map((evidence) => evidence.id));
  const mapNodeIds = new Set(map.nodes.map((node) => node.id));

  if (getExplorationTotalWeight(chapter) !== 100) {
    issues.push(`Chapter ${chapter.id} exploration weights total ${getExplorationTotalWeight(chapter)}, expected 100.`);
  }

  for (const hotspot of chapter.scene.hotspots) {
    for (const labelId of hotspot.labelIds) {
      if (!labelIds.has(labelId)) {
        issues.push(`Hotspot ${hotspot.id} references missing label ${labelId}.`);
      }
    }
  }

  for (const requiredLabelId of getRequiredLabelIds(chapter)) {
    if (!labelIds.has(requiredLabelId)) {
      issues.push(`Minigame requires missing label ${requiredLabelId}.`);
    }
  }

  for (const evidence of chapter.minigame.evidenceCards) {
    if (!labelIds.has(evidence.sourceLabelId)) {
      issues.push(`Evidence ${evidence.id} references missing source label ${evidence.sourceLabelId}.`);
    }
  }

  for (const eventCard of chapter.minigame.eventCards) {
    for (const evidenceId of eventCard.requiredEvidenceIds) {
      if (!evidenceIds.has(evidenceId)) {
        issues.push(`Event ${eventCard.id} requires missing evidence ${evidenceId}.`);
      }
    }
  }

  if (chapter.nextUnlock && !mapNodeIds.has(chapter.nextUnlock.nodeId)) {
    issues.push(`Chapter nextUnlock references missing map node ${chapter.nextUnlock.nodeId}.`);
  }

  if (!chapter.reward.src) {
    issues.push(`Chapter ${chapter.id} reward src is empty.`);
  }

  if (!chapter.badge.lockedImage || !chapter.badge.unlockedImage) {
    issues.push(`Chapter ${chapter.id} badge image path is empty.`);
  }

  return issues;
}
