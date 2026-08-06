import { Cache, Viewer, events as viewerEvents } from "@photo-sphere-viewer/core";
import { MarkersPlugin, events as markerEvents } from "@photo-sphere-viewer/markers-plugin";
import { VirtualTourPlugin, events as tourEvents } from "@photo-sphere-viewer/virtual-tour-plugin";
import { toPhotoSphereTourNodes, type PanoramaTour } from "@/content/panoramaTour";

export interface PanoramaRuntimeCallbacks {
  onInfoHotspotSelect: (hotspotId: string, trigger: HTMLElement | null) => void;
  onNodeChange: (nodeId: string) => void;
  onPanoramaError: () => void;
}

export interface PanoramaRuntime {
  destroy: () => void;
}

export interface ViewerSettlementTarget {
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

export const virtualTourPresentationOptions = {
  showLinkTooltip: false
} as const;

export type PanoramaRuntimeFactory = (
  container: HTMLElement,
  tour: PanoramaTour,
  callbacks: PanoramaRuntimeCallbacks
) => PanoramaRuntime | Promise<PanoramaRuntime>;

export function bindDirectHotspotActivation(
  markerRoot: Element,
  hotspotId: string,
  onActivate: (hotspotId: string, trigger: HTMLElement) => void
): () => void {
  const trigger = markerRoot.querySelector<HTMLElement>("[data-panorama-hotspot='info']");
  if (!trigger) {
    return () => undefined;
  }

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    onActivate(hotspotId, trigger);
  };
  trigger.addEventListener("click", handleClick);
  return () => trigger.removeEventListener("click", handleClick);
}

export function waitForViewerSettled(viewer: ViewerSettlementTarget): Promise<void> {
  return new Promise((resolve) => {
    const finish = () => {
      viewer.removeEventListener(viewerEvents.ReadyEvent.type, finish);
      viewer.removeEventListener(viewerEvents.PanoramaErrorEvent.type, finish);
      resolve();
    };
    viewer.addEventListener(viewerEvents.ReadyEvent.type, finish);
    viewer.addEventListener(viewerEvents.PanoramaErrorEvent.type, finish);
  });
}

function loadImageAsBlob(src: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) {
        reject(new Error(`Unable to prepare panorama ${src}: Canvas 2D is unavailable.`));
        return;
      }
      context.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error(`Unable to prepare panorama ${src}: Blob encoding failed.`));
        }
      }, "image/png");
    };
    image.onerror = () => reject(new Error(`Unable to load panorama image ${src}.`));
    image.src = src;
  });
}

export async function primePanoramaBlobCache(
  tour: PanoramaTour,
  dependencies: {
    loadBlob?: (src: string) => Promise<Blob>;
    addToCache?: (url: string, key: string, blob: Blob) => void;
    getFromCache?: (url: string, key: string) => HTMLImageElement | Blob | undefined;
  } = {}
): Promise<void> {
  const loadBlob = dependencies.loadBlob ?? loadImageAsBlob;
  const addToCache = dependencies.addToCache ?? ((url, key, blob) => Cache.add(url, key, blob));
  const getFromCache = dependencies.getFromCache ?? ((url, key) => Cache.get(url, key));

  await Promise.all(
    tour.nodes.map(async (node) => {
      if (getFromCache(node.panorama.src, node.panorama.src)) {
        return;
      }
      const blob = await loadBlob(node.panorama.src);
      addToCache(node.panorama.src, node.panorama.src, blob);
    })
  );
}

export const createPhotoSphereRuntime: PanoramaRuntimeFactory = async (container, tour, callbacks) => {
  await primePanoramaBlobCache(tour);
  const startNode = tour.nodes.find((node) => node.id === tour.startNodeId) ?? tour.nodes[0];
  const nodes = toPhotoSphereTourNodes(tour);

  const viewer = new Viewer({
    container,
    defaultYaw: startNode.initialView.yaw,
    defaultPitch: startNode.initialView.pitch,
    defaultZoomLvl: startNode.initialView.zoom,
    canvasBackground: "#eee1c8",
    loadingTxt: "正在展开白虎岭……",
    navbar: ["zoom", "move", "fullscreen"],
    keyboard: "always",
    mousewheel: true,
    touchmoveTwoFingers: false,
    defaultTransition: {
      effect: "fade",
      speed: 650,
      rotation: true
    },
    plugins: [
      [MarkersPlugin, {}],
      [
        VirtualTourPlugin,
        {
          dataMode: "client",
          positionMode: "manual",
          renderMode: "2d",
          nodes,
          startNodeId: tour.startNodeId,
          preload: false,
          ...virtualTourPresentationOptions,
          transitionOptions: {
            showLoader: true,
            effect: "none",
            speed: 650,
            rotation: false
          },
          arrowStyle: {
            className: "panorama-scene-link",
            size: { width: 58, height: 58 },
            element: (link: { data?: { label?: { zhHans?: string } } }) => {
              const button = document.createElement("button");
              button.type = "button";
              button.className = "panorama-scene-link-button";
              button.setAttribute("aria-label", link.data?.label?.zhHans ?? "进入下一场景");
              button.innerHTML = '<span class="panorama-scene-link-core" aria-hidden="true"></span>';
              return button;
            }
          }
        }
      ]
    ]
  });
  const viewerSettled = waitForViewerSettled(viewer as unknown as ViewerSettlementTarget);

  const markers = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
  const virtualTour = viewer.getPlugin<VirtualTourPlugin>(VirtualTourPlugin);
  let directActivationCleanups: Array<() => void> = [];

  const bindDirectActivations = (markerList: ReturnType<MarkersPlugin["getMarkers"]>) => {
    directActivationCleanups.forEach((cleanup) => cleanup());
    directActivationCleanups = markerList
      .filter((marker) => marker.data?.kind === "info")
      .map((marker) =>
        bindDirectHotspotActivation(marker.domElement, marker.id, (hotspotId, trigger) => {
          callbacks.onInfoHotspotSelect(hotspotId, trigger);
        })
      );
  };

  const handleMarkerSelect = (event: InstanceType<typeof markerEvents.SelectMarkerEvent>) => {
    if (event.marker.data?.kind !== "info") {
      return;
    }
    const trigger = event.marker.domElement.querySelector<HTMLElement>("button") ?? event.marker.domElement;
    callbacks.onInfoHotspotSelect(event.marker.id, trigger instanceof HTMLElement ? trigger : null);
  };
  const handleNodeChange = (event: InstanceType<typeof tourEvents.NodeChangedEvent>) => {
    callbacks.onNodeChange(event.node.id);
  };
  const handleMarkersSet = (event: InstanceType<typeof markerEvents.SetMarkersEvent>) => {
    bindDirectActivations(event.markers);
  };

  markers.addEventListener(markerEvents.SelectMarkerEvent.type, handleMarkerSelect);
  markers.addEventListener(markerEvents.SetMarkersEvent.type, handleMarkersSet);
  virtualTour.addEventListener(tourEvents.NodeChangedEvent.type, handleNodeChange);
  viewer.addEventListener(viewerEvents.PanoramaErrorEvent.type, callbacks.onPanoramaError);
  queueMicrotask(() => bindDirectActivations(markers.getMarkers()));
  await viewerSettled;

  return {
    destroy() {
      markers.removeEventListener(markerEvents.SelectMarkerEvent.type, handleMarkerSelect);
      markers.removeEventListener(markerEvents.SetMarkersEvent.type, handleMarkersSet);
      virtualTour.removeEventListener(tourEvents.NodeChangedEvent.type, handleNodeChange);
      viewer.removeEventListener(viewerEvents.PanoramaErrorEvent.type, callbacks.onPanoramaError);
      directActivationCleanups.forEach((cleanup) => cleanup());
      viewer.destroy();
    }
  };
};
