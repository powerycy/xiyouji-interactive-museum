# 全书证据抽取流程

## 1. 为什么需要全书抽取

《西游记》互动博物馆的主角形象、大地图路线、地点节点和长期设定不能只从第二七回生成。

必须区分：

- 全书基础设定：从一百回综合提取
- 章节状态设定：从当前章节提取
- 产品表现：在基础设定和章节状态之上做视觉化、互动化

## 2. 输入

主源：

- `data/raw/xiyouji/project-gutenberg-23962-xiyouji.txt`

已切分示例：

- `data/processed/xiyouji/chapter-027.txt`

后续应切分全书：

- `data/processed/xiyouji/chapters/chapter-001.txt`
- `data/processed/xiyouji/chapters/chapter-002.txt`
- ...
- `data/processed/xiyouji/chapters/chapter-100.txt`

## 3. 角色基础设定抽取

每个核心角色需要建立基础设定文件。

建议文件：

- `content/characters/sun-wukong.base.json`
- `content/characters/tang-seng.base.json`
- `content/characters/zhu-bajie.base.json`
- `content/characters/sha-seng.base.json`
- `content/characters/bailongma.base.json`

每个角色基础设定包含：

- 常用姓名和称谓
- 出身和身份变化
- 外貌或形态描述
- 服饰和随身物
- 法器和武器
- 性格特征
- 与其他角色关系
- 关键章节证据
- 禁止误用的改编印象

## 4. 章节角色状态抽取

每章再建立角色状态。

示例：

- `content/chapters/027/characters/sun-wukong.state.json`

章节状态包含：

- 当前地点
- 当前服饰/风尘/受伤/被困状态
- 当前道具
- 当前情绪
- 当前动作
- 与本章事件关系
- 对应原文证据

正式人物图提示词必须由：

```text
角色基础设定 + 当前章节状态 + 当前场景动作 + 美术风格约束
```

合成。

## 5. 大地图路线抽取

大地图必须从全书找线索，不允许让 AI 自由画路线。

路线抽取字段：

- 地点名称
- 地点别名
- 首次出现章节
- 相关章节范围
- 地点类型：山、河、国、洞、寺、观、天界、佛土等
- 路线顺序
- 关键事件
- 原文证据
- 是否为 MVP 节点

建议文件：

- `content/map/route-canon.seed.json`

## 6. 地图节点分层

大地图至少分三层：

### 线路层

表达取经路线的前后顺序。

### 地点层

表达国度、山岭、河流、洞府、寺观、天界、佛土等空间类型。

### 章节层

表达每个地点对应的章节事件和解锁状态。

## 7. 艺术化边界

大地图可以艺术化，不需要真实地理比例。

允许：

- 压缩距离
- 放大重要地点
- 用妖气、佛光、山势表现章节气质
- 用路线节点表现阅读进度

不允许：

- 改变原著地点顺序
- 把不相关章节合并为同一地点
- 添加没有原文依据的关键节点
- 让 AI 自由生成不存在的西游国度或劫难

## 8. 开发顺序

推荐顺序：

1. 切分全书 100 回
2. 提取回目表
3. 提取主角基础设定
4. 提取路线地点候选
5. 人工确认大地图节点
6. 生成大地图美术 brief
7. 再生成正式大地图资源

## 9. 与当前 Demo 的关系

当前 `chapter-027.seed.json` 可用于 MVP 开发，但其中人物和地图应在全书抽取完成后再做一次校准。

特别是：

- 孙悟空、唐僧、猪八戒、沙僧的正式图纸不能只参考第二七回
- 大地图不能只使用当前概念测试图
- 白虎岭节点可以保留为 Demo 节点，但路线位置应以后续 `route-canon.seed.json` 为准

