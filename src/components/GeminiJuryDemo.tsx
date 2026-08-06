"use client";

import { baihulingPanoramaTour } from "@/content/panoramaTour";
import { PanoramaInfoDrawer } from "./PanoramaInfoDrawer";

const landscapeContent = baihulingPanoramaTour.content["content-baihuling-landscape"];
const landscapeScene = baihulingPanoramaTour.nodes[0];

export function GeminiJuryDemo() {
  return (
    <main className="gemini-jury-demo">
      <img
        className="gemini-jury-demo-backdrop"
        src={landscapeScene.panorama.fallbackSrc}
        alt="白虎岭山路场景"
      />
      <div className="gemini-jury-demo-shade" aria-hidden="true" />
      <header className="gemini-jury-demo-header">
        <p>Vibe-a-thon 2026 · 评委直达演示</p>
        <h1>Gemini 多模态文化导览</h1>
        <span>同一能力已嵌入 360° 全景热点；本页用于稳定展示真实 API 结果。</span>
      </header>
      <div className="gemini-jury-demo-badge">
        <b>01</b>
        <span>白虎岭险路</span>
      </div>
      <PanoramaInfoDrawer
        content={landscapeContent}
        initialLanguage="zh-Hans"
        placement="right"
        onClose={() => undefined}
      />
    </main>
  );
}
