import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StudioPreview } from "./StudioPreview";

describe("StudioPreview", () => {
  it("shows the chapter 027 v2 scene chain asset readiness", () => {
    render(<StudioPreview />);

    expect(screen.getByText("v2 场景链资源")).toBeInTheDocument();
    expect(screen.getByText("已批准 10/10")).toBeInTheDocument();
    expect(screen.getByText("资源闸门已通过，当前 seed 可启用 10 节点场景链。")).toBeInTheDocument();
    expect(screen.getByText("scene-027-01-baihuling-road")).toBeInTheDocument();
    expect(screen.getAllByText("approved")).toHaveLength(10);
    expect(screen.getByText("原文证据")).toBeInTheDocument();
    expect(screen.getByText(/峰巖重疊/)).toBeInTheDocument();
  });
});
