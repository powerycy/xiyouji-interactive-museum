# 西游记互动博物馆开发前文档

本目录是《西游记》原著还原型互动博物馆的开发前交付包，用于交给后续 AI 开发对话或开发者直接执行。

## 文档顺序

1. [PRD.md](./PRD.md)：产品定位、目标用户、MVP 范围和成功标准
2. [USER_FLOW.md](./USER_FLOW.md)：大地图、章节探索、小游戏、奖励解锁流程
3. [TECH_SPEC.md](./TECH_SPEC.md)：技术架构、运行方式、本地存储和资源策略
4. [CONTENT_MODEL.md](./CONTENT_MODEL.md)：章节、热点、展签、探索度、小游戏的数据模型
5. [CHAPTER_027_DESIGN.md](./CHAPTER_027_DESIGN.md)：三打白骨精 demo 的具体设计
6. [FULL_TEXT_EVIDENCE_WORKFLOW.md](./FULL_TEXT_EVIDENCE_WORKFLOW.md)：全书角色设定和大地图路线证据抽取流程
7. [ART_DIRECTION.md](./ART_DIRECTION.md)：原著驱动的东方神魔漫画博物馆风美术规范
8. [ASSET_LIST.md](./ASSET_LIST.md)：开发前需要生成的美术资源清单
9. [assets/CHAPTER_027_ASSET_PROMPTS.md](./assets/CHAPTER_027_ASSET_PROMPTS.md)：三打白骨精 demo 核心美术生成提示词
10. [assets/STYLE_TESTS.md](./assets/STYLE_TESTS.md)：首轮美术风格测试记录
11. [AI_CONTENT_PIPELINE.md](./AI_CONTENT_PIPELINE.md)：AI 辅助内容生产与人工确认流程
12. [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)：开发任务拆解和验收顺序

## 开发交接

交给另一个对话开发时，优先让它读取：

- [../HANDOFF.md](../HANDOFF.md)
- [../content/chapters/chapter-027.seed.json](../content/chapters/chapter-027.seed.json)
- [../content/map/map-nodes.seed.json](../content/map/map-nodes.seed.json)

## 原著来源

原著文本已保存到：

- [../data/raw/xiyouji/project-gutenberg-23962-xiyouji.txt](../data/raw/xiyouji/project-gutenberg-23962-xiyouji.txt)
- [../data/raw/xiyouji/SOURCE.md](../data/raw/xiyouji/SOURCE.md)
- [../data/processed/xiyouji/chapter-027.txt](../data/processed/xiyouji/chapter-027.txt)

当前主源为 Project Gutenberg eBook #23962《西遊記》。项目内容必须以该文本为证据源，不使用影视、动画、漫画、网文或民间改编作为原著依据。
