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
- `baihuling-360-v1.png`：可做奖励页全景视觉，比例接近 2:1；不是严格工程级 equirectangular，正式 360 建议重做。
- `baihuling-360-thumb.jpg`：由当前全景图裁切生成，用于奖励入口缩略图。
- `chapter-027-badges-v1.png`：徽章合图可用作视觉参考；`locked-v1` 已裁切左侧锁定徽章，`unlocked-v1` 已裁切右侧发光解锁徽章。

## 开发注意

`chapter-027.seed.json` 已指向 `baihuling-main-v2.png`，但热点坐标仍需在 `/studio` 里按真实图片重新校准。

## 已替换删除资源

- `baihuling-main-v1.png`：构图可用，但师徒四人和角色设定图存在不一致，尤其猪八戒偏粉、偏可爱；已删除，并被 `baihuling-main-v2.png` 替换为开发推荐图。
