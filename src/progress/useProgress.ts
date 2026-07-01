"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createEmptyProgress, createProgressManager, type StorageLike, type XiyoujiProgress } from "./progress";

function getBrowserStorage(): StorageLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const testKey = "__xiyouji_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

export function useProgress() {
  const managerRef = useRef(createProgressManager(null));
  const [progress, setProgress] = useState<XiyoujiProgress>(() => createEmptyProgress());

  useEffect(() => {
    managerRef.current = createProgressManager(getBrowserStorage());
    setProgress(managerRef.current.getSnapshot());
  }, []);

  const manager = useMemo(() => {
    const refresh = () => setProgress(managerRef.current.getSnapshot());

    return {
      getSnapshot: () => managerRef.current.getSnapshot(),
      reset: () => {
        managerRef.current.reset();
        refresh();
      },
      markLabelRead: (chapterId: string, labelId: string) => {
        managerRef.current.markLabelRead(chapterId, labelId);
        refresh();
      },
      markSceneVisited: (chapterId: string, sceneId: string) => {
        managerRef.current.markSceneVisited(chapterId, sceneId);
        refresh();
      },
      openSceneHotspot: (chapterId: string, hotspotId: string) => {
        managerRef.current.openSceneHotspot(chapterId, hotspotId);
        refresh();
      },
      navigateToScene: (...args: Parameters<ReturnType<typeof createProgressManager>["navigateToScene"]>) => {
        managerRef.current.navigateToScene(...args);
        refresh();
      },
      goBackScene: (...args: Parameters<ReturnType<typeof createProgressManager>["goBackScene"]>) => {
        const targetSceneId = managerRef.current.goBackScene(...args);
        refresh();
        return targetSceneId;
      },
      markGameCompleted: (chapterId: string) => {
        managerRef.current.markGameCompleted(chapterId);
        refresh();
      },
      markRewardViewed: (...args: Parameters<ReturnType<typeof createProgressManager>["markRewardViewed"]>) => {
        managerRef.current.markRewardViewed(...args);
        refresh();
      }
    };
  }, []);

  return { progress, manager };
}
