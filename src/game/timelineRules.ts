import type { Minigame } from "@/content/types";

export interface TimelineState {
  orderedEventIds: string[];
  evidenceByEventId: Record<string, string>;
}

export interface EventEvaluation {
  eventId: string;
  expectedOrder: number;
  actualOrder: number;
  orderCorrect: boolean;
  evidenceCorrect: boolean;
  requiredEvidenceIds: string[];
  selectedEvidenceId?: string;
}

export interface TimelineEvaluation {
  complete: boolean;
  events: EventEvaluation[];
  message: string;
}

export function getCorrectEventOrder(minigame: Minigame): string[] {
  return minigame.eventCards
    .slice()
    .sort((a, b) => a.correctOrder - b.correctOrder)
    .map((eventCard) => eventCard.id);
}

export function getInitialTimelineState(minigame: Minigame): TimelineState {
  const correctOrder = getCorrectEventOrder(minigame);
  const split = Math.ceil(correctOrder.length / 2);
  return {
    orderedEventIds: [...correctOrder.slice(split), ...correctOrder.slice(0, split)],
    evidenceByEventId: {}
  };
}

export function moveEvent(orderedEventIds: string[], eventId: string, direction: "up" | "down"): string[] {
  const currentIndex = orderedEventIds.indexOf(eventId);
  if (currentIndex === -1) {
    return orderedEventIds;
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= orderedEventIds.length) {
    return orderedEventIds;
  }

  const next = [...orderedEventIds];
  const [item] = next.splice(currentIndex, 1);
  next.splice(targetIndex, 0, item);
  return next;
}

export function evaluateTimelineGame(minigame: Minigame, state: TimelineState): TimelineEvaluation {
  const eventById = new Map(minigame.eventCards.map((eventCard) => [eventCard.id, eventCard]));
  const events = state.orderedEventIds.map((eventId, index) => {
    const eventCard = eventById.get(eventId);
    const selectedEvidenceId = state.evidenceByEventId[eventId];
    const requiredEvidenceIds = eventCard?.requiredEvidenceIds ?? [];
    const actualOrder = index + 1;
    const expectedOrder = eventCard?.correctOrder ?? -1;

    return {
      eventId,
      expectedOrder,
      actualOrder,
      orderCorrect: actualOrder === expectedOrder,
      evidenceCorrect: requiredEvidenceIds.length === 0 || requiredEvidenceIds.includes(selectedEvidenceId),
      requiredEvidenceIds,
      selectedEvidenceId
    };
  });

  const allKnownEvents = state.orderedEventIds.length === minigame.eventCards.length;
  const complete = allKnownEvents && events.every((eventResult) => eventResult.orderCorrect && eventResult.evidenceCorrect);

  return {
    complete,
    events,
    message: complete ? "时间线与证据都正确。" : "仍有事件顺序或证据匹配需要调整。"
  };
}
