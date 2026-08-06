# Demo 运行说明

## 公开仓库

https://github.com/powerycy/xiyouji-interactive-museum

默认分支：`codex/vibe-top100-submission`

## 推荐评审入口

- 首页：`http://localhost:3000`
- 白虎岭 360° 体验：`http://localhost:3000/chapter/027`
- Gemini 评委直达页：`http://localhost:3000/gemini-demo`
- 时间线小游戏：`http://localhost:3000/chapter/027/game`
- 奖励页：`http://localhost:3000/chapter/027/reward`

评委直达页调用与 360° 热点相同的服务端 Gemini API，但使用静态场景底图，便于 WebGL 受限的录屏或评审环境稳定核验真实 AI 结果。

## 本地运行

环境：Node.js 20+、pnpm。

```bash
pnpm install
cp .env.example .env.local
# 在 .env.local 中设置 GEMINI_API_KEY
pnpm dev
```

Gemini API Key 可在 Google AI Studio 创建。Key 只由服务端读取，不会发送到浏览器或进入公开仓库。没有 Key 时，地图、360° 场景、三语展签、小游戏与奖励仍可运行。

## 推荐浏览器

- 桌面端：最新版 Chrome 或 Edge，建议宽度 1280px 以上
- 移动端：最新版 Safari 或 Chrome
- 360° 页面需 WebGL；失败时自动显示静态回退

## 验证命令与提交结果

```bash
pnpm test
pnpm typecheck
pnpm build
```

提交前结果：16 个测试文件、63 项测试全部通过；TypeScript 检查通过；Next.js 生产构建通过；真实 Gemini 3.5 Flash 多模态请求返回 HTTP 200。
