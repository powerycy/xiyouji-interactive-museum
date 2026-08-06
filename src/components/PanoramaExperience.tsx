"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  baihulingPanoramaTour,
  type PanoramaCulturalContent,
  type PanoramaLanguage
} from "@/content/panoramaTour";
import { PanoramaInfoDrawer, type PanoramaOverlayPlacement } from "./PanoramaInfoDrawer";
import {
  createPhotoSphereRuntime,
  type PanoramaRuntimeFactory
} from "./photoSphereRuntime";

export function PanoramaExperience({
  language = "zh-Hans",
  onMarkLabelRead,
  progressSummary,
  runtimeFactory = createPhotoSphereRuntime
}: {
  language?: PanoramaLanguage;
  onMarkLabelRead?: (labelId: string) => void;
  progressSummary?: {
    explorationPercent: number;
    requiredReadCount: number;
    requiredTotal: number;
    gameUnlocked: boolean;
  };
  runtimeFactory?: PanoramaRuntimeFactory;
}) {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const markLabelReadRef = useRef(onMarkLabelRead);
  const [currentNodeId, setCurrentNodeId] = useState(baihulingPanoramaTour.startNodeId);
  const [activeContentId, setActiveContentId] = useState<string | null>(null);
  const [overlayPlacement, setOverlayPlacement] = useState<PanoramaOverlayPlacement>("right");
  const [runtimeFailed, setRuntimeFailed] = useState(false);
  const activeContent: PanoramaCulturalContent | null = useMemo(
    () => (activeContentId ? baihulingPanoramaTour.content[activeContentId] ?? null : null),
    [activeContentId]
  );
  const currentNode =
    baihulingPanoramaTour.nodes.find((node) => node.id === currentNodeId) ?? baihulingPanoramaTour.nodes[0];
  const runtimeTour = useMemo(
    () => ({ ...baihulingPanoramaTour, startNodeId: currentNode.id }),
    [currentNode.id]
  );

  useEffect(() => {
    markLabelReadRef.current = onMarkLabelRead;
  }, [onMarkLabelRead]);

  useEffect(() => {
    if (!viewerContainerRef.current || runtimeFailed) {
      return;
    }

    let cancelled = false;
    let runtime: Awaited<ReturnType<PanoramaRuntimeFactory>> | null = null;
    let nodeChangeTimer: number | null = null;

    async function startRuntime() {
      try {
        const nextRuntime = await runtimeFactory(viewerContainerRef.current as HTMLDivElement, runtimeTour, {
          onInfoHotspotSelect: (hotspotId, trigger) => {
            const hotspot = baihulingPanoramaTour.nodes
              .flatMap((node) => node.infoHotspots)
              .find((candidate) => candidate.id === hotspotId);
            const content = hotspot ? baihulingPanoramaTour.content[hotspot.contentId] : null;
            if (!content) {
              return;
            }
            returnFocusRef.current = trigger;
            if (trigger) {
              const triggerBox = trigger.getBoundingClientRect();
              const triggerCenter = triggerBox.left + triggerBox.width / 2;
              setOverlayPlacement(triggerCenter > window.innerWidth / 2 ? "left" : "right");
            }
            setActiveContentId(content.id);
            markLabelReadRef.current?.(content.labelId);
          },
          onNodeChange: (nodeId) => {
            if (nodeChangeTimer !== null) {
              window.clearTimeout(nodeChangeTimer);
            }
            // VirtualTourPlugin emits NodeChangedEvent before it has finished
            // drawing the next node's link layer. Deferring React's runtime
            // rebuild prevents teardown from racing that final render pass.
            nodeChangeTimer = window.setTimeout(() => {
              if (!cancelled) {
                setCurrentNodeId(nodeId);
                setActiveContentId(null);
              }
            }, 120);
          },
          onPanoramaError: () => setRuntimeFailed(true)
        });

        if (cancelled) {
          nextRuntime.destroy();
        } else {
          runtime = nextRuntime;
        }
      } catch {
        if (!cancelled) {
          setRuntimeFailed(true);
        }
      }
    }

    void startRuntime();

    return () => {
      cancelled = true;
      if (nodeChangeTimer !== null) {
        window.clearTimeout(nodeChangeTimer);
      }
      runtime?.destroy();
    };
  }, [runtimeFactory, runtimeFailed, runtimeTour]);

  if (runtimeFailed) {
    return (
      <section className="panorama-static-fallback" aria-labelledby="panorama-fallback-title">
        <img src={currentNode.panorama.fallbackSrc} alt="白虎岭山路静态回退图" />
        <div className="panorama-static-fallback-copy">
          <p>360° 场景暂时无法载入</p>
          <h1 id="panorama-fallback-title">白虎岭暂时隐入云雾</h1>
          <p>可以重新载入全景，已读展签和探索进度不会丢失。</p>
          <button type="button" onClick={() => setRuntimeFailed(false)} aria-label="重新载入全景">
            重新载入全景
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="panorama-experience" aria-labelledby="panorama-experience-title">
      <div
        key={currentNode.id}
        ref={viewerContainerRef}
        className="panorama-viewer"
        data-testid="panorama-viewer"
      />

      <header className="panorama-top-hud psv--capture-event">
        <div>
          <p>西游记互动博物馆 · 第二七回</p>
          <h1 id="panorama-experience-title">白虎岭 · 白骨夫人</h1>
        </div>
        <div className="panorama-top-actions">
          <span className="panorama-drag-hint">拖动环视 · 滚轮或双指缩放</span>
        </div>
      </header>

      <div className="panorama-legend psv--capture-event" aria-label="全景热点图例">
        <span><i className="panorama-legend-info" aria-hidden="true" />文化展签</span>
        <span><i className="panorama-legend-link" aria-hidden="true" />场景入口</span>
      </div>

      {progressSummary ? (
        <nav className="panorama-chapter-progress psv--capture-event" aria-label="章节探索进度">
          <span>原著线索 {progressSummary.requiredReadCount}/{progressSummary.requiredTotal}</span>
          <small>探索度 {progressSummary.explorationPercent}%</small>
          {progressSummary.gameUnlocked ? (
            <Link href="/chapter/027/game" aria-label="进入真相时间线">进入时间线</Link>
          ) : (
            <em>继续寻找白色热点</em>
          )}
        </nav>
      ) : null}

      {currentNode.isPlaceholder ? (
        <p className="panorama-placeholder-status psv--capture-event">样板终点 · 下一场景制作中</p>
      ) : null}

      <p className="sr-only" aria-live="polite">
        当前场景：{currentNode.name.zhHans}
      </p>

      {activeContent ? (
        <PanoramaInfoDrawer
          content={activeContent}
          initialLanguage={language}
          placement={overlayPlacement}
          onClose={() => setActiveContentId(null)}
          returnFocusRef={returnFocusRef}
        />
      ) : null}
    </section>
  );
}
