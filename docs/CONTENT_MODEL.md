# 内容模型

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
  "status": "available",
  "unlockRequirement": null,
  "explorationThreshold": 70,
  "scene": {},
  "labels": [],
  "minigame": {},
  "reward": {},
  "badge": {}
}
```

## 3. 地图节点

```json
{
  "id": "baihuling",
  "name": "白虎岭",
  "chapterId": "chapter-027",
  "position": { "x": 48, "y": 62 },
  "state": "available",
  "previewText": "白骨夫人三次变化，师徒关系出现裂痕。",
  "thumbnail": "/assets/map/nodes/baihuling.jpg"
}
```

节点状态：

- `locked`
- `preview`
- `available`
- `completed`

## 4. 场景

```json
{
  "id": "baihuling-main",
  "title": "白虎岭",
  "image": "/assets/chapters/027/scenes/baihuling-main.jpg",
  "hotspots": []
}
```

## 5. 热点

```json
{
  "id": "hotspot-baigufuren",
  "type": "character",
  "title": "白骨夫人",
  "position": { "x": 63, "y": 48 },
  "radius": 6,
  "labelIds": ["label-027-baigufuren-01"],
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
  "id": "label-027-baigufuren-01",
  "title": "白骨夫人",
  "type": "character",
  "source": {
    "work": "西遊記",
    "chapterNumber": 27,
    "chapterTitle": "屍魔三戲唐三藏　聖僧恨逐美猴王",
    "rawFile": "data/raw/xiyouji/project-gutenberg-23962-xiyouji.txt",
    "lineStart": null,
    "lineEnd": null
  },
  "originalTraditional": "繁体原文摘录放这里。",
  "plainSimplified": "简体白话解释放这里。",
  "explorationWeight": 10,
  "requiredForGame": true,
  "relatedIds": ["hotspot-baigufuren"]
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
- 达到 70% 解锁小游戏

## 8. 小游戏

```json
{
  "id": "game-027-timeline",
  "type": "timeline-evidence-match",
  "title": "白虎岭真相时间线",
  "unlockExplorationPercent": 70,
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
      "sourceLabelId": "label-027-example"
    }
  ]
}
```

小游戏内容使用简体白话，但每张证据卡必须能回到展签和原文。

## 9. 奖励资源

```json
{
  "type": "panorama",
  "src": "/assets/chapters/027/rewards/baihuling-360.jpg",
  "thumbnail": "/assets/chapters/027/rewards/baihuling-360-thumb.jpg"
}
```

或：

```json
{
  "type": "video",
  "src": "/assets/chapters/027/rewards/baihuling-ending.mp4",
  "poster": "/assets/chapters/027/rewards/baihuling-ending-poster.jpg"
}
```

## 10. 本地进度

```json
{
  "version": 1,
  "chapters": {
    "chapter-027": {
      "readLabelIds": ["label-027-baigufuren-01"],
      "explorationPercent": 72,
      "gameCompleted": true,
      "rewardViewed": true,
      "badgeUnlocked": true
    }
  },
  "map": {
    "unlockedNodeIds": ["baihuling", "next-preview-node"]
  }
}
```

