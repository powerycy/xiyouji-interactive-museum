# 大地图路线数据

本目录保存取经大地图相关数据。

## 文件

- `map-nodes.seed.json`：MVP 演示用大地图节点，允许先做空壳预览
- `route-canon.seed.json`：正式路线数据结构骨架
- `route-canon.candidates.json`：从全书扫描出的路线候选和重点节点证据

## 使用规则

正式大地图不要直接用 AI 想象路线。

推荐顺序：

1. 读取 `route-canon.candidates.json`
2. 优先审核 `priorityNodes`
3. 用 `autoNodes` 补查遗漏地点
4. 人工确认后写入 `route-canon.seed.json`
5. 再生成正式大地图美术 brief

`priorityNodes` 是带预置重点名称的全文扫描结果，适合作为大地图主干候选。

`autoNodes` 是宽泛地点候选池，可能包含句子残片或背景地点，不应直接作为地图节点。
