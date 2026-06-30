import type { ChapterSeed, MapNode, MapNodeState, MapSeed } from "@/content/types";
import { getExplorationPercent, getRequiredLabelIds, getRequiredReadCount } from "@/content/xiyouji";

export const PROGRESS_KEY = "xiyouji.progress.v1";
export const PROGRESS_VERSION = 1;

export interface ChapterProgress {
  readLabelIds: string[];
  gameCompleted: boolean;
  rewardViewed: boolean;
  badgeUnlocked: boolean;
}

export interface XiyoujiProgress {
  version: 1;
  chapters: Record<string, ChapterProgress>;
  map: {
    unlockedNodeIds: string[];
  };
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface GameGate {
  unlocked: boolean;
  explorationPercent: number;
  explorationRequired: number;
  requiredReadCount: number;
  requiredTotal: number;
  missingRequiredLabelIds: string[];
}

export function createEmptyChapterProgress(): ChapterProgress {
  return {
    readLabelIds: [],
    gameCompleted: false,
    rewardViewed: false,
    badgeUnlocked: false
  };
}

export function createEmptyProgress(): XiyoujiProgress {
  return {
    version: PROGRESS_VERSION,
    chapters: {},
    map: {
      unlockedNodeIds: []
    }
  };
}

export function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  };
}

export function parseProgress(raw: string | null): XiyoujiProgress {
  if (!raw) {
    return createEmptyProgress();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<XiyoujiProgress>;
    if (parsed.version !== PROGRESS_VERSION || !parsed.chapters || !parsed.map) {
      return createEmptyProgress();
    }
    return {
      version: PROGRESS_VERSION,
      chapters: parsed.chapters,
      map: {
        unlockedNodeIds: Array.isArray(parsed.map.unlockedNodeIds) ? parsed.map.unlockedNodeIds : []
      }
    };
  } catch {
    return createEmptyProgress();
  }
}

export function getChapterProgress(progress: XiyoujiProgress, chapterId: string): ChapterProgress {
  return progress.chapters[chapterId] ?? createEmptyChapterProgress();
}

export function getGameGate(chapter: ChapterSeed, progress: XiyoujiProgress): GameGate {
  const chapterProgress = getChapterProgress(progress, chapter.id);
  const requiredLabelIds = getRequiredLabelIds(chapter);
  const read = new Set(chapterProgress.readLabelIds);
  const missingRequiredLabelIds = requiredLabelIds.filter((labelId) => !read.has(labelId));
  const explorationPercent = getExplorationPercent(chapter, chapterProgress.readLabelIds);
  const explorationRequired = chapter.minigame.unlockRequirement.explorationPercentGte;

  return {
    unlocked: explorationPercent >= explorationRequired && missingRequiredLabelIds.length === 0,
    explorationPercent,
    explorationRequired,
    requiredReadCount: getRequiredReadCount(chapter, chapterProgress.readLabelIds),
    requiredTotal: requiredLabelIds.length,
    missingRequiredLabelIds
  };
}

export function getNodeState(node: MapNode, progress: XiyoujiProgress): MapNodeState {
  if (progress.map.unlockedNodeIds.includes(node.id)) {
    return node.id === "baihuling" && getChapterProgress(progress, "chapter-027").badgeUnlocked ? "completed" : "preview";
  }
  if (node.id === "baihuling" && getChapterProgress(progress, "chapter-027").badgeUnlocked) {
    return "completed";
  }
  return node.state;
}

export function createProgressManager(storage: StorageLike | null | undefined) {
  const backingStorage = storage ?? createMemoryStorage();
  let snapshot = parseProgress(backingStorage.getItem(PROGRESS_KEY));

  function persist(next: XiyoujiProgress) {
    snapshot = next;
    backingStorage.setItem(PROGRESS_KEY, JSON.stringify(snapshot));
  }

  function updateChapter(chapterId: string, update: (chapter: ChapterProgress) => ChapterProgress) {
    const current = getChapterProgress(snapshot, chapterId);
    persist({
      ...snapshot,
      chapters: {
        ...snapshot.chapters,
        [chapterId]: update(current)
      }
    });
  }

  return {
    getSnapshot: () => snapshot,
    reset: () => persist(createEmptyProgress()),
    markLabelRead: (chapterId: string, labelId: string) => {
      updateChapter(chapterId, (chapter) => ({
        ...chapter,
        readLabelIds: Array.from(new Set([...chapter.readLabelIds, labelId]))
      }));
    },
    markGameCompleted: (chapterId: string) => {
      updateChapter(chapterId, (chapter) => ({
        ...chapter,
        gameCompleted: true
      }));
    },
    markRewardViewed: (chapter: ChapterSeed, map: MapSeed) => {
      const chapterProgress = getChapterProgress(snapshot, chapter.id);
      if (!chapterProgress.gameCompleted) {
        return;
      }

      const nextUnlocked = new Set(snapshot.map.unlockedNodeIds);
      if (chapter.nextUnlock) {
        nextUnlocked.add(chapter.nextUnlock.nodeId);
      }

      persist({
        ...snapshot,
        chapters: {
          ...snapshot.chapters,
          [chapter.id]: {
            ...chapterProgress,
            rewardViewed: true,
            badgeUnlocked: true
          }
        },
        map: {
          unlockedNodeIds: Array.from(nextUnlocked).filter((nodeId) => map.nodes.some((node) => node.id === nodeId))
        }
      });
    }
  };
}
