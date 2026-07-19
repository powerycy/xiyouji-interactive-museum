import manifestJson from "../../content/chapters/027/scene-assets.v2.manifest.json";
import type { Chapter027V2AssetManifest } from "./types";

export const requiredChapter027V2SceneIds = [
  "scene-027-01-baihuling-road",
  "scene-027-02-demon-motive",
  "scene-027-03-first-disguise",
  "scene-027-04-wukong-returns",
  "scene-027-05-bajie-instigation",
  "scene-027-06-second-disguise",
  "scene-027-07-third-disguise",
  "scene-027-08-skeleton-reveal",
  "scene-027-09-banish-wukong",
  "scene-027-10-chapter-review"
] as const;

const runtimeScenePrefix = "/assets/chapters/027/scenes/v2";

export const chapter027V2AssetManifest = manifestJson as Chapter027V2AssetManifest;

export function getExpectedChapter027V2RuntimeSrc(fileName: string): string {
  return `${runtimeScenePrefix}/${fileName}`;
}

export function getChapter027V2AssetReadiness(manifest: Chapter027V2AssetManifest) {
  const sceneIds = manifest.scenes.map((scene) => scene.sceneId);
  const runtimeSrcs = manifest.scenes.map((scene) => scene.runtimeSrc).filter((src): src is string => Boolean(src));
  const hasRequiredOrder =
    manifest.scenes.length === requiredChapter027V2SceneIds.length &&
    requiredChapter027V2SceneIds.every((sceneId, index) => sceneIds[index] === sceneId);
  const hasUniqueRuntimeSrcs = new Set(runtimeSrcs).size === runtimeSrcs.length;
  const invalidRuntimeScenes = manifest.scenes.filter((scene) => {
    if (!scene.runtimeSrc) {
      return false;
    }
    return scene.runtimeSrc !== getExpectedChapter027V2RuntimeSrc(scene.fileName);
  });
  const rejectedRuntimeScenes = manifest.scenes.filter((scene) => scene.runtimeSrc?.includes("rejected"));
  const approvedScenes = manifest.scenes.filter(
    (scene) => scene.status === "approved" && scene.runtimeSrc === getExpectedChapter027V2RuntimeSrc(scene.fileName)
  );
  const missingScenes = manifest.scenes.filter((scene) => scene.status === "missing");
  const rejectedScenes = manifest.scenes.filter((scene) => scene.status === "rejected");
  const pendingScenes = manifest.scenes.filter((scene) => scene.status === "qa-pending");

  return {
    totalCount: manifest.scenes.length,
    approvedCount: approvedScenes.length,
    missingCount: missingScenes.length,
    rejectedCount: rejectedScenes.length,
    pendingCount: pendingScenes.length,
    approvedScenes,
    missingScenes,
    rejectedScenes,
    pendingScenes,
    invalidRuntimeScenes,
    rejectedRuntimeScenes,
    hasRequiredOrder,
    hasUniqueRuntimeSrcs,
    readyToEnableSceneNodes:
      hasRequiredOrder &&
      hasUniqueRuntimeSrcs &&
      invalidRuntimeScenes.length === 0 &&
      rejectedRuntimeScenes.length === 0 &&
      approvedScenes.length === requiredChapter027V2SceneIds.length
  };
}
