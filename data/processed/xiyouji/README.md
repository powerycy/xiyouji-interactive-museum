# 处理后的西游记文本

本目录保存从原始 Project Gutenberg 文本中机械切分出的章节文本。

## 文件

- `chapter-index.json`：全书 100 回索引，包含回目、源文件行号和切分后路径
- `chapters/chapter-001.txt` 到 `chapters/chapter-100.txt`：全书 100 回原文切分文件
- `chapter-027.txt`：第二七回《屍魔三戲唐三藏　聖僧恨逐美猴王》

## 切分来源

源文件：

- `data/raw/xiyouji/project-gutenberg-23962-xiyouji.txt`

切分范围：

- 第二七回从源文件第 6988 行开始
- 第二八回从源文件第 7248 行开始
- `chapter-027.txt` 取第 6988 到 7247 行

处理原则：

- 仅机械切分
- 不改写原文
- 不做白话化
- 不加入改编内容

## 复跑方式

```bash
python3 scripts/extract_xiyouji_fulltext.py
```

脚本会重新生成：

- `chapter-index.json`
- `chapters/chapter-001.txt` 到 `chapters/chapter-100.txt`
- `content/map/route-canon.candidates.json`
- `content/characters/*.base.candidates.json`

脚本会校验回目是否完整为 1 到 100；如果漏回或顺序异常，会直接报错。
