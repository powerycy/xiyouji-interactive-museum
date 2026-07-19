# Demo 运行说明

## 公开仓库

https://github.com/powerycy/xiyouji-interactive-museum

评审时请打开仓库默认分支 `codex/vibe-top100-submission`。该分支包含本次提交的完整优化版本。

## 推荐浏览器

- 桌面端：最新版 Chrome 或 Edge，建议窗口宽度 1280px 以上
- 移动端：最新版 Safari 或 Chrome
- 请允许 WebGL；若 WebGL 不可用，页面会自动显示静态全景回退

## 本地运行

环境：Node.js 20+、pnpm。

```bash
pnpm install
pnpm dev
```

浏览器打开：

- 首页：`http://localhost:3000`
- 白虎岭全景：`http://localhost:3000/chapter/027`
- 小游戏：`http://localhost:3000/chapter/027/game`
- 奖励页：`http://localhost:3000/chapter/027/reward`

## 验证命令

```bash
pnpm test
pnpm typecheck
pnpm build
```

提交前最近一次结果：56 项测试通过，TypeScript 检查通过，Next.js 生产构建通过（8 个静态页面）。
