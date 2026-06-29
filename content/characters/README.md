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

### 章节状态设定

章节状态从当前章节提取，描述角色在本章的环境、动作、情绪和衣着变化。

建议路径：

- `content/chapters/027/characters/sun-wukong.state.json`

## 生成美术资源的规则

正式人物图提示词必须同时读取：

1. 角色全书基础设定
2. 当前章节状态设定
3. 当前美术方向

不能只根据第二七回生成孙悟空、唐僧、八戒、沙僧的基础形象。

