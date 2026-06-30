# 美术资源清单

## 1. 资源策略

MVP 开发前必须生成核心视觉资源，不使用纯占位图完成体验。

但不提前生成全书资源。只生成大地图和三打白骨精 demo 所需核心包，开发中允许替换更好的版本。

当前已有 v1 资源见：

- `public/assets/README.md`
- `public/assets/map/ASSET_QA.md`
- `public/assets/chapters/027/ASSET_QA.md`

## 2. 大地图资源

必需：

- `public/assets/map/journey-map-v2.png`
  - 取经大地图背景
  - 原著驱动东方神魔漫画博物馆风
  - 有路线、山川、国度、妖域层次

- `public/assets/map/nodes/*.jpg`
  - 大地图节点缩略图，当前 v1 已按 `content/map/map-nodes.seed.json` 生成，可用于 MVP

## 3. 三打白骨精章节资源

必需：

- `public/assets/chapters/027/cover-v1.png`
  - 章节入口图

- `public/assets/chapters/027/scenes/baihuling-main-v2.png`
  - 白虎岭主探索场景
  - 必须可放热点

- `public/assets/chapters/027/rewards/baihuling-360-v1.png`
  - 360 全景图
  - 若先做动画，则改为视频资源

- `public/assets/chapters/027/rewards/baihuling-360-thumb.jpg`
  - 奖励页入口缩略图，由当前全景图裁切生成

可选：

- 章节完成内置动画
  - 后续生成真实视频文件后，再写入章节 seed 的奖励资源

## 4. 人物图纸

必需：

- `public/assets/chapters/027/characters/sun-wukong-v1.png`
- `public/assets/chapters/027/characters/tang-seng-v1.png`
- `public/assets/chapters/027/characters/zhu-bajie-v1.png`
- `public/assets/chapters/027/characters/sha-seng-v1.png`
- `public/assets/chapters/027/characters/baigu-furen-v1.png`

每张人物图纸要求：

- 半身或全身
- 原著驱动东方神魔漫画博物馆风
- 原创造型
- 有展陈感
- 背景不要过于复杂
- 必须读取对应 `content/characters/*.base.json`
- 必须叠加 `content/chapters/027/characters/*.state.json`

## 5. 物件与场景插图

后续可选新增：

- 斋饭小图，建议命名为 `food-v1.png`
- 行李小图，建议命名为 `luggage-v1.png`
- 金箍棒小图，建议命名为 `jingubang-v1.png`
- 紧箍咒小图，建议命名为 `jinguzhou-v1.png`
- 山路局部图，建议命名为 `mountain-path-v1.png`
- 妖气局部图，建议命名为 `demon-aura-v1.png`

这些资源尚未生成。生成后再放入对应资源目录并写入 seed，可作为展签小图或工作台预览。物件图也要绑定展签原文，不能只做气氛插图。

## 6. 徽章资源

必需：

- `public/assets/badges/chapter-027-locked-v1.png`
- `public/assets/badges/chapter-027-unlocked-v1.png`

徽章风格：

- 暗金
- 石刻或金属质感
- 有白虎岭/白骨/金箍棒等抽象符号
- 不要太可爱

## 7. UI 资源

建议：

- 展签边框纹理
- 地图节点图标
- 已读状态图标
- 探索度环形或条形装饰
- 小游戏事件卡背景
- 奖励解锁光效

## 8. 首批风格测试图提示词

### 白虎岭主场景

```text
《西游记》第二七回白虎岭，原创原著驱动东方神魔漫画博物馆风，险峻山路，枯树，岩石，远处妖气潜伏，唐僧师徒行进在山岭中，孙悟空警觉回望，画面预留多个可点击热点区域，高对比光影，厚重线条，暗金、青灰、山石冷色与少量赭红妖气点缀，史诗感，细节丰富但不拥挤。禁止复制《西行纪》或任何现有影视动画漫画造型，禁止现代物品，禁止低幼卡通，禁止素淡水彩。
```

### 白骨夫人人物图纸

```text
《西游记》白骨夫人原创人物设定图，原著驱动东方神魔漫画博物馆风，伪装与妖气并存，外表有古典人物气质，阴影中隐约显出白骨与妖气轮廓，强对比光影，厚重线条，暗红、青灰、暗金点缀，博物馆角色图纸构图。禁止复制《西行纪》角色，禁止现代性感妖女套路，禁止影视剧造型，禁止低幼卡通。
```

### 三打白骨精徽章

```text
《西游记》三打白骨精章节徽章，暗金金属与石刻质感，中心符号融合白虎岭山形、白骨妖气、金箍棒意象，东方神魔风，高对比，小尺寸仍清晰，适合游戏成就徽章。禁止使用现有 IP 标志，禁止卡通可爱风。
```
