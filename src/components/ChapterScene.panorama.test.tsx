import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createEmptyProgress } from "@/progress/progress";

vi.mock("@/progress/useProgress", () => ({
  useProgress: () => ({
    progress: createEmptyProgress(),
    manager: {
      markLabelRead: vi.fn(),
      markSceneVisited: vi.fn(),
      openSceneHotspot: vi.fn(),
      navigateToScene: vi.fn(),
      goBackScene: vi.fn()
    }
  })
}));

vi.mock("./PanoramaExperience", () => ({
  PanoramaExperience: () => <section aria-label="白虎岭全景样板" />
}));

import { ChapterScene } from "./ChapterScene";

describe("ChapterScene panorama entry", () => {
  it("uses the panorama as the only chapter experience", () => {
    render(<ChapterScene />);

    expect(screen.getByRole("region", { name: "白虎岭全景样板" })).toBeInTheDocument();
    expect(screen.queryByText("图像场景链")).not.toBeInTheDocument();
  });
});
