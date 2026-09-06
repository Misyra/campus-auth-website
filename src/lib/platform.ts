export type DetectedPlatform =
  | "windows-x64"
  | "windows-arm64"
  | "macos-arm64"
  | "macos-x64"
  | "linux-x64"
  | "unknown";

export type ReleaseTarget = "x86_64-pc-windows-msvc" | "aarch64-pc-windows-msvc" | "aarch64-apple-darwin" | "x86_64-apple-darwin" | "x86_64-unknown-linux-gnu";

export const PLATFORM_TO_TARGET: Record<Exclude<DetectedPlatform, "unknown">, ReleaseTarget> = {
  "windows-x64": "x86_64-pc-windows-msvc",
  "windows-arm64": "aarch64-pc-windows-msvc",
  "macos-arm64": "aarch64-apple-darwin",
  "macos-x64": "x86_64-apple-darwin",
  "linux-x64": "x86_64-unknown-linux-gnu",
};

export const PLATFORM_LABEL: Record<Exclude<DetectedPlatform, "unknown">, string> = {
  "windows-x64": "Windows x64",
  "windows-arm64": "Windows arm64",
  "macos-arm64": "macOS Apple Silicon",
  "macos-x64": "macOS Intel",
  "linux-x64": "Linux x64",
};

export const TARGET_ARCHIVE: Record<ReleaseTarget, "zip" | "tar.gz"> = {
  "x86_64-pc-windows-msvc": "zip",
  "aarch64-pc-windows-msvc": "zip",
  "aarch64-apple-darwin": "tar.gz",
  "x86_64-apple-darwin": "tar.gz",
  "x86_64-unknown-linux-gnu": "tar.gz",
};

export function detectPlatform(): DetectedPlatform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  // userAgentData is newer, prefer it if available
  const uaDataPlatform = (navigator as unknown as { userAgentData?: { platform?: string; architecture?: string } }).userAgentData?.platform?.toLowerCase() ?? "";
  const uaDataArch = (navigator as unknown as { userAgentData?: { platform?: string; architecture?: string } }).userAgentData?.architecture?.toLowerCase() ?? "";
  const platform = (uaDataPlatform || navigator.platform || "").toLowerCase();

  const isMac = /mac/.test(platform) || /mac/.test(ua);
  const isWin = /win/.test(platform) || /windows/.test(ua) || /win/.test(ua);
  const isLinux = /linux/.test(platform) || /linux/.test(ua);

  const isArm = /arm|aarch64/.test(ua) || /arm/.test(platform) || uaDataArch === "arm";

  if (isWin) return isArm ? "windows-arm64" : "windows-x64";
  if (isMac) {
    const isIntelMac = /intel/.test(ua);
    // modern macOS often hides arch; default to Apple Silicon if not Intel
    return isIntelMac ? "macos-x64" : "macos-arm64";
  }
  if (isLinux) return "linux-x64";
  return "unknown";
}

export function assetNameForTarget(tag: string, target: ReleaseTarget): string {
  const v = tag.startsWith("v") ? tag : `v${tag}`;
  const ext = TARGET_ARCHIVE[target];
  return `campus-auth-${v}-${target}.${ext}`;
}

export function latestDownloadUrl(assetName: string): string {
  return `https://github.com/Misyra/Campus-Auth-rs/releases/latest/download/${assetName}`;
}

export function taggedDownloadUrl(tag: string, assetName: string): string {
  const v = tag.startsWith("v") ? tag : `v${tag}`;
  return `https://github.com/Misyra/Campus-Auth-rs/releases/download/${v}/${assetName}`;
}
