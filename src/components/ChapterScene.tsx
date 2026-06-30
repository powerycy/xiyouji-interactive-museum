"use client";

import { useMemo, useState } from "react";
import type { ChapterLabel } from "@/content/types";
import { chapter027, getLabelById } from "@/content/xiyouji";
import { getChapterProgress } from "@/progress/progress";
import { useProgress } from "@/progress/useProgress";
import { ExplorationStatus } from "./ExplorationStatus";
import { MinigameGate } from "./MinigameGate";
import { MuseumLabelPanel } from "./MuseumLabelPanel";

export function ChapterScene() {
  const { progress, manager } = useProgress();
  const chapterProgress = getChapterProgress(progress, chapter027.id);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(chapter027.scene.hotspots[0]?.id ?? null);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(chapter027.scene.hotspots[0]?.labelIds[0] ?? null);
  const selectedHotspot = selectedHotspotId ? chapter027.scene.hotspots.find((hotspot) => hotspot.id === selectedHotspotId) ?? null : null;
  const selectedLabel = selectedLabelId ? getLabelById(chapter027, selectedLabelId) ?? null : null;
  const selectedHotspotLabels = selectedHotspot?.labelIds
    .map((labelId) => getLabelById(chapter027, labelId))
    .filter((label): label is ChapterLabel => Boolean(label)) ?? [];
  const read = useMemo(() => new Set(chapterProgress.readLabelIds), [chapterProgress.readLabelIds]);

  return (
    <div className="chapter-layout">
      <div className="scene-column">
        <ExplorationStatus chapter={chapter027} progress={progress} />
        <div className="scene-stage surface">
          <img src={chapter027.scene.image} alt={chapter027.scene.title} className="scene-image" />
          {chapter027.scene.hotspots.map((hotspot) => (
            <button
              className={`hotspot ${hotspot.isKey ? "hotspot-key" : ""}`}
              key={hotspot.id}
              style={{
                left: `${hotspot.position.x}%`,
                top: `${hotspot.position.y}%`,
                width: `${Math.max(28, hotspot.radius * 6)}px`,
                height: `${Math.max(28, hotspot.radius * 6)}px`
              }}
              onClick={() => {
                setSelectedHotspotId(hotspot.id);
                setSelectedLabelId(hotspot.labelIds[0] ?? null);
              }}
              aria-label={hotspot.title}
            >
              <span>{hotspot.title}</span>
            </button>
          ))}
        </div>
        {selectedHotspotLabels.length > 1 ? (
          <div className="hotspot-label-switcher surface">
            <span className="small-text">{selectedHotspot?.title} 展签</span>
            <div className="action-row">
              {selectedHotspotLabels.map((label) => (
                <button
                  key={label.id}
                  className={selectedLabelId === label.id ? "label-tab-active" : ""}
                  onClick={() => setSelectedLabelId(label.id)}
                >
                  {label.title}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <MinigameGate chapter={chapter027} progress={progress} />
      </div>

      <MuseumLabelPanel
        label={selectedLabel}
        read={Boolean(selectedLabel && read.has(selectedLabel.id))}
        onMarkRead={(labelId) => manager.markLabelRead(chapter027.id, labelId)}
      />
    </div>
  );
}
