import type { VirtualTourNode } from "@photo-sphere-viewer/virtual-tour-plugin";

export type PanoramaLanguage = "zh-Hant" | "zh-Hans" | "en";

export interface PanoramaTexturePosition {
  textureX: number;
  textureY: number;
}

export interface PanoramaLocalizedTitle {
  zhHant: string;
  zhHans: string;
  en: string;
}

export interface PanoramaCulturalContent {
  id: string;
  labelId: string;
  title: PanoramaLocalizedTitle;
  originalTraditional: string;
  explanationZhHans: string;
  guideEn: string;
  source: {
    chapterNumber: number;
    chapterTitle: string;
    rawLineStart: number;
    rawLineEnd: number;
  };
}

export interface PanoramaSceneLink {
  id: string;
  targetNodeId: string;
  position: PanoramaTexturePosition;
  label: PanoramaLocalizedTitle;
}

export interface PanoramaInfoHotspot {
  id: string;
  position: PanoramaTexturePosition;
  contentId: string;
  label: PanoramaLocalizedTitle;
}

export interface PanoramaTourNode {
  id: string;
  name: PanoramaLocalizedTitle;
  panorama: {
    src: string;
    thumbnailSrc: string;
    fallbackSrc: string;
    width: number;
    height: number;
    projection: "equirectangular";
  };
  initialView: {
    yaw: number;
    pitch: number;
    zoom: number;
  };
  sceneLinks: PanoramaSceneLink[];
  infoHotspots: PanoramaInfoHotspot[];
  isPlaceholder?: boolean;
}

export interface PanoramaTour {
  id: string;
  startNodeId: string;
  nodes: PanoramaTourNode[];
  content: Record<string, PanoramaCulturalContent>;
}

const chapterTitleTraditional = "尸魔三戲唐三藏　聖僧恨逐美猴王";

export const baihulingPanoramaTour: PanoramaTour = {
  id: "chapter-027-baihuling-panorama-sample",
  startNodeId: "baihuling-road",
  nodes: [
    {
      id: "baihuling-road",
      name: {
        zhHant: "白虎嶺山路",
        zhHans: "白虎岭山路",
        en: "Baihuling mountain road"
      },
      panorama: {
        src: "/assets/chapters/027/panoramas/baihuling-road-panorama-v1.png",
        thumbnailSrc: "/assets/chapters/027/panoramas/baihuling-road-panorama-v1-thumb.png",
        fallbackSrc: "/assets/chapters/027/scenes/v2/scene-027-01-baihuling-road-v2.png",
        width: 1774,
        height: 887,
        projection: "equirectangular"
      },
      initialView: { yaw: 0, pitch: -0.08, zoom: 48 },
      sceneLinks: [
        {
          id: "baihuling-road-to-next",
          targetNodeId: "baihuling-first-disguise",
          position: { textureX: 1460, textureY: 555 },
          label: {
            zhHant: "沿山路深入",
            zhHans: "沿山路深入",
            en: "Continue along the ridge"
          }
        }
      ],
      infoHotspots: [
        {
          id: "baihuling-road-landscape",
          position: { textureX: 520, textureY: 500 },
          contentId: "content-baihuling-landscape",
          label: {
            zhHant: "白虎嶺險路",
            zhHans: "白虎岭险路",
            en: "The hazardous ridge"
          }
        },
        {
          id: "baihuling-road-hunger",
          position: { textureX: 860, textureY: 675 },
          contentId: "content-baihuling-hunger",
          label: {
            zhHant: "缽盂與饑餓",
            zhHans: "钵盂与饥饿",
            en: "The alms bowl and hunger"
          }
        }
      ]
    },
    {
      id: "baihuling-first-disguise",
      name: {
        zhHant: "送齋女子",
        zhHans: "送斋女子",
        en: "The food-bearing stranger"
      },
      panorama: {
        src: "/assets/chapters/027/panoramas/baihuling-first-disguise-panorama-v2.png",
        thumbnailSrc: "/assets/chapters/027/panoramas/baihuling-first-disguise-panorama-v2-thumb.png",
        fallbackSrc: "/assets/chapters/027/scenes/v2/scene-027-03-first-disguise-v2.png",
        width: 1774,
        height: 887,
        projection: "equirectangular"
      },
      initialView: { yaw: 0, pitch: -0.08, zoom: 46 },
      sceneLinks: [
        {
          id: "baihuling-first-disguise-to-repeated",
          targetNodeId: "baihuling-repeated-disguises",
          position: { textureX: 1580, textureY: 620 },
          label: {
            zhHant: "追看連環變化",
            zhHans: "追看连环变化",
            en: "Follow the repeated disguises"
          }
        }
      ],
      infoHotspots: [
        {
          id: "baihuling-demon-motive",
          position: { textureX: 720, textureY: 520 },
          contentId: "content-demon-motive",
          label: {
            zhHant: "妖怪起意",
            zhHans: "妖怪起意",
            en: "The demon's motive"
          }
        },
        {
          id: "baihuling-first-disguise-info",
          position: { textureX: 760, textureY: 590 },
          contentId: "content-first-disguise",
          label: {
            zhHant: "送齋女子",
            zhHans: "送斋女子",
            en: "The first disguise"
          }
        },
        {
          id: "baihuling-wukong-eyes",
          position: { textureX: 1390, textureY: 475 },
          contentId: "content-wukong-eyes",
          label: {
            zhHant: "火眼金睛",
            zhHans: "火眼金睛",
            en: "Wukong sees through the disguise"
          }
        },
        {
          id: "baihuling-bajie-instigation",
          position: { textureX: 1115, textureY: 535 },
          contentId: "content-bajie-instigation",
          label: {
            zhHant: "八戒唆嘴",
            zhHans: "八戒挑唆",
            en: "Bajie undermines Wukong"
          }
        }
      ]
    },
    {
      id: "baihuling-repeated-disguises",
      name: {
        zhHant: "連環變化",
        zhHans: "连环变化",
        en: "The repeated disguises"
      },
      panorama: {
        src: "/assets/chapters/027/panoramas/baihuling-repeated-disguises-panorama-v2.png",
        thumbnailSrc: "/assets/chapters/027/panoramas/baihuling-repeated-disguises-panorama-v2-thumb.png",
        fallbackSrc: "/assets/chapters/027/scenes/v2/scene-027-07-third-disguise-v2.png",
        width: 1774,
        height: 887,
        projection: "equirectangular"
      },
      initialView: { yaw: 0, pitch: -0.06, zoom: 46 },
      sceneLinks: [
        {
          id: "baihuling-repeated-to-reveal",
          targetNodeId: "baihuling-reveal-banishment",
          position: { textureX: 1585, textureY: 640 },
          label: {
            zhHant: "前往本相現形",
            zhHans: "前往本相现形",
            en: "Continue to the revelation"
          }
        }
      ],
      infoHotspots: [
        {
          id: "baihuling-second-disguise",
          position: { textureX: 875, textureY: 535 },
          contentId: "content-second-disguise",
          label: {
            zhHant: "尋女老婦",
            zhHans: "寻女老妇",
            en: "The grieving old woman"
          }
        },
        {
          id: "baihuling-third-disguise",
          position: { textureX: 225, textureY: 445 },
          contentId: "content-third-disguise",
          label: {
            zhHant: "念經老公公",
            zhHans: "念经老公公",
            en: "The praying old man"
          }
        }
      ]
    },
    {
      id: "baihuling-reveal-banishment",
      name: {
        zhHant: "本相與貶書",
        zhHans: "本相与贬书",
        en: "Revelation and banishment"
      },
      panorama: {
        src: "/assets/chapters/027/panoramas/baihuling-reveal-banishment-panorama-v2.png",
        thumbnailSrc: "/assets/chapters/027/panoramas/baihuling-reveal-banishment-panorama-v2-thumb.png",
        fallbackSrc: "/assets/chapters/027/scenes/v2/scene-027-08-skeleton-reveal-v2.png",
        width: 1774,
        height: 887,
        projection: "equirectangular"
      },
      initialView: { yaw: 0, pitch: -0.1, zoom: 46 },
      sceneLinks: [
        {
          id: "baihuling-reveal-to-road",
          targetNodeId: "baihuling-road",
          position: { textureX: 1515, textureY: 515 },
          label: {
            zhHant: "回到白虎嶺山路",
            zhHans: "回到白虎岭山路",
            en: "Return to the Baihuling road"
          }
        }
      ],
      infoHotspots: [
        {
          id: "baihuling-final-kill",
          position: { textureX: 770, textureY: 690 },
          contentId: "content-final-kill",
          label: {
            zhHant: "粉骷髏本相",
            zhHans: "粉骷髅本相",
            en: "The skeleton revealed"
          }
        },
        {
          id: "baihuling-curse-banish",
          position: { textureX: 535, textureY: 590 },
          contentId: "content-curse-banish",
          label: {
            zhHant: "石上貶書",
            zhHans: "石上贬书",
            en: "The letter of banishment"
          }
        },
        {
          id: "baihuling-sha-seng",
          position: { textureX: 110, textureY: 455 },
          contentId: "content-sha-seng",
          label: {
            zhHant: "沙僧見證",
            zhHans: "沙僧见证",
            en: "Sha Seng as witness"
          }
        }
      ]
    }
  ],
  content: {
    "content-baihuling-landscape": {
      id: "content-baihuling-landscape",
      labelId: "label-027-baihuling",
      title: {
        zhHant: "白虎嶺：險山生怪",
        zhHans: "白虎岭：险山生怪",
        en: "Baihuling: danger in the ridge"
      },
      originalTraditional:
        "峰巖重疊，澗壑彎環。虎狼成陣走，麂鹿作群行。無數獐鑽簇簇，滿山狐兔聚叢叢。千尺大蟒，萬丈長蛇。大蟒噴愁霧，長蛇吐怪風。",
      explanationZhHans:
        "这一段先把白虎岭写成险恶之地：山峰重叠、沟壑弯曲，猛兽成群，蟒蛇吐雾生风。它不是普通山路，而是妖怪容易潜伏的荒山险境。",
      guideEn:
        "The novel first establishes Baihuling as a hazardous wilderness of layered peaks, winding ravines and hidden creatures. The landscape is not just scenery: it prepares us for a threat that can remain concealed along an empty mountain road.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 6997,
        rawLineEnd: 6998
      }
    },
    "content-baihuling-hunger": {
      id: "content-baihuling-hunger",
      labelId: "label-027-hunger",
      title: {
        zhHant: "唐僧饑餓，悟空離隊",
        zhHans: "唐僧饥饿，悟空离队",
        en: "Hunger separates Wukong from the group"
      },
      originalTraditional:
        "三藏道：「悟空，我這一日，肚中饑了，你去那裏化些齋吃。」行者陪笑道：「師父好不聰明。這等半山之中，前不巴村，後不著店，有錢也沒買處，教往那裏尋齋？」",
      explanationZhHans:
        "唐僧肚饿，让悟空去化斋。悟空指出这里前不着村、后不着店，根本难找食物。正因为悟空离开去摘桃，白骨精才有机会接近唐僧。",
      guideEn:
        "Tang Sanzang asks Wukong to find food, even though the ridge has neither a village ahead nor an inn behind. Wukong's departure to gather peaches creates the opening that the White-Bone Demon will exploit.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 7005,
        rawLineEnd: 7007
      }
    },
    "content-demon-motive": {
      id: "content-demon-motive",
      labelId: "label-027-demon-motive",
      title: {
        zhHant: "妖怪為何盯上唐僧",
        zhHans: "妖怪为何盯上唐僧",
        en: "Why the demon targets Tang Sanzang"
      },
      originalTraditional:
        "他在雲端裏踏著陰風，看見長老坐在地下，就不勝歡喜道：「造化，造化。幾年家人都講東土的唐和尚取大乘，他本是金蟬子化身，十世修行的原體，有人吃他一塊肉，長壽長生。真個今日到了。」",
      explanationZhHans:
        "白骨精看见唐僧后大喜，因为她知道唐僧是金蝉子化身，传说吃他一块肉可以长寿长生。这就是她三次变化、反复接近唐僧的动机。",
      guideEn:
        "The demon recognizes Tang Sanzang as the reincarnation of the Golden Cicada and believes that eating his flesh will grant longevity. This desire drives every disguise that follows.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 7023,
        rawLineEnd: 7026
      }
    },
    "content-first-disguise": {
      id: "content-first-disguise",
      labelId: "label-027-first-disguise",
      title: {
        zhHant: "第一次變化：送齋女子",
        zhHans: "第一次变化：送斋女子",
        en: "First disguise: a woman bringing food"
      },
      originalTraditional:
        "好妖精，停下陰風，在那山凹裏搖身一變，變做個月貌花容的女兒，說不盡那眉清目秀，齒白唇紅。左手提著一個青砂罐兒，右手提著一個綠磁瓶兒，從西向東，徑奔唐僧：",
      explanationZhHans:
        "白骨精第一次变成漂亮女子，手里提着饭罐和瓶子，假装来斋僧。她利用唐僧饥饿和八戒贪吃的弱点，制造接近唐僧的机会。",
      guideEn:
        "For her first approach, the demon becomes a young woman carrying a jar and a green-glazed vessel. The performance exploits Tang Sanzang's hunger and Bajie's appetite to make hospitality look harmless.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 7031,
        rawLineEnd: 7033
      }
    },
    "content-wukong-eyes": {
      id: "content-wukong-eyes",
      labelId: "label-027-wukong-eyes",
      title: {
        zhHant: "火眼金睛識破妖精",
        zhHans: "火眼金睛识破妖精",
        en: "Wukong sees through the disguise"
      },
      originalTraditional:
        "只見那行者自南山頂上摘了幾個桃子，托著缽盂，一觔斗，點將回來，睜火眼金睛觀看，認得那女子是個妖精，放下缽盂，掣鐵棒，當頭就打。",
      explanationZhHans:
        "悟空摘桃回来后，用火眼金睛看出女子其实是妖精，于是立刻放下钵盂，拿出铁棒要打。这里体现了悟空判断准确，但行动方式直接，也埋下师徒冲突。",
      guideEn:
        "Returning with peaches, Wukong immediately recognizes the visitor as a demon. His perception is accurate, but his sudden violence gives Tang Sanzang no time to understand what Wukong has seen.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 7075,
        rawLineEnd: 7077
      }
    },
    "content-bajie-instigation": {
      id: "content-bajie-instigation",
      labelId: "label-027-bajie-instigation",
      title: {
        zhHant: "八戒挑唆唐僧",
        zhHans: "八戒挑唆唐僧",
        en: "Bajie turns Tang Sanzang against Wukong"
      },
      originalTraditional:
        "沙僧攙著長老，近前看時，那裏是甚香米飯，卻是一罐子拖尾巴的長蛆﹔也不是麵觔，卻是幾個青蛙、癩蝦蟆，滿地亂跳。長老才有三分兒信了。怎禁豬八戒氣不忿，在傍漏八分兒唆嘴道：「師父，說起這個女子，他是此間農婦，因為送飯下田，路遇我等，卻怎麼栽他是個妖怪？哥哥的棍重，走將來試手打他一下，不期就打殺了。怕你念甚麼緊箍兒咒，故意的使個障眼法兒，變做這等樣東西，演幌你眼，使不念咒哩。」",
      explanationZhHans:
        "悟空打倒假尸后，饭菜现出蛆虫和青蛙，唐僧已有几分相信。但八戒在旁边挑唆，说这是悟空怕念咒而变出的障眼法，使唐僧再次动摇。",
      guideEn:
        "The false meal changes into maggots, frogs and toads, briefly supporting Wukong's warning. Bajie nevertheless claims that Wukong created the illusion to escape punishment, deepening the mistrust between master and disciple.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 7094,
        rawLineEnd: 7099
      }
    },
    "content-second-disguise": {
      id: "content-second-disguise",
      labelId: "label-027-second-disguise",
      title: {
        zhHant: "第二次變化：尋女老婦",
        zhHans: "第二次变化：寻女老妇",
        en: "Second disguise: a grieving old woman"
      },
      originalTraditional:
        "好妖精，按落陰雲，在那前山坡下搖身一變，變作個老婦人，年滿八旬，手拄著一根彎頭竹杖，一步一聲的哭著走來。",
      explanationZhHans:
        "白骨精第二次变成八旬老妇，假装来寻找被打死的女儿。这个变化是接着第一次骗局设计的，让唐僧更相信悟空误伤平民。",
      guideEn:
        "The demon next appears as an eighty-year-old mother searching for her daughter. By extending the first disguise into a family tragedy, she makes Wukong appear to have killed an innocent villager.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 7122,
        rawLineEnd: 7123
      }
    },
    "content-third-disguise": {
      id: "content-third-disguise",
      labelId: "label-027-third-disguise",
      title: {
        zhHant: "第三次變化：念經老公公",
        zhHans: "第三次变化：念经老公公",
        en: "Third disguise: a praying old man"
      },
      originalTraditional:
        "好妖精，按聳陰風，在山坡下搖身一變，變做一個老公公，真個是：白髮如彭祖，蒼髯賽壽星。耳中鳴玉磬，眼裏幌金星。",
      explanationZhHans:
        "白骨精第三次变成老公公，继续补全“女儿、母亲、父亲”这一家人的假象。她每次变化都围绕同一个骗局加深唐僧的误判。",
      guideEn:
        "The third disguise completes an invented family: daughter, mother and now father. Each new role makes the earlier deception more emotionally convincing and isolates Wukong further.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 7162,
        rawLineEnd: 7166
      }
    },
    "content-final-kill": {
      id: "content-final-kill",
      labelId: "label-027-final-kill",
      title: {
        zhHant: "白骨夫人現出本相",
        zhHans: "白骨夫人现出本相",
        en: "The White-Bone Demon is revealed"
      },
      originalTraditional:
        "卻是一堆粉骷髏在那裏。唐僧大驚道：「悟空，這個人才死了，怎麼就化作一堆骷髏？」行者道：「他是個潛靈作怪的僵尸，在此迷人敗本，被我打殺，他就現了本相。他那脊梁上有一行字，叫做『白骨夫人』。」",
      explanationZhHans:
        "悟空第三次打倒妖魔后，地上显出一堆粉骷髅，脊梁上有“白骨夫人”字样。到这里，原文明确交代她的妖怪本相。",
      guideEn:
        "After the third blow, the body becomes a pale skeleton and the novel explicitly identifies the figure as the White-Bone Demon. The supernatural evidence is finally visible to everyone, not only to Wukong.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 7193,
        rawLineEnd: 7196
      }
    },
    "content-curse-banish": {
      id: "content-curse-banish",
      labelId: "label-027-curse-banish",
      title: {
        zhHant: "唐僧寫下貶書",
        zhHans: "唐僧写下贬书",
        en: "Tang Sanzang writes the banishment letter"
      },
      originalTraditional:
        "唐僧見他言言語語，越添惱怒，滾鞍下馬來，叫沙僧包袱內取出紙筆，即於澗下取水，石上磨墨，寫了一紙貶書，遞於行者道：「猴頭，執此為照，再不要你做徒弟了﹔如再與你相見，我就墮了阿鼻地獄。」",
      explanationZhHans:
        "虽然白骨夫人已经现出本相，唐僧仍因八戒挑唆和对悟空连杀三人的恐惧，最终写下贬书，逐走悟空。这也是本回题目“圣僧恨逐美猴王”的落点。",
      guideEn:
        "Even after the demon's form is exposed, Tang Sanzang remains horrified by Wukong's violence and influenced by Bajie's accusations. He formally dismisses Wukong in writing, completing the chapter's tragic reversal.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 7217,
        rawLineEnd: 7219
      }
    },
    "content-sha-seng": {
      id: "content-sha-seng",
      labelId: "label-027-sha-seng",
      title: {
        zhHant: "沙僧的被動見證",
        zhHans: "沙僧的被动见证",
        en: "Sha Seng as the quiet witness"
      },
      originalTraditional:
        "大聖跳起來，把身一抖，收上毫毛，卻又吩咐沙僧道：「賢弟，你是個好人，卻只要留心防著八戒詀言詀語，途中更要仔細。倘一時有妖精拿住師父，你就說老孫是他大徒弟，西方毛怪聞我的手段，不敢傷我師父。」",
      explanationZhHans:
        "沙僧在本回不是冲突中心，但悟空临走前专门嘱咐他防着八戒搬弄是非、路上多加小心。这让沙僧成为师徒矛盾的见证者。",
      guideEn:
        "Before leaving, Wukong entrusts Sha Seng with protecting their master and guarding against Bajie's divisive talk. Sha Seng becomes the quiet witness who must carry the consequences of the broken group.",
      source: {
        chapterNumber: 27,
        chapterTitle: chapterTitleTraditional,
        rawLineStart: 7227,
        rawLineEnd: 7229
      }
    }
  }
};

export function validatePanoramaTour(tour: PanoramaTour): string[] {
  const issues: string[] = [];
  const nodeIds = new Set(tour.nodes.map((node) => node.id));

  if (!nodeIds.has(tour.startNodeId)) {
    issues.push(`Start node ${tour.startNodeId} is missing.`);
  }

  for (const node of tour.nodes) {
    if (node.panorama.width !== node.panorama.height * 2) {
      issues.push(`Panorama ${node.id} must use an exact 2:1 aspect ratio.`);
    }

    for (const sceneLink of node.sceneLinks) {
      if (!nodeIds.has(sceneLink.targetNodeId)) {
        issues.push(`Scene link ${sceneLink.id} targets missing node ${sceneLink.targetNodeId}.`);
      }
    }

    for (const hotspot of node.infoHotspots) {
      const content = tour.content[hotspot.contentId];
      if (!content) {
        issues.push(`Information hotspot ${hotspot.id} references missing content ${hotspot.contentId}.`);
        continue;
      }

      if (!content.originalTraditional || !content.explanationZhHans || !content.guideEn) {
        issues.push(`Cultural content ${content.id} must provide all three language layers.`);
      }
    }
  }

  return issues;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>\"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '\"': "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}

export function toPhotoSphereTourNodes(tour: PanoramaTour): VirtualTourNode[] {
  return tour.nodes.map((node) => ({
    id: node.id,
    panorama: node.panorama.src,
    name: node.name.zhHans,
    thumbnail: node.panorama.thumbnailSrc,
    links: node.sceneLinks.map((link) => ({
      nodeId: link.targetNodeId,
      position: link.position,
      data: { kind: "scene-link", id: link.id, label: link.label }
    })),
    markers: node.infoHotspots.map((hotspot) => ({
      id: hotspot.id,
      position: hotspot.position,
      html: `<button type="button" class="panorama-marker-button" aria-label="${escapeHtml(
        hotspot.label.zhHans
      )}" data-panorama-hotspot="info"><span class="panorama-hotspot-core" aria-hidden="true"></span></button>`,
      size: { width: 54, height: 54 },
      anchor: "center center",
      className: "panorama-info-marker",
      data: { kind: "info", contentId: hotspot.contentId }
    })),
    data: {
      initialView: node.initialView,
      fallbackSrc: node.panorama.fallbackSrc,
      isPlaceholder: Boolean(node.isPlaceholder)
    }
  }));
}
