# 设计规格：西游记 MVP 游戏闭环

## 1. 目标

开发一个可本地运行、可完整游玩的《西游记》互动博物馆 MVP 闭环。

闭环范围为：

1. 取经大地图
2. 第二七回“三打白骨精”白虎岭章节探索
3. 探索度与核心线索解锁
4. “白虎岭真相时间线”小游戏
5. 静态全景预览奖励
6. 徽章点亮与下一节点预览解锁
7. 只读本地内容工作台 `/studio`

本阶段优先让完整体验跑通。拖拽库、动效库和真正 360 viewer 都不进入首版 MVP。

## 2. 技术路线

采用 Next.js + React + TypeScript。

首版不引入 `@dnd-kit`、Framer Motion 或 360 viewer。交互使用 React state、按钮、点击、上移下移和选择控件完成。

内容继续使用当前仓库内的本地 JSON 与真实资源：

- `content/map/map-nodes.seed.json`
- `content/chapters/chapter-027.seed.json`
- `public/assets/**`

用户进度保存在 localStorage：

- key：`xiyouji.progress.v1`
- version：`1`

读取进度时必须校验版本和 JSON 结构。进度缺失、损坏或版本不匹配时，回到干净的 v1 空进度。

## 3. 页面结构

### `/` 大地图

读取 `map-nodes.seed.json`，使用 `backgroundImage` 作为地图背景，按节点百分比坐标渲染 marker。

节点状态来自 seed 与本地进度合并：

- `baihuling` 初始可进入
- `heisonglin` 初始 locked
- 白虎岭奖励查看后，`heisonglin` 变为 preview
- 白虎岭完成后显示已解锁徽章

不可进入节点显示缩略图、节点名和预览文案，不跳转到未实现章节。

### `/chapter/027` 白虎岭探索

读取 `chapter-027.seed.json`，显示章节标题、原回目、主场景图和 11 个热点。

热点按 `scene.hotspots[].position` 百分比坐标覆盖在真实场景图上。点击热点后，打开展签面板，显示：

- 展签标题和类型
- 繁体原文
- 简体白话解释
- 来源章节与原文位置
- 探索权重
- 是否为小游戏核心线索

用户点击“标记已读”后，把 label id 写入进度。探索度按百分比公式计算：

```ts
sum(readLabel.explorationWeight) / totalExplorationWeight * 100
```

MVP seed 的展签总权重应为 100。若总权重异常，`/studio` 负责暴露该问题，但用户端仍使用公式计算，避免把“权重和”长期当成百分比。UI 同时显示：

- 探索度百分比
- 核心线索阅读进度，例如 `7/9`

小游戏入口必须同时满足：

1. 探索度 `>= 70%`
2. `minigame.unlockRequirement.requiredReadLabelIds` 中 9 个核心线索全部已读

若只满足探索度但核心线索未读完，入口仍禁用，并显示缺少的核心线索数量。

### `/chapter/027/game` 小游戏

小游戏为“事件时间线还原 + 原文线索卡匹配”。

首版不用拖拽。交互为：

1. 显示事件卡列表
2. 用户点击选中事件卡
3. 使用上移/下移按钮调整顺序
4. 为需要证据的事件选择一张线索卡
5. 点击校验

校验规则：

- 事件顺序必须匹配 `eventCards[].correctOrder`
- 每个事件所选证据必须包含在该事件的 `requiredEvidenceIds`
- 全部正确后写入 `gameCompleted: true`
- 完成后跳转到 `/chapter/027/reward`

未解锁时访问小游戏页，应显示解锁条件并提供返回章节探索的入口。

### `/chapter/027/reward`

奖励只支持当前 seed 的 `static-panorama-preview`。

若 `gameCompleted !== true` 时直接访问 `/chapter/027/reward`，奖励页显示“小游戏尚未完成”的状态，并提供返回小游戏或章节探索的入口。此状态不得写入 `rewardViewed`、`badgeUnlocked` 或地图解锁进度。

页面显示：

- 奖励标题
- `reward.src` 静态全景图
- 可选缩略图或资源说明
- 返回大地图按钮

用户查看奖励后写入：

- `rewardViewed: true`
- `badgeUnlocked: true`
- 地图解锁 `heisonglin`

如果未来 seed 中的 reward 类型不是 `static-panorama-preview`，首版显示“不支持该奖励类型”的主题化空状态，不接入 360 viewer。

### `/studio` 只读工作台

首版 `/studio` 不写回 JSON，只做本地预览和 QA。

展示内容：

- 地图节点列表与状态
- 白虎岭主场景图
- 热点覆盖预览
- 展签列表、权重和核心线索标记
- 探索权重总和
- 小游戏事件卡、证据卡和答案引用
- 奖励资源与徽章资源

`/studio` 可以提供“重置本地进度”按钮，方便重复测试闭环。该按钮只清理 localStorage，不修改内容文件。

## 4. 模块边界

### 内容模块

内容模块负责导入 JSON 并建立类型化数据结构。它提供便捷查询：

- label by id
- hotspot labels
- required label ids
- total exploration weight
- required label progress
- reward asset

MVP 信任已有 seed，但在 `/studio` 中暴露异常，例如：

- 展签总权重不是 100
- 热点引用不存在的展签
- 小游戏证据引用不存在的展签
- reward 或 badge 资源路径为空

### 进度模块

进度模块是 localStorage 的唯一读写入口。页面和组件不直接拼 localStorage。

如果 localStorage 不可用，进度模块内部启用内存中的 session fallback。页面仍只调用 progress API；fallback 只保证当前 session 可继续游玩，不承诺刷新后恢复。

动作包括：

- 读取进度
- 重置进度
- 标记展签已读
- 计算探索度
- 判断小游戏是否解锁
- 标记小游戏完成
- 标记奖励已查看
- 计算地图节点状态

保存的是可序列化游戏状态，不保存组件状态或 DOM 状态。

### 规则模块

小游戏校验放在纯函数模块中。输入当前事件顺序和证据选择，输出：

- 每张事件卡是否顺序正确
- 每张事件卡证据是否正确
- 整体是否完成
- 可展示的错误提示

这样核心规则可以不用浏览器直接测试。

### UI 组件

组件按页面和职责拆分：

- `MapView`
- `MapNodeMarker`
- `ChapterScene`
- `HotspotMarker`
- `MuseumLabelPanel`
- `ExplorationStatus`
- `MinigameGate`
- `TimelineGame`
- `RewardPreview`
- `StudioPreview`

页面路由负责加载内容、组合组件和处理跳转。业务规则放在内容、进度和规则模块里。

## 5. 视觉与交互方向

界面是“暗黑东方神魔漫画博物馆”风，不做通用后台或文档站。

DOM 承担文字密集 UI，主图和地图保护为核心视觉区域。常驻 HUD 保持克制：

- 大地图主要突出路线和节点
- 章节页主要突出场景图和热点
- 展签以面板或抽屉承载长文本
- 小游戏页面允许更强的卡片结构，因为它本身是规则界面

移动端首版需要可用：地图、场景图、展签、小游戏按钮和奖励图不能出现不可读或互相遮挡。

## 6. 错误处理

MVP 错误处理保持轻量但明确：

- 找不到章节：显示主题化空状态并返回大地图
- 热点没有展签：显示“该热点暂无展签”
- localStorage 不可用：当前 session 仍可交互，并提示进度不会持久保存
- reward 类型不支持：显示当前 MVP 只支持静态全景预览
- 图片加载失败：保留布局并显示资源路径，方便 `/studio` QA

## 7. 验收标准

实现完成后，必须能验证：

- 本地应用可启动
- `/`、`/chapter/027`、`/chapter/027/game`、`/chapter/027/reward`、`/studio` 可访问
- 大地图显示真实地图资源和节点
- 白虎岭节点可进入，其他节点显示锁定或预览
- 白虎岭场景图和热点可见
- 点击热点可查看展签
- 标记展签已读后探索度增长
- 探索度 `69%`、`70%`、`71%` 与核心线索未齐/已齐的组合下，小游戏入口状态正确
- 小游戏可用上移/下移排序和证据选择完成
- 错误顺序或错误证据会提示
- 完成小游戏后进入奖励页
- 奖励页显示 `static-panorama-preview` 静态图
- 查看奖励后徽章点亮，黑松林变为预览
- 刷新页面后进度仍存在
- `/studio` 能只读预览章节、热点、展签、小游戏、奖励和徽章资源

## 8. 明确不做

首版不做：

- 用户登录
- 云端数据库
- 自由 AI 问答
- 无限 AI 生成剧情
- `@dnd-kit` 拖拽
- Framer Motion 动效
- 真实 360 viewer
- `/studio` 写回 JSON
- 全书章节完整开发
