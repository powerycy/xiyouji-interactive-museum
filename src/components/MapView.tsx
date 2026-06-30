"use client";

import Link from "next/link";
import { mapSeed } from "@/content/xiyouji";
import { getNodeState } from "@/progress/progress";
import { useProgress } from "@/progress/useProgress";

export function MapView() {
  const { progress } = useProgress();

  return (
    <div className="map-layout">
      <div className="map-stage surface">
        <img src={mapSeed.backgroundImage} alt="取经大地图" className="map-image" />
        {mapSeed.nodes.map((node) => {
          const state = getNodeState(node, progress);
          const isPlayable = node.chapterId === "chapter-027" && state !== "locked";
          const marker = (
            <span className={`map-marker map-marker-${state}`} style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}>
              <span className="map-marker-dot" />
              <span className="map-marker-label">{node.name}</span>
            </span>
          );

          return isPlayable ? (
            <Link href="/chapter/027" key={node.id} aria-label={`进入${node.name}`}>
              {marker}
            </Link>
          ) : (
            <span key={node.id} aria-label={`${node.name} ${state}`}>
              {marker}
            </span>
          );
        })}
      </div>

      <aside className="node-panel surface">
        <h2>路线节点</h2>
        {mapSeed.nodes.map((node) => {
          const state = getNodeState(node, progress);
          return (
            <article className="node-card" key={node.id}>
              <img src={node.thumbnail} alt="" />
              <div>
                <h3>{node.name}</h3>
                <p>{node.previewText}</p>
                <span>{state}</span>
              </div>
            </article>
          );
        })}
      </aside>
    </div>
  );
}
