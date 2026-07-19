import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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
});
