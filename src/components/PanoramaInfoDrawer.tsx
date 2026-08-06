"use client";

import { useEffect, useId, useState, type FormEvent, type RefObject } from "react";
import type { PanoramaCulturalContent, PanoramaLanguage } from "@/content/panoramaTour";

type DrawerSection = "original" | "explanation" | "english";
export type PanoramaOverlayPlacement = "left" | "right";

interface GeminiGuideResult {
  answer: string;
  visualObservation: string;
  culturalContext: string;
  evidenceQuote: string;
  confidenceNote: string;
  model: string;
  source: {
    chapterNumber: number;
    rawLineStart: number;
    rawLineEnd: number;
  };
  usage: {
    promptTokens: number | null;
    outputTokens: number | null;
  };
}

interface GeminiGuideError {
  error?: string;
  code?: string;
}

const sectionForLanguage: Record<PanoramaLanguage, DrawerSection> = {
  "zh-Hant": "original",
  "zh-Hans": "explanation",
  en: "english"
};

export function PanoramaInfoDrawer({
  content,
  initialLanguage,
  placement,
  onClose,
  onMarkRead,
  returnFocusRef
}: {
  content: PanoramaCulturalContent;
  initialLanguage: PanoramaLanguage;
  placement: PanoramaOverlayPlacement;
  onClose: () => void;
  onMarkRead?: (contentId: string) => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  const titleId = useId();
  const panelId = useId();
  const [section, setSection] = useState<DrawerSection>(() => sectionForLanguage[initialLanguage]);
  const [geminiQuestion, setGeminiQuestion] = useState("");
  const [geminiResult, setGeminiResult] = useState<GeminiGuideResult | null>(null);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);

  useEffect(() => {
    setSection(sectionForLanguage[initialLanguage]);
    setGeminiQuestion("");
    setGeminiResult(null);
    setGeminiError(null);
    setGeminiLoading(false);
  }, [content.id, initialLanguage]);

  useEffect(() => {
    onMarkRead?.(content.id);
  }, [content.id, onMarkRead]);

  function closeDrawer() {
    onClose();
    queueMicrotask(() => returnFocusRef?.current?.focus());
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const tabs: Array<{ id: DrawerSection; label: string }> = [
    { id: "original", label: "原文" },
    { id: "explanation", label: "简释" },
    { id: "english", label: "English" }
  ];
  const body =
    section === "original"
      ? content.originalTraditional
      : section === "explanation"
        ? content.explanationZhHans
        : content.guideEn;
  const title =
    section === "original"
      ? content.title.zhHant
      : section === "explanation"
        ? content.title.zhHans
        : content.title.en;
  const geminiLanguage: PanoramaLanguage =
    section === "original" ? "zh-Hant" : section === "english" ? "en" : "zh-Hans";

  async function requestGeminiGuide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = geminiQuestion.trim();
    if (!question || geminiLoading) {
      return;
    }
    setGeminiLoading(true);
    setGeminiError(null);
    setGeminiResult(null);
    try {
      const response = await fetch("/api/gemini-guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentId: content.id, language: geminiLanguage, question })
      });
      const payload = (await response.json()) as GeminiGuideResult | GeminiGuideError;
      if (!response.ok || !("answer" in payload)) {
        const message = "code" in payload && payload.code === "GEMINI_NOT_CONFIGURED"
          ? "AI 导览是可选功能，当前无需它也能完成全部博物馆体验。"
          : "error" in payload && payload.error
            ? payload.error
            : "AI 导览暂时无法完成解读。";
        throw new Error(message);
      }
      setGeminiResult(payload);
    } catch (error) {
      setGeminiError(error instanceof Error ? error.message : "Gemini 暂时无法完成解读。");
    } finally {
      setGeminiLoading(false);
    }
  }

  return (
    <aside
      className={`panorama-info-drawer panorama-info-drawer-${placement} psv--capture-event`}
      role="dialog"
      aria-modal={false}
      aria-labelledby={titleId}
      data-placement={placement}
      data-testid="panorama-info-drawer"
    >
      <header className="panorama-drawer-header">
        <div>
          <p className="panorama-drawer-kicker">第二七回 · 文化展签</p>
          <h2 id={titleId}>{title}</h2>
        </div>
        <button type="button" className="panorama-drawer-close" onClick={closeDrawer} aria-label="关闭文化说明">
          <span aria-hidden="true">×</span>
        </button>
      </header>

      <div className="panorama-language-tabs" role="tablist" aria-label="展签语言">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={section === tab.id}
            aria-controls={panelId}
            className={section === tab.id ? "panorama-language-tab-active" : ""}
            onClick={() => setSection(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id={panelId} className="panorama-drawer-body" role="tabpanel" tabIndex={0}>
        <p lang={section === "original" ? "zh-Hant" : section === "english" ? "en" : "zh-Hans"}>{body}</p>

        <section className="gemini-curator" aria-labelledby={`${panelId}-gemini-title`}>
          <div className="gemini-curator-heading">
            <div>
              <span>Google AI · 多模态策展</span>
              <h3 id={`${panelId}-gemini-title`}>让 Gemini 看见画面，也读懂原文</h3>
            </div>
            <b aria-label="Gemini 3.5 Flash">✦ Gemini</b>
          </div>

          <form onSubmit={requestGeminiGuide}>
            <label htmlFor={`${panelId}-gemini-question`}>向 Gemini 提问</label>
            <textarea
              id={`${panelId}-gemini-question`}
              value={geminiQuestion}
              maxLength={400}
              rows={2}
              onChange={(event) => setGeminiQuestion(event.target.value)}
              placeholder={
                section === "english"
                  ? "What should an international visitor notice here?"
                  : section === "original"
                    ? "這段原文與眼前畫面有甚麼關係？"
                    : "这段原文和眼前画面有什么关系？"
              }
            />
            <button type="submit" disabled={!geminiQuestion.trim() || geminiLoading}>
              {geminiLoading ? "Gemini 正在对照画面与原文…" : "让 Gemini 结合画面解读"}
            </button>
          </form>

          <div className="gemini-curator-status" aria-live="polite">
            {geminiError ? <p className="gemini-curator-error">{geminiError}</p> : null}
            {geminiResult ? (
              <article className="gemini-curator-result">
                <h4>Gemini 3.5 Flash · 证据约束解读</h4>
                <p>{geminiResult.answer}</p>
                <dl>
                  <div>
                    <dt>画面观察</dt>
                    <dd>{geminiResult.visualObservation}</dd>
                  </div>
                  <div>
                    <dt>文化语境</dt>
                    <dd>{geminiResult.culturalContext}</dd>
                  </div>
                  <div>
                    <dt>原文证据</dt>
                    <dd lang="zh-Hant">“{geminiResult.evidenceQuote}”</dd>
                  </div>
                </dl>
                <small>
                  {geminiResult.confidenceNote} · 第 {geminiResult.source.chapterNumber} 回原文行 {geminiResult.source.rawLineStart}–{geminiResult.source.rawLineEnd}
                </small>
              </article>
            ) : null}
          </div>
        </section>
      </div>

      <footer className="panorama-drawer-source">
        <span>原著依据</span>
        <p>
          《西游记》第二十七回 · 原文行 {content.source.rawLineStart}–{content.source.rawLineEnd}
        </p>
      </footer>
    </aside>
  );
}
