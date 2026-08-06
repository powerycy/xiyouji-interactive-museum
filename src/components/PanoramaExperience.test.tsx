import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { PanoramaRuntimeCallbacks, PanoramaRuntimeFactory } from "./photoSphereRuntime";
import { PanoramaExperience } from "./PanoramaExperience";

function createRuntimeHarness() {
  let callbacks: PanoramaRuntimeCallbacks | null = null;
  const destroy = vi.fn();
  const factory: PanoramaRuntimeFactory = (_container, _tour, nextCallbacks) => {
    callbacks = nextCallbacks;
    return { destroy };
  };

  return {
    factory,
    destroy,
    callbacks: () => {
      if (!callbacks) {
        throw new Error("Panorama runtime was not created.");
      }
      return callbacks;
    }
  };
}

describe("PanoramaExperience", () => {
  it("presents the completed White Bone Demon route instead of a sample label", () => {
    const harness = createRuntimeHarness();
    render(<PanoramaExperience runtimeFactory={harness.factory} />);

    expect(screen.getByRole("heading", { name: "白虎岭 · 白骨夫人" })).toBeInTheDocument();
    expect(screen.queryByText(/全景样板/)).not.toBeInTheDocument();
  });

  it("keeps a compact chapter-progress path to the evidence game", () => {
    const harness = createRuntimeHarness();
    render(
      <PanoramaExperience
        runtimeFactory={harness.factory}
        progressSummary={{ explorationPercent: 100, requiredReadCount: 9, requiredTotal: 9, gameUnlocked: true }}
      />
    );

    expect(screen.getByText("原著线索 9/9")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "进入真相时间线" })).toHaveAttribute("href", "/chapter/027/game");
  });

  it("opens custom trilingual content from an information hotspot", () => {
    const harness = createRuntimeHarness();
    const markLabelRead = vi.fn();
    const trigger = document.createElement("button");
    trigger.textContent = "白虎岭险路";
    document.body.append(trigger);

    render(<PanoramaExperience runtimeFactory={harness.factory} onMarkLabelRead={markLabelRead} />);

    act(() => {
      harness.callbacks().onInfoHotspotSelect("baihuling-road-landscape", trigger);
    });

    expect(screen.getByTestId("panorama-info-drawer")).toBeInTheDocument();
    expect(screen.getByText(/这一段先把白虎岭写成险恶之地/)).toBeInTheDocument();
    expect(markLabelRead).toHaveBeenCalledWith("label-027-baihuling");

    trigger.remove();
  });

  it("places the floating label opposite the hotspot so the scene remains visible", () => {
    const harness = createRuntimeHarness();
    const trigger = document.createElement("button");
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue({
      x: 820,
      y: 300,
      left: 820,
      top: 300,
      right: 872,
      bottom: 352,
      width: 52,
      height: 52,
      toJSON: () => ({})
    });

    render(<PanoramaExperience runtimeFactory={harness.factory} />);

    act(() => {
      harness.callbacks().onInfoHotspotSelect("baihuling-road-landscape", trigger);
    });

    expect(screen.getByTestId("panorama-info-drawer")).toHaveAttribute("data-placement", "left");
  });

  it("offers a panorama retry without exposing the legacy image chain after a runtime error", async () => {
    const user = userEvent.setup();
    const harness = createRuntimeHarness();

    render(<PanoramaExperience runtimeFactory={harness.factory} />);
    expect(screen.queryByText("图像场景链")).not.toBeInTheDocument();

    act(() => {
      harness.callbacks().onPanoramaError();
    });

    expect(screen.getByRole("img", { name: "白虎岭山路静态回退图" })).toBeInTheDocument();
    expect(screen.queryByText("图像场景链")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "重新载入全景" }));
    expect(screen.getByTestId("panorama-viewer")).toBeInTheDocument();
  });

  it("announces the final chapter scene without a placeholder state", async () => {
    const harness = createRuntimeHarness();
    render(<PanoramaExperience runtimeFactory={harness.factory} />);

    act(() => {
      harness.callbacks().onNodeChange("baihuling-reveal-banishment");
    });

    await waitFor(() => expect(screen.getByText("当前场景：本相与贬书")).toBeInTheDocument());
    expect(screen.queryByText("样板终点 · 下一场景制作中")).not.toBeInTheDocument();
  });

  it("restarts the WebGL runtime at the selected node after a scene-link transition", async () => {
    let callbacks: PanoramaRuntimeCallbacks | null = null;
    const starts: string[] = [];
    const destroy = vi.fn();
    const factory: PanoramaRuntimeFactory = (_container, tour, nextCallbacks) => {
      starts.push(tour.startNodeId);
      callbacks = nextCallbacks;
      return { destroy };
    };

    render(<PanoramaExperience runtimeFactory={factory} />);

    act(() => {
      callbacks?.onNodeChange("baihuling-first-disguise");
    });

    expect(destroy).not.toHaveBeenCalled();
    await waitFor(() => expect(starts).toEqual(["baihuling-road", "baihuling-first-disguise"]));
    expect(destroy).toHaveBeenCalledOnce();
  });
});
