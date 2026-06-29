# 本地内容抽取脚本

## `extract_xiyouji_fulltext.py`

从 Project Gutenberg《西遊記》底本文本生成开发前数据。

运行：

```bash
python3 scripts/extract_xiyouji_fulltext.py
```

输出：

- `data/processed/xiyouji/chapter-index.json`
- `data/processed/xiyouji/chapters/chapter-001.txt` 到 `chapter-100.txt`
- `content/map/route-canon.candidates.json`
- `content/characters/*.base.candidates.json`

脚本只做机械抽取和候选生成，不做白话改写，不生成最终人物设定，也不替代人工考据。
