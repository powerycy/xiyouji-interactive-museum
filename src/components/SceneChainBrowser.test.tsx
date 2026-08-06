import { useMemo, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ChapterSeedV2 } from "@/content/types";
import { chapter027 } from "@/content/xiyouji";
import { createEmptyProgress, createMemoryStorage, createProgressManager } from "@/progress/progress";
import { SceneChainBrowser } from "./SceneChainBrowser";

const fixtureChapter: ChapterSeedV2 = {
  ...chapter027,
  version: 2,
  sceneNavigation: {
    initialSceneId: "scene-027-01-baihuling-road",
    mainlineSceneIds: ["scene-027-01-baihuling-road", "scene-027-02-demon-motive"],
    gameGateSceneId: "scene-027-02-demon-motive",
    allowCycles: false
  },
  sceneNodes: [
    {
      id: "scene-027-01-baihuling-road",
      kind: "main",
      order: 1,
      title: "白虎岭山路",
      subtitle: "组件测试",
      entryCopy: "险山生怪，唐僧饥饿，悟空离队去化斋。",
      source: {
        chapterNumber: 27,
        rawLineStart: 6997,
        rawLineEnd: 7007,
        labelIds: ["label-027-baihuling"]
      },
      asset: {
        type: "image",
        src: "/assets/chapters/027/scenes/v2-test/scene-027-01.png",
        alt: "白虎岭山路主视觉"
      },
      nextSceneIds: ["scene-027-02-demon-motive"],
      hotspots: [
        {
          id: "scene-hotspot-027-01-advance",
          title: "沿白虎岭山路深入",
          kind: "advance",
          position: { x: 72, y: 49 },
          radius: 9,
          labelIds: [],
          action: {
            type: "advance-scene",
            targetSceneId: "scene-027-02-demon-motive",
            popoverTitle: "沿山路深入",
            popoverCopy: "这处画面把当前证据推向下一幅视觉场景。"
          },
          initiallyVisible: true
        }
      ],
      unlock: { type: "chapter-available" }
    },
    {
      id: "scene-027-02-demon-motive",
      kind: "main",
      order: 2,
      title: "妖怪起意",
      subtitle: "组件测试",
      entryCopy: "阴风从远处压近。",
      source: {
        chapterNumber: 27,
        rawLineStart: 7023,
        rawLineEnd: 7026,
        labelIds: ["label-027-demon-motive"]
      },
      asset: {
        type: "image",
        src: "/assets/chapters/027/scenes/v2-test/scene-027-02.png",
        alt: "妖怪起意主视觉"
      },
      previousSceneId: "scene-027-01-baihuling-road",
      nextSceneIds: [],
      hotspots: [],
      unlock: { type: "scene-visited", sceneId: "scene-027-01-baihuling-road" }
    }
  ]
};

function renderBrowser() {
  const calls: string[] = [];
  const manager = {
    markLabelRead: (_chapterId: string, labelId: string) => calls.push(`label:${labelId}`),
    markSceneVisited: (_chapterId: string, sceneId: string) => calls.push(`visit:${sceneId}`),
    openSceneHotspot: (_chapterId: string, hotspotId: string) => calls.push(`hotspot:${hotspotId}`),
    navigateToScene: (_chapterId: string, sceneId: string) => calls.push(`nav:${sceneId}`),
    goBackScene: () => null
  };

  render(<SceneChainBrowser chapter={fixtureChapter} progress={createEmptyProgress()} manager={manager} />);
  return calls;
}

function stubDecodedImage() {
  class DecodedImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src = "";

    decode() {
      return Promise.resolve();
    }
  }

  vi.stubGlobal("Image", DecodedImage);
}

function StatefulBrowser() {
  const [progressManager] = useState(() => createProgressManager(createMemoryStorage()));
  const [progress, setProgress] = useState(() => progressManager.getSnapshot());
  const manager = useMemo(() => {
    const refresh = () => setProgress(progressManager.getSnapshot());

    return {
      markLabelRead: (chapterId: string, labelId: string) => {
        progressManager.markLabelRead(chapterId, labelId);
        refresh();
      },
      markSceneVisited: (chapterId: string, sceneId: string) => {
        progressManager.markSceneVisited(chapterId, sceneId);
        refresh();
      },
      openSceneHotspot: (chapterId: string, hotspotId: string) => {
        progressManager.openSceneHotspot(chapterId, hotspotId);
        refresh();
      },
      navigateToScene: (
        chapterId: string,
        sceneId: string,
        options?: { fromSceneId?: string; pushStack?: boolean }
      ) => {
        progressManager.navigateToScene(chapterId, sceneId, options);
        refresh();
      },
      goBackScene: (chapterId: string) => {
        const targetSceneId = progressManager.goBackScene(chapterId);
        refresh();
        return targetSceneId;
      }
    };
  }, [progressManager]);

  return <SceneChainBrowser chapter={fixtureChapter} progress={progress} manager={manager} />;
}

describe("SceneChainBrowser", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("renders the initial scene as the main interaction surface", () => {
    const calls = renderBrowser();

    expect(screen.getByRole("img", { name: /白虎岭山路主视觉/ })).toBeInTheDocument();
    expect(screen.getAllByText("白虎岭山路").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText("下一场景")).toBeInTheDocument();
    expect(screen.getByLabelText("章节时间线")).toBeInTheDocument();
    expect(calls).toContain("visit:scene-027-01-baihuling-road");
  });

  it("opens a lightweight popover and ripple before advancing", async () => {
    const user = userEvent.setup();
    renderBrowser();

    await user.click(screen.getByRole("button", { name: /沿白虎岭山路深入/ }));

    expect(screen.getByText("沿山路深入")).toBeInTheDocument();
    expect(screen.getByText("进入下一场景")).toBeInTheDocument();
    expect(document.querySelector(".scene-click-ripple")).toBeInTheDocument();
  });

  it("waits for the target scene image to decode before committing navigation", async () => {
    vi.useFakeTimers();
    let resolveDecode: (() => void) | null = null;
    class PendingImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      src = "";

      decode() {
        return new Promise<void>((resolve) => {
          resolveDecode = resolve;
        });
      }
    }
    vi.stubGlobal("Image", PendingImage);
    const calls = renderBrowser();

    fireEvent.click(screen.getByLabelText("下一场景"));

    expect(calls).not.toContain("nav:scene-027-02-demon-motive");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(calls).not.toContain("nav:scene-027-02-demon-motive");

    await act(async () => {
      resolveDecode?.();
    });

    expect(calls).toContain("nav:scene-027-02-demon-motive");
  });

  it("syncs the museum label to the newly revealed scene source", async () => {
    stubDecodedImage();
    render(<StatefulBrowser />);

    expect(screen.getByRole("heading", { name: "白虎岭：险山生怪" })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("下一场景"));

    expect(await screen.findByRole("img", { name: "妖怪起意主视觉" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "妖怪为何盯上唐僧" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "白虎岭：险山生怪" })).not.toBeInTheDocument();
  });

  it("uses reverse motion when returning along the scene stack", async () => {
    stubDecodedImage();
    const user = userEvent.setup();
    render(<StatefulBrowser />);

    await user.click(screen.getByRole("button", { name: /沿白虎岭山路深入/ }));
    await user.click(screen.getByRole("button", { name: "进入下一场景" }));

    expect(await screen.findByRole("img", { name: "妖怪起意主视觉" })).toBeInTheDocument();

    await user.click(screen.getByLabelText("返回上一层"));

    expect(await screen.findByRole("img", { name: "白虎岭山路主视觉" })).toBeInTheDocument();
    expect(document.querySelector(".scene-transition-backward")).toBeInTheDocument();
  });

  it("lets the time scrubber jump back to a visited scene", async () => {
    stubDecodedImage();
    const user = userEvent.setup();
    render(<StatefulBrowser />);

    await user.click(screen.getByLabelText("下一场景"));

    expect(await screen.findByRole("img", { name: "妖怪起意主视觉" })).toBeInTheDocument();

    await user.click(screen.getByLabelText("跳转到白虎岭山路"));

    expect(await screen.findByRole("img", { name: "白虎岭山路主视觉" })).toBeInTheDocument();
    expect(document.querySelector(".scene-transition-jump")).toBeInTheDocument();
  });
});
