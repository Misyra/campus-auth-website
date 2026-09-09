import { ArrowDown, ArrowUp, RefreshCw, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_BTN, SOURCE_LABELS } from "./constants";
import type { LogEntry, LogLevel } from "./types";

type Props = {
  logs: LogEntry[];
  levelFilter: string;
  sourceFilter: string;
  search: string;
  autoScroll: boolean;
  sourceOptions: string[];
  compact: boolean;
  onLevelFilter: (v: string) => void;
  onSourceFilter: (v: string) => void;
  onSearch: (v: string) => void;
  onToggleAutoScroll: () => void;
  onRefresh: () => void;
  onClear: () => void;
  logViewerRef: React.RefObject<HTMLDivElement | null>;
};

function levelClass(level: LogLevel) {
  if (level === "INFO") return "text-sky-600 dark:text-sky-400";
  if (level === "WARN") return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function ConsoleLogPanel({
  logs,
  levelFilter,
  sourceFilter,
  search,
  autoScroll,
  sourceOptions,
  compact,
  onLevelFilter,
  onSourceFilter,
  onSearch,
  onToggleAutoScroll,
  onRefresh,
  onClear,
  logViewerRef,
}: Props) {
  const filtered = logs.filter(
    (l) =>
      (!levelFilter || l.level === levelFilter) &&
      (!sourceFilter || l.source === sourceFilter) &&
      (!search || l.msg.toLowerCase().includes(search.toLowerCase())),
  );
  const emptyText = search || levelFilter || sourceFilter ? "无匹配日志" : "暂无日志";

  if (compact) {
    return (
      <div className="flex min-h-0 flex-1 flex-col rounded-lg border bg-card">
        <div className="flex shrink-0 items-center justify-between border-b px-2 py-1.5">
          <span className="text-[11px] font-semibold">实时日志</span>
          <button className={cn(ICON_BTN, "h-6 w-6")} title="清空" onClick={onClear}>
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
        <div ref={logViewerRef} className="min-h-0 flex-1 overflow-y-auto rounded-md bg-muted/40 p-1.5 font-mono text-[9px] leading-relaxed">
          {logs.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">{emptyText}</div>
          ) : (
            logs.map((l) => (
              <div key={l.seq} className="flex gap-1 py-px">
                <span className="shrink-0 text-muted-foreground">{l.time}</span>
                <span className={cn("shrink-0 font-semibold", levelClass(l.level))}>{l.level}</span>
                <span className="shrink-0 text-muted-foreground">{SOURCE_LABELS[l.source] ?? l.source}</span>
                <span className="min-w-0 break-words">{l.msg}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col rounded-lg border bg-card">
      <div className="flex shrink-0 items-center justify-between border-b px-2.5 py-1.5">
        <span className="text-xs font-semibold">实时日志</span>
        <div className="flex items-center gap-1">
          <button
            className={cn(ICON_BTN, "h-6 w-6", autoScroll && "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400")}
            title={autoScroll ? "自动滚动：开" : "自动滚动：关"}
            onClick={onToggleAutoScroll}
          >
            {autoScroll ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          </button>
          <button className={cn(ICON_BTN, "h-6 w-6")} title="刷新" onClick={onRefresh}>
            <RefreshCw className="h-3 w-3" />
          </button>
          <button className={cn(ICON_BTN, "h-6 w-6")} title="清空" onClick={onClear}>
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <select
            value={levelFilter}
            onChange={(e) => onLevelFilter(e.target.value)}
            className="h-6 rounded-md border bg-background px-1 text-[11px] outline-none"
            aria-label="日志级别筛选"
          >
            <option value="">全部级别</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => onSourceFilter(e.target.value)}
            className="h-6 rounded-md border bg-background px-1 text-[11px] outline-none"
            aria-label="日志来源筛选"
          >
            <option value="">全部来源</option>
            {sourceOptions.map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABELS[s] ?? s}
              </option>
            ))}
          </select>
          <div className="relative h-6 min-w-0 flex-1">
            <Search className="absolute left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="搜索日志..."
              className="h-6 w-full rounded-md border bg-background pl-6 pr-1.5 text-[11px] outline-none focus:border-cyan-500/60"
            />
          </div>
        </div>
        <div ref={logViewerRef} className="min-h-0 flex-1 overflow-y-auto rounded-md bg-muted/40 p-1.5 font-mono text-[10px] leading-relaxed">
          {filtered.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">{emptyText}</div>
          ) : (
            filtered.map((l) => (
              <div key={l.seq} className="flex gap-1.5 py-px">
                <span className="shrink-0 text-muted-foreground">{l.time}</span>
                <span className={cn("shrink-0 font-semibold", levelClass(l.level))}>{l.level}</span>
                <span className="shrink-0 text-muted-foreground">{SOURCE_LABELS[l.source] ?? l.source}</span>
                <span className="min-w-0 break-words">{l.msg}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
