"use client";

import { chapter027V2AssetManifest, getChapter027V2AssetReadiness } from "@/content/chapter027V2Assets";
import { chapter027, getContentIssues, getExplorationTotalWeight, mapSeed } from "@/content/xiyouji";
import { useProgress } from "@/progress/useProgress";

export function StudioPreview() {
  const { manager } = useProgress();
  const issues = getContentIssues(chapter027, mapSeed);
  const v2Readiness = getChapter027V2AssetReadiness(chapter027V2AssetManifest);

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

      <section className="surface studio-panel studio-panel-wide">
        <h2>v2 场景链资源</h2>
        <p>
          已批准 {v2Readiness.approvedCount}/{v2Readiness.totalCount}
        </p>
        <p className="small-text">
          {v2Readiness.readyToEnableSceneNodes
            ? "资源闸门已通过，当前 seed 可启用 10 节点场景链。"
            : "10 张证据空间主视觉全部 approved 且存在 runtimeSrc 后，才允许写入 sceneNodes。"}
        </p>
        <p className="small-text">
          <strong>原文证据</strong>：每张候选图必须能追到第二七回原文、展签和可点击物证。
        </p>
        <div className="studio-asset-list">
          {chapter027V2AssetManifest.scenes.map((scene) => (
            <article key={scene.sceneId} className="studio-asset-row">
              {scene.runtimeSrc ? <img src={scene.runtimeSrc} alt={`${scene.title}美术资源`} /> : <span className="studio-asset-thumb-empty" />}
              <div>
                <strong>{scene.sceneId}</strong>
                <span>{scene.title}</span>
              </div>
              <span>{scene.status}</span>
              <span>{scene.visualMode}</span>
              <span>{scene.evidenceFocus.join(" / ")}</span>
              <div className="studio-asset-evidence">
                <strong>关联展签</strong>
                <span>{scene.sourceEvidence.labelIds.join(" / ")}</span>
                <strong>原文摘录</strong>
                <p>{scene.sourceEvidence.originalExcerpt}</p>
                <strong>图像 brief</strong>
                <p>{scene.sourceEvidence.imageBrief}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
