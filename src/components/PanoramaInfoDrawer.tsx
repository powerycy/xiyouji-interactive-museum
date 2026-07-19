"use client";

import { useEffect, useId, useState, type RefObject } from "react";
import type { PanoramaCulturalContent, PanoramaLanguage } from "@/content/panoramaTour";

type DrawerSection = "original" | "explanation" | "english";
export type PanoramaOverlayPlacement = "left" | "right";

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

  useEffect(() => {
    setSection(sectionForLanguage[initialLanguage]);
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
