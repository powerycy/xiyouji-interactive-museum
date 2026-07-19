# 《西游记》互动博物馆

一个以《西游记》原著证据为核心的多语言 Web 3D / 360° 互动文化导览原型。当前公开版本以第二十七回“三打白骨精”为完整样板：观众可在四个 360° 场景之间移动，点击热点阅读繁体中文原文、简体中文解释和英文导览，并通过线索探索、事件排序小游戏与奖励页理解人物冲突和故事结构。

## 当前可体验内容

- 取经路线大地图与第二十七回入口
- 4 个可拖拽、缩放、跳转的白虎岭 360° 全景场景
- 11 个经人工校对的文化热点
- 繁体中文原文、简体中文解释、英文导览三层信息
- 桌面端悬浮玻璃信息窗与移动端底部信息面板
- 探索进度、线索解锁、事件时间线小游戏和章节奖励
- WebGL 失败时的静态图回退

## 本地运行

需要 Node.js 20+ 与 pnpm。

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`，在地图中选择“白虎岭”，或直接访问 `http://localhost:3000/chapter/027`。

生产验证：

```bash
pnpm test
pnpm typecheck
pnpm build
```

## 技术与内容结构

- Next.js、React、TypeScript
- Photo Sphere Viewer（360° 全景、热点和场景跳转）
- 本地 JSON 内容模型与原著行号证据
- localStorage 保存探索与奖励进度
- 响应式桌面 / 移动端交互

核心全景数据见 `src/content/panoramaTour.ts`，原著章节和展签内容见 `content/chapters/chapter-027.seed.json`，美术提示词与约束见 `docs/assets/CHAPTER_027_ASSET_PROMPTS.md`。

## AI 使用披露

当前版本的运行时没有接入 Google AI、Gemini API 或其他在线生成式 AI 服务。视觉资产在开发阶段使用图像生成工具辅助产出，经人工筛选、裁切、热点定位和内容校对；首页地图景深使用 Depth Anything V2 Small 生成。原著证据、三语展签、交互逻辑和代码均作为本地静态内容运行。

本披露用于准确说明当前实现，不把未完成的 Google AI 集成写成已实现功能。

## 版权与第三方依赖

《西游记》原著为公版文本。项目中的原创代码、策展结构和生成视觉资产保留作者权利；第三方依赖说明见 `THIRD_PARTY_NOTICES.md`。未经明确许可，不代表本仓库整体采用开源许可证。
