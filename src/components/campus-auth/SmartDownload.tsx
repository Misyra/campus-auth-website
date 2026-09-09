import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Monitor, Apple, Boxes, AlertCircle, Smartphone, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadInfo, type PlatformDownload } from "@/hooks/useDownloadInfo";
import { SITE } from "@/data/site";

const iconFor = (p: PlatformDownload["platform"]) => {
  if (p.startsWith("windows")) return Monitor;
  if (p.startsWith("macos")) return Apple;
  if (p.startsWith("linux")) return Boxes;
  return Download;
};

export function SmartDownload({ compact = false }: { compact?: boolean }) {
  if (compact) return <SmartDownloadHero />;
  return <SmartDownloadFull />;
}

/** 首页 Hero 紧凑版：主推荐按钮 + 其他平台入口 */
function SmartDownloadHero() {
  const { primary, tag, isMobile } = useDownloadInfo();

  if (isMobile) {
    return (
      <span className="inline-flex items-center gap-2 rounded-xl border border-dashed bg-card px-5 py-3 text-sm font-medium text-muted-foreground">
        <Smartphone className="h-4 w-4 shrink-0" />
        暂不支持当前平台，请在电脑上访问下载
      </span>
    );
  }

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

  const PrimaryIcon = iconFor(primary.platform);
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

/** 下载页完整版：主推荐 + 可展开的全平台列表 */
function SmartDownloadFull() {
  const { primary, all, tag, isMobile } = useDownloadInfo();
  const [expanded, setExpanded] = useState(false);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-8 text-center">
        <Smartphone className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-semibold text-foreground">暂不支持当前平台</p>
        <p className="text-xs text-muted-foreground">请使用电脑浏览器访问本页面，选择对应系统版本下载</p>
        <a href={`${SITE.releaseBase}/latest`} target="_blank" rel="noreferrer" className="mt-2 text-sm font-medium text-primary hover:underline">
          前往 GitHub Releases 查看完整清单
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-5 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {primary ? (
            <PrimaryButton primary={primary} tag={tag} />
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
              {all.map((p) => {
                const isCurrent = primary?.platform === p.platform;
                const Icon = iconFor(p.platform);
                return (
                  <div key={p.platform} className="flex flex-col">
                    <a
                      href={p.href}
                      rel="noreferrer"
                      title={p.asset}
                      className={`flex h-[112px] flex-col rounded-xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${isCurrent ? "ring-1 ring-primary/25" : ""}`}
                    >
                      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold">
                        <Icon className="h-4 w-4 shrink-0" />
                        {p.label} 下载
                      </span>
                      <span className="mt-1 font-mono text-xs text-muted-foreground">{tag}</span>
                      <span className="mt-2 truncate font-mono text-[11px] leading-none text-muted-foreground" title={p.asset}>
                        {p.asset}
                      </span>
                    </a>
                    {primary && !isCurrent ? (
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

function PrimaryButton({ primary, tag }: { primary: PlatformDownload; tag: string }) {
  const PrimaryIcon = iconFor(primary.platform);
  return (
    <a href={primary.href} rel="noreferrer" className="group relative rounded-xl p-[2px]">
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-fuchsia-500 to-cyan-400 opacity-90 transition group-hover:opacity-100" />
      <span className="relative inline-flex items-center gap-2.5 whitespace-nowrap rounded-[10px] bg-card px-5 py-[9px] text-sm font-semibold">
        <PrimaryIcon className="h-4 w-4 shrink-0" />
        {primary.label} 下载
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-normal text-muted-foreground">{tag}</span>
      </span>
    </a>
  );
}
