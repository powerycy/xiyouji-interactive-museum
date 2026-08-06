import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createEmptyProgress } from "@/progress/progress";

vi.mock("@/progress/useProgress", () => ({
  useProgress: () => ({ progress: createEmptyProgress() })
}));

import { MapView } from "./MapView";

describe("MapView immersive journey map", () => {
  it("keeps the depth map full-screen and lets the journey window expand and collapse", async () => {
    const user = userEvent.setup();
    render(<MapView />);

    expect(screen.getByTestId("immersive-journey-map")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "取经大地图" })).toBeInTheDocument();
    expect(screen.queryByTitle("取经大地图空间景深")).not.toBeInTheDocument();
    expect(screen.getByTestId("immersive-journey-map")).toHaveAttribute(
      "data-depth-provenance",
      "depth-anything-v2-small"
    );
    expect(screen.queryByRole("complementary", { name: "取经纪程" })).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "白虎岭" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "进入白虎岭" })).toHaveAttribute("href", "/chapter/027");

    await user.click(screen.getByRole("button", { name: "展开取经纪程" }));

    expect(screen.getByRole("complementary", { name: "取经纪程" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "进入白虎岭" })).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "收起取经纪程" }));
    expect(screen.queryByRole("complementary", { name: "取经纪程" })).not.toBeInTheDocument();
  });

  it("opens a floating detail when a map node is selected", async () => {
    const user = userEvent.setup();
    render(<MapView />);

    await user.click(screen.getByRole("button", { name: "查看五庄观节点" }));

    expect(screen.getByRole("dialog", { name: "五庄观" })).toBeInTheDocument();
    expect(screen.getByText(/前序章节节点/)).toBeInTheDocument();
  });
});
