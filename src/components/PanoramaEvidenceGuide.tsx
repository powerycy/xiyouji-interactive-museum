"use client";

import { baihulingPanoramaTour } from "@/content/panoramaTour";

export function PanoramaEvidenceGuide({
  open,
  onOpenChange,
  onSelect
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (nodeId: string, contentId: string, labelId: string) => void;
}) {
  return (
    <div className="panorama-evidence-guide psv--capture-event">
      <button
        type="button"
        className="panorama-evidence-guide-toggle"
        aria-expanded={open}
        aria-controls="panorama-evidence-guide-panel"
        onClick={() => onOpenChange(!open)}
      >
        {open ? "收起证据导览" : "原著证据导览 · 11 条"}
      </button>

      {open ? (
        <aside id="panorama-evidence-guide-panel" className="panorama-evidence-guide-panel" aria-label="原著证据导览">
          <header>
            <div>
              <p>评委快速路径</p>
              <h2>4 幕 · 11 条原著证据</h2>
            </div>
            <button type="button" onClick={() => onOpenChange(false)} aria-label="关闭原著证据导览">×</button>
          </header>
          <p className="panorama-evidence-guide-intro">
            不必寻找视角里的热点。按故事顺序打开展签，也会记录探索进度。
          </p>
          <ol>
            {baihulingPanoramaTour.nodes.map((node, nodeIndex) => (
              <li key={node.id}>
                <p><span>{String(nodeIndex + 1).padStart(2, "0")}</span>{node.name.zhHans}</p>
                <div>
                  {node.infoHotspots.map((hotspot) => {
                    const content = baihulingPanoramaTour.content[hotspot.contentId];
                    return (
                      <button
                        type="button"
                        key={hotspot.id}
                        onClick={() => onSelect(node.id, content.id, content.labelId)}
                      >
                        {content.title.zhHans}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
        </aside>
      ) : null}
    </div>
  );
}
