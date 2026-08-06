"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChapterSeedV2, SceneHotspot, SceneNode } from "@/content/types";
import { getMainlineSceneNodes, getSceneNodeById } from "@/content/xiyouji";
import { getChapterProgress, type XiyoujiProgress } from "@/progress/progress";
import { ExplorationStatus } from "./ExplorationStatus";
import { MinigameGate } from "./MinigameGate";
import { MuseumLabelPanel } from "./MuseumLabelPanel";
import { SceneLightPopover } from "./SceneLightPopover";
import { SceneTimelineControls } from "./SceneTimelineControls";
import { SceneTransitionStage, type SceneTransitionState } from "./SceneTransitionStage";

function decodeImage(src: string): Promise<void> {
  if (typeof window === "undefined" || typeof Image === "undefined") {
    return Promise.resolve();
  }

  const image = new Image();
  let settled = false;

  return new Promise((resolve) => {
    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    const canDecode = typeof image.decode === "function";
    image.onload = () => {
      if (!canDecode) {
        done();
      }
    };
    image.onerror = done;
    image.src = src;

    if (canDecode) {
      image
        .decode()
        .then(done)
        .catch(done);
    }
  });
}

export function SceneChainBrowser({
  chapter,
  progress,
  manager
}: {
  chapter: ChapterSeedV2;
  progress: XiyoujiProgress;
  manager: {
    markLabelRead: (chapterId: string, labelId: string) => void;
    markSceneVisited: (chapterId: string, sceneId: string) => void;
    openSceneHotspot: (chapterId: string, hotspotId: string) => void;
    navigateToScene: (chapterId: string, sceneId: string, options?: { fromSceneId?: string; pushStack?: boolean }) => void;
    goBackScene: (chapterId: string) => string | null;
  };
}) {
  const chapterProgress = getChapterProgress(progress, chapter.id);
  const mainlineScenes = getMainlineSceneNodes(chapter);
  const currentSceneId = chapterProgress.currentSceneId ?? chapter.sceneNavigation.initialSceneId;
  const currentScene = getSceneNodeById(chapter, currentSceneId) ?? mainlineScenes[0];
  const currentSceneDefaultLabelId = currentScene.source.labelIds[0] ?? null;
  const [previousScene, setPreviousScene] = useState<SceneNode | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<SceneHotspot | null>(null);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(currentSceneDefaultLabelId);
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const [transition, setTransition] = useState<SceneTransitionState>({
    phase: "idle",
    direction: "forward",
    origin: { x: 50, y: 50 }
  });
  const visited = useMemo(
    () => new Set([...chapterProgress.visitedSceneIds, currentScene.id]),
    [chapterProgress.visitedSceneIds, currentScene.id]
  );
  const selectedLabel = chapter.labels.find((label) => label.id === selectedLabelId) ?? null;

  useEffect(() => {
    manager.markSceneVisited(chapter.id, currentScene.id);
  }, [chapter.id, currentScene.id, manager]);

  useEffect(() => {
    setSelectedLabelId(currentSceneDefaultLabelId);
    setActiveHotspot(null);
  }, [currentScene.id, currentSceneDefaultLabelId]);

  useEffect(() => {
    const neighbors = [currentScene.previousSceneId, currentScene.nextSceneIds[0]]
      .map((sceneId) => (sceneId ? getSceneNodeById(chapter, sceneId) : undefined))
      .filter((scene): scene is SceneNode => Boolean(scene));

    for (const neighbor of neighbors) {
      void decodeImage(neighbor.asset.src);
    }
  }, [chapter, currentScene.nextSceneIds, currentScene.previousSceneId]);

  async function navigate(
    sceneId: string,
    hotspot: SceneHotspot | null,
    direction: SceneTransitionState["direction"],
    pushStack = false
  ) {
    const target = getSceneNodeById(chapter, sceneId);
    if (!target || target.id === currentScene.id) {
      return;
    }

    const origin = hotspot?.position ?? { x: direction === "backward" ? 28 : 72, y: 52 };
    setPreviousScene(currentScene);
    setTransition({ phase: "leaving", direction, origin });
    await decodeImage(target.asset.src);
    setTransition({ phase: "entering", direction, origin });
    setActiveHotspot(null);
    manager.navigateToScene(chapter.id, sceneId, {
      fromSceneId: currentScene.id,
      pushStack
    });
    window.setTimeout(() => setTransition((value) => ({ ...value, phase: "idle" })), 340);
  }

  async function goBack() {
    const targetSceneId = chapterProgress.sceneStack.at(-1);
    const target = targetSceneId ? getSceneNodeById(chapter, targetSceneId) : null;
    if (!target) {
      return;
    }

    const origin = { x: 28, y: 52 };
    setPreviousScene(currentScene);
    setTransition({ phase: "leaving", direction: "backward", origin });
    await decodeImage(target.asset.src);
    setTransition({ phase: "entering", direction: "backward", origin });
    manager.goBackScene(chapter.id);
    window.setTimeout(() => setTransition((value) => ({ ...value, phase: "idle" })), 340);
  }

  function openHotspot(hotspot: SceneHotspot) {
    manager.openSceneHotspot(chapter.id, hotspot.id);
    setRipple({ x: hotspot.position.x, y: hotspot.position.y, key: Date.now() });
    setActiveHotspot(hotspot);
  }

  const nextSceneId = currentScene.nextSceneIds[0];
  const previousSceneId = currentScene.previousSceneId;

  return (
    <div className="scene-chain-layout">
      <SceneTransitionStage scene={currentScene} previousScene={previousScene} transition={transition}>
        <div className="scene-title-hud">
          <p className="small-text">第二七回 · {currentScene.subtitle}</p>
          <h2>{currentScene.title}</h2>
          <p>{currentScene.entryCopy}</p>
        </div>
        <div className="scene-hotspot-layer">
          {currentScene.hotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              className={`scene-hotspot scene-hotspot-${hotspot.kind} ${activeHotspot?.id === hotspot.id ? "scene-hotspot-active" : ""}`}
              style={{
                left: `${hotspot.position.x}%`,
                top: `${hotspot.position.y}%`,
                width: `${Math.max(44, (hotspot.radius ?? 7) * 8)}px`,
                height: `${Math.max(44, (hotspot.radius ?? 7) * 8)}px`
              }}
              onClick={() => openHotspot(hotspot)}
              aria-label={hotspot.title}
            >
              <span>{hotspot.title}</span>
            </button>
          ))}
        </div>
        {ripple ? (
          <span
            key={ripple.key}
            className="scene-click-ripple"
            style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
            aria-hidden="true"
          />
        ) : null}
        {activeHotspot ? (
          <SceneLightPopover
            hotspot={activeHotspot}
            onOpenLabel={() => setSelectedLabelId(activeHotspot.labelIds[0] ?? null)}
            onAdvance={() => {
              if (activeHotspot.action.targetSceneId) {
                void navigate(activeHotspot.action.targetSceneId, activeHotspot, "forward", true);
              }
            }}
            onClose={() => setActiveHotspot(null)}
          />
        ) : null}
        <div className="scene-chain-nav">
          <button disabled={!previousSceneId} onClick={() => previousSceneId && void navigate(previousSceneId, null, "backward")} aria-label="上一场景">
            上一场景
          </button>
          <button disabled={!nextSceneId} onClick={() => nextSceneId && void navigate(nextSceneId, null, "forward")} aria-label="下一场景">
            下一场景
          </button>
          <button onClick={() => void goBack()} disabled={chapterProgress.sceneStack.length === 0} aria-label="返回上一层">
            返回
          </button>
        </div>
        <SceneTimelineControls
          scenes={mainlineScenes}
          currentSceneId={currentScene.id}
          visitedSceneIds={visited}
          onJump={(sceneId) => void navigate(sceneId, null, "jump")}
        />
      </SceneTransitionStage>
      <aside className="scene-side-stack">
        <ExplorationStatus chapter={chapter} progress={progress} />
        <MuseumLabelPanel
          label={selectedLabel}
          read={Boolean(selectedLabel && chapterProgress.readLabelIds.includes(selectedLabel.id))}
          onMarkRead={(labelId) => manager.markLabelRead(chapter.id, labelId)}
        />
        <MinigameGate chapter={chapter} progress={progress} />
      </aside>
    </div>
  );
}
