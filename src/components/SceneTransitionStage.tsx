"use client";

import type { CSSProperties, ReactNode } from "react";
import type { SceneNode } from "@/content/types";

export interface SceneTransitionState {
  phase: "idle" | "leaving" | "entering";
  direction: "forward" | "backward" | "jump";
  origin: { x: number; y: number };
}

export function SceneTransitionStage({
  scene,
  previousScene,
  transition,
  children
}: {
  scene: SceneNode;
  previousScene: SceneNode | null;
  transition: SceneTransitionState;
  children: ReactNode;
}) {
  const origin = `${transition.origin.x}% ${transition.origin.y}%`;

  return (
    <div
      className={`scene-chain-stage scene-transition-${transition.phase} scene-transition-${transition.direction}`}
      style={{ "--scene-transition-origin": origin } as CSSProperties}
    >
      {previousScene ? (
        <img
          src={previousScene.asset.src}
          alt=""
          aria-hidden="true"
          className="scene-chain-image scene-chain-image-previous"
          style={{ transformOrigin: origin }}
        />
      ) : null}
      <img src={scene.asset.src} alt={scene.asset.alt} className="scene-chain-image scene-chain-image-current" />
      {children}
    </div>
  );
}
