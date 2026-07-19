import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");

describe("panorama hotspot visual contract", () => {
  it("uses translucent white centers instead of solid green or red centers", () => {
    const infoCore =
      css.match(/\.panorama-hotspot-core,\s*\.panorama-scene-link-core\s*\{(?<rule>[\s\S]*?)\}/)?.groups
        ?.rule ?? "";
    const sceneCore = css.match(/\.panorama-scene-link-core\s*\{(?<rule>[\s\S]*?)\}/)?.groups?.rule ?? "";

    expect(infoCore).toContain("background: rgba(255, 255, 255");
    expect(sceneCore).toContain("background: rgba(255, 255, 255");
    expect(infoCore).not.toMatch(/rgba\((?:57|62),\s*(?:118|124),/);
    expect(sceneCore).not.toMatch(/rgba\((?:169|180),\s*(?:78|91),/);
  });
});
