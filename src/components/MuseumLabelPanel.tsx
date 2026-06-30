"use client";

import type { ChapterLabel } from "@/content/types";

export function MuseumLabelPanel({
  label,
  read,
  onMarkRead
}: {
  label: ChapterLabel | null;
  read: boolean;
  onMarkRead: (labelId: string) => void;
}) {
  if (!label) {
    return (
      <aside className="label-panel surface">
        <p className="small-text">选择场景中的热点查看展签。</p>
      </aside>
    );
  }

  return (
    <aside className="label-panel surface">
      <p className="small-text">
        {label.type} · 权重 {label.explorationWeight}
      </p>
      <h2>{label.title}</h2>
      <h3>原文</h3>
      <p className="traditional-text">{label.originalTraditional}</p>
      <h3>白话解释</h3>
      <p>{label.plainSimplified}</p>
      <p className="small-text">
        第二七回，原文行 {label.source.rawLineStart ?? "?"}-{label.source.rawLineEnd ?? "?"}
      </p>
      {label.requiredForGame ? <p className="key-clue">小游戏核心线索</p> : null}
      <button className="primary-button" disabled={read} onClick={() => onMarkRead(label.id)}>
        {read ? "已读" : "标记已读"}
      </button>
    </aside>
  );
}
