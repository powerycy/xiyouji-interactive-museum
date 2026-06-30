"use client";

import Link from "next/link";
import { useEffect } from "react";
import { chapter027, mapSeed } from "@/content/xiyouji";
import { getChapterProgress } from "@/progress/progress";
import { useProgress } from "@/progress/useProgress";

export function RewardPreview() {
  const { progress, manager } = useProgress();
  const chapterProgress = getChapterProgress(progress, chapter027.id);

  useEffect(() => {
    if (chapterProgress.gameCompleted && chapter027.reward.type === "static-panorama-preview") {
      manager.markRewardViewed(chapter027, mapSeed);
    }
  }, [chapterProgress.gameCompleted, manager]);

  if (!chapterProgress.gameCompleted) {
    return (
      <section className="surface reward-panel">
        <h2>小游戏尚未完成</h2>
        <p>完成“白虎岭真相时间线”后才能查看奖励。此页面不会点亮徽章或解锁地图节点。</p>
        <div className="action-row">
          <Link href="/chapter/027/game" className="gate-link primary-button">
            返回小游戏
          </Link>
          <Link href="/chapter/027" className="gate-link">
            返回章节探索
          </Link>
        </div>
      </section>
    );
  }

  if (chapter027.reward.type !== "static-panorama-preview") {
    return (
      <section className="surface reward-panel">
        <h2>当前 MVP 不支持该奖励类型</h2>
        <p>{chapter027.reward.type}</p>
      </section>
    );
  }

  return (
    <section className="reward-panel surface">
      <p className="small-text">章节奖励</p>
      <h2>{chapter027.reward.title}</h2>
      <img src={chapter027.reward.src} alt={chapter027.reward.title} className="reward-image" />
      <p>白虎岭徽章已点亮，黑松林预览已解锁。</p>
      <Link href="/" className="gate-link primary-button">
        返回大地图
      </Link>
    </section>
  );
}
