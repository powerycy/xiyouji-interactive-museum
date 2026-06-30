import type { ChapterSeed } from "@/content/types";
import { getGameGate, type XiyoujiProgress } from "@/progress/progress";

export function ExplorationStatus({ chapter, progress }: { chapter: ChapterSeed; progress: XiyoujiProgress }) {
  const gate = getGameGate(chapter, progress);

  return (
    <section className="exploration-status surface">
      <div>
        <span className="small-text">探索度</span>
        <strong>{gate.explorationPercent}%</strong>
      </div>
      <div>
        <span className="small-text">核心线索</span>
        <strong>
          {gate.requiredReadCount}/{gate.requiredTotal}
        </strong>
      </div>
    </section>
  );
}
