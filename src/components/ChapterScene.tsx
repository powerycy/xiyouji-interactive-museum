"use client";

import { useMemo, useState } from "react";
import { chapter027, getLabelById } from "@/content/xiyouji";
import { getChapterProgress } from "@/progress/progress";
import { useProgress } from "@/progress/useProgress";
import { ExplorationStatus } from "./ExplorationStatus";
import { MinigameGate } from "./MinigameGate";
import { MuseumLabelPanel } from "./MuseumLabelPanel";

export function ChapterScene() {
  const { progress, manager } = useProgress();
  const chapterProgress = getChapterProgress(progress, chapter027.id);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(chapter027.scene.hotspots[0]?.labelIds[0] ?? null);
  const selectedLabel = selectedLabelId ? getLabelById(chapter027, selectedLabelId) ?? null : null;
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
              onClick={() => setSelectedLabelId(hotspot.labelIds[0] ?? null)}
              aria-label={hotspot.title}
            >
              <span>{hotspot.title}</span>
            </button>
          ))}
        </div>
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
