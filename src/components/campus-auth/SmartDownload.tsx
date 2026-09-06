import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Monitor, Apple, Boxes, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectPlatform, type DetectedPlatform, latestDownloadUrl, PLATFORM_LABEL, PLATFORM_TO_TARGET, assetNameForTarget } from "@/lib/platform";
import { useLatestRelease } from "@/hooks/useLatestRelease";
import { SITE } from "@/data/site";

const iconFor = (p: DetectedPlatform) => {
  if (p.startsWith("windows")) return Monitor;
  if (p.startsWith("macos")) return Apple;
  if (p.startsWith("linux")) return Boxes;
  return Download;
};

const ALL_PLATFORMS: Exclude<DetectedPlatform, "unknown">[] = ["windows-x64", "windows-arm64", "macos-arm64", "macos-x64", "linux-x64"];

export function SmartDownload({ compact = false }: { compact?: boolean }) {
  if (compact) return <SmartDownloadHero />;
  return <SmartDownloadFull />;
}

function SmartDownloadHero() {
  const { tag } = useLatestRelease();
  const [platform, setPlatform] = useState<DetectedPlatform>("unknown");
  useEffect(() => setPlatform(detectPlatform()), []);
  const primary = useMemo(() => {
    if (platform === "unknown") return null;
    const target = PLATFORM_TO_TARGET[platform];
    const asset = assetNameForTarget(tag, target);
    return { platform, label: PLATFORM_LABEL[platform], href: latestDownloadUrl(asset) };
  }, [platform, tag]);
  const PrimaryIcon = iconFor(primary?.platform ?? "unknown");

  if (!primary) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <a href={`${SITE.releaseBase}/latest`} target="_blank" rel="noreferrer">
          <Button variant="hero" className="h-11 px-7">免费下载</Button>
        </a>
        <a href="#download" className="inline-flex h-11 items-center gap-1.5 rounded-xl border bg-card px-5 text-sm font-medium hover:bg-accent">
          其他平台 <ChevronDown className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={primary.href} rel="noreferrer" className="group relative rounded-xl p-[2px]">
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-cyan-400 opacity-90 transition group-hover:opacity-100" />
        <span className="relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-[10px] bg-card px-5 py-[9px] text-sm font-semibold">
          <PrimaryIcon className="h-4 w-4 shrink-0" />
          {primary.label} 下载
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-normal text-muted-foreground">{tag}</span>
        </span>
      </a>
      <a href="#download" className="inline-flex h-11 items-center gap-1.5 rounded-xl border bg-card px-5 text-sm font-medium hover:bg-accent">
        其他平台 <ChevronDown className="h-4 w-4" />
      </a>
    </div>
  );
}

function SmartDownloadFull() {
  const { tag } = useLatestRelease();
  const [platform, setPlatform] = useState<DetectedPlatform>("unknown");
  const [expanded, setExpanded] = useState(false);
  useEffect(() => setPlatform(detectPlatform()), []);

  const primary = useMemo(() => {
    if (platform === "unknown") return null;
    const target = PLATFORM_TO_TARGET[platform];
    const asset = assetNameForTarget(tag, target);
    return { platform, label: PLATFORM_LABEL[platform], asset, href: latestDownloadUrl(asset) };
  }, [platform, tag]);
  const PrimaryIcon = iconFor(primary?.platform ?? "unknown");

  return (
    <div className="rounded-2xl border bg-card p-5 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {primary ? (
            <a href={primary.href} rel="noreferrer" className="group relative rounded-xl p-[2px]">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-cyan-400 opacity-90 transition group-hover:opacity-100" />
              <span className="relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-[10px] bg-card px-5 py-[9px] text-sm font-semibold">
                <PrimaryIcon className="h-4 w-4 shrink-0" />
                {primary.label} 下载
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-normal text-muted-foreground">{tag}</span>
              </span>
            </a>
          ) : (
            <a href={`${SITE.releaseBase}/latest`} target="_blank" rel="noreferrer">
              <Button variant="hero" className="h-11 px-7">免费下载</Button>
            </a>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border bg-card px-5 text-sm font-medium hover:bg-accent"
          >
            {expanded ? <>收起 <ChevronUp className="h-4 w-4" /></> : <>其他平台 <ChevronDown className="h-4 w-4" /></>}
          </button>
        </div>
        <a href={`${SITE.releaseBase}/latest`} target="_blank" rel="noreferrer" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex">
          GitHub Releases
        </a>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ALL_PLATFORMS.map((p) => {
                const target = PLATFORM_TO_TARGET[p];
                const asset = assetNameForTarget(tag, target);
                const href = latestDownloadUrl(asset);
                const isCurrent = p === platform;
                const Icon = iconFor(p);
                return (
                  <div key={p} className="flex flex-col">
                    <a
                      href={href}
                      rel="noreferrer"
                      title={asset}
                      className={`flex h-[112px] flex-col rounded-xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${isCurrent ? "ring-1 ring-primary/25" : ""}`}
                    >
                      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold">
                        <Icon className="h-4 w-4 shrink-0" />
                        {PLATFORM_LABEL[p]} 下载
                      </span>
                      <span className="mt-1 font-mono text-xs text-muted-foreground">{tag}</span>
                      <span className="mt-2 truncate font-mono text-[11px] leading-none text-muted-foreground" title={asset}>
                        {asset}
                      </span>
                    </a>
                    {platform !== "unknown" && !isCurrent ? (
                      <span className="mt-1.5 inline-flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3 shrink-0" /> 不支持您当前的系统架构
                      </span>
                    ) : isCurrent ? (
                      <span className="mt-1.5 text-xs font-medium text-primary">✓ 已为当前系统推荐</span>
                    ) : (
                      <span className="mt-1.5 text-xs text-transparent">占位</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
