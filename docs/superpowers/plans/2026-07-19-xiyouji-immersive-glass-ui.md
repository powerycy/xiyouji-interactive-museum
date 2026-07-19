# 《西游记》沉浸式玻璃 UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将白虎岭全景和首页大地图统一为全屏画面主导、半透明悬浮信息层的沉浸式文化博物馆体验。

**Architecture:** 保留 Photo Sphere Viewer 和既有内容模型，将热点命中加固、浮窗位置决策和地图悬浮状态拆成可测试的小函数/组件。视觉只用 CSS 变量、backdrop-filter、transform 和 reduced-motion 媒体查询，不增加运行时 UI 或 3D 依赖。

**Tech Stack:** Next.js 16、React 19、TypeScript、Photo Sphere Viewer 5.14.3、Vitest、Testing Library、CSS。

## Global Constraints

- 完整保留工作区中既有未提交 v2 改动，不 reset、checkout 或覆盖无关文件。
- 不新增图片、字体、音乐或 3D 资产；首页复用 `public/assets/map/journey-map-v2.png`。
- 不删除旧场景链源文件，只从当前用户流程移除入口。
- 不上传 GitHub；本轮停在本地 QA 与用户验收。

---

### Task 1: 移除旧图像链入口

**Files:**
- Modify: `src/components/ChapterScene.tsx`
- Modify: `src/components/PanoramaExperience.tsx`
- Test: `src/components/ChapterScene.panorama.test.tsx`
- Test: `src/components/PanoramaExperience.test.tsx`

**Interfaces:**
- Produces: `ChapterScene` 只渲染 `PanoramaExperience`；`PanoramaExperience` 不再接收 `onUseFallback`。

- [ ] 写失败测试：页面不存在名称包含“图像场景链”的按钮，WebGL 错误回退仅提供“重新载入”按钮。
- [ ] 运行 `pnpm vitest run src/components/ChapterScene.panorama.test.tsx src/components/PanoramaExperience.test.tsx`，确认因旧按钮存在而失败。
- [ ] 移除 `experienceMode`、`SceneChainBrowser` 入口和 `onUseFallback`；添加 `onRetry={() => setRuntimeFailed(false)}` 的静态回退。
- [ ] 重跑测试，确认通过。

### Task 2: 加固热点命中并替换视觉语义

**Files:**
- Modify: `src/content/panoramaTour.ts`
- Modify: `src/components/photoSphereRuntime.ts`
- Modify: `app/globals.css`
- Test: `src/content/panoramaTour.test.ts`
- Test: `src/components/photoSphereRuntime.test.ts`

**Interfaces:**
- Produces: `createHotspotElement(label, kind, onActivate)` 创建无文字、可访问且有直接 click 回调的按钮；热点可见核心与 52 px 命中区分离。

- [ ] 写失败测试：热点 HTML 不含“阅”，包含 `panorama-hotspot-core`；直接 click 会调用 `onInfoHotspotSelect`。
- [ ] 运行相关测试，确认新结构和直接事件当前缺失。
- [ ] 将信息 marker 改为无文字核心；运行时在 marker 建立后为按钮绑定 click 回调，并在销毁时清理。
- [ ] 将场景箭头改为无文字方向光晕；用伪元素绘制，不在 DOM 中写可见字符。
- [ ] 增加透明核心、呼吸环、48/52 px 命中区以及 `prefers-reduced-motion` 样式。
- [ ] 重跑相关测试，确认通过。

### Task 3: 自适应悬浮文化窗

**Files:**
- Modify: `src/components/PanoramaExperience.tsx`
- Modify: `src/components/PanoramaInfoDrawer.tsx`
- Modify: `app/globals.css`
- Test: `src/components/PanoramaExperience.test.tsx`
- Test: `src/components/PanoramaInfoDrawer.test.tsx`

**Interfaces:**
- Produces: `PanoramaOverlaySide = "left" | "right" | "bottom"`；`PanoramaInfoDrawer` 接收 `placement`；热点回调传入触发元素并据其 `getBoundingClientRect()` 选择相反侧。

- [ ] 写失败测试：左半区热点打开右侧浮窗，右半区热点打开左侧浮窗；移动布局保留 bottom CSS 契约。
- [ ] 运行测试，确认 `placement` 契约不存在。
- [ ] 在 `PanoramaExperience` 计算位置并传入抽屉；在抽屉根元素增加 `data-placement` 和位置类。
- [ ] 用半透明暖玻璃重写窗口、标签、来源、标题牌、图例和工具栏样式，确保四周画面可见。
- [ ] 重跑组件测试，确认语言切换、Escape、关闭和焦点恢复仍通过。

### Task 4: 全屏景深首页大地图

**Files:**
- Modify: `app/page.tsx`
- Modify: `src/components/MapView.tsx`
- Create: `src/components/MapView.test.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `MapView` 内部维护 `isJourneyOpen` 和 `selectedNodeId`；节点面板可展开、收起，地图背景始终全屏。

- [ ] 写失败测试：存在全屏地图区；“展开取经纪程”打开悬浮节点面板，“收起取经纪程”关闭；白虎岭仍链接 `/chapter/027`。
- [ ] 运行测试，确认旧常驻 `node-panel` 结构导致失败。
- [ ] 将 `app/page.tsx` 改为 `AppFrame variant="museum-light"` 和无外层 section-heading 的全屏壳。
- [ ] 重写 `MapView`：背景层、轻景深层、标题玻璃牌、地图节点、可收起纪程面板和选择态详情。
- [ ] 增加桌面/移动响应式 CSS；移动面板为底部玻璃层，所有按钮保持至少 44 px 命中区。
- [ ] 重跑地图测试，确认通过。

### Task 5: 原著覆盖审计

**Files:**
- Read: `content/chapters/chapter-027.seed.json`
- Read: `src/content/panoramaTour.ts`
- Read: `src/content/xiyouji.ts`
- Create: `docs/review/2026-07-19-baihuling-panorama-sample/ORIGINAL_TEXT_COVERAGE.md`
- Test: `src/content/panoramaTour.test.ts`

**Interfaces:**
- Produces: 可核查的覆盖表，明确“当前全景热点覆盖”不等于“第二十七回全文覆盖”。

- [ ] 为每个全景热点的 `source.lines` 与三语字段写结构测试。
- [ ] 对照章节 seed 的 labels、v2 scene nodes 和全景热点，列出已覆盖与未进入本全景的关键段落。
- [ ] 写入覆盖审计文档，不虚构行号、原文或英文来源。
- [ ] 运行内容测试，确认通过。

### Task 6: 完整验证与视觉 QA

**Files:**
- Modify: `docs/review/2026-07-19-baihuling-panorama-sample/README.md`
- Create: `docs/review/2026-07-19-baihuling-panorama-sample/qa-v2-*.png`

**Interfaces:**
- Consumes: Tasks 1–5 的最终 UI 与内容。

- [ ] 运行 `pnpm test`，预期全部测试通过。
- [ ] 运行 `pnpm run typecheck`，预期零 TypeScript 错误。
- [ ] 运行 `pnpm run build`，预期 Next.js 生产构建成功。
- [ ] Chrome 桌面 1280 × 720：连续缩放/拖动后用真实坐标点击两类热点；验证浮窗左右定位、关闭和焦点恢复。
- [ ] Chrome 移动 390 × 844：验证热点 52 px 命中、底部浮层、地图面板展开/收起和安全区。
- [ ] 保存首页、全景、浮窗、缩放后热点、移动端截图并更新 QA 记录。
