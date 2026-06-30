"use client";

import { chapter027, getContentIssues, getExplorationTotalWeight, mapSeed } from "@/content/xiyouji";
import { useProgress } from "@/progress/useProgress";

export function StudioPreview() {
  const { manager } = useProgress();
  const issues = getContentIssues(chapter027, mapSeed);

  return (
    <div className="studio-grid">
      <section className="surface studio-panel">
        <h2>内容 QA</h2>
        <p>探索权重总和：{getExplorationTotalWeight(chapter027)}</p>
        {issues.length === 0 ? <p>当前 seed 未发现结构问题。</p> : null}
        {issues.map((issue) => (
          <p key={issue} className="key-clue">
            {issue}
          </p>
        ))}
        <button onClick={() => manager.reset()}>重置本地进度</button>
      </section>

      <section className="surface studio-panel">
        <h2>热点预览</h2>
        <div className="studio-scene">
          <img src={chapter027.scene.image} alt={chapter027.scene.title} />
          {chapter027.scene.hotspots.map((hotspot) => (
            <span key={hotspot.id} style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}>
              {hotspot.title}
            </span>
          ))}
        </div>
      </section>

      <section className="surface studio-panel">
        <h2>展签</h2>
        {chapter027.labels.map((label) => (
          <article key={label.id} className="studio-item">
            <strong>{label.title}</strong>
            <span>
              {label.explorationWeight} · {label.requiredForGame ? "核心线索" : "普通展签"}
            </span>
          </article>
        ))}
      </section>

      <section className="surface studio-panel">
        <h2>小游戏与奖励</h2>
        <p>事件卡：{chapter027.minigame.eventCards.length}</p>
        <p>证据卡：{chapter027.minigame.evidenceCards.length}</p>
        <p>奖励：{chapter027.reward.type}</p>
        <img src={chapter027.badge.unlockedImage} alt={chapter027.badge.title} className="studio-badge" />
      </section>
    </div>
  );
}
