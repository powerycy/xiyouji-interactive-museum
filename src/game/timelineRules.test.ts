import { describe, expect, it } from "vitest";
import { chapter027 } from "@/content/xiyouji";
import { evaluateTimelineGame, getCorrectEventOrder, getInitialTimelineState } from "./timelineRules";

describe("timeline game rules", () => {
  it("passes with correct order and accepted evidence", () => {
    const evidenceByEventId = Object.fromEntries(
      chapter027.minigame.eventCards.map((eventCard) => [eventCard.id, eventCard.requiredEvidenceIds[0]])
    );

    const result = evaluateTimelineGame(chapter027.minigame, {
      orderedEventIds: getCorrectEventOrder(chapter027.minigame),
      evidenceByEventId
    });

    expect(result.complete).toBe(true);
    expect(result.events.every((eventResult) => eventResult.orderCorrect && eventResult.evidenceCorrect)).toBe(true);
  });

  it("fails when order is wrong", () => {
    const state = getInitialTimelineState(chapter027.minigame);
    const result = evaluateTimelineGame(chapter027.minigame, {
      orderedEventIds: state.orderedEventIds,
      evidenceByEventId: {}
    });

    expect(result.complete).toBe(false);
    expect(result.events.some((eventResult) => !eventResult.orderCorrect)).toBe(true);
  });

  it("fails when evidence is wrong or missing", () => {
    const state = getInitialTimelineState(chapter027.minigame);
    const result = evaluateTimelineGame(chapter027.minigame, {
      orderedEventIds: getCorrectEventOrder(chapter027.minigame),
      evidenceByEventId: {
        [state.orderedEventIds[0]]: "not-real-evidence"
      }
    });

    expect(result.complete).toBe(false);
    expect(result.events.some((eventResult) => !eventResult.evidenceCorrect)).toBe(true);
  });
});
