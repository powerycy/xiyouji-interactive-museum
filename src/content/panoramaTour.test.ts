import { describe, expect, it } from "vitest";
import {
  baihulingPanoramaTour,
  toPhotoSphereTourNodes,
  validatePanoramaTour,
  type PanoramaTour
} from "./panoramaTour";

describe("baihuling panorama tour data", () => {
  it("ships a valid four-node White Bone Demon route with scene and information hotspots", () => {
    expect(validatePanoramaTour(baihulingPanoramaTour)).toEqual([]);

    const entry = baihulingPanoramaTour.nodes.find((node) => node.id === baihulingPanoramaTour.startNodeId);
    expect(baihulingPanoramaTour.nodes).toHaveLength(4);
    expect(entry?.sceneLinks).toHaveLength(1);
    expect(entry?.infoHotspots.length).toBeGreaterThanOrEqual(1);
  });

  it("keeps traditional source text, simplified explanation and English guidance together", () => {
    const entry = baihulingPanoramaTour.nodes.find((node) => node.id === baihulingPanoramaTour.startNodeId);
    const content = baihulingPanoramaTour.content[entry?.infoHotspots[0]?.contentId ?? ""];

    expect(content.originalTraditional).toMatch(/峰巖重疊/);
    expect(content.explanationZhHans).toMatch(/白虎岭/);
    expect(content.guideEn).toMatch(/Baihuling/i);
    expect(content.source.rawLineStart).toBe(6997);
  });

  it("covers both curated evidence labels assigned to the current Baihuling road scene", () => {
    const entry = baihulingPanoramaTour.nodes.find((node) => node.id === baihulingPanoramaTour.startNodeId);
    const content = (entry?.infoHotspots ?? []).map((hotspot) => baihulingPanoramaTour.content[hotspot.contentId]);

    expect(content.map((item) => item.labelId).sort()).toEqual(["label-027-baihuling", "label-027-hunger"]);
    for (const item of content) {
      expect(item.originalTraditional.length).toBeGreaterThan(20);
      expect(item.explanationZhHans.length).toBeGreaterThan(20);
      expect(item.guideEn.length).toBeGreaterThan(20);
      expect(item.source.rawLineEnd).toBeGreaterThanOrEqual(item.source.rawLineStart);
    }
  });

  it("makes every curated chapter label reachable from the panorama route with three language layers", () => {
    const content = baihulingPanoramaTour.nodes
      .flatMap((node) => node.infoHotspots)
      .map((hotspot) => baihulingPanoramaTour.content[hotspot.contentId]);

    expect(new Set(content.map((item) => item.labelId)).size).toBe(11);
    expect(content).toHaveLength(11);
    for (const item of content) {
      expect(item.originalTraditional.length).toBeGreaterThan(20);
      expect(item.explanationZhHans.length).toBeGreaterThan(20);
      expect(item.guideEn.length).toBeGreaterThan(20);
    }
  });

  it("reports a scene link that targets a missing panorama node", () => {
    const invalidTour: PanoramaTour = {
      ...baihulingPanoramaTour,
      nodes: baihulingPanoramaTour.nodes.map((node, index) =>
        index === 0
          ? {
              ...node,
              sceneLinks: [{ ...node.sceneLinks[0], targetNodeId: "missing-node" }]
            }
          : node
      )
    };

    expect(validatePanoramaTour(invalidTour)).toContain(
      "Scene link baihuling-road-to-next targets missing node missing-node."
    );
  });

  it("maps scene links to Virtual Tour and information hotspots to Markers", () => {
    const nodes = toPhotoSphereTourNodes(baihulingPanoramaTour);
    const entry = nodes.find((node) => node.id === baihulingPanoramaTour.startNodeId);

    expect(entry?.links?.[0]).toMatchObject({ nodeId: "baihuling-first-disguise" });
    expect(entry?.markers?.[0]).toMatchObject({
      id: "baihuling-road-landscape",
      data: { kind: "info", contentId: "content-baihuling-landscape" }
    });
    expect(entry?.markers?.[0]?.html).toContain("panorama-hotspot-core");
    expect(entry?.markers?.[0]?.html).not.toContain("阅");
    expect(entry?.markers?.[0]?.tooltip).toBeUndefined();
  });
});
