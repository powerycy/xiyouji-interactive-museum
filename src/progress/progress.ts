import type { ChapterSeed, MapNode, MapNodeState, MapSeed } from "@/content/types";
import { getExplorationPercent, getRequiredLabelIds, getRequiredReadCount } from "@/content/xiyouji";

export const PROGRESS_KEY = "xiyouji.progress.v1";
export const PROGRESS_VERSION = 1;

export interface ChapterProgress {
  readLabelIds: string[];
  gameCompleted: boolean;
  rewardViewed: boolean;
  badgeUnlocked: boolean;
  visitedSceneIds: string[];
  openedHotspotIds: string[];
  currentSceneId: string | null;
  sceneStack: string[];
  mainlineUnlockedSceneIds: string[];
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

export interface NavigateToSceneOptions {
  fromSceneId?: string;
  pushStack?: boolean;
}

function unique(values: readonly string[]): string[] {
  return Array.from(new Set(values));
}

export function createEmptyChapterProgress(): ChapterProgress {
  return {
    readLabelIds: [],
    gameCompleted: false,
    rewardViewed: false,
    badgeUnlocked: false,
    visitedSceneIds: [],
    openedHotspotIds: [],
    currentSceneId: null,
    sceneStack: [],
    mainlineUnlockedSceneIds: []
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
      chapters: Object.fromEntries(
        Object.entries(parsed.chapters).map(([chapterId, chapter]) => [chapterId, normalizeChapterProgress(chapter)])
      ),
      map: {
        unlockedNodeIds: Array.isArray(parsed.map.unlockedNodeIds) ? parsed.map.unlockedNodeIds : []
      }
    };
  } catch {
    return createEmptyProgress();
  }
}

export function normalizeChapterProgress(chapter: Partial<ChapterProgress> | undefined): ChapterProgress {
  const empty = createEmptyChapterProgress();
  if (!chapter) {
    return empty;
  }

  return {
    readLabelIds: Array.isArray(chapter.readLabelIds) ? unique(chapter.readLabelIds) : empty.readLabelIds,
    gameCompleted: Boolean(chapter.gameCompleted),
    rewardViewed: Boolean(chapter.rewardViewed),
    badgeUnlocked: Boolean(chapter.badgeUnlocked),
    visitedSceneIds: Array.isArray(chapter.visitedSceneIds) ? unique(chapter.visitedSceneIds) : empty.visitedSceneIds,
    openedHotspotIds: Array.isArray(chapter.openedHotspotIds) ? unique(chapter.openedHotspotIds) : empty.openedHotspotIds,
    currentSceneId: typeof chapter.currentSceneId === "string" ? chapter.currentSceneId : empty.currentSceneId,
    sceneStack: Array.isArray(chapter.sceneStack) ? chapter.sceneStack.filter((sceneId) => typeof sceneId === "string") : empty.sceneStack,
    mainlineUnlockedSceneIds: Array.isArray(chapter.mainlineUnlockedSceneIds)
      ? unique(chapter.mainlineUnlockedSceneIds)
      : empty.mainlineUnlockedSceneIds
  };
}

export function getChapterProgress(progress: XiyoujiProgress, chapterId: string): ChapterProgress {
  return normalizeChapterProgress(progress.chapters[chapterId]);
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
        readLabelIds: unique([...chapter.readLabelIds, labelId])
      }));
    },
    markSceneVisited: (chapterId: string, sceneId: string) => {
      updateChapter(chapterId, (chapter) => ({
        ...chapter,
        currentSceneId: chapter.currentSceneId ?? sceneId,
        visitedSceneIds: unique([...chapter.visitedSceneIds, sceneId]),
        mainlineUnlockedSceneIds: unique([...chapter.mainlineUnlockedSceneIds, sceneId])
      }));
    },
    openSceneHotspot: (chapterId: string, hotspotId: string) => {
      updateChapter(chapterId, (chapter) => ({
        ...chapter,
        openedHotspotIds: unique([...chapter.openedHotspotIds, hotspotId])
      }));
    },
    navigateToScene: (chapterId: string, sceneId: string, options: NavigateToSceneOptions = {}) => {
      updateChapter(chapterId, (chapter) => ({
        ...chapter,
        currentSceneId: sceneId,
        visitedSceneIds: unique([...chapter.visitedSceneIds, sceneId]),
        mainlineUnlockedSceneIds: unique([...chapter.mainlineUnlockedSceneIds, sceneId]),
        sceneStack:
          options.pushStack && options.fromSceneId
            ? [...chapter.sceneStack, options.fromSceneId]
            : chapter.sceneStack
      }));
    },
    goBackScene: (chapterId: string) => {
      const chapterProgress = getChapterProgress(snapshot, chapterId);
      const nextStack = chapterProgress.sceneStack.slice(0, -1);
      const targetSceneId = chapterProgress.sceneStack.at(-1) ?? chapterProgress.currentSceneId;

      if (targetSceneId) {
        updateChapter(chapterId, (chapter) => ({
          ...chapter,
          currentSceneId: targetSceneId,
          visitedSceneIds: unique([...chapter.visitedSceneIds, targetSceneId]),
          mainlineUnlockedSceneIds: unique([...chapter.mainlineUnlockedSceneIds, targetSceneId]),
          sceneStack: nextStack
        }));
      }

      return targetSceneId ?? null;
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
