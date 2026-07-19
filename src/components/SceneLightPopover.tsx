"use client";

import type { SceneHotspot } from "@/content/types";

export function SceneLightPopover({
  hotspot,
  onOpenLabel,
  onAdvance,
  onClose
}: {
  hotspot: SceneHotspot;
  onOpenLabel: () => void;
  onAdvance: () => void;
  onClose: () => void;
}) {
  return (
    <div className="scene-light-popover" style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}>
      <p className="small-text">{hotspot.kind}</p>
      <h3>{hotspot.action.popoverTitle ?? hotspot.title}</h3>
      <p>{hotspot.action.popoverCopy ?? "查看这处原著证据。"}</p>
      <div className="action-row">
        {hotspot.labelIds.length > 0 ? <button onClick={onOpenLabel}>展开原文</button> : null}
        {hotspot.action.targetSceneId ? (
          <button className="primary-button" onClick={onAdvance}>
            进入下一场景
          </button>
        ) : null}
        <button onClick={onClose}>返回画面</button>
      </div>
    </div>
  );
}
