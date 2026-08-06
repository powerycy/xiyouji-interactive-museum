"use client";

import Link from "next/link";
import { useState } from "react";
import { chapter027 } from "@/content/xiyouji";
import {
  evaluateTimelineGame,
  getInitialTimelineState,
  getSolvedTimelineState,
  moveEvent,
  type TimelineEvaluation
} from "@/game/timelineRules";
import { getGameGate } from "@/progress/progress";
import { useProgress } from "@/progress/useProgress";

export function TimelineGame() {
  const { progress, manager } = useProgress();
  const gate = getGameGate(chapter027, progress);
  const [state, setState] = useState(() => getInitialTimelineState(chapter027.minigame));
  const [selectedEventId, setSelectedEventId] = useState<string | null>(state.orderedEventIds[0] ?? null);
  const [result, setResult] = useState<TimelineEvaluation | null>(null);

  if (!gate.unlocked) {
    return (
      <section className="surface game-locked">
        <h2>小游戏尚未解锁</h2>
        <p>
          当前探索度 {gate.explorationPercent}%，核心线索 {gate.requiredReadCount}/{gate.requiredTotal}。
        </p>
        <Link href="/chapter/027" className="primary-button gate-link">
          返回白虎岭探索
        </Link>
      </section>
    );
  }

  const eventById = new Map(chapter027.minigame.eventCards.map((eventCard) => [eventCard.id, eventCard]));

  function selectEvidence(eventId: string, evidenceId: string) {
    setState((current) => ({
      ...current,
      evidenceByEventId: {
        ...current.evidenceByEventId,
        [eventId]: evidenceId
      }
    }));
  }

  function check() {
    const evaluation = evaluateTimelineGame(chapter027.minigame, state);
    setResult(evaluation);
    if (evaluation.complete) {
      manager.markGameCompleted(chapter027.id);
    }
  }

  return (
    <div className="game-layout">
      <section className="surface game-board">
        <h2>{chapter027.minigame.title}</h2>
        <p className="small-text">选择事件卡，用上移和下移调整顺序。</p>
        <div className="timeline-list">
          {state.orderedEventIds.map((eventId, index) => {
            const eventCard = eventById.get(eventId)!;
            const eventResult = result?.events.find((item) => item.eventId === eventId);
            return (
              <button
                key={eventId}
                className={`timeline-card ${selectedEventId === eventId ? "timeline-card-selected" : ""}`}
                onClick={() => setSelectedEventId(eventId)}
              >
                <span>{index + 1}</span>
                <strong>{eventCard.text}</strong>
                {eventResult ? <em>{eventResult.orderCorrect ? "顺序正确" : "顺序需调整"}</em> : null}
              </button>
            );
          })}
        </div>
        <div className="action-row">
          <button
            disabled={!selectedEventId}
            onClick={() =>
              selectedEventId &&
              setState((current) => ({ ...current, orderedEventIds: moveEvent(current.orderedEventIds, selectedEventId, "up") }))
            }
          >
            上移
          </button>
          <button
            disabled={!selectedEventId}
            onClick={() =>
              selectedEventId &&
              setState((current) => ({ ...current, orderedEventIds: moveEvent(current.orderedEventIds, selectedEventId, "down") }))
            }
          >
            下移
          </button>
          <button className="primary-button" onClick={check}>
            校验时间线
          </button>
          <button
            onClick={() => {
              const solved = getSolvedTimelineState(chapter027.minigame);
              setState(solved);
              setSelectedEventId(solved.orderedEventIds[0] ?? null);
              setResult(null);
            }}
          >
            加载演示答案
          </button>
          {result?.complete ? (
            <Link href="/chapter/027/reward" className="primary-button gate-link">
              查看奖励
            </Link>
          ) : null}
        </div>
        {result ? <p>{result.message}</p> : null}
        <p className="small-text">评委可加载演示答案，再点“校验时间线”快速查看奖励闭环。</p>
      </section>

      <aside className="surface evidence-panel">
        <h2>证据卡</h2>
        <p className="small-text">为选中的事件选择一张原文线索卡。</p>
        {selectedEventId ? (
          <div className="evidence-list">
            {chapter027.minigame.evidenceCards.map((evidence) => (
              <button
                key={evidence.id}
                className={state.evidenceByEventId[selectedEventId] === evidence.id ? "evidence-selected" : ""}
                onClick={() => selectEvidence(selectedEventId, evidence.id)}
              >
                {evidence.text}
              </button>
            ))}
          </div>
        ) : (
          <p>先选择一个事件。</p>
        )}
      </aside>
    </div>
  );
}
