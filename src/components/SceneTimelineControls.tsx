"use client";

import type { SceneNode } from "@/content/types";

export function SceneTimelineControls({
  scenes,
  currentSceneId,
  visitedSceneIds,
  onJump
}: {
  scenes: SceneNode[];
  currentSceneId: string;
  visitedSceneIds: Set<string>;
  onJump: (sceneId: string) => void;
}) {
  return (
    <>
      <nav className="scene-breadcrumb" aria-label="场景路径">
        {scenes.map((scene, index) => {
          const unlocked = visitedSceneIds.has(scene.id) || scene.order === 1;
          return (
            <button
              key={scene.id}
              className={scene.id === currentSceneId ? "scene-crumb-active" : ""}
              disabled={!unlocked}
              onClick={() => onJump(scene.id)}
            >
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {scene.title}
            </button>
          );
        })}
      </nav>
      <nav className="scene-time-scrubber" aria-label="章节时间线">
        {scenes.map((scene) => {
          const unlocked = visitedSceneIds.has(scene.id) || scene.order === 1;
          return (
            <button
              key={scene.id}
              className={scene.id === currentSceneId ? "scene-time-active" : ""}
              disabled={!unlocked}
              onClick={() => onJump(scene.id)}
              aria-label={`跳转到${scene.title}`}
            >
              {scene.order}
            </button>
          );
        })}
      </nav>
    </>
  );
}
