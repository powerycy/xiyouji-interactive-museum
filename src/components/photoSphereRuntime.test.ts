import { describe, expect, it, vi } from "vitest";
import { baihulingPanoramaTour } from "@/content/panoramaTour";
import {
  bindDirectHotspotActivation,
  primePanoramaBlobCache,
  virtualTourPresentationOptions,
  waitForViewerSettled
} from "./photoSphereRuntime";

describe("virtualTourPresentationOptions", () => {
  it("never renders a persistent hover tooltip for a scene entrance", () => {
    expect(virtualTourPresentationOptions).toEqual({ showLinkTooltip: false });
  });
});

describe("primePanoramaBlobCache", () => {
  it("loads and caches every panorama before the viewer starts", async () => {
    const blobs = new Map(
      baihulingPanoramaTour.nodes.map((node) => [node.panorama.src, new Blob([node.id], { type: "image/png" })])
    );
    const loadBlob = vi.fn(async (src: string) => blobs.get(src) as Blob);
    const addToCache = vi.fn();

    await primePanoramaBlobCache(baihulingPanoramaTour, { loadBlob, addToCache });

    expect(loadBlob).toHaveBeenCalledTimes(baihulingPanoramaTour.nodes.length);
    for (const node of baihulingPanoramaTour.nodes) {
      expect(addToCache).toHaveBeenCalledWith(node.panorama.src, node.panorama.src, blobs.get(node.panorama.src));
    }
  });

  it("does not decode panoramas that are already in the Photo Sphere cache", async () => {
    const cachedSrc = baihulingPanoramaTour.nodes[0].panorama.src;
    const loadBlob = vi.fn(async (src: string) => new Blob([src], { type: "image/png" }));
    const addToCache = vi.fn();

    await primePanoramaBlobCache(baihulingPanoramaTour, {
      loadBlob,
      addToCache,
      getFromCache: (url) => (url === cachedSrc ? new Blob(["cached"]) : undefined)
    });

    expect(loadBlob).not.toHaveBeenCalledWith(cachedSrc);
    expect(loadBlob).toHaveBeenCalledTimes(baihulingPanoramaTour.nodes.length - 1);
  });
});

describe("bindDirectHotspotActivation", () => {
  it("activates the information hotspot directly and removes the listener during cleanup", () => {
    const root = document.createElement("div");
    root.innerHTML = '<button type="button" data-panorama-hotspot="info"><span></span></button>';
    const activate = vi.fn();

    const cleanup = bindDirectHotspotActivation(root, "baihuling-road-hunger", activate);
    root.querySelector("button")?.click();

    expect(activate).toHaveBeenCalledWith("baihuling-road-hunger", root.querySelector("button"));

    cleanup();
    root.querySelector("button")?.click();
    expect(activate).toHaveBeenCalledOnce();
  });
});

describe("waitForViewerSettled", () => {
  it("keeps the runtime pending until the viewer has completed its initial asynchronous setup", async () => {
    const listeners = new Map<string, Set<() => void>>();
    const viewer = {
      addEventListener: vi.fn((type: string, listener: () => void) => {
        const bucket = listeners.get(type) ?? new Set<() => void>();
        bucket.add(listener);
        listeners.set(type, bucket);
      }),
      removeEventListener: vi.fn((type: string, listener: () => void) => listeners.get(type)?.delete(listener))
    };
    let settled = false;

    const ready = waitForViewerSettled(viewer);
    void ready.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);

    listeners.get("ready")?.forEach((listener) => listener());
    await ready;
    expect(settled).toBe(true);
  });
});
