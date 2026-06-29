# 角色设定数据

本目录用于保存从《西游记》全书提取的角色设定。

## 两层结构

### 全书基础设定

基础设定从一百回综合提取，不能只看某一章。

建议文件：

- `sun-wukong.base.json`
- `tang-seng.base.json`
- `zhu-bajie.base.json`
- `sha-seng.base.json`
- `bailongma.base.json`

当前已生成自动证据候选：

- `sun-wukong.base.candidates.json`
- `tang-seng.base.candidates.json`
- `zhu-bajie.base.candidates.json`
- `sha-seng.base.candidates.json`
- `bailongma.base.candidates.json`

这些文件来自全文机械扫描，包含别名、原文片段、章节号和源文件路径。它们不是最终人物设定，作用是给人工考据和美术提示词提供证据池。

当前也已生成第一版整理草案：

- `sun-wukong.base.json`
- `tang-seng.base.json`
- `zhu-bajie.base.json`
- `sha-seng.base.json`
- `bailongma.base.json`

这些文件可用于 MVP 开发和美术提示词拼装，但仍标记为 `curated-draft-requires-human-review`。

### 章节状态设定

章节状态从当前章节提取，描述角色在本章的环境、动作、情绪和衣着变化。

建议路径：

- `content/chapters/027/characters/sun-wukong.state.json`

第二七回已生成：

- `content/chapters/027/characters/sun-wukong.state.json`
- `content/chapters/027/characters/tang-seng.state.json`
- `content/chapters/027/characters/zhu-bajie.state.json`
- `content/chapters/027/characters/sha-seng.state.json`
- `content/chapters/027/characters/bailongma.state.json`

## 生成美术资源的规则

正式人物图提示词必须同时读取：

1. 角色全书基础设定
2. 当前章节状态设定
3. 当前美术方向

不能只根据第二七回生成孙悟空、唐僧、八戒、沙僧的基础形象。

## 使用顺序

1. 先读对应角色的 `.base.candidates.json`
2. 复核并修订 `.base.json`
3. 再结合章节状态 `content/chapters/027/characters/*.state.json`
4. 最后生成正式人物图 prompt 和资产
