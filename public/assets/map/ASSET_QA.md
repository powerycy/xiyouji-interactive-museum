# 大地图资源 QA

## 当前资源

- `journey-map-v2.png`：当前推荐开发用版本，长安在左、佛土在右，与 `content/map/map-nodes.seed.json` 更接近。
- `nodes/*.jpg`：v1 已生成，由 `journey-map-v2.png` 按 `content/map/map-nodes.seed.json` 的节点坐标裁切得到，可用于开发期节点缩略图。正式版可按节点重新绘制更高完成度缩略图。

## 已废弃删除

- `journey-map-v1.png`：第一版方向错误，佛土在左、长安在右，已删除，后续开发不再引用。

## 注意

`journey-map-v2.png` 分辨率为 1915x821，低于理想生产规格。MVP 本地开发可先使用，正式视觉资源建议重新生成或放大到至少 2400px 宽。
