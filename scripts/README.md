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

## `build_xiyouji_curated_drafts.py`

从已经抽取的候选证据生成第一版人工整理草案。

运行：

```bash
python3 scripts/build_xiyouji_curated_drafts.py
```

输出：

- `content/characters/*.base.json`
- `content/chapters/027/characters/*.state.json`
- `content/map/route-canon.seed.json`

这些文件已经比候选数据更适合开发和美术生产，但状态仍是 `curated-draft-requires-human-review`，正式上线前需要人工复核。

## `validate_asset_references.mjs`

检查交接文档、产品文档和资源 QA 文档中的资产路径是否能落到真实文件。

运行：

```bash
node scripts/validate_asset_references.mjs
```

覆盖：

- `HANDOFF.md`
- `docs/**/*.md`
- `public/assets/**/*.md`

脚本会检查 `public/assets/...`、`/assets/...` 和 `public/assets/map/nodes/*.jpg` 这类通配路径。
