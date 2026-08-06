import { describe, expect, it } from "vitest";
import { AppFrame } from "./AppFrame";
import Chapter027GamePage from "../../app/chapter/027/game/page";
import Chapter027RewardPage from "../../app/chapter/027/reward/page";

describe("chapter 027 visual routes", () => {
  it("keeps the game and reward in the same warm museum system as the panorama", () => {
    const gamePage = Chapter027GamePage();
    const rewardPage = Chapter027RewardPage();

    expect(gamePage.type).toBe(AppFrame);
    expect(gamePage.props.variant).toBe("museum-light");
    expect(rewardPage.type).toBe(AppFrame);
    expect(rewardPage.props.variant).toBe("museum-light");
  });
});
