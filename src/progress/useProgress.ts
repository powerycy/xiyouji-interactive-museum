"use client";

import { useMemo, useState } from "react";
import { createProgressManager, type StorageLike, type XiyoujiProgress } from "./progress";

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
  const [baseManager] = useState(() => createProgressManager(getBrowserStorage()));
  const [progress, setProgress] = useState<XiyoujiProgress>(() => baseManager.getSnapshot());

  const manager = useMemo(() => {
    const refresh = () => setProgress(baseManager.getSnapshot());

    return {
      getSnapshot: baseManager.getSnapshot,
      reset: () => {
        baseManager.reset();
        refresh();
      },
      markLabelRead: (chapterId: string, labelId: string) => {
        baseManager.markLabelRead(chapterId, labelId);
        refresh();
      },
      markGameCompleted: (chapterId: string) => {
        baseManager.markGameCompleted(chapterId);
        refresh();
      },
      markRewardViewed: (...args: Parameters<typeof baseManager.markRewardViewed>) => {
        baseManager.markRewardViewed(...args);
        refresh();
      }
    };
  }, [baseManager]);

  return { progress, manager };
}
