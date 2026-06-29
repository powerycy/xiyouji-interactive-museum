#!/usr/bin/env python3
"""Build curated draft data from extracted Xiyouji evidence candidates."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CHARACTER_DIR = ROOT / "content/characters"
ROUTE_CANDIDATES_FILE = ROOT / "content/map/route-canon.candidates.json"
ROUTE_SEED_FILE = ROOT / "content/map/route-canon.seed.json"
CHAPTER_027_CHARACTER_DIR = ROOT / "content/chapters/027/characters"


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def evidence(chapter: int, source: str, excerpt: str, plain: str) -> dict:
    return {
        "chapterNumber": chapter,
        "sourceFile": source,
        "excerptTraditional": excerpt,
        "plainSimplified": plain,
    }


CHARACTER_BASES = {
    "sun-wukong": {
        "id": "sun-wukong",
        "name": "孫悟空",
        "aliases": ["石猴", "美猴王", "孫悟空", "孫行者", "行者", "大聖", "齊天大聖", "鬥戰勝佛"],
        "status": "curated-draft-requires-human-review",
        "sourceCandidates": "content/characters/sun-wukong.base.candidates.json",
        "identityArc": [
            "花果山仙石化生的石猴。",
            "入水簾洞後被群猴拜為王，稱美猴王。",
            "拜菩提祖師學道，得名孫悟空。",
            "曾得如意金箍棒與披掛，大鬧天宮，後被壓五行山。",
            "取經路上皈依唐僧，頭戴緊箍，稱孫行者。",
            "功成後受封鬥戰勝佛。"
        ],
        "appearanceEvidence": [
            evidence(
                1,
                "data/processed/xiyouji/chapters/chapter-001.txt",
                "因見風，化作一個石猴，五官俱備，四肢皆全。便就學爬學走，拜了四方。目運兩道金光，射沖斗府。",
                "悟空本体是石猴，五官四肢俱全，出生时双眼金光直冲天府。"
            ),
            evidence(
                83,
                "data/processed/xiyouji/chapters/chapter-083.txt",
                "高低面賽馬鞍，眼放金光如火亮。渾身毛硬似鋼針，虎皮裙繫明花響。",
                "后期原文仍强调猴相、金光眼、硬毛和虎皮裙，不应画成纯人类武将。"
            )
        ],
        "clothingAndProps": [
            "早期天宫披挂包含紫金冠、赭黄袍、蓝田带、步云履。",
            "取经路上常见组合为直裰、虎皮裙、紧箍、金箍棒。",
            "第十四回后戴紧箍，紧箍不应被省略为普通发箍。",
            "服饰会随章节变化：可有布直裰、锦直裰、虎皮裙、临时变化伪装。"
        ],
        "weaponsOrTools": ["如意金箍棒", "觔斗雲", "毫毛变化", "火眼金睛", "紧箍"],
        "personality": [
            "机敏好胜，遇妖怪常主动试探。",
            "保护唐僧是取经阶段核心职责。",
            "易怒、敢辩，也会因被误解而委屈。",
            "讲义气，但不宜画成阴郁反英雄。"
        ],
        "relationships": [
            "师父：唐三藏。",
            "师弟：猪八戒、沙悟净。",
            "受观音安排护送取经。",
            "与花果山群猴、水帘洞旧部有前史关系。"
        ],
        "canonicalEvidence": [
            {"chapterNumber": 1, "sourceFile": "data/processed/xiyouji/chapters/chapter-001.txt", "note": "石猴出生、花果山水簾洞前史。"},
            {"chapterNumber": 3, "sourceFile": "data/processed/xiyouji/chapters/chapter-003.txt", "note": "取得如意金箍棒和披挂。"},
            {"chapterNumber": 14, "sourceFile": "data/processed/xiyouji/chapters/chapter-014.txt", "note": "皈依唐僧、穿直裰、戴紧箍。"},
            {"chapterNumber": 27, "sourceFile": "data/processed/xiyouji/chapters/chapter-027.txt", "note": "三打白骨精章节状态与被逐事件。"},
            {"chapterNumber": 100, "sourceFile": "data/processed/xiyouji/chapters/chapter-100.txt", "note": "功成受封鬥戰勝佛。"}
        ],
        "visualPrinciples": [
            "保持猴相：毛脸、雷公嘴、金光眼、灵活身形。",
            "取经阶段优先表现行者身份，而不是天宫全甲常驻。",
            "战斗姿态可以强，但身体不应变成厚重写实肌肉武士。",
            "色彩可随章节气氛变化，但人物识别点必须来自原文。"
        ],
        "avoid": [
            "不要直接套用影视、动画、漫画里的悟空造型。",
            "不要把紫金冠黄金甲当作取经全程常服。",
            "不要做成无猴相的美型人类少年或纯暗黑铠甲战士。"
        ]
    },
    "tang-seng": {
        "id": "tang-seng",
        "name": "唐三藏",
        "aliases": ["江流", "陳玄奘", "玄奘", "唐僧", "唐三藏", "御弟", "聖僧", "金蟬子", "旃檀功德佛"],
        "status": "curated-draft-requires-human-review",
        "sourceCandidates": "content/characters/tang-seng.base.candidates.json",
        "identityArc": [
            "乳名江流，金山寺法明长老救养。",
            "削发修行，法名玄奘。",
            "被选为水陆大会高僧，得唐太宗认可。",
            "受锦襕袈裟、九环锡杖、通关文牒，奉旨西行取经。",
            "原为金蝉子转生，功成后为旃檀功德佛。"
        ],
        "appearanceEvidence": [
            evidence(
                12,
                "data/processed/xiyouji/chapters/chapter-012.txt",
                "賜五彩織金袈裟一件、毘盧帽一頂。",
                "唐僧正式出行前得到五彩织金袈裟和毘卢帽。"
            ),
            evidence(
                12,
                "data/processed/xiyouji/chapters/chapter-012.txt",
                "長老遂將袈裟抖開，披在身上，手持錫杖，侍立階前。",
                "核心视觉为袈裟、毘卢帽、九环锡杖和僧人威仪。"
            )
        ],
        "clothingAndProps": [
            "锦襕异宝袈裟。",
            "毘卢帽。",
            "九环锡杖。",
            "通关文牒、紫金钵盂、行李。"
        ],
        "weaponsOrTools": ["九环锡杖", "通关文牒", "紫金钵盂", "经卷"],
        "personality": [
            "守戒、慈悯、重礼法。",
            "容易受妖怪幻象触动，常因慈悲误会悟空。",
            "面对色诱、恐吓时强调取经初心和清净戒行。",
            "不应塑造成战斗型角色。"
        ],
        "relationships": [
            "徒弟：孙悟空、猪八戒、沙悟净；脚力：白龙马。",
            "与唐太宗有御弟关系。",
            "受观音点化取经。",
            "前世为如来二徒金蝉子。"
        ],
        "canonicalEvidence": [
            {"chapterNumber": 9, "sourceFile": "data/processed/xiyouji/chapters/chapter-009.txt", "note": "江流身世和玄奘法名。"},
            {"chapterNumber": 12, "sourceFile": "data/processed/xiyouji/chapters/chapter-012.txt", "note": "水陆大会、袈裟、锡杖、御弟、三藏称号和通关文牒。"},
            {"chapterNumber": 27, "sourceFile": "data/processed/xiyouji/chapters/chapter-027.txt", "note": "慈悯误认白骨精变化，逐走悟空。"},
            {"chapterNumber": 100, "sourceFile": "data/processed/xiyouji/chapters/chapter-100.txt", "note": "金蝉子身份与旃檀功德佛果位。"}
        ],
        "visualPrinciples": [
            "保持端正僧相和礼仪感。",
            "以袈裟、毘卢帽、锡杖、文牒为主要识别点。",
            "脸部气质应清秀、克制、慈悯，而非帝王或武将。",
            "章节状态可表现疲惫、惊惧、疑虑，但不改变基本僧人身份。"
        ],
        "avoid": [
            "不要画成武僧或法术攻击角色。",
            "不要使用影视版固定脸谱。",
            "不要把袈裟做成西式教袍或重甲披风。"
        ]
    },
    "zhu-bajie": {
        "id": "zhu-bajie",
        "name": "豬八戒",
        "aliases": ["天蓬元帥", "豬剛鬣", "豬悟能", "悟能", "豬八戒", "八戒", "獃子", "老豬", "淨壇使者"],
        "status": "curated-draft-requires-human-review",
        "sourceCandidates": "content/characters/zhu-bajie.base.candidates.json",
        "identityArc": [
            "原为天河里天蓬元帅。",
            "因酒后戏弄嫦娥被贬下界，错投猪胎。",
            "在福陵山云栈洞、高老庄作怪，后被收服。",
            "受戒法名猪悟能，唐僧又称猪八戒。",
            "取经途中挑担、涉水有功，功成净坛使者。"
        ],
        "appearanceEvidence": [
            evidence(
                18,
                "data/processed/xiyouji/chapters/chapter-018.txt",
                "初來時是一條黑胖漢，後來就變做一個長嘴大耳朵的獃子，腦後又有一溜鬃毛，身體粗糙怕人，頭臉就像個豬的模樣。",
                "八戒基础外形是黑胖、长嘴大耳、脑后鬃毛、猪脸特征。"
            )
        ],
        "clothingAndProps": [
            "取经阶段多穿直裰，颜色可随章节出现青锦、皂锦等变化。",
            "九齿钉钯为主要武器。",
            "常挑担，承担行李负重。"
        ],
        "weaponsOrTools": ["九齿钉钯", "天罡数变化", "挑担行李"],
        "personality": [
            "贪吃、怕苦、好色、爱抱怨，是喜剧性很强的角色。",
            "战斗时有力，也常在关键时出力。",
            "会退缩、分行李，但并非完全无用。",
            "语言可市井、滑稽，但不要脱离原著。"
        ],
        "relationships": [
            "师父：唐三藏。",
            "师兄：孙悟空；师弟：沙悟净。",
            "高老庄曾为高家女婿。",
            "受观音劝善，归入取经队伍。"
        ],
        "canonicalEvidence": [
            {"chapterNumber": 8, "sourceFile": "data/processed/xiyouji/chapters/chapter-008.txt", "note": "天蓬元帅被贬与猪悟能受戒。"},
            {"chapterNumber": 18, "sourceFile": "data/processed/xiyouji/chapters/chapter-018.txt", "note": "高老庄外貌描述。"},
            {"chapterNumber": 19, "sourceFile": "data/processed/xiyouji/chapters/chapter-019.txt", "note": "九齿钉钯、猪刚鬣和入队。"},
            {"chapterNumber": 100, "sourceFile": "data/processed/xiyouji/chapters/chapter-100.txt", "note": "功成净坛使者。"}
        ],
        "visualPrinciples": [
            "保留长嘴大耳、粗糙身体、鬃毛和黑胖感。",
            "漫画化可以增强表情，但不能变成可爱宠物。",
            "九齿钉钯和行李担是高频识别物。",
            "体型应明显重于悟空、沙僧。"
        ],
        "avoid": [
            "不要画成单纯粉色小猪。",
            "不要弱化到完全不能战斗。",
            "不要套用影视版固定服装比例。"
        ]
    },
    "sha-seng": {
        "id": "sha-seng",
        "name": "沙悟淨",
        "aliases": ["捲簾大將", "沙悟淨", "悟淨", "沙僧", "沙和尚", "金身羅漢"],
        "status": "curated-draft-requires-human-review",
        "sourceCandidates": "content/characters/sha-seng.base.candidates.json",
        "identityArc": [
            "原为灵霄殿下侍銮舆的卷帘大将。",
            "蟠桃会上失手打碎玻璃盏，被贬流沙河。",
            "在流沙河为怪，后受观音安排归顺唐僧。",
            "取经路上牵马、护持行李，功成金身罗汉。"
        ],
        "appearanceEvidence": [
            evidence(
                22,
                "data/processed/xiyouji/chapters/chapter-022.txt",
                "一頭紅燄髮蓬鬆，兩隻圓睛亮似燈。不黑不青藍靛臉，如雷如鼓老龍聲。身披一領鵝黃氅，腰束雙攢露白藤。項下骷髏懸九個，手持寶杖甚崢嶸。",
                "沙僧早期形象有红焰蓬发、圆眼、蓝靛脸、鹅黄氅、九个骷髅、宝杖。"
            )
        ],
        "clothingAndProps": [
            "早期流沙河形象有鹅黄氅、白藤腰束、项下九个骷髅。",
            "归队后常以和尚/行脚僧形象出现，仍持降妖宝杖。",
            "可表现牵马、看守行李等稳定职责。"
        ],
        "weaponsOrTools": ["降妖宝杖", "九个骷髅", "法船相关葫芦"],
        "personality": [
            "沉稳、听命、忠厚。",
            "存在罪业前史，但取经阶段更像队伍中的稳定支点。",
            "战斗力不应被忽略，降妖宝杖是重要武器。",
            "台词和行为比悟空、八戒更克制。"
        ],
        "relationships": [
            "师父：唐三藏。",
            "师兄：孙悟空、猪八戒。",
            "受观音与木叉安排归顺。",
            "与流沙河、弱水、骷髅法船有强关联。"
        ],
        "canonicalEvidence": [
            {"chapterNumber": 8, "sourceFile": "data/processed/xiyouji/chapters/chapter-008.txt", "note": "卷帘大将被贬前史。"},
            {"chapterNumber": 22, "sourceFile": "data/processed/xiyouji/chapters/chapter-022.txt", "note": "流沙河外貌、降妖杖、骷髅法船和归顺。"},
            {"chapterNumber": 100, "sourceFile": "data/processed/xiyouji/chapters/chapter-100.txt", "note": "功成金身罗汉。"}
        ],
        "visualPrinciples": [
            "保留蓝靛脸、红发、宝杖等原著识别点。",
            "取经阶段可以弱化骷髅恐怖感，但不要完全删除其前史证据。",
            "整体气质沉稳可靠，不做夸张喜剧角色。",
            "体型可高大结实，但不应覆盖唐僧、悟空、八戒的识别差异。"
        ],
        "avoid": [
            "不要直接变成普通光头和尚。",
            "不要把沙僧画成纯背景搬运工。",
            "不要使用影视版单一棕红脸谱作为唯一依据。"
        ]
    },
    "bailongma": {
        "id": "bailongma",
        "name": "白龍馬",
        "aliases": ["玉龍", "小龍", "白馬", "龍馬", "意馬", "八部天龍馬"],
        "status": "curated-draft-requires-human-review",
        "sourceCandidates": "content/characters/bailongma.base.candidates.json",
        "identityArc": [
            "原为西海龙王之子，在空中受罪。",
            "受观音救解，等待取经人。",
            "蛇盘山鹰愁涧吞唐僧原马，后变作白马。",
            "取经途中驮唐僧西去、驮经东回。",
            "功成八部天龙马。"
        ],
        "appearanceEvidence": [
            evidence(
                15,
                "data/processed/xiyouji/chapters/chapter-015.txt",
                "教他就變做我原騎的白馬，毛片俱同，馱我上西天拜佛。",
                "白龙马取经阶段外观与唐僧原来的白马相同，重点是马形而非长期龙形。"
            )
        ],
        "clothingAndProps": [
            "白马形态为常态。",
            "第十五回后有鞍轡、韁籠等马具。",
            "龙形可用于揭示前史、奖励图或特殊动画，不宜常驻探索主画面。"
        ],
        "weaponsOrTools": ["龙身变化", "马具", "驮负唐僧与经卷"],
        "personality": [
            "取经阶段沉默承担脚力职责。",
            "原有龙子前史和罪责，后皈依沙门。",
            "视觉表现应有神性和清洁感，但不要喧宾夺主。"
        ],
        "relationships": [
            "脚力：驮唐三藏。",
            "与观音救解有关。",
            "与蛇盘山、鹰愁涧强关联。",
            "与西海龙王有身世关系。"
        ],
        "canonicalEvidence": [
            {"chapterNumber": 8, "sourceFile": "data/processed/xiyouji/chapters/chapter-008.txt", "note": "西海龙子受罪，观音安排为取经脚力。"},
            {"chapterNumber": 15, "sourceFile": "data/processed/xiyouji/chapters/chapter-015.txt", "note": "鹰愁涧吞马、变白马、得鞍轡。"},
            {"chapterNumber": 100, "sourceFile": "data/processed/xiyouji/chapters/chapter-100.txt", "note": "功成八部天龙马。"}
        ],
        "visualPrinciples": [
            "常态画成白马，不画成人形队友。",
            "可以在鬃毛、眼神、马具纹样中暗示龙性。",
            "白马应服务唐僧动线和地图旅途感。",
            "龙形只在回忆、转场、奖励或特殊章节中使用。"
        ],
        "avoid": [
            "不要长期画成人形白龙王子。",
            "不要让龙形盖过取经队伍主视觉。",
            "不要把白马画成普通无神性的坐骑。"
        ]
    }
}


CHAPTER_027_STATES = {
    "sun-wukong": {
        "id": "sun-wukong",
        "chapterNumber": 27,
        "status": "curated-draft-requires-human-review",
        "currentLocation": "白虎嶺",
        "chapterRole": "识破并三次打杀白骨夫人变化，最终被唐僧逐走。",
        "currentAppearance": [
            "取经阶段行者形象，头戴紧箍。",
            "可使用赭黄袍、蓝田带、步云履、如意金箍棒作为他自述前史视觉回声，但当前不应全程天宫重甲。",
            "动作应敏捷、警觉、带强烈护师意图。"
        ],
        "emotion": ["警觉", "急切辩白", "委屈", "被逐后的不甘"],
        "props": ["如意金箍棒", "紧箍", "行者衣装"],
        "evidence": [
            evidence(27, "data/processed/xiyouji/chapters/chapter-027.txt", "怕你念甚麼緊箍兒咒，故意的使個障眼法兒，變做這等樣東西。", "悟空说明白骨夫人用障眼法变化，自己是识妖而打。"),
            evidence(27, "data/processed/xiyouji/chapters/chapter-027.txt", "頭戴的是紫金冠，身穿的是赭黃袍，腰繫的是藍田帶，足踏的是步雲履，手執的是如意金箍棒。", "悟空自述旧日花果山/齐天大圣时期的装束，可作回忆或图纸元素。")
        ]
    },
    "tang-seng": {
        "id": "tang-seng",
        "chapterNumber": 27,
        "status": "curated-draft-requires-human-review",
        "currentLocation": "白虎嶺",
        "chapterRole": "被白骨夫人变化迷惑，因慈悯和戒杀立场误会悟空。",
        "currentAppearance": ["骑白马行至山岭，僧人旅途状态。", "可表现疲惫、惊惧、慈悯。"],
        "emotion": ["惊惧", "慈悯", "愤怒", "失望"],
        "props": ["袈裟", "毘卢帽", "锡杖", "通关文牒"],
        "evidence": [
            evidence(27, "data/processed/xiyouji/chapters/chapter-027.txt", "原來這唐僧是個慈憫的聖僧，他見行者哀告，卻也回心轉意。", "本章唐僧的核心误判来自慈悯和戒杀，不是单纯愚蠢。")
        ]
    },
    "zhu-bajie": {
        "id": "zhu-bajie",
        "chapterNumber": 27,
        "status": "curated-draft-requires-human-review",
        "currentLocation": "白虎嶺",
        "chapterRole": "被白骨精变化的斋饭吸引，并多次挑动唐僧责怪悟空。",
        "currentAppearance": ["取经僧徒形象，长嘴大耳，携九齿钉钯。", "可表现贪吃、摇摆、插话的喜剧姿态。"],
        "emotion": ["贪食", "猜疑", "挑拨", "自保"],
        "props": ["九齿钉钯", "直裰", "行李担"],
        "evidence": [
            evidence(27, "data/processed/xiyouji/chapters/chapter-027.txt", "那獃子放下釘鈀，整整直裰，擺擺搖搖，充作個斯文氣象，一直的靦面相迎。", "八戒看到女子送斋时放下武器、整理衣服，喜剧性和贪念明显。")
        ]
    },
    "sha-seng": {
        "id": "sha-seng",
        "chapterNumber": 27,
        "status": "curated-draft-requires-human-review",
        "currentLocation": "白虎嶺",
        "chapterRole": "随队护持，在本章不是主要冲突发动者。",
        "currentAppearance": ["沉稳僧徒形象，携降妖宝杖。", "可弱化流沙河骷髅恐怖元素，但图纸中应保留其前史。"],
        "emotion": ["谨慎", "沉默", "跟随"],
        "props": ["降妖宝杖", "行李", "白马缰绳"],
        "evidence": [
            evidence(27, "data/processed/xiyouji/chapters/chapter-027.txt", "八戒、沙僧雖沒甚麼大本事，然八戒是天蓬元帥，沙僧是捲簾大將。", "本章白骨精也承认沙僧有卷帘大将前史，只是本章戏份相对少。")
        ]
    },
    "bailongma": {
        "id": "bailongma",
        "chapterNumber": 27,
        "status": "curated-draft-requires-human-review",
        "currentLocation": "白虎嶺",
        "chapterRole": "驮唐僧行经白虎岭，是旅途动线和场景构图的重要元素。",
        "currentAppearance": ["白马形态，配鞍轡。", "不作为人形角色出现。"],
        "emotion": ["警觉", "受惊"],
        "props": ["鞍轡", "缰绳"],
        "evidence": [
            evidence(27, "data/processed/xiyouji/chapters/chapter-027.txt", "聖僧歇馬在山巖，忽見裙釵女近前。", "本章场景中唐僧骑马/歇马进入白虎岭事件。")
        ]
    }
}


ROUTE_EVENT_OVERRIDES = {
    "花果山": ["悟空出生和群猴前史。", "美猴王势力根基，后续多次回返。"],
    "水簾洞": ["悟空发现洞天并成为猴王。", "悟空旧居，真假猴王等事件也回到此处。"],
    "靈臺方寸山": ["悟空访道学仙。"],
    "斜月三星洞": ["菩提祖师传授悟空法名与本领。"],
    "東海龍宮": ["悟空索取如意金箍棒和披挂。"],
    "南天門": ["天界出入关口，大闹天宫前史节点。"],
    "靈霄寶殿": ["天宫权力中心，大闹天宫前史节点。"],
    "五行山": ["悟空被压五百年，后归入取经队伍。"],
    "長安": ["唐僧受命取经，最后携经回东土。"],
    "白虎嶺": ["白骨夫人三次变化，悟空被逐。"],
    "流沙河": ["收沙悟净，弱水难渡。"],
    "火焰山": ["三调芭蕉扇。"],
    "靈山": ["取经队伍抵达佛土。"],
    "雷音寺": ["拜见如来，取得真经。"]
}

ROUTE_CHAPTER_OVERRIDES = {
    "花果山": (1, 7),
    "水簾洞": (1, 7),
    "靈臺方寸山": (1, 2),
    "斜月三星洞": (1, 2),
    "東海龍宮": (3, 3),
    "南天門": (4, 7),
    "靈霄寶殿": (4, 7),
    "五行山": (7, 14),
    "長安": (8, 13),
    "雙叉嶺": (13, 13),
    "蛇盤山": (15, 15),
    "鷹愁澗": (15, 15),
    "觀音院": (16, 17),
    "黑風山": (16, 17),
    "高老莊": (18, 19),
    "雲棧洞": (18, 19),
    "黃風嶺": (20, 21),
    "流沙河": (22, 22),
    "萬壽山": (24, 26),
    "五莊觀": (24, 26),
    "白虎嶺": (27, 27),
    "黑松林": (28, 31),
    "寶象國": (29, 31),
    "平頂山": (32, 35),
    "蓮花洞": (32, 35),
    "烏雞國": (37, 39),
    "號山": (40, 42),
    "枯松澗": (40, 42),
    "火雲洞": (40, 42),
    "黑水河": (43, 43),
    "車遲國": (44, 46),
    "通天河": (47, 49),
    "金山金洞": (50, 52),
    "西梁女國": (53, 55),
    "火焰山": (59, 61),
    "祭賽國": (62, 63),
    "荊棘嶺": (64, 64),
    "小雷音寺": (65, 66),
    "駝羅莊": (67, 67),
    "朱紫國": (68, 71),
    "盤絲洞": (72, 73),
    "濯垢泉": (72, 73),
    "獅駝嶺": (74, 77),
    "比丘國": (78, 79),
    "鎮海寺": (81, 81),
    "陷空山": (81, 83),
    "無底洞": (81, 83),
    "滅法國": (84, 84),
    "隱霧山": (86, 87),
    "玉華州": (88, 90),
    "金平府": (91, 92),
    "青龍山": (91, 92),
    "天竺國": (93, 95),
    "靈山": (98, 98),
    "雷音寺": (98, 98),
}


def build_character_bases() -> None:
    for character_id, payload in CHARACTER_BASES.items():
        write_json(CHARACTER_DIR / f"{character_id}.base.json", payload)


def build_chapter_027_states() -> None:
    for character_id, payload in CHAPTER_027_STATES.items():
        write_json(CHAPTER_027_CHARACTER_DIR / f"{character_id}.state.json", payload)


def route_phase(order: int) -> str:
    if order <= 8:
        return "prelude"
    if order <= 20:
        return "departure-and-team-formation"
    if order <= 53:
        return "westward-trials"
    return "buddhist-land-and-return"


def map_role(order: int, name: str) -> str:
    if name in {"長安", "五行山", "白虎嶺", "流沙河", "火焰山", "靈山", "雷音寺"}:
        return "major"
    if route_phase(order) == "prelude":
        return "background"
    return "preview"


def build_route_seed() -> None:
    candidates = json.loads(ROUTE_CANDIDATES_FILE.read_text(encoding="utf-8"))
    nodes = []
    for item in candidates["priorityNodes"]:
        order = item["routeOrderDraft"]
        chapter_start, chapter_end = ROUTE_CHAPTER_OVERRIDES.get(
            item["name"],
            (
                min(item["relatedChapters"]) if item["relatedChapters"] else item["firstChapter"],
                max(item["relatedChapters"]) if item["relatedChapters"] else item["firstChapter"],
            ),
        )
        evidence_items = []
        for ev in item["evidence"][:3]:
            evidence_items.append(
                {
                    "chapterNumber": ev["chapterNumber"],
                    "excerptTraditional": ev["excerptTraditional"],
                    "plainSimplified": f"原文证据显示“{item['name']}”在第 {ev['chapterNumber']} 回出现；需人工确认其地图层级和事件摘要。",
                    "sourceFile": ev["sourceFile"],
                    "rawLine": ev["rawLine"],
                }
            )
        nodes.append(
            {
                "id": item["id"].replace("priority-route", "route"),
                "name": item["name"],
                "aliases": item["aliases"],
                "routeOrder": order,
                "phase": route_phase(order),
                "chapterStart": chapter_start,
                "chapterEnd": chapter_end,
                "locationType": item["locationType"],
                "keyEvents": ROUTE_EVENT_OVERRIDES.get(item["name"], [f"{item['name']}相关劫难或旅途节点，待人工细化。"]),
                "evidence": evidence_items,
                "mapRole": map_role(order, item["name"]),
                "artNotes": "正式绘制前需结合本节点相关章节再生成地点美术 brief。",
                "candidateStatus": "draft-from-full-text-candidates-requires-human-review",
            }
        )

    payload = {
        "version": 1,
        "status": "curated-draft-requires-human-review",
        "source": {
            "work": "西遊記",
            "rawFile": "data/raw/xiyouji/project-gutenberg-23962-xiyouji.txt",
            "candidateFile": "content/map/route-canon.candidates.json",
        },
        "notes": [
            "本文件是从 priorityNodes 整理出的正式路线草案，已经带有全文证据，但仍需人工考据确认。",
            "routeOrder 是产品地图顺序草案，不等于真实地理距离。",
            "phase 用于区分前史、队伍形成、取经劫难和佛土终点。",
            "mapRole 用于 MVP 显示优先级；major 节点优先做视觉资源。",
        ],
        "schema": {
            "id": "string",
            "name": "string",
            "aliases": ["string"],
            "routeOrder": "number",
            "phase": "prelude|departure-and-team-formation|westward-trials|buddhist-land-and-return",
            "chapterStart": "number",
            "chapterEnd": "number",
            "locationType": "mountain|river|kingdom|cave|temple|monastery|heaven|buddhist-land|other",
            "keyEvents": ["string"],
            "evidence": [
                {
                    "chapterNumber": "number",
                    "excerptTraditional": "string",
                    "plainSimplified": "string",
                    "sourceFile": "string",
                    "rawLine": "number",
                }
            ],
            "mapRole": "major|minor|preview|background",
            "artNotes": "string",
            "candidateStatus": "string",
        },
        "nodes": nodes,
    }
    write_json(ROUTE_SEED_FILE, payload)


def main() -> None:
    build_character_bases()
    build_chapter_027_states()
    build_route_seed()
    print("Wrote curated character base drafts")
    print("Wrote chapter 027 character state drafts")
    print("Wrote curated route canon draft")


if __name__ == "__main__":
    main()
