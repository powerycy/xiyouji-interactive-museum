# 开发交接说明

## 当前状态

本仓库已经完成《西游记》原著还原型互动博物馆的开发前准备：

- 原著主源已下载
- 全书 100 回已机械切分
- 第二七回已单独保留为 demo 原文
- 产品、技术、内容、美术、AI 流程文档已完成
- 三打白骨精 demo 的结构化 seed 数据已生成
- 大地图 seed 节点已生成
- 主角基础设定和大地图路线的全文证据候选已生成
- 主角基础设定草案、第二七回角色状态草案、55 节点路线草案已生成
- 第一批真实 v1 美术资源已生成并保存到 `public/assets`

## 下一位开发者先读

按顺序阅读：

1. `docs/README.md`
2. `docs/PRD.md`
3. `docs/TECH_SPEC.md`
4. `docs/CONTENT_MODEL.md`
5. `docs/CHAPTER_027_DESIGN.md`
6. `docs/FULL_TEXT_EVIDENCE_WORKFLOW.md`
7. `content/chapters/chapter-027.seed.json`
8. `content/map/map-nodes.seed.json`
9. `content/map/route-canon.seed.json`
10. `content/characters/sun-wukong.base.json`
11. `content/characters/tang-seng.base.json`
12. `content/characters/zhu-bajie.base.json`
13. `content/characters/sha-seng.base.json`
14. `content/characters/bailongma.base.json`
15. `content/chapters/027/characters/sun-wukong.state.json`
16. `content/map/route-canon.candidates.json`
17. `docs/assets/CHAPTER_027_ASSET_PROMPTS.md`
18. `public/assets/README.md`
19. `public/assets/chapters/027/ASSET_QA.md`
20. `public/assets/map/ASSET_QA.md`
21. `docs/IMPLEMENTATION_PLAN.md`

## 核心约束

- 不做用户登录
- 不做云端数据库
- 不开放自由 AI 问答
- 不做无限 AI 生成剧情
- 不把影视、动画、漫画、网文内容当成原著
- 不复制《西行纪》或其他现有 IP 的角色造型、构图、服饰、武器和标志性画面
- 小游戏使用简体白话
- 博物馆展签使用繁体原文 + 简体白话解释

## 推荐开发起点

第一阶段目标：

1. 初始化 Next.js + TypeScript 项目
2. 加载 `content/map/map-nodes.seed.json`
3. 加载 `content/chapters/chapter-027.seed.json`
4. 实现大地图节点状态
5. 实现白虎岭章节页
6. 实现展签和探索度
7. 实现 70% 解锁小游戏

## 资源注意事项

首轮美术风格测试图已经生成，保存于 `public/assets/style-tests`。这些图只用于气质测试，不是原著考据最终资源。

当前已生成可用于 MVP 开发的真实 v1 资源：

- `public/assets/map/journey-map-v2.png`
- `public/assets/chapters/027/cover-v1.png`
- `public/assets/chapters/027/scenes/baihuling-main-v1.png`
- `public/assets/chapters/027/characters/sun-wukong-v1.png`
- `public/assets/chapters/027/characters/tang-seng-v1.png`
- `public/assets/chapters/027/characters/zhu-bajie-v1.png`
- `public/assets/chapters/027/characters/sha-seng-v1.png`
- `public/assets/chapters/027/characters/baigu-furen-v1.png`
- `public/assets/chapters/027/rewards/baihuling-360-v1.png`
- `public/assets/badges/chapter-027-locked-v1.png`
- `public/assets/badges/chapter-027-unlocked-v1.png`

仍需补齐或替换的 MVP 资源：

- 单枚裁切版锁定/解锁徽章
- 地图节点缩略图

资源 QA 见：

- `public/assets/map/ASSET_QA.md`
- `public/assets/chapters/027/ASSET_QA.md`

主角基础形象必须从全书提取，不能只依据第二七回生成。大地图也必须从全书路线线索提取，不能让 AI 自由画路线。

全文切分和证据候选已生成：

- `data/processed/xiyouji/chapter-index.json`
- `data/processed/xiyouji/chapters/chapter-001.txt` 到 `chapter-100.txt`
- `content/map/route-canon.candidates.json`
- `content/characters/*.base.candidates.json`
- `content/characters/*.base.json`
- `content/chapters/027/characters/*.state.json`
- `content/map/route-canon.seed.json`

可复跑脚本：

```bash
python3 scripts/extract_xiyouji_fulltext.py
python3 scripts/build_xiyouji_curated_drafts.py
```

路线开发时优先读取 `route-canon.seed.json`。需要追溯时审核 `route-canon.candidates.json` 的 `priorityNodes`。`autoNodes` 只是补漏搜索池，可能有噪声，不能直接变成地图节点。

提示词见：

- `docs/assets/CHAPTER_027_ASSET_PROMPTS.md`

资源路径约定见：

- `public/assets/README.md`
- `docs/ASSET_LIST.md`

## 数据注意事项

`chapter-027.seed.json` 已指向 `baihuling-main-v1.png`，但热点坐标仍是开发前草案，字段 `coordinateStatus` 已标明需按 v1 图片在 `/studio` 中重新校准。

展签和小游戏内容是第一版 seed，开发时可以先直接使用；上线前应人工复核原文摘录和白话解释。

`map-nodes.seed.json` 是 MVP 演示节点，不是全书考据路线。正式大地图应以后续 `route-canon.seed.json` 的全书抽取结果为准。

`*.base.json` 是第一版人物基础设定草案，已经比候选文件更适合开发和美术生产，但仍需人工复核。正式人物图必须叠加 `content/chapters/027/characters/*.state.json`。

## 验收目标

MVP 完成时必须做到：

- 本地启动应用
- 大地图可见
- 白虎岭节点可进入
- 其他节点显示锁定或预览
- 白虎岭场景热点可点击
- 展签显示繁体原文和简体白话解释
- 阅读展签累计探索度
- 探索度达到 70% 后小游戏入口可用
- 完成小游戏后进入 360 全景或动画奖励
- 徽章点亮并保存到本地进度
- 刷新页面后进度不丢失
- `/studio` 可预览章节数据、热点、展签、小游戏和奖励资源
