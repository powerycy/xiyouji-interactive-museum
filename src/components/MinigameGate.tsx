import Link from "next/link";
import type { ChapterSeed } from "@/content/types";
import { getGameGate, type XiyoujiProgress } from "@/progress/progress";

export function MinigameGate({ chapter, progress }: { chapter: ChapterSeed; progress: XiyoujiProgress }) {
  const gate = getGameGate(chapter, progress);

  if (gate.unlocked) {
    return (
      <Link href="/chapter/027/game" className="gate-link primary-button">
        进入白虎岭真相时间线
      </Link>
    );
  }

  return (
    <div className="gate-locked surface">
      <strong>小游戏尚未解锁</strong>
      <p>
        需要探索度至少 {gate.explorationRequired}%，并读完 {gate.requiredTotal} 个核心线索。
        当前核心线索 {gate.requiredReadCount}/{gate.requiredTotal}。
      </p>
    </div>
  );
}
