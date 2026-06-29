#!/usr/bin/env python3
"""Extract reusable source data from the Project Gutenberg Xiyouji text."""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RAW_FILE = ROOT / "data/raw/xiyouji/project-gutenberg-23962-xiyouji.txt"
CHAPTER_DIR = ROOT / "data/processed/xiyouji/chapters"
CHAPTER_INDEX_FILE = ROOT / "data/processed/xiyouji/chapter-index.json"
ROUTE_CANDIDATES_FILE = ROOT / "content/map/route-canon.candidates.json"
CHARACTER_DIR = ROOT / "content/characters"


CHAPTER_HEADER_RE = re.compile(r"^\s*第([一二三四五六七八九十百○〇零]+)回\s+(.+?)\s*$")
DIGIT_MAP = {
    "○": 0,
    "〇": 0,
    "零": 0,
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "七": 7,
    "八": 8,
    "九": 9,
}


LOCATION_SUFFIX_TYPE = {
    "山": "mountain",
    "嶺": "mountain",
    "岭": "mountain",
    "河": "river",
    "江": "river",
    "澗": "river",
    "涧": "river",
    "海": "water",
    "國": "kingdom",
    "国": "kingdom",
    "洞": "cave",
    "觀": "temple",
    "观": "temple",
    "寺": "monastery",
    "府": "city",
    "郡": "city",
    "城": "city",
    "莊": "village",
    "庄": "village",
    "宮": "heaven",
    "宫": "heaven",
    "殿": "heaven",
    "洲": "region",
    "關": "pass",
    "关": "pass",
}

LOCATION_RE = re.compile(
    r"(?<![一-龥])([一-龥]{2,8}(?:山|嶺|岭|河|江|澗|涧|海|國|国|洞|觀|观|寺|府|郡|城|莊|庄|宮|宫|殿|洲|關|关))(?![一-龥])"
)
LOCATION_STOP_PREFIXES = (
    "一座",
    "那座",
    "這座",
    "这座",
    "此座",
    "本山",
    "山中",
    "山前",
    "山後",
    "山后",
    "洞中",
    "洞裏",
    "洞里",
    "國中",
    "国中",
    "城中",
    "空中",
    "半山",
    "好山",
    "仙山",
)
LOCATION_STOP_EXACT = {
    "一座山",
    "這座山",
    "那座山",
    "此山",
    "其山",
    "此洞",
    "那洞",
    "這洞",
    "此國",
    "那國",
    "東土",
    "西天",
    "大海",
    "名山",
    "好山",
    "仙山",
    "下山",
    "登山",
    "過嶺",
    "越嶺",
    "真個好山",
}

LOCATION_CLEAN_MARKERS = (
    "這部書單表",
    "朝遊",
    "暮宿",
    "直至",
    "徑來到",
    "來到",
    "早看見",
    "下界去",
    "圍困了",
    "名曰",
    "喚做",
    "喚為",
    "叫做",
    "叫做個",
    "乃是",
    "有座",
    "有一座",
    "那廂有座",
    "那裏有座",
    "到了",
    "到於",
    "行至",
    "投至",
    "在於",
    "曰",
)

LOCATION_BAD_FRAGMENTS = (
    "遂分為",
    "國近",
    "順澗",
    "王遣",
    "我明日",
    "我等",
    "果是",
    "果有",
    "怎麼",
    "弟子",
    "頭如",
    "隔兩重",
    "又飄",
    "串長",
    "登崖",
    "在仙",
)

PRIORITY_ROUTE_NAMES = [
    {"name": "花果山", "aliases": ["花果山"]},
    {"name": "水簾洞", "aliases": ["水簾洞"]},
    {"name": "靈臺方寸山", "aliases": ["靈臺方寸山", "靈台方寸山"]},
    {"name": "斜月三星洞", "aliases": ["斜月三星洞"]},
    {"name": "東海龍宮", "aliases": ["東海龍宮", "龍宮"]},
    {"name": "南天門", "aliases": ["南天門"]},
    {"name": "靈霄寶殿", "aliases": ["靈霄寶殿"]},
    {"name": "五行山", "aliases": ["五行山"]},
    {"name": "長安", "aliases": ["長安"]},
    {"name": "雙叉嶺", "aliases": ["雙叉嶺"]},
    {"name": "蛇盤山", "aliases": ["蛇盤山"]},
    {"name": "鷹愁澗", "aliases": ["鷹愁澗"]},
    {"name": "觀音院", "aliases": ["觀音院"]},
    {"name": "黑風山", "aliases": ["黑風山"]},
    {"name": "高老莊", "aliases": ["高老莊"]},
    {"name": "雲棧洞", "aliases": ["雲棧洞"]},
    {"name": "黃風嶺", "aliases": ["黃風嶺"]},
    {"name": "流沙河", "aliases": ["流沙河"]},
    {"name": "萬壽山", "aliases": ["萬壽山"]},
    {"name": "五莊觀", "aliases": ["五莊觀"]},
    {"name": "白虎嶺", "aliases": ["白虎嶺", "白虎岭"]},
    {"name": "黑松林", "aliases": ["黑松林"]},
    {"name": "寶象國", "aliases": ["寶象國"]},
    {"name": "平頂山", "aliases": ["平頂山"]},
    {"name": "蓮花洞", "aliases": ["蓮花洞"]},
    {"name": "烏雞國", "aliases": ["烏雞國"]},
    {"name": "號山", "aliases": ["號山"]},
    {"name": "枯松澗", "aliases": ["枯松澗"]},
    {"name": "火雲洞", "aliases": ["火雲洞"]},
    {"name": "黑水河", "aliases": ["黑水河"]},
    {"name": "車遲國", "aliases": ["車遲國"]},
    {"name": "通天河", "aliases": ["通天河"]},
    {"name": "金山金洞", "aliases": ["金山金洞", "金山", "金洞"]},
    {"name": "西梁女國", "aliases": ["西梁女國"]},
    {"name": "火焰山", "aliases": ["火焰山"]},
    {"name": "祭賽國", "aliases": ["祭賽國"]},
    {"name": "荊棘嶺", "aliases": ["荊棘嶺"]},
    {"name": "小雷音寺", "aliases": ["小雷音寺"]},
    {"name": "駝羅莊", "aliases": ["駝羅莊"]},
    {"name": "朱紫國", "aliases": ["朱紫國"]},
    {"name": "盤絲洞", "aliases": ["盤絲洞"]},
    {"name": "濯垢泉", "aliases": ["濯垢泉"]},
    {"name": "獅駝嶺", "aliases": ["獅駝嶺"]},
    {"name": "比丘國", "aliases": ["比丘國"]},
    {"name": "鎮海寺", "aliases": ["鎮海寺"]},
    {"name": "陷空山", "aliases": ["陷空山"]},
    {"name": "無底洞", "aliases": ["無底洞"]},
    {"name": "滅法國", "aliases": ["滅法國"]},
    {"name": "隱霧山", "aliases": ["隱霧山"]},
    {"name": "玉華州", "aliases": ["玉華州"]},
    {"name": "金平府", "aliases": ["金平府"]},
    {"name": "青龍山", "aliases": ["青龍山"]},
    {"name": "天竺國", "aliases": ["天竺國"]},
    {"name": "靈山", "aliases": ["靈山"]},
    {"name": "雷音寺", "aliases": ["雷音寺"]},
]


CHARACTERS = {
    "sun-wukong": {
        "name": "孫悟空",
        "aliases": ["孫悟空", "悟空", "孫行者", "行者", "大聖", "美猴王", "猴王", "石猴", "齊天大聖", "弼馬溫"],
        "buckets": {
            "originIdentity": ["石猴", "花果山", "水簾洞", "猴王", "弼馬溫", "齊天大聖"],
            "appearanceBody": ["模樣", "本相", "毛", "眼", "面", "三頭六臂", "身"],
            "clothingProps": ["虎皮裙", "緊箍", "金箍", "衣", "裙"],
            "weaponsOrTools": ["金箍棒", "鐵棒", "棒", "毫毛", "觔斗"],
            "personalityActions": ["笑", "怒", "哭", "罵", "拜", "救", "惱", "歡喜"],
            "relationships": ["師父", "八戒", "沙僧", "唐僧", "觀音", "如來"],
        },
    },
    "tang-seng": {
        "name": "唐三藏",
        "aliases": ["唐三藏", "三藏", "唐僧", "玄奘", "長老", "聖僧", "御弟", "江流"],
        "buckets": {
            "originIdentity": ["江流", "玄奘", "御弟", "金蟬", "長安", "唐王"],
            "appearanceBody": ["模樣", "面", "身", "眉", "眼", "相貌"],
            "clothingProps": ["袈裟", "錫杖", "毘盧帽", "僧衣", "帽"],
            "weaponsOrTools": ["錫杖", "袈裟", "通關文牒", "文牒"],
            "personalityActions": ["哭", "驚", "拜", "念", "怕", "慈悲", "齋戒"],
            "relationships": ["徒弟", "行者", "八戒", "沙僧", "白馬", "觀音", "唐王"],
        },
    },
    "zhu-bajie": {
        "name": "豬八戒",
        "aliases": ["豬八戒", "八戒", "悟能", "獃子", "老豬", "天蓬", "豬剛鬣"],
        "buckets": {
            "originIdentity": ["天蓬", "豬剛鬣", "雲棧洞", "高老莊", "悟能"],
            "appearanceBody": ["模樣", "嘴", "耳", "肚", "身", "豬"],
            "clothingProps": ["衣", "僧衣", "直裰", "帽"],
            "weaponsOrTools": ["釘鈀", "九齒", "鈀"],
            "personalityActions": ["笑", "哭", "罵", "嚷", "貪", "怕", "懶"],
            "relationships": ["師父", "行者", "沙僧", "高老", "媳婦"],
        },
    },
    "sha-seng": {
        "name": "沙悟淨",
        "aliases": ["沙僧", "沙和尚", "悟淨", "沙悟淨", "捲簾", "沙門"],
        "buckets": {
            "originIdentity": ["捲簾", "流沙河", "悟淨", "天庭"],
            "appearanceBody": ["模樣", "髮", "項", "身", "面"],
            "clothingProps": ["衣", "僧衣", "骷髏", "項下"],
            "weaponsOrTools": ["降妖杖", "寶杖", "杖"],
            "personalityActions": ["拜", "哭", "救", "保護", "老實"],
            "relationships": ["師父", "行者", "八戒", "木叉", "觀音"],
        },
    },
    "bailongma": {
        "name": "白龍馬",
        "aliases": ["白龍馬", "龍馬", "白馬", "玉龍", "意馬", "小龍"],
        "buckets": {
            "originIdentity": ["西海", "龍子", "玉龍", "鷹愁澗", "意馬"],
            "appearanceBody": ["白馬", "龍", "身", "馬"],
            "clothingProps": ["鞍", "韁", "轡"],
            "weaponsOrTools": ["馬", "龍"],
            "personalityActions": ["馱", "變", "踏", "嘶"],
            "relationships": ["三藏", "唐僧", "行者", "菩薩", "龍王"],
        },
    },
}


def parse_chinese_chapter_number(raw: str) -> int:
    if "○" in raw or "〇" in raw or "零" in raw:
        value = 0
        for char in raw:
            if char not in DIGIT_MAP:
                raise ValueError(f"Unsupported digit in chapter number: {raw}")
            value = value * 10 + DIGIT_MAP[char]
        return value

    if "百" in raw:
        if raw == "一百":
            return 100
        raise ValueError(f"Unsupported hundred chapter number: {raw}")

    if "十" in raw:
        left, _, right = raw.partition("十")
        tens = DIGIT_MAP[left] if left else 1
        ones = DIGIT_MAP[right] if right else 0
        return tens * 10 + ones

    if len(raw) > 1:
        value = 0
        for char in raw:
            if char not in DIGIT_MAP:
                raise ValueError(f"Unsupported chapter number: {raw}")
            value = value * 10 + DIGIT_MAP[char]
        return value

    return DIGIT_MAP[raw]


def excerpt(lines: list[str], index: int, radius: int = 1) -> str:
    start = max(0, index - radius)
    end = min(len(lines), index + radius + 1)
    return "\n".join(line.rstrip() for line in lines[start:end]).strip()


def find_body_bounds(lines: list[str]) -> tuple[int, int]:
    start = 0
    end = len(lines)
    for idx, line in enumerate(lines):
        if line.startswith("*** START OF THE PROJECT GUTENBERG EBOOK"):
            start = idx + 1
        if line.startswith("*** END OF THE PROJECT GUTENBERG EBOOK"):
            end = idx
            break
    return start, end


def split_chapters(lines: list[str]) -> list[dict]:
    body_start, body_end = find_body_bounds(lines)
    headers = []
    for idx in range(body_start, body_end):
        match = CHAPTER_HEADER_RE.match(lines[idx].rstrip())
        if not match:
            continue
        number = parse_chinese_chapter_number(match.group(1))
        headers.append(
            {
                "number": number,
                "title": " ".join(match.group(2).split()),
                "rawHeader": lines[idx].rstrip(),
                "startLine": idx + 1,
                "startIndex": idx,
            }
        )

    expected = list(range(1, 101))
    actual = [item["number"] for item in headers]
    if actual != expected:
        raise RuntimeError(f"Expected chapters 1-100, got {actual}")

    CHAPTER_DIR.mkdir(parents=True, exist_ok=True)
    index = []
    for position, header in enumerate(headers):
        start_index = header["startIndex"]
        end_index = headers[position + 1]["startIndex"] if position + 1 < len(headers) else body_end
        chapter_lines = lines[start_index:end_index]
        filename = f"chapter-{header['number']:03d}.txt"
        path = CHAPTER_DIR / filename
        path.write_text("".join(chapter_lines).rstrip() + "\n", encoding="utf-8")
        index.append(
            {
                "number": header["number"],
                "titleTraditional": header["title"],
                "rawHeader": header["rawHeader"],
                "sourceFile": str(RAW_FILE.relative_to(ROOT)),
                "processedFile": str(path.relative_to(ROOT)),
                "rawStartLine": header["startLine"],
                "rawEndLine": end_index,
                "lineCount": len(chapter_lines),
            }
        )

    CHAPTER_INDEX_FILE.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return index


def load_chapter_texts(index: list[dict]) -> list[dict]:
    chapters = []
    for item in index:
        path = ROOT / item["processedFile"]
        lines = path.read_text(encoding="utf-8").splitlines()
        chapters.append({**item, "lines": lines, "text": "\n".join(lines)})
    return chapters


def location_type(name: str) -> str:
    if name.endswith(("靈山", "灵山", "雷音寺")):
        return "buddhist-land"
    return LOCATION_SUFFIX_TYPE.get(name[-1], "other")


def is_location_candidate(name: str) -> bool:
    if name in LOCATION_STOP_EXACT:
        return False
    if any(fragment in name for fragment in LOCATION_BAD_FRAGMENTS):
        return False
    if any(name.startswith(prefix) for prefix in LOCATION_STOP_PREFIXES):
        return False
    if len(name) < 2:
        return False
    if name.count("山") > 1 and not name.endswith("山"):
        return False
    return True


def clean_location_candidate(name: str) -> str:
    cleaned = name.strip(" ：，。；、！「」『』")
    changed = True
    while changed:
        changed = False
        for marker in LOCATION_CLEAN_MARKERS:
            if marker in cleaned and not cleaned.endswith(marker):
                after = cleaned.split(marker, 1)[1]
                if after and after != cleaned:
                    cleaned = after
                    changed = True
    return cleaned.strip(" ：，。；、！「」『』")


def extract_priority_route_nodes(chapters: list[dict]) -> list[dict]:
    nodes = []
    for order, item in enumerate(PRIORITY_ROUTE_NAMES, start=1):
        evidence = []
        related_chapters = set()
        for chapter in chapters:
            found_in_chapter = False
            for line_index, line in enumerate(chapter["lines"]):
                if not any(alias in line for alias in item["aliases"]):
                    continue
                related_chapters.add(chapter["number"])
                found_in_chapter = True
                if len(evidence) < 6:
                    evidence.append(
                        {
                            "chapterNumber": chapter["number"],
                            "rawLine": chapter["rawStartLine"] + line_index,
                            "excerptTraditional": excerpt(chapter["lines"], line_index),
                            "sourceFile": chapter["processedFile"],
                        }
                    )
                break
            if found_in_chapter and len(evidence) >= 6:
                continue
        nodes.append(
            {
                "id": f"priority-route-{order:03d}",
                "name": item["name"],
                "aliases": item["aliases"],
                "routeOrderDraft": order,
                "locationType": location_type(item["name"]),
                "foundInFullText": bool(evidence),
                "firstChapter": evidence[0]["chapterNumber"] if evidence else None,
                "relatedChapters": sorted(related_chapters),
                "evidence": evidence,
                "candidateStatus": "seeded-name-scanned-against-full-text-requires-review",
            }
        )
    return nodes


def extract_route_candidates(chapters: list[dict]) -> None:
    mentions: dict[str, list[dict]] = defaultdict(list)
    counts: Counter[str] = Counter()

    for chapter in chapters:
        for line_index, line in enumerate(chapter["lines"]):
            for match in LOCATION_RE.finditer(line):
                name = clean_location_candidate(match.group(1))
                if not is_location_candidate(name):
                    continue
                counts[name] += 1
                if len(mentions[name]) >= 8:
                    continue
                mentions[name].append(
                    {
                        "chapterNumber": chapter["number"],
                        "rawLine": chapter["rawStartLine"] + line_index,
                        "excerptTraditional": excerpt(chapter["lines"], line_index),
                        "sourceFile": chapter["processedFile"],
                    }
                )

    selected = []
    for name, count in counts.most_common():
        first = mentions[name][0]
        score = count
        if any(keyword in name for keyword in ("花果山", "長安", "五行山", "白虎", "流沙河", "火焰山", "雷音", "靈山")):
            score += 20
        if score < 2 and first["chapterNumber"] not in {1, 13, 14, 15, 22, 27, 59, 98, 100}:
            continue
        selected.append(
            {
                "id": f"auto-location-{len(selected) + 1:03d}",
                "name": name,
                "routeOrderCandidate": len(selected) + 1,
                "firstChapter": first["chapterNumber"],
                "firstRawLine": first["rawLine"],
                "locationType": location_type(name),
                "mentionCount": count,
                "relatedChapters": sorted({item["chapterNumber"] for item in mentions[name]}),
                "evidence": mentions[name],
                "candidateStatus": "auto-extracted-requires-human-review",
            }
        )
        if len(selected) >= 120:
            break

    selected.sort(key=lambda item: (item["firstChapter"], item["firstRawLine"], -item["mentionCount"]))
    for order, item in enumerate(selected, start=1):
        item["routeOrderCandidate"] = order

    priority_nodes = extract_priority_route_nodes(chapters)
    payload = {
        "version": 1,
        "status": "auto-extracted-candidates-not-final",
        "source": str(RAW_FILE.relative_to(ROOT)),
        "notes": [
            "本文件由 scripts/extract_xiyouji_fulltext.py 从全书机械抽取。",
            "候选地点按首次出现章节和原文行号排序，不等同于最终取经路线。",
            "priorityNodes 是为大地图人工确认准备的重点节点扫描清单；autoNodes 是更宽泛的地点候选。",
            "正式大地图必须人工确认地点是否是路线节点、背景地点或应删除噪声。",
        ],
        "priorityCandidateCount": len(priority_nodes),
        "autoCandidateCount": len(selected),
        "priorityNodes": priority_nodes,
        "autoNodes": selected,
    }
    ROUTE_CANDIDATES_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def extract_character_candidates(chapters: list[dict]) -> None:
    CHARACTER_DIR.mkdir(parents=True, exist_ok=True)
    for character_id, config in CHARACTERS.items():
        alias_re = re.compile("|".join(re.escape(alias) for alias in sorted(config["aliases"], key=len, reverse=True)))
        buckets = {bucket: [] for bucket in config["buckets"]}
        overall = []

        for chapter in chapters:
            for line_index, line in enumerate(chapter["lines"]):
                if not alias_re.search(line):
                    continue
                hit = {
                    "chapterNumber": chapter["number"],
                    "rawLine": chapter["rawStartLine"] + line_index,
                    "excerptTraditional": excerpt(chapter["lines"], line_index),
                    "sourceFile": chapter["processedFile"],
                }
                if len(overall) < 40:
                    overall.append(hit)
                for bucket, keywords in config["buckets"].items():
                    if len(buckets[bucket]) >= 12:
                        continue
                    if any(keyword in line or keyword in hit["excerptTraditional"] for keyword in keywords):
                        buckets[bucket].append(hit)

        payload = {
            "version": 1,
            "status": "auto-extracted-candidates-not-final",
            "id": character_id,
            "name": config["name"],
            "aliases": config["aliases"],
            "source": str(RAW_FILE.relative_to(ROOT)),
            "notes": [
                "本文件用于人物基础设定考据，不能直接作为最终人物图设定。",
                "同一称谓在原文中可能指代上下文人物，开发前应人工复核证据。",
                "正式美术提示词应由基础设定、章节状态和场景动作共同生成。",
            ],
            "evidenceBuckets": buckets,
            "earlyMentions": overall,
        }
        out = CHARACTER_DIR / f"{character_id}.base.candidates.json"
        out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    lines = RAW_FILE.read_text(encoding="utf-8").splitlines(keepends=True)
    chapter_index = split_chapters(lines)
    chapters = load_chapter_texts(chapter_index)
    extract_route_candidates(chapters)
    extract_character_candidates(chapters)
    print(f"Wrote {len(chapter_index)} chapters to {CHAPTER_DIR.relative_to(ROOT)}")
    print(f"Wrote chapter index to {CHAPTER_INDEX_FILE.relative_to(ROOT)}")
    print(f"Wrote route candidates to {ROUTE_CANDIDATES_FILE.relative_to(ROOT)}")
    print(f"Wrote character candidates to {CHARACTER_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
