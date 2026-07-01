# 内容模型

> 最新 v2 场景链契约以 `docs/review/2026-07-01-mvp-effect-audit/REVISION_REQUIREMENTS.md` 为准。本文件保留 v1 基础内容模型和共用字段说明；下一版章节页应优先使用 `sceneNodes` / `sceneNavigation`，旧 `scene` 单场景字段只作为 Studio 对比、回退和迁移参考。

## 1. 总体原则

内容模型必须让每个产品内容都能追溯到原著证据。

核心对象：

- 章节
- 地图节点
- 场景
- 热点
- 展签
- 原文引用
- 探索度
- 小游戏
- 奖励资源
- 徽章

## 2. 章节结构示例

```json
{
  "id": "chapter-027",
  "title": "三打白骨精",
  "originalTitle": "屍魔三戲唐三藏　聖僧恨逐美猴王",
  "chapterNumber": 27,
  "mapNodeId": "baihuling",
  "canonicalRouteId": "route-021",
  "status": "available",
  "unlockRequirement": null,
  "explorationThreshold": 70,
  "scene": {},
  "sceneNavigation": {},
  "sceneNodes": [],
  "labels": [],
  "minigame": {},
  "reward": {},
  "badge": {}
}
```

说明：

- `scene` 是 v1 单场景模型，保留给当前闭环、Studio 对比和兼容回退。
- `sceneNavigation` 与 `sceneNodes` 是 v2 视觉场景链模型。若 seed 中存在 `sceneNodes`，章节页必须以它作为权威渲染数据。
- `labels`、`minigame`、`reward`、`badge` 继续复用，不把原著文字烘焙进图片。

## 3. 地图节点

```json
{
  "id": "baihuling",
  "canonicalRouteId": "route-021",
  "name": "白虎岭",
  "chapterId": "chapter-027",
  "position": { "x": 48, "y": 55 },
  "state": "available",
  "previewText": "屍魔三戲唐三藏，聖僧恨逐美猴王。",
  "thumbnail": "/assets/map/nodes/baihuling.jpg"
}
```

`id` 是 MVP 前端节点和本地进度使用的 appNodeId；`canonicalRouteId` 映射到 `content/map/route-canon.seed.json` 的正式路线节点，用于考据、路线扩展和证据回查。

节点状态：

- `locked`
- `preview`
- `available`
- `completed`

## 4. 场景

### 4.1 v1 单场景模型

```json
{
  "id": "baihuling-main",
  "title": "白虎岭",
  "image": "/assets/chapters/027/scenes/baihuling-main-v2.png",
  "hotspots": []
}
```

### 4.2 v2 场景链模型

v2 不再把所有热点堆在一张白虎岭主图上，而是把章节拆成多个主线 scene node。三打白骨精 v2 固定为 10 个主线场景，完整清单、命名、资源前置条件和导航规则见 `REVISION_REQUIREMENTS.md`。

示意结构：

```json
{
  "sceneNavigation": {
    "initialSceneId": "scene-027-01-baihuling-road",
    "mainlineSceneIds": [
      "scene-027-01-baihuling-road",
      "scene-027-02-demon-motive",
      "scene-027-03-first-disguise",
      "scene-027-04-wukong-returns",
      "scene-027-05-bajie-instigation",
      "scene-027-06-second-disguise",
      "scene-027-07-third-disguise",
      "scene-027-08-skeleton-reveal",
      "scene-027-09-banish-wukong",
      "scene-027-10-chapter-review"
    ],
    "gameGateSceneId": "scene-027-10-chapter-review",
    "allowCycles": false
  },
  "sceneNodes": [
    {
      "id": "scene-027-01-baihuling-road",
      "kind": "main",
      "order": 1,
      "title": "白虎岭山路",
      "entryCopy": "险山生怪，唐僧饥饿，悟空离队去化斋。",
      "source": {
        "chapterNumber": 27,
        "rawLineStart": 6997,
        "rawLineEnd": 7007,
        "labelIds": ["label-027-baihuling", "label-027-hunger"]
      },
      "asset": {
        "type": "image",
        "src": "chapters/027/scenes/v2/scene-027-01-baihuling-road-v2.png",
        "alt": "白虎岭山路主视觉"
      },
      "previousSceneId": null,
      "nextSceneIds": ["scene-027-02-demon-motive"],
      "hotspots": [],
      "unlock": { "type": "chapter-available" }
    }
  ]
}
```

v2 导航约束：

- 主线场景按 `sceneNavigation.mainlineSceneIds` 线性推进。
- 细节场景必须有 `parentSceneId`，从父场景热点进入。
- `next` / `previous` 沿主线移动；`back` 弹出浏览栈回到上一层。
- 场景访问状态与探索度分开：`visitedSceneIds`、`openedHotspotIds` 不直接增加探索度，探索度仍只按唯一已读展签权重计算。

## 5. 热点

```json
{
  "id": "hotspot-baigu-furen",
  "type": "character",
  "title": "白骨夫人",
  "position": { "x": 72, "y": 48 },
  "radius": 8,
  "labelIds": ["label-027-demon-motive", "label-027-final-kill"],
  "isKey": true
}
```

热点类型：

- `character`
- `object`
- `location`
- `event`
- `detail`

位置使用百分比坐标，方便响应式缩放。

## 6. 展签

```json
{
  "id": "label-027-demon-motive",
  "title": "妖怪为何盯上唐僧",
  "type": "character",
  "source": {
    "work": "西遊記",
    "chapterNumber": 27,
    "chapterTitle": "屍魔三戲唐三藏　聖僧恨逐美猴王",
    "rawFile": "data/raw/xiyouji/project-gutenberg-23962-xiyouji.txt",
    "rawLineStart": 7023,
    "rawLineEnd": 7026
  },
  "originalTraditional": "繁体原文摘录放这里。",
  "plainSimplified": "简体白话解释放这里。",
  "explorationWeight": 8,
  "requiredForGame": true,
  "relatedIds": ["hotspot-baigu-furen"]
}
```

## 7. 探索度

探索度来自已读展签权重之和。

计算规则：

```ts
explorationPercent =
  sum(readLabel.explorationWeight) / sum(allLabel.explorationWeight) * 100
```

约束：

- 总权重建议为 100
- 关键展签权重大
- 彩蛋展签权重小
- 小游戏入口必须同时满足：探索度达到 70%（即 >= 70%），且 `minigame.unlockRequirement.requiredReadLabelIds` 全部已读
- `explorationPercentGte` 是最低探索度门槛，不等于“只要 70% 就一定解锁”。若必读核心展签权重合计超过 70%，实际解锁以“核心线索全读完”为准
- `requiredReadLabelEffectiveWeight` 可记录当前必读核心展签权重合计，方便 UI 和 QA 明确实际解锁口径

## 8. 小游戏

```json
{
  "id": "game-027-timeline",
  "type": "timeline-evidence-match",
  "title": "白虎岭真相时间线",
  "unlockExplorationPercent": 70,
  "unlockRequirement": {
    "type": "exploration-and-read-labels",
    "explorationPercentGte": 70,
    "requiredReadLabelEffectiveWeight": 89,
    "copy": "探索度至少 70%，并读完 9 个核心线索展签后解锁小游戏。",
    "requiredReadLabelIds": [
      "label-027-hunger",
      "label-027-demon-motive",
      "label-027-first-disguise",
      "label-027-wukong-eyes",
      "label-027-bajie-instigation",
      "label-027-second-disguise",
      "label-027-third-disguise",
      "label-027-final-kill",
      "label-027-curse-banish"
    ]
  },
  "eventCards": [
    {
      "id": "event-1",
      "text": "白骨精第一次变化，引诱唐僧师徒。",
      "correctOrder": 1,
      "requiredEvidenceIds": ["evidence-1"]
    }
  ],
  "evidenceCards": [
    {
      "id": "evidence-1",
      "text": "来自已读展签的简体白话线索。",
      "sourceLabelId": "label-027-demon-motive"
    }
  ]
}
```

小游戏内容使用简体白话，但每张证据卡必须能回到展签和原文。前端显示小游戏入口前，应校验所有 `evidenceCards[].sourceLabelId` 都在已读展签集合中，且这些 source label 与 `requiredReadLabelIds` 保持一致。当前三打白骨精 demo 的核心线索权重合计为 89%，因此实际按钮文案应强调“核心线索全读完”，不要只显示“70% 解锁”。

## 9. 奖励资源

```json
{
  "type": "static-panorama-preview",
  "src": "/assets/chapters/027/rewards/baihuling-360-v1.png",
  "thumbnail": "/assets/chapters/027/rewards/baihuling-360-thumb.jpg"
}
```

当前 `baihuling-360-v1.png` 是 2:1 全景视觉预览，不是严格工程级 equirectangular 资源，MVP 应按静态图奖励展示。后续如果替换为合格 360 图，可把奖励对象改为 `panorama` 类型并接入全景 viewer；如果替换为动画，必须先生成真实视频和封面文件，再把奖励对象改为 `video` 类型。seed 中不要引用尚未落盘的资源。

## 10. 本地进度

```json
{
  "version": 1,
  "chapters": {
    "chapter-027": {
      "readLabelIds": ["label-027-demon-motive"],
      "explorationPercent": 72,
      "gameCompleted": true,
      "rewardViewed": true,
      "badgeUnlocked": true
    }
  },
  "map": {
    "unlockedNodeIds": ["baihuling", "heisonglin"]
  }
}
```

MVP 进度版本策略：

- 当前版本号为 `1`，localStorage key 为 `xiyouji.progress.v1`
- 若读取到缺失、格式错误或 `version` 不匹配的进度，前端应重置为干净的 v1 空进度
- `/studio` 或开发调试 UI 应提供“重置本地进度”入口
- 正式扩展多章节前，再补充跨版本迁移脚本
