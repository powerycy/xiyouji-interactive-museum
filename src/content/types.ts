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
}
