# 西游记 MVP 体验修改需求草案

## 1. 审查结论

当前版本已经完成了技术闭环：大地图、白虎岭热点、展签阅读、探索度、小游戏、奖励页、徽章/下一节点状态、本地进度和 Studio 都能跑通。

但它更像“功能验证版”，离目标中的“原著互动博物馆 + 章节游戏 + 视觉探索体验”还有明显差距。主要问题不是内容数据，而是产品形态仍停留在“单张场景图 + 热点面板”，没有形成以视觉场景为主的连续探索体验。

重要修正：下一版不应只是美化当前单场景热点页，而应把白虎岭章节改造成“全屏视觉场景链”。用户从大地图进入白虎岭后，先看到场景 1；点击场景中的关键人物、物件或方向，进入场景 2；再继续进入场景 3。MVP v2 的场景按照原著时间线展开，覆盖本轮列出的关键原文段落和已抽取展签；“第二七回完整逐段视觉化”属于正式版扩展目标，不属于本轮必须完成范围。每个场景仍可点击细节，例如烛台、器物、山路、人物、兵器、尸骨等，弹出对应原著文案和白话解释。

修改方向：保留现有 Next.js + React + TypeScript + JSON + localStorage 技术路线，但需要重构章节体验结构：从“一个场景承载全部热点”改成“多个视觉场景承载原著内容”。视觉成像效果、场景切换和浏览节奏要严格参考 flipbook.page 的丝滑过渡和视觉优先表达。

## 2. 审查截图

- `01-map.png`：初始大地图
- `02-chapter.png`：白虎岭探索初始状态
- `03-after-one-label-read.png`：读完一个普通展签后
- `04b-multi-label-hotspot.png`：多展签热点状态
- `05-game-unlocked.png`：小游戏解锁状态
- `06-game.png`：小游戏初始状态
- `06b-game-complete.png`：小游戏完成状态
- `07-reward.png`：奖励页
- `08-map-after-reward.png`：奖励后地图状态
- `09-studio.png`：Studio 工作台

## 3. 总体修改目标

把页面从“Web 表单式功能验证”改成“可沉浸探索的西游记原著视觉场景链 demo”。

必须保留：

- 原著展签数据和白话解释
- 70% 探索度 + 9 个核心线索解锁规则
- 三打白骨精作为教学章节
- 大地图、章节页、小游戏、奖励页、Studio 五个核心路由
- 本地运行、本地进度、无登录

必须纠正：

- 当前版本不是原著全部内容，只是精选 11 个热点/展签的 MVP。
- 下一版不能把全部内容继续压在一张白虎岭主图上。
- 每个关键原文段落或原文事件应尽量有对应视觉场景、专场动画或细节热点。
- 章节体验要按时间线推进，同时允许在已解锁场景间前后切换。
- “无限延伸”指在原著内容范围内不断进入下一视觉场景，不是实时 AI 无限生成，也不是脱离原著自由扩写。

MVP v2 范围边界：

- 本轮只要求第二七回“三打白骨精”关键场景链，不要求全书，也不要求第二七回逐句逐段全部视觉化。
- 本轮必须把现有 11 个展签全部纳入场景链，并补足它们对应的场景归属、视觉资源、热点动作和解锁规则。
- 之前容易被理解为“本轮要完整覆盖全章”的表述，在本轮统一解释为“本轮场景清单覆盖的关键原文与展签都被展示”；正式版再扩展为完整第二七回逐段视觉化。
- 探索度继续按“唯一已读展签权重求和 / 总权重”计算，场景访问状态单独记录，不直接改变展签权重。

需要加强：

- 章节入口的故事感
- 热点探索的发现感
- 多场景连续探索的沉浸感
- 展签的博物馆感和原著证据感
- 小游戏的游戏包装
- 奖励页的仪式感
- 徽章点亮和下一节点解锁的视觉反馈
- Flipbook.page 式的演示节奏：全屏视觉优先、点击进入下一画面、顺滑过渡、场景连续展开；但不做脱离原著的无限生成浏览器，也不做素淡翻书绘本
- Flipbook.page 式说明框：点击画面细节后出现轻量浮层说明，说明框与画面绑定，不要变成右侧长文面板

## 4. P0 必修问题

### 4.1 产品形态错误：不能再是一张图承载全部热点

证据：`02-chapter.png`

当前白虎岭页面是一张大场景图，上面堆叠所有人物、物件、事件热点。这只是功能验证方式，不符合目标体验。

要求：

- 白虎岭章节改为“场景链”结构，而不是“单张图 + 全部热点”。
- 每个场景全屏或近全屏展示，以视觉为主，文字为辅。
- 点击大地图白虎岭节点后进入场景 1。
- 场景 1 中点击关键热点或前进区域进入场景 2。
- 场景 2 再进入场景 3，以此按原著时间线推进。
- 场景内也允许点击细节热点，只弹出该细节对应原著文案，不强迫跳转。
- 已解锁场景可以前后切换，例如上一场景、下一场景、时间线缩略条。

建议三打白骨精 demo 的第一版场景链：

1. 白虎岭山路：险山生怪，唐僧饥饿，悟空去化斋。
2. 妖怪洞察唐僧肉：白骨精知道唐僧来历，起意要吃。
3. 送斋女子：青砂罐、绿磁瓶、女子第一次接近。
4. 悟空归来：火眼金睛识破妖精，第一次打杀假尸。
5. 八戒挑唆：八戒说悟空障眼法，唐僧误解加深。
6. 老妇寻女：白骨精第二次变化，哭寻女儿。
7. 老公公寻亲：白骨精第三次变化，骗局完成。
8. 粉骷髅现形：白骨夫人本相出现。
9. 贬书逐猴王：唐僧写贬书，悟空离队。
10. 章节回望：解锁小游戏前的真相汇总。

MVP v2 的场景清单固定为 10 个主线 scene node，不能写成“8-10 个”浮动范围。第 10 个“章节回望”需要独立总结画面或独立动效，不再视为无画面的普通说明页。

| order | sceneId | 资源文件名 | 关联展签 |
| --- | --- | --- | --- |
| 1 | `scene-027-01-baihuling-road` | `scene-027-01-baihuling-road-v2.png` | `label-027-baihuling`, `label-027-hunger` |
| 2 | `scene-027-02-demon-motive` | `scene-027-02-demon-motive-v2.png` | `label-027-demon-motive` |
| 3 | `scene-027-03-first-disguise` | `scene-027-03-first-disguise-v2.png` | `label-027-first-disguise` |
| 4 | `scene-027-04-wukong-returns` | `scene-027-04-wukong-returns-v2.png` | `label-027-wukong-eyes` |
| 5 | `scene-027-05-bajie-instigation` | `scene-027-05-bajie-instigation-v2.png` | `label-027-bajie-instigation` |
| 6 | `scene-027-06-second-disguise` | `scene-027-06-second-disguise-v2.png` | `label-027-second-disguise` |
| 7 | `scene-027-07-third-disguise` | `scene-027-07-third-disguise-v2.png` | `label-027-third-disguise` |
| 8 | `scene-027-08-skeleton-reveal` | `scene-027-08-skeleton-reveal-v2.png` | `label-027-final-kill` |
| 9 | `scene-027-09-banish-wukong` | `scene-027-09-banish-wukong-v2.png` | `label-027-curse-banish`, `label-027-sha-seng` |
| 10 | `scene-027-10-chapter-review` | `scene-027-10-chapter-review-v2.png` | 汇总已读核心线索，不新增探索权重 |

验收：

- 用户不再看到一张图上堆满所有热点。
- 用户能像浏览视觉故事一样从一个场景进入下一个场景。
- 每个场景有自己的画面、焦点、热点和原著证据。

### 4.2 内容覆盖不足：当前热点不是原著全部内容

证据：当前 `content/chapters/chapter-027.seed.json` 仅覆盖精选热点和展签，不是第二七回完整拆解。

要求：

- 明确当前 seed 是 MVP 精选版，不得在界面或文档中暗示“已覆盖原著全部内容”。
- 下一版要补一层 `sceneNodes` 或等价结构，把第二七回按时间线拆成多个视觉场景。
- 每个 scene node 至少包含：场景 id、时间线顺序、背景图/动画资源、进入说明、可点击热点、关联原文行号、已探索状态、下一场景。
- 每个热点至少包含：热点类型、点击动作、关联原文、白话解释、是否进入下一场景、是否计入核心线索。
- 原文内容覆盖目标分级：
  - MVP v2：覆盖第二七回“三打白骨精”关键原文段落和已抽取展签。
  - 正式版：把第二七回完整原文拆成视觉场景、细节热点和展签。
  - 全书版：每回都按同样方法扩展。

验收：

- 开发者能区分“章节场景链数据”和“旧 hotspot/label 数据”。
- 用户能沿时间线看到多个画面，而不是读一组静态展签。

### 4.2.1 `sceneNodes` 数据契约

下一版必须先定义 `sceneNodes` 契约，再改页面。当前 `src/content/types.ts` 只有旧 `scene.hotspots`，不能让开发者临时猜字段。

建议把以下草案同步到 `src/content/types.ts`，并在 `content/chapters/chapter-027.seed.json` 中升级为 `version: 2` 或增加向后兼容的 `contentVersion: 2`：

```ts
export type SceneNodeKind = "main" | "detail" | "summary";
export type SceneAssetType = "image" | "video" | "image-sequence";
export type SceneHotspotKind =
  | "character"
  | "object"
  | "location"
  | "event"
  | "detail"
  | "advance";

export type SceneHotspotActionType =
  | "open-popover"
  | "open-label"
  | "open-detail-scene"
  | "advance-scene";

export interface SceneAsset {
  type: SceneAssetType;
  src: string;
  poster?: string;
  frames?: string[];
  alt: string;
}

export interface SceneHotspot {
  id: string;
  title: string;
  kind: SceneHotspotKind;
  position: { x: number; y: number };
  radius?: number;
  polygon?: Array<{ x: number; y: number }>;
  labelIds: string[];
  action: {
    type: SceneHotspotActionType;
    targetSceneId?: string;
    popoverTitle?: string;
    popoverCopy?: string;
  };
  requiredForGame?: boolean;
  initiallyVisible?: boolean;
}

export interface SceneNode {
  id: string;
  kind: SceneNodeKind;
  order: number;
  title: string;
  subtitle?: string;
  entryCopy: string;
  source: {
    chapterNumber: number;
    rawLineStart?: number;
    rawLineEnd?: number;
    labelIds: string[];
  };
  asset: SceneAsset;
  parentSceneId?: string;
  previousSceneId?: string;
  nextSceneIds: string[];
  hotspots: SceneHotspot[];
  unlock: {
    type: "chapter-available" | "scene-visited" | "labels-read" | "always";
    sceneId?: string;
    labelIds?: string[];
  };
}

export interface ChapterSceneNavigation {
  initialSceneId: string;
  mainlineSceneIds: string[];
  gameGateSceneId: string;
  allowCycles: false;
}

export interface ChapterSeedV2 extends ChapterSeed {
  version: 2;
  // 旧字段保留给 v1 页面、Studio 对比和回退；v2 章节页以 sceneNodes 为准。
  scene: ChapterSeed["scene"];
  sceneNavigation: ChapterSceneNavigation;
  sceneNodes: SceneNode[];
}
```

兼容策略：

- `sceneNodes` 存在时，`/chapter/027` 必须优先渲染 `sceneNodes`；旧 `scene.hotspots` 只作为 Studio 对比、回退和迁移参考。
- 本轮不要删除旧 `scene` 字段，避免已有 Map、Studio、测试和进度逻辑突然失效。
- 旧 hotspot id 可以保留为 `legacyHotspotId` 或记录在备注中，但运行时点击以 `sceneNodes[].hotspots[].id` 为准。
- `labels`、`minigame`、`reward`、`badge` 继续复用现有结构；不要把原文文本烘焙进图片。

进度迁移规则：

- 如果只是在当前 `xiyouji.progress.v1` 内追加可选场景字段，可保持 `PROGRESS_VERSION = 1`，但读取时必须给旧进度补默认值。
- 如果重构为独立场景浏览栈，建议升级为 `xiyouji.progress.v2` / `PROGRESS_VERSION = 2`，并从 v1 迁移：保留 `readLabelIds`、`gameCompleted`、`rewardViewed`、`badgeUnlocked`、`unlockedNodeIds`；新增 `visitedSceneIds`、`openedHotspotIds`、`currentSceneId`、`sceneStack`、`mainlineUnlockedSceneIds`。
- v1 迁移到 v2 时，默认 `visitedSceneIds` 至少包含 `sceneNavigation.initialSceneId`；已读展签对应的 scene node 自动标记为已访问或已解锁，但不得凭空标记为已读。
- 读取失败、版本不匹配且无法迁移、JSON 损坏时，重置为干净进度，并在 `/studio` 提供“重置本地进度”入口。

场景访问状态和探索度分开：

- `visitedSceneIds` 表示看过哪些画面。
- `openedHotspotIds` 表示点开过哪些热点。
- `readLabelIds` 表示读过哪些展签。
- 探索度只按唯一 `readLabelIds` 对应展签权重计算；访问场景或打开浮层本身不直接增加探索度。

### 4.3 资源策略必须明确：不直接照搬实时生成

flipbook.page 公开页面描述为“按需实时生成的无限视觉浏览器”。这个方向可以作为体验参考，但不适合作为本项目 MVP 的运行时技术路线。

本项目要求原著准确、人物一致、路线可控、本地运行、无需登录，因此 MVP v2 应采用“预设场景资源 + 本地场景图谱”的方式：

- 画面、局部图、角色状态图、物件图、奖励图在开发前或开发过程中离线生成并落盘。
- 前端运行时只读取本地 JSON 和本地资源，不在用户端实时调用 AI 生成画面。
- AI 可用于离线生产：拆原文、生成场景提示词、生成候选图、补局部物件图、做白话解释草稿。
- 未来可以在 `/studio` 中加入“AI 生成候选资源”的工作流，但必须人工预览确认后才进入正式 seed。

实现前置条件：

- 开始重构 `/chapter/027` 之前，必须先生成、接收或验收 v2 场景资产包。
- v2 场景资产包至少包含 10 张主线场景图，文件放在 assets 根目录下的 `chapters/027/scenes/v2/` 或同等清晰目录下。
- 文件名必须与 4.1 的固定清单一致，例如 `scene-027-01-baihuling-road-v2.png` 到 `scene-027-10-chapter-review-v2.png`。
- 推荐尺寸为 1920 x 1080，最低不低于 1600 x 900；移动端如需单独裁切，可另存 `*-mobile-v2.png`。
- 每张图必须是独立场景构图，不能用同一张白虎岭主图换文字，也不能用纯色块、空白、低清草图或无关占位图。
- 资源生产可以由当前对话、后续美术资源对话或用户提供完成；开发对话接入前必须在 `public/assets/chapters/027/ASSET_QA.md` 或新的 v2 QA 文件中记录验收结论。
- 如果交给纯开发对话时资产包尚未存在，该对话的第一任务是停下来补齐或请求资产，而不是先用占位图搭页面。

不建议运行时实时生成的原因：

- 延迟高，无法保证 flipbook.page 那种稳定丝滑体验。
- 成本和网络依赖高，不符合本地运行目标。
- 人物形象、服装、场景连续性容易漂移。
- 原著准确性难保证，可能生成不符合原文的细节。
- 生成结果不可控，会影响后续热点、展签和小游戏证据。

验收：

- 用户端体验不依赖在线 AI 生成。
- 每个场景资源都能从 `public/assets` 找到真实文件。
- 场景链可以做到“像实时深入”，但本质是预设好的原著场景图谱。

### 4.4 多展签热点容易漏读

证据：`04b-multi-label-hotspot.png`

当前“孙悟空”等热点包含多个展签，但切换按钮放在场景图下方，视觉权重弱。用户点完所有热点后可能停在 8/9，不知道还差哪个核心线索。

要求：

- 点击一个热点后，右侧展签面板必须清楚显示“该热点包含 N 条展签”。
- 多展签切换应放进右侧展签面板顶部，或做成热点详情抽屉，而不是远离内容区。
- 每条展签显示状态：已读/未读、是否核心线索、探索权重。
- 小游戏未解锁时，明确列出还缺哪些核心线索标题，不只显示 8/9。
- 场景热点本身应显示已探索状态，避免用户反复点同一处却不知道是否完成。

验收：

- 用户点击“孙悟空”后能立即看出有“火眼金睛识破妖精”和“白骨夫人现出本相”两条展签。
- 用户能从页面上直接知道还缺哪条核心线索。
- 读完所有核心线索后稳定显示 9/9，并解锁小游戏。

## 5. P1 体验升级

### 5.1 大地图需要从“插图 + 节点列表”升级为“取经路线探索”

证据：`01-map.png`、`08-map-after-reward.png`

当前地图图像有气氛，但页面像地图预览加右侧状态清单。缺少取经路线逐步解锁、劫难地点被点亮、章节完成后徽章反馈的感觉。

要求：

- 大地图作为首页主体验，减少右侧清单的表格感。
- 节点 hover/click 时出现地点卡片：章节名、回目、状态、缩略图、进入按钮。
- 白虎岭 completed 后，地图上的白虎岭节点要有明显完成标记，黑松林节点要有“新解锁/预览已开启”的视觉变化。
- 徽章应显示在地图上或节点卡片里，不只在奖励页文字提示。
- 路线光效可以沿已完成路线点亮，体现时间线顺序。

验收：

- 完成白虎岭后返回地图，用户不用看右侧文字也能看出白虎岭已完成、黑松林已解锁预览。
- 首页第一眼像“取经大地图”，而不是普通内容列表页。

### 5.2 白虎岭探索页需要改为“视觉场景浏览器”

证据：`02-chapter.png`、`03-after-one-label-read.png`

当前页功能完整，但热点像透明圆点，展签像右侧信息框。缺少专场画面、场景推进、人物图纸、物件证据、原著物证的层级。

要求：

- 章节主体验应全屏展示当前 scene node，不再默认显示所有热点。
- 当前场景只展示与这个时间点相关的人物、物件、场景细节和前进入口。
- 点击进入下一场景时，使用 flipbook.page 式视觉过渡：画面缩放、淡入、滑动、景深或翻页式进入，但不要素淡绘本化。
- 每个场景可以有一个主动作热点，例如“继续沿山路前行”“查看女子手中罐瓶”“追随悟空视线”。
- 细节热点只展示对应原著证据，不阻断场景推进。
- 细节热点的说明框可以参考 flipbook.page：浮在画面上方或点击点附近，轻量、半透明、有标题、短说明、原文入口和“深入/返回”动作。
- 说明框不应默认占据右侧大面板；只有用户点击“展开原文”时才进入完整博物馆展签。
- 热点样式区分人物、物件、场景、事件，不同类型用不同图标/描边/标签。
- 已读热点和未读热点视觉明显不同。
- 展签面板改为“博物馆标签”结构：标题、分类、核心线索标识、繁体原文、白话解释、来源行号、探索权重。
- 展签中原文和白话解释要有明确层级，原文像文物说明，白话像策展解读。
- 角色热点可以附小型角色图纸/头像裁切；物件热点可以附物件卡。
- 页面顶端的探索度区域改为“章节探索进度条 + 核心线索进度 + 当前目标提示”。

验收：

- 用户能一眼看出哪些热点是人物、哪些是物件、哪些是事件。
- 用户能从场景 1 连续进入场景 2、场景 3，而不是停留在同一张大图上。
- 读完一个普通展签后，页面说明为什么探索度增加但核心线索不增加。
- 展签的观感更接近博物馆签，而不是普通文章卡片。

### 5.3 小游戏需要从“排序表单”升级为“真相还原小游戏”

证据：`06-game.png`、`06b-game-complete.png`

当前小游戏逻辑正确，但体验像题库校验。它需要更像章节结束前的互动关卡。

要求：

- 页面标题和文案改成“还原白虎岭真相”这类更有情境感的表达。
- 事件卡改为时间轴卡片，加入章节场景小图、事件编号、人物/妖怪图标。
- 证据卡和事件卡之间要有明确匹配关系。选中事件时，右侧证据卡应显示“为第 X 步选择原文证据”。
- 校验后，不只显示“顺序正确”，要给出章节真相反馈，例如“骗局链条已还原”“悟空被逐的原因已确认”。
- 完成时增加完成态：光效、徽章预告、进入奖励页的强 CTA。
- 可以先不用拖拽，但上移/下移按钮需要更像游戏控件，不要像普通表单按钮。

验收：

- 不引入拖拽库也可以，但用户要觉得自己在“还原故事真相”，而不是做表格排序题。
- 通关后出现明显完成反馈和“查看章节奖励”入口。

### 5.4 奖励页需要成为闭环高光

证据：`07-reward.png`

当前奖励页是静态全景图 + 一句提示，缺少“游戏结束后生成/展示全景、点亮徽章、解锁下一章”的仪式感。

要求：

- 进入奖励页时先展示短暂完成态：章节完成、白虎岭徽章点亮、黑松林预览解锁。
- 全景图展示要更沉浸：尽量铺满主视觉区域，减少卡片边框感。
- 当前资源仍按 `static-panorama-preview` 展示，不接 360 viewer。
- 可以增加伪 360 视觉演示：缓慢横向平移、轻微景深、光效扫过，但不能声称是真 360 交互。
- 徽章图片要作为核心视觉出现，并有点亮动效。
- 返回大地图按钮旁增加“查看已点亮路线/前往下个预览”的引导。

验收：

- 用户完成小游戏后，能明显感到“章节完成了”。
- 白虎岭徽章不是文字提示，而是真正被看见、被点亮。
- 奖励页不再像普通图片详情页。

### 5.5 Studio 需要更像内容和美术预览后台

证据：`09-studio.png`

当前 Studio 是开发 QA 面板，能看结构，但不适合用户筛选/预览美术资源。

要求：

- Studio 第一版仍可只读，但要分成：章节内容、热点预览、展签列表、游戏数据、奖励资源、美术资源。
- 美术资源区展示：大地图、章节主图、角色图、徽章、奖励图。
- 每个资源显示路径、尺寸、用途、当前 v1/v2 状态。
- 如果未来有多版候选，先预留候选卡片结构，但不需要写回 JSON。
- 重置进度按钮保留，但放在开发工具区，不要占内容 QA 首位。

验收：

- 打开 Studio 能快速预览所有当前视觉资源。
- 能看出哪些资源是当前 seed 正在用的，哪些只是候选或测试图。

### 5.6 视觉资源必须从“单主图”升级为“场景资源包”

当前只有白虎岭主场景图、角色图、奖励图等少量素材，无法支撑用户目标中的连续视觉探索。

要求：

- 第二七回 v2 必须准备 10 张场景级主视觉，或 10 个等价的短动画/动效分层资源。
- 每个 scene node 必须绑定自己的视觉资源，不允许所有场景共用同一张主图。
- 场景资源应按原著时间线命名，例如：
  - `scene-027-01-baihuling-road`
  - `scene-027-02-demon-motive`
  - `scene-027-03-first-disguise`
  - `scene-027-04-wukong-returns`
  - `scene-027-05-bajie-instigation`
  - `scene-027-06-second-disguise`
  - `scene-027-07-third-disguise`
  - `scene-027-08-skeleton-reveal`
  - `scene-027-09-banish-wukong`
  - `scene-027-10-chapter-review`
- 每个场景至少有一个主进入热点和若干细节热点。
- 细节热点可以指向局部画面、人物图纸、物件图纸、原文展签或下一场景。
- 不能用纯色块、空白占位图或文字框假装视觉资源；若资源暂缺，应先生成 v2 视觉资源，再进入体验升级。

验收：

- 用户从场景 1 进入场景 2 时，看到的是新的画面/动画，而不是同一张图换文字。
- 视觉资源目录和 Studio 都能清楚显示每个场景正在使用哪张图或哪个动画。

### 5.7 深入与返回能力

用户希望像 flipbook.page 一样随意深入剧情，也能回到上一个剧情。MVP v2 可以实现这种交互，但范围应限定在已策划的原著场景图谱内。

要求：

- 主线场景是线性的，固定为 4.1 的 10 个 `scene-027-01` 到 `scene-027-10`，按 `sceneNavigation.mainlineSceneIds` 顺序推进。
- 细节场景是主线场景的子节点，必须有 `parentSceneId`，只能从对应主线场景或同一证据链入口进入。
- MVP v2 不允许循环路径；`sceneNavigation.allowCycles` 固定为 `false`。
- 场景间维护浏览栈：用户每深入一个细节场景，就能通过 `back` 返回上一层。
- 提供上一场景、下一场景、返回上一层、回到章节时间线、回到大地图五种导航方式。
- 每个场景可以有多个深入入口，但入口必须来自原著内容或原著可解释的场景细节。
- 不允许脱离原著自由扩写剧情路径。
- 必须使用 `parentSceneId`、`previousSceneId`、`nextSceneIds`、`sceneNavigation.mainlineSceneIds`、`visitedSceneIds` 等字段表达导航关系，不能只靠组件内部硬编码。
- 场景返回时应保留已读状态和当前探索度。

导航语义：

- `next`：沿主线时间线进入下一个已解锁或可解锁主场景；例如从 `scene-027-03-first-disguise` 到 `scene-027-04-wukong-returns`。
- `previous`：沿主线时间线回到上一个主场景，不等同于浏览器返回。
- `back`：弹出浏览栈，回到刚才进入当前场景之前的场景；主要用于细节深入后返回。
- `breadcrumb`：展示当前路径，例如“白虎岭 > 送斋女子 > 青砂罐”，点击面包屑可回到对应已访问节点。
- `time scrubber`：只展示主线 10 个场景，可跳转到已访问或已解锁主场景；未解锁场景显示锁定态。

解锁规则：

- `scene-027-01-baihuling-road` 随白虎岭章节开放。
- 主线第 N+1 个场景由第 N 个场景的主进入热点或 `advance-scene` 动作解锁。
- 细节场景由父场景访问后解锁，但只有点击对应热点才加入浏览栈。
- 读展签、完成核心线索和达到 70% 探索度只控制小游戏入口，不应阻止用户按主线看完 10 个场景。
- `scene-027-10-chapter-review` 可以汇总缺失核心线索，并引导用户回到对应场景补读展签。

验收：

- 用户连续进入 3 层场景后，可以逐层返回。
- 返回不丢失探索状态。
- 深入路径不会跳出《西游记》第二七回原著证据范围。

## 6. P2 视觉和动效要求

### 6.1 严格参考 OpenFlipbook / Flipbook 式视觉演示

本需求基于对 `eren23/openflipbook` 源码的技术分析。OpenFlipbook 是 MIT 许可的 flipbook.page 开源复刻，README 中明确其核心范式是 `image-is-the-UI`：每一页是一张图，用户点击图片区域，系统解析点击对象并生成/进入下一页。

对本项目可借鉴的不是其在线 AI 生成后端，而是前端交互范式：

- 一页一个主视觉，图片本身就是主要 UI。
- 外层 DOM UI 尽量少，使用覆盖在画面上的半透明胶囊、浮层、说明框。
- 点击画面某一点后，从该点击点产生涟漪/扩散/入场动画。
- 新画面和旧画面双层叠放，使用 mask/opacity 做丝滑替换。
- 维护访问路径和历史栈，支持 back、forward、breadcrumb、time scrubber。
- 已探索过的分支在原图点击位置显示小 beacon，可直接回到该分支。
- 说明框跟随点击位置出现，轻量呈现，再决定是否深入。

要求：

- 页面切换、场景进入、热点深入、返回上一场景都要参考 flipbook.page 的顺滑视觉浏览感。
- 核心表达是“全屏画面优先，点击画面中的目标进入下一张/下一层视觉场景”。
- 说明框效果也要参考：轻量浮层、跟随点击目标、短文案优先、需要时再展开完整展签。
- 地图进入章节、场景 1 进入场景 2、章节进入小游戏、小游戏进入奖励页，都要有连续过渡。
- 展签切换可以有轻微翻页/展册感，但不能变成素淡翻书绘本。
- 可以做原著范围内的连续视觉延伸；MVP v2 先延伸到本轮 10 个主线场景和现有 11 个展签全部展示完成，正式版再扩展到第二七回完整逐段视觉化。
- 不做脱离原著的实时 AI 无限生成浏览器，不改成自由搜索型浏览器。

建议借鉴的 OpenFlipbook 前端模块/模式：

- `MorphImagePair` + `useImageMorph` + `morph-style.ts`：双图层切换，新图从点击点用 radial mask 扩散显现。
- `ClickRipple`：点击后在点击点显示持续涟漪，反馈“正在进入/生成”。
- `GeneratingBanner`：画面底部半透明状态条，适合显示“进入下一场景中”。
- `TapHint`：居中的底部提示胶囊，提示用户点击画面探索。
- `HintPrompt` / `ClickDetailPopover`：点击点附近的轻量浮层和确认框，可改造成“原著说明框/深入场景”。
- `TimeScrubber`：底部胶片条，可用于章节场景时间线跳转。
- `Breadcrumb`：当前路径面包屑，可用于“白虎岭 > 送斋女子 > 青砂罐”。
- `BranchBeacons`：已探索分支的小点，可用于提示某个细节已打开过。
- `EntityHoverOverlay` / `EnterableMarkers`：画面上轻量实体标记，可改造成原著人物、物件、场景热点。

不建议照搬的部分：

- fal/OpenRouter/Modal/Mongo/R2 后端链路：不符合本项目本地运行和原著可控目标。
- 运行时实时生成下一页：会牺牲丝滑、成本、稳定性和原著准确性。
- 视频 streaming / LTXF 协议：MVP 不需要，复杂度高，后续若要动画也应先用预生成视频或 CSS/图片转场。
- 把文字全部烘焙进图片：本项目需要可检索、可校验的原著文本，繁体原文和白话解释仍应保留为结构化 JSON/DOM。

### 6.2 美术气质继续保持“原著驱动东方神魔漫画博物馆风”

要求：

- 不是全站暗黑风；白虎岭可以阴森，后续章节按原著变化。
- 避免普通网页卡片感，增加卷轴、拓片、碑刻、册页、法器、路线光效等东方博物馆语汇。
- 不复制《西行纪》角色造型和具体画面，只参考力量感、厚重线条、高对比、神魔压迫感。

### 6.3 移动端也要可用

要求：

- 大地图可横向/缩放查看，节点不重叠。
- 章节页在移动端改为：场景图在上，展签抽屉从底部打开。
- 小游戏在移动端事件卡和证据卡上下排列。
- 画面热点点击区域不小于 44 x 44 CSS px；小热点可用透明命中区扩大，但视觉标记不要遮住主体。
- 说明浮层必须避开刘海屏、安全区、底部导航和时间线控件；必要时自动改为底部抽屉。
- 底部 `TapHint`、时间线胶片条、返回按钮和展签抽屉不能互相遮挡。
- 横屏和竖屏都要检查：场景主视觉不应被顶部/底部 UI 挤到不可读。
- 多展签热点在移动端必须显示“第 X / N 条”和未读提示，不能藏在横向溢出的按钮里。
- 小游戏的上移/下移、证据选择、提交按钮都要能单手点击，按钮文本不换行挤压。

## 7. 另一个开发对话的建议执行顺序

1. 先确认或补齐白虎岭 v2 场景资产包：10 张独立主线场景图，命名、尺寸和 QA 记录符合 4.1、4.3、5.6。
2. 定义并落地 `sceneNodes` / `sceneNavigation` 数据结构，把现有展签按原著时间线拆进 10 个主线场景。
3. 更新进度结构：记录 `visitedSceneIds`、`openedHotspotIds`、`currentSceneId`、`sceneStack`，并处理 v1 本地进度兼容或迁移。
4. 把 `/chapter/027` 从单图热点页改为全屏视觉场景浏览器。
5. 实现场景深入、返回上一层、上一/下一主线场景、时间线缩略导航和浏览栈。
6. 实现 flipbook.page 式说明框：点击画面细节先出轻量浮层，再按需展开完整展签。
7. 修多展签热点和缺失线索提示。
8. 重做大地图节点卡、完成态、徽章点亮和下一节点解锁视觉。
9. 包装小游戏视觉和完成反馈，不先引入拖拽库。
10. 升级奖励页仪式感和静态全景展示。
11. 扩展 Studio 的场景链和美术资源预览区。
12. 最后统一 flipbook.page 式过渡、移动端和视觉细节。

## 8. 交付给开发对话的提示词

请基于 `/Users/zhengshuwen/Documents/小说探索` 当前 main 分支继续修改，不要重写项目。当前版本功能闭环已跑通，但体验偏功能验证版。请先阅读：

- `docs/review/2026-07-01-mvp-effect-audit/REVISION_REQUIREMENTS.md`
- `docs/review/2026-07-01-mvp-effect-audit/*.png`
- `HANDOFF.md`
- `docs/TECH_SPEC.md`
- `docs/ART_DIRECTION.md`
- `content/chapters/chapter-027.seed.json`

修改目标：把 MVP 从“Web 表单式互动”升级为“原著驱动的西游记视觉场景链/互动博物馆 demo”。当前实现是一张白虎岭主图承载所有热点，这不符合目标。下一版优先把第二七回拆成按原著时间线推进的 10 个全屏主线视觉场景：大地图点击白虎岭进入 `scene-027-01-baihuling-road`，再沿 `sceneNavigation.mainlineSceneIds` 进入后续场景，直到 `scene-027-10-chapter-review` 汇总本轮关键线索。MVP v2 覆盖本轮场景清单和现有 11 个展签；第二七回完整逐段视觉化是正式版扩展，不属于本轮。每个场景有独立画面/动画和细节热点。点击细节热点时，先出现类似 flipbook.page 的轻量说明浮层，再按需展开完整博物馆展签，展签展示繁体原文与简体白话解释。视觉成像、说明框、过渡和展示节奏严格参考 flipbook.page：全屏视觉优先、点击深入、丝滑转场、可返回上一层。资源策略采用预设场景资源和本地场景图谱，AI 只用于离线生产候选图和内容，不在用户端实时生成画面。进入页面重构前，必须先确认或补齐 10 张 v2 场景主视觉资源，不能用同一张主图或占位图假装多场景。保留 Next.js + React + TypeScript + 本地 JSON + localStorage，不接真实 360 viewer，不引入重依赖，当前奖励仍按 `static-panorama-preview` 展示。
