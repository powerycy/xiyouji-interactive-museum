# 内容数据

本目录保存《西游记》互动博物馆的结构化内容数据。

## 当前文件

- `chapters/chapter-027.seed.json`：第二七回“三打白骨精”demo 的章节 seed 数据
- `map/map-nodes.seed.json`：取经大地图节点 seed 数据
- `map/route-canon.seed.json`：正式路线数据结构骨架
- `map/route-canon.candidates.json`：从全文扫描出的路线候选和重点节点证据
- `characters/*.base.candidates.json`：从全文扫描出的主角基础设定证据候选
- `characters/*.base.json`：从证据候选整理出的主角基础设定草案
- `chapters/027/characters/*.state.json`：第二七回角色章节状态草案

## 使用说明

`chapter-027.seed.json` 已包含：

- 章节元数据
- 白虎岭主场景资源路径
- 热点草案
- 博物馆展签
- 探索度权重
- 小游戏事件卡
- 证据卡
- 360/动画奖励资源路径
- 徽章资源路径

## 重要说明

热点坐标是开发前草案，需在真实白虎岭主场景图确定后，通过 `/studio` 或手动调整重新校准。

展签中的繁体原文来自 `data/processed/xiyouji/chapter-027.txt`，白话解释为第一版 seed，开发前可先使用，上线前应人工复核。

路线开发优先参考 `map/route-canon.seed.json`。如需追溯证据，再查看 `map/route-canon.candidates.json` 里的 `priorityNodes`。`autoNodes` 是宽泛地点候选池，可能包含句子残片，只用于补漏和搜索，不应直接变成大地图节点。
