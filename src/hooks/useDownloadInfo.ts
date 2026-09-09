import { useEffect, useMemo, useState } from "react";
import { detectPlatform, type DetectedPlatform, latestDownloadUrl, PLATFORM_LABEL, PLATFORM_TO_TARGET, assetNameForTarget, type ReleaseTarget } from "@/lib/platform";
import { useLatestRelease } from "@/hooks/useLatestRelease";

export type PlatformDownload = {
  platform: DetectedPlatform;
  label: string;
  target: ReleaseTarget;
  asset: string;
  href: string;
};

const ALL_PLATFORMS: Exclude<DetectedPlatform, "unknown">[] = [
  "windows-x64",
  "windows-arm64",
  "macos-arm64",
  "macos-x64",
  "linux-x64",
];

function buildDownload(platform: Exclude<DetectedPlatform, "unknown">, tag: string): PlatformDownload {
  const target = PLATFORM_TO_TARGET[platform];
  const asset = assetNameForTarget(tag, target);
  return { platform, label: PLATFORM_LABEL[platform], target, asset, href: latestDownloadUrl(asset) };
}

/**
 * 封装下载页通用逻辑：平台检测 + release tag + 主推荐下载 + 全平台列表。
 * SmartDownloadHero（首页紧凑版）与 SmartDownloadFull（下载页完整版）共享。
 */
export function useDownloadInfo() {
  const { tag } = useLatestRelease();
  const [platform, setPlatform] = useState<DetectedPlatform>("unknown");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const primary = useMemo<PlatformDownload | null>(() => {
    if (platform === "unknown") return null;
    return buildDownload(platform, tag);
  }, [platform, tag]);

  const all = useMemo<PlatformDownload[]>(() => ALL_PLATFORMS.map((p) => buildDownload(p, tag)), [tag]);

  return { tag, platform, primary, all };
}
