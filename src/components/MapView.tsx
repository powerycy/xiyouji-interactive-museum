"use client";

import Link from "next/link";
import { useState } from "react";
import { mapSeed } from "@/content/xiyouji";
import { getNodeState } from "@/progress/progress";
import { useProgress } from "@/progress/useProgress";

export function MapView() {
  const { progress } = useProgress();
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = mapSeed.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedState = selectedNode ? getNodeState(selectedNode, progress) : null;

  return (
    <section
      className="journey-map-experience"
      data-testid="immersive-journey-map"
      data-depth-provenance="depth-anything-v2-small"
      aria-label="取经大地图"
    >
      <div className="journey-map-depth-scene">
        <img src={mapSeed.backgroundImage} alt="取经大地图" className="journey-map-depth-image" />
        <iframe
          src="/assets/map/spatial/journey-map-v2-spatial-v18.html"
          title="取经大地图空间景深"
          className="journey-map-spatial-frame"
          loading="eager"
          tabIndex={-1}
        />
        <div className="journey-map-atmosphere" aria-hidden="true" />
      </div>

      <header className="journey-map-title glass-overlay">
        <p>西游记互动博物馆 · 原著路线</p>
        <h1>取经大地图</h1>
        <span>从长安到灵山，沿取经纪程进入白虎岭。</span>
      </header>

      <button
        type="button"
        className="journey-map-timeline-toggle glass-overlay"
        aria-expanded={isJourneyOpen}
        onClick={() => setIsJourneyOpen((open) => !open)}
      >
        {isJourneyOpen ? "收起取经纪程" : "展开取经纪程"}
      </button>

      <div className="journey-map-node-layer" aria-label="地图节点">
        {mapSeed.nodes.map((node) => {
          const state = getNodeState(node, progress);
          return (
            <button
              type="button"
              key={node.id}
              className={`immersive-map-node immersive-map-node-${state}`}
              style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
              aria-label={`查看${node.name}节点`}
              aria-pressed={selectedNodeId === node.id}
              onClick={() => setSelectedNodeId((selected) => (selected === node.id ? null : node.id))}
            >
              <span className="immersive-map-node-core" aria-hidden="true" />
              <span className="immersive-map-node-label">{node.name}</span>
            </button>
          );
        })}
      </div>

      {selectedNode ? (
        <aside className="journey-map-node-detail glass-overlay" role="dialog" aria-label={selectedNode.name}>
          <button
            type="button"
            className="journey-map-close"
            onClick={() => setSelectedNodeId(null)}
            aria-label={`关闭${selectedNode.name}节点说明`}
          >
            ×
          </button>
          <p className="journey-map-detail-kicker">取经节点 · {selectedState}</p>
          <h2>{selectedNode.name}</h2>
          <p>{selectedNode.previewText}</p>
          {selectedNode.chapterId === "chapter-027" && selectedState !== "locked" ? (
            <Link href="/chapter/027" aria-label="进入白虎岭" className="journey-map-enter-link">
              进入白虎岭全景
            </Link>
          ) : null}
        </aside>
      ) : null}

      {isJourneyOpen ? (
        <aside className="journey-map-timeline glass-overlay" aria-label="取经纪程">
          <header>
            <div>
              <p>原著路线</p>
              <h2>取经纪程</h2>
            </div>
            <button type="button" onClick={() => setIsJourneyOpen(false)} aria-label="关闭取经纪程面板">
              ×
            </button>
          </header>
          <ol>
            {mapSeed.nodes.map((node) => {
              const state = getNodeState(node, progress);
              return (
                <li key={node.id}>
                  <button type="button" onClick={() => setSelectedNodeId(node.id)}>
                    <span>{node.name}</span>
                    <small>{state}</small>
                  </button>
                  {node.chapterId === "chapter-027" && state !== "locked" ? (
                    <Link href="/chapter/027" aria-label="进入白虎岭">进入</Link>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </aside>
      ) : null}
    </section>
  );
}
