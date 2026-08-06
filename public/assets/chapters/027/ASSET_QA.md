# 第二七回资源 QA

## 当前可用资源

- `/assets/map/journey-map-v2.png`
- `/assets/chapters/027/cover-v1.png`
- `/assets/chapters/027/scenes/baihuling-main-v2.png`
- `/assets/chapters/027/characters/sun-wukong-v1.png`
- `/assets/chapters/027/characters/tang-seng-v1.png`
- `/assets/chapters/027/characters/zhu-bajie-v1.png`
- `/assets/chapters/027/characters/sha-seng-v1.png`
- `/assets/chapters/027/characters/baigu-furen-v1.png`
- `/assets/chapters/027/rewards/baihuling-360-v1.png`
- `/assets/chapters/027/rewards/baihuling-360-thumb.jpg`
- `/assets/badges/chapter-027-badges-v1.png`
- `/assets/badges/chapter-027-locked-v1.png`
- `/assets/badges/chapter-027-unlocked-v1.png`

## 视觉结论

- `journey-map-v2.png`：方向可用于当前 seed，长安在左，佛土在右；分辨率低于理想 2400px，可开发先用，正式版建议提高分辨率。
- `cover-v1.png`：封面氛围强，适合 demo；右侧白骨夫人偏妖化，正式版建议重做得更克制。
- `baihuling-main-v2.png`：当前推荐章节探索主场景，热点空间清楚；已按角色图纸统一师徒四人，猪八戒改为黑褐粗重猪形、长嘴大耳、九齿钉钯方向。
- `sun-wukong-v1.png`：猴相、金光眼、虎皮裙、金箍棒明确，可作为 v1 人物图纸；紧箍偏额饰，正式版可再校正。
- `tang-seng-v1.png`：袈裟、毘卢帽、锡杖明确；人物略年轻美型，可后续调整为更端正古典。
- `zhu-bajie-v1.png`：长嘴大耳、鬃毛、九齿钉钯明确，可用。
- `sha-seng-v1.png`：蓝靛脸、红发、降妖宝杖明确；骷髅元素偏重，若想更温和可重生成。
- `baigu-furen-v1.png`：伪装、骨相、妖气都明确，适合 demo。
- `baihuling-360-v1.png`：可做奖励页静态全景预览，比例接近 2:1；不是严格工程级 equirectangular，当前 seed 不应接 360 viewer，正式 360 建议重做。
- `baihuling-360-thumb.jpg`：由当前全景图裁切生成，用于奖励入口缩略图。
- `chapter-027-badges-v1.png`：徽章合图可用作视觉参考；`locked-v1` 已裁切左侧锁定徽章，`unlocked-v1` 已裁切右侧发光解锁徽章。

## v2 场景链资源

第一轮 v2 场景链图已拒绝，不能作为正式资源接入：

- 审查位置：`docs/review/2026-07-01-v2-scene-rejected-drafts/`
- 拒绝原因：孙悟空、唐僧、猪八戒、沙僧等核心角色未稳定继承现有角色图纸和原著设定，部分服饰、装备和体态偏离过大。
- 处理结果：这些图片已从章节 027 的 v2 scenes 运行时资源目录移出；`chapter-027.seed.json` 不得引用它们。

下一轮 v2 场景资源必须先通过角色一致性 QA：

1. 以 `public/assets/chapters/027/characters/*-v1.png` 作为强角色参考。
2. 同时读取 `content/characters/*.base.json` 与 `content/chapters/027/characters/*.state.json`。
3. 逐张读取 `content/chapters/027/scene-assets.v2.manifest.json` 的 `sourceEvidence`，确认候选图能对应原文摘录、展签和物证空间。
4. 若生成模型无法稳定保留角色形象，应改用“背景场景 + 已审核角色图层/剪影/局部特写 + 气氛/物件图”的组合方式。
5. 通过逐张 QA 后，才能重新落盘到章节 027 的 v2 scenes 运行时资源目录并写入 `sceneNodes`。

详细逐张准入清单见 `docs/assets/CHAPTER_027_V2_EVIDENCE_SPACE_ASSET_CHECKLIST.md`。v2 的优先美术策略为“剧情证据空间”：剪影、物证、道路、妖气、尸骨、贬书承担叙事；未经审核的角色正脸表情不能作为剧情核心。

## 开发注意

`chapter-027.seed.json` 当前仍保持 v1 单场景字段，指向 `baihuling-main-v2.png`。v2 章节页在 10 张主线场景图通过角色一致性 QA 前，不应正式接入 `sceneNodes`。

## 已替换删除资源

- `baihuling-main-v1.png`：构图可用，但师徒四人和角色设定图存在不一致，尤其猪八戒偏粉、偏可爱；已删除，并被 `baihuling-main-v2.png` 替换为开发推荐图。
