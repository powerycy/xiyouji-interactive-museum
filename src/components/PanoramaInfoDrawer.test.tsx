import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PanoramaCulturalContent } from "@/content/panoramaTour";
import { PanoramaInfoDrawer } from "./PanoramaInfoDrawer";

const content: PanoramaCulturalContent = {
  id: "content-baihuling-landscape",
  labelId: "label-027-baihuling",
  title: {
    zhHant: "白虎嶺：險山生怪",
    zhHans: "白虎岭：险山生怪",
    en: "Baihuling: danger in the ridge"
  },
  originalTraditional: "峰巖重疊，澗壑彎環。",
  explanationZhHans: "白虎岭不是普通山路，而是妖怪容易潜伏的荒山险境。",
  guideEn: "Baihuling is presented as a hazardous ridge where danger can remain hidden.",
  source: {
    chapterNumber: 27,
    chapterTitle: "尸魔三戏唐三藏　圣僧恨逐美猴王",
    rawLineStart: 6997,
    rawLineEnd: 6998
  }
};

describe("PanoramaInfoDrawer", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("switches among simplified explanation, traditional original and English guide", async () => {
    const user = userEvent.setup();
    render(
      <PanoramaInfoDrawer
        content={content}
        initialLanguage="zh-Hans"
        placement="right"
        onClose={() => undefined}
      />
    );

    expect(screen.getByText(content.explanationZhHans)).toBeInTheDocument();
    expect(screen.getByTestId("panorama-info-drawer")).toHaveAttribute("data-placement", "right");

    await user.click(screen.getByRole("tab", { name: "原文" }));
    expect(screen.getByText(content.originalTraditional)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "English" }));
    expect(screen.getByText(content.guideEn)).toBeInTheDocument();
  });

  it("closes on Escape and restores focus to the hotspot trigger", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const hotspotRef = createRef<HTMLButtonElement>();

    render(
      <>
        <button ref={hotspotRef}>测试热点</button>
        <PanoramaInfoDrawer
          content={content}
          initialLanguage="zh-Hans"
          placement="left"
          onClose={onClose}
          returnFocusRef={hotspotRef}
        />
      </>
    );

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledOnce();
    expect(hotspotRef.current).toHaveFocus();
  });

  it("asks Gemini to interpret the current panorama and source evidence", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        answer: "白虎岭的层叠峰岩把危险变成可感知的空间压迫。",
        visualObservation: "山路被岩壁夹住，视线难以展开。",
        culturalContext: "古典小说常用险山作为人物判断受到考验的门槛。",
        evidenceQuote: "峰巖重疊，澗壑彎環。",
        confidenceNote: "解读仅依据当前画面与所附原文。",
        model: "gemini-3.5-flash-001",
        source: { chapterNumber: 27, rawLineStart: 6997, rawLineEnd: 6998 },
        usage: { promptTokens: 412, outputTokens: 96 }
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <PanoramaInfoDrawer
        content={content}
        initialLanguage="zh-Hans"
        placement="right"
        onClose={() => undefined}
      />
    );

    await user.type(screen.getByLabelText("向 Gemini 提问"), "为什么这里显得危险？");
    await user.click(screen.getByRole("button", { name: "让 Gemini 结合画面解读" }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/gemini-guide",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          contentId: content.id,
          language: "zh-Hans",
          question: "为什么这里显得危险？"
        })
      })
    );
    expect(await screen.findByText("白虎岭的层叠峰岩把危险变成可感知的空间压迫。")).toBeInTheDocument();
    expect(screen.getByText(/Gemini 3.5 Flash/)).toBeInTheDocument();
    expect(screen.getAllByText(/原文行 6997–6998/)).toHaveLength(2);
  });
});
