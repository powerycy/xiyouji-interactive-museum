export type MapNodeState = "locked" | "preview" | "available" | "completed";

export interface MapNode {
  id: string;
  canonicalRouteId: string;
  name: string;
  chapterId: string | null;
  position: { x: number; y: number };
  state: MapNodeState;
  previewText: string;
  thumbnail: string;
  unlockRequirement?: { chapterCompleted: string };
}

export interface MapSeed {
  version: number;
  title: string;
  coordinateSystem: "percentage";
  backgroundImage: string;
  notes: string[];
  nodes: MapNode[];
}

export type LabelType = "character" | "object" | "location" | "event" | "detail";

export interface ChapterLabel {
  id: string;
  title: string;
  type: LabelType | string;
  source: {
    chapterNumber: number;
    chapterTitle?: string;
    rawFile?: string;
    rawLineStart?: number;
    rawLineEnd?: number;
  };
  originalTraditional: string;
  plainSimplified: string;
  explorationWeight: number;
  requiredForGame: boolean;
  relatedIds: string[];
}

export interface Hotspot {
  id: string;
  type: LabelType | string;
  title: string;
  position: { x: number; y: number };
  radius: number;
  labelIds: string[];
  isKey: boolean;
}

export type SceneNodeKind = "main" | "detail" | "summary";
export type SceneAssetType = "image" | "video" | "image-sequence";
export type SceneHotspotKind = "character" | "object" | "location" | "event" | "detail" | "advance";
export type SceneHotspotActionType = "open-popover" | "open-label" | "open-detail-scene" | "advance-scene";

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

export interface EventCard {
  id: string;
  text: string;
  correctOrder: number;
  requiredEvidenceIds: string[];
}

export interface EvidenceCard {
  id: string;
  text: string;
  sourceLabelId: string;
}

export interface Minigame {
  id: string;
  type: "timeline-evidence-match";
  title: string;
  unlockRequirement: {
    type: "exploration-and-read-labels";
    explorationPercentGte: number;
    requiredReadLabelEffectiveWeight: number;
    copy: string;
    requiredReadLabelIds: string[];
  };
  eventCards: EventCard[];
  evidenceCards: EvidenceCard[];
}

export interface RewardAsset {
  id: string;
  title: string;
  type: "static-panorama-preview" | string;
  src: string;
  thumbnail?: string;
}

export interface BadgeAsset {
  id: string;
  title: string;
  lockedImage: string;
  unlockedImage: string;
  unlockCondition: string;
}

export interface ChapterSeed {
  version: number;
  id: string;
  title: string;
  originalTitle: string;
  chapterNumber: number;
  mapNodeId: string;
  canonicalRouteId: string;
  status: string;
  explorationThreshold: number;
  scene: {
    id: string;
    title: string;
    image: string;
    coordinateStatus?: string;
    hotspots: Hotspot[];
  };
  labels: ChapterLabel[];
  minigame: Minigame;
  reward: RewardAsset;
  badge: BadgeAsset;
  nextUnlock?: {
    nodeId: string;
    stateAfterCompletion: MapNodeState;
  };
  sceneNavigation?: ChapterSceneNavigation;
  sceneNodes?: SceneNode[];
}

export interface ChapterSeedV2 extends ChapterSeed {
  version: 2;
  sceneNavigation: ChapterSceneNavigation;
  sceneNodes: SceneNode[];
}

export type Chapter027V2AssetStatus = "missing" | "rejected" | "qa-pending" | "approved";
export type Chapter027V2VisualMode = "evidence-space" | "approved-character-layer" | "silhouette";

export interface Chapter027V2SceneSourceEvidence {
  labelIds: string[];
  rawLineStart: number;
  rawLineEnd: number;
  originalExcerpt: string;
  imageBrief: string;
}

export interface Chapter027V2SceneAssetManifestItem {
  order: number;
  sceneId: string;
  title: string;
  fileName: string;
  status: Chapter027V2AssetStatus;
  visualMode: Chapter027V2VisualMode;
  sourceEvidence: Chapter027V2SceneSourceEvidence;
  evidenceFocus: string[];
  roleRisk: "none" | "low" | "medium" | "high";
  qaNotes: string[];
  runtimeSrc?: string;
}

export interface Chapter027V2AssetManifest {
  version: 1;
  chapterId: "chapter-027";
  assetDirectory: string;
  runtimeDirectory: string;
  approvalRule: string;
  scenes: Chapter027V2SceneAssetManifestItem[];
}
