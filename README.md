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
- Gemini 3.5 Flash 多模态文化导览：同时分析当前全景画面与对应原著证据

## 本地运行

需要 Node.js 20+ 与 pnpm。

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`，在地图中选择“白虎岭”，或直接访问 `http://localhost:3000/chapter/027`。评审或录屏环境也可打开 `http://localhost:3000/gemini-demo`，在不依赖 WebGL 的静态场景中核验同一套真实 Gemini API。

### 启用 Gemini 多模态导览

1. 在 [Google AI Studio](https://aistudio.google.com/apikey) 创建 Gemini API Key。
2. 复制 `.env.example` 为 `.env.local`，填写 `GEMINI_API_KEY`。
3. 重启 `pnpm dev`，打开任意白色文化热点，在展签内向 Gemini 提问。

API Key 只由 Next.js 服务端路由读取，不会发送到浏览器或提交到 GitHub。浏览器只提交热点 ID、当前语言和访客问题；原著证据与全景路径由服务端从白名单内容模型解析，避免客户端伪造来源。

生产验证：

```bash
pnpm test
pnpm typecheck
pnpm build
```

当前提交验证结果：16 个测试文件、63 项测试通过，TypeScript 检查和 Next.js 生产构建通过。

## 技术与内容结构

- Next.js、React、TypeScript
- Photo Sphere Viewer（360° 全景、热点和场景跳转）
- Google Gen AI SDK `@google/genai` + Gemini 3.5 Flash（图像与原文联合解读、结构化 JSON 输出）
- 本地 JSON 内容模型与原著行号证据
- localStorage 保存探索与奖励进度
- 响应式桌面 / 移动端交互

核心全景数据见 `src/content/panoramaTour.ts`，原著章节和展签内容见 `content/chapters/chapter-027.seed.json`，美术提示词与约束见 `docs/assets/CHAPTER_027_ASSET_PROMPTS.md`。

## Google AI 与生成式 AI 使用披露

当前版本已接入 Google Gen AI SDK 和 Gemini 3.5 Flash。用户在文化热点中提问时，服务端把当前 360° 全景图、该热点经人工校对的繁体原文、简体解释、英文导览和原文行号共同提交给 Gemini；模型以结构化 JSON 返回画面观察、文化语境、原文引句和解读边界。提示词明确把访客问题视为不可信文本，要求不得绕过证据或虚构引文。

Gemini 功能需要服务端设置 `GEMINI_API_KEY`。没有 Key 时，其余本地博物馆体验仍可运行，界面会给出明确配置提示。

视觉资产在开发阶段使用图像生成工具辅助产出，经人工筛选、裁切、热点定位和内容校对；首页地图景深使用 Depth Anything V2 Small 生成。

## 版权与第三方依赖

《西游记》原著为公版文本。项目中的原创代码、策展结构和生成视觉资产保留作者权利；第三方依赖说明见 `THIRD_PARTY_NOTICES.md`。未经明确许可，不代表本仓库整体采用开源许可证。
