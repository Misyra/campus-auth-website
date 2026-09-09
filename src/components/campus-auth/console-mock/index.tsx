import { useEffect, useRef, useState } from "react";
import { Activity, AlertTriangle, Bell, Calendar, Clock, LogIn, Pause, Play, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConsoleSidebar } from "./ConsoleSidebar";
import { ConsoleLogPanel } from "./ConsoleLogPanel";
import { ConsoleHistoryPanel } from "./ConsoleHistoryPanel";
import { ICON_BTN, INITIAL_LOGS, PERIODIC_LOGS, START_BASE_SECONDS } from "./constants";
import { fmtDuration, fmtFull, fmtShort, makeLog } from "./utils";
import type { HistoryEntry, LogEntry } from "./types";

/**
 * ConsoleMock — 官网首页 Hero 的"可交互控制台演示"（16:9 窗口）。
 * 按真实软件（Campus-Auth-rs/frontend，Vue 版）的仪表盘还原为纯前端 React
 * 框架 UI：可点击监控开关、手动登录、网络测试、筛选日志，数据为本地模拟，无后端。
 */
export function ConsoleMock({ compact = false }: { compact?: boolean }) {
  const [monitoring, setMonitoring] = useState(true);
  const [seconds, setSeconds] = useState(START_BASE_SECONDS);
  const [checkCount, setCheckCount] = useState(4);
  const [loginCount, setLoginCount] = useState(0);
  const [lastCheck, setLastCheck] = useState("18:18");
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [levelFilter, setLevelFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [search, setSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [bellOpen, setBellOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loginBusy, setLoginBusy] = useState(false);
  const [inViewport, setInViewport] = useState(true);

  const logViewerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tickRef = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 首屏外（滚动离开视口）暂停演示定时器，避免常驻 CPU 占用
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  function pushLog(level: LogEntry["level"], source: string, msg: string) {
    setLogs((l) => [...l.slice(-99), makeLog(level, source, msg)]);
  }

  // 监控运行中：运行时长每秒累计；每 5s 一次周期检测（计数 + 时间 + 日志）；视口外暂停
  useEffect(() => {
    if (!monitoring || !inViewport) return;
    const id = setInterval(() => {
      setSeconds((s) => s + 1);
      tickRef.current += 1;
      if (tickRef.current % 5 === 0) {
        setCheckCount((c) => c + 1);
        setLastCheck(fmtShort(new Date()));
        pushLog("INFO", "monitor", PERIODIC_LOGS[Math.floor(tickRef.current / 5) % PERIODIC_LOGS.length]);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [monitoring, inViewport]);

  // 日志自动滚动
  useEffect(() => {
    if (autoScroll && logViewerRef.current) {
      logViewerRef.current.scrollTop = logViewerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const sourceOptions = Array.from(new Set(logs.map((l) => l.source)));

  function toggleMonitor() {
    setMonitoring((m) => {
      const next = !m;
      pushLog("INFO", "monitor", next ? "启动检测: 手动触发" : "检测已停止（演示）");
      showToast(next ? "监控已启动（演示）" : "监控已停止（演示）");
      return next;
    });
  }

  function manualLogin() {
    if (loginBusy) return;
    setLoginBusy(true);
    pushLog("INFO", "login", "手动登录已触发，正在打开浏览器…");
    setTimeout(() => {
      pushLog("INFO", "login", "登录成功（演示模式）");
      setLoginCount((c) => c + 1);
      setHistory((h) =>
        [{ time: fmtFull(new Date()), duration: "4.2s", profile: "默认配置方案", source: "手动登录", ok: true }, ...h].slice(0, 8),
      );
      setLoginBusy(false);
      showToast("手动登录完成（演示）");
    }, 900);
  }

  function testNetwork() {
    pushLog("INFO", "network", "手动网络测试开始…");
    setTimeout(() => {
      pushLog("INFO", "network", "网络正常: 认证页可达（延迟 8ms）");
      setCheckCount((c) => c + 1);
      setLastCheck(fmtShort(new Date()));
      showToast("网络测试完成（演示）");
    }, 600);
  }

  const stats = [
    { label: "开始检测时长", value: fmtDuration(seconds), icon: Clock, tone: "text-emerald-500 bg-emerald-500/10" },
    { label: "检测次数", value: String(checkCount), icon: Activity, tone: "text-sky-500 bg-sky-500/10" },
    { label: "登录次数", value: String(loginCount), icon: AlertTriangle, tone: "text-amber-500 bg-amber-500/10" },
    { label: "最后检测", value: lastCheck, icon: Calendar, tone: "text-violet-500 bg-violet-500/10" },
  ];

  const logPanelProps = {
    logs,
    levelFilter,
    sourceFilter,
    search,
    autoScroll,
    sourceOptions,
    compact,
    onLevelFilter: setLevelFilter,
    onSourceFilter: setSourceFilter,
    onSearch: setSearch,
    onToggleAutoScroll: () => setAutoScroll((a) => !a),
    onRefresh: () => pushLog("INFO", "web", "日志已刷新（演示）"),
    onClear: () => setLogs([]),
    logViewerRef,
  };

  return (
    <div ref={rootRef} className="relative flex aspect-video w-full overflow-hidden bg-card text-foreground">
      <ConsoleSidebar compact={compact} monitoring={monitoring} onToast={showToast} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶栏 */}
        <header className={cn("flex shrink-0 items-center justify-between gap-2 border-b px-3", compact ? "h-9" : "h-11")}>
          <h2 className="text-sm font-semibold">仪表盘</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setBellOpen((o) => !o)} className={ICON_BTN} title="通知历史" aria-label="通知历史">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-500" />
              </button>
              {bellOpen && (
                <>
                  <button className="fixed inset-0 z-10 cursor-default" aria-hidden onClick={() => setBellOpen(false)} />
                  <div className="absolute right-0 z-20 mt-1 w-60 rounded-lg border bg-card p-2.5 shadow-lg">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>通知历史</span>
                      <button className="hover:text-foreground" onClick={() => setBellOpen(false)}>
                        关闭
                      </button>
                    </div>
                    <div className="rounded-md bg-muted/60 px-2 py-1.5 text-[11px]">
                      <span className="font-medium text-cyan-600 dark:text-cyan-400">检测</span>
                      <span className="ml-1 text-muted-foreground">网络状态变化: Offline → Online</span>
                    </div>
                    <div className="mt-1.5 text-center text-[10px] text-muted-foreground">演示数据</div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={toggleMonitor}
              className="inline-flex items-center gap-1.5 rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-cyan-500"
              title={monitoring ? "停止网络检测和自动登录" : "开始检测网络，断网时自动登录"}
            >
              {monitoring ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {monitoring ? "停止检测" : "启动检测"}
            </button>
          </div>
        </header>

        {/* 仪表盘主体（桌面尺寸） */}
        <div className={cn("flex min-h-0 flex-1 flex-col gap-2 p-2.5", compact && "hidden")}>
          {/* 网络状态横幅 */}
          <div
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-600 dark:text-emerald-400",
              !monitoring && "border-border bg-muted text-muted-foreground",
            )}
          >
            <span className={cn("h-2 w-2 rounded-full bg-emerald-500", !monitoring && "bg-muted-foreground/50")} />
            {monitoring ? "在线监测中" : "监控已停止"}
          </div>

          {/* 统计卡片 */}
          <div className="grid shrink-0 grid-cols-4 gap-2">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2 rounded-lg border bg-card p-2">
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.tone)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[11px] leading-tight text-muted-foreground">{s.label}</div>
                    <div className="truncate text-[13px] font-semibold leading-tight tabular-nums">{s.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 主区域：左（快捷操作 + 登录历史）右（实时日志） */}
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-2">
            <div className="flex min-h-0 flex-col gap-2">
              <div className="shrink-0 rounded-lg border bg-card">
                <div className="border-b px-2.5 py-1.5 text-xs font-semibold">快捷操作</div>
                <div className="space-y-1.5 p-2">
                  <button
                    onClick={manualLogin}
                    disabled={loginBusy}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1.5 text-xs transition hover:bg-muted disabled:opacity-60"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    {loginBusy ? "登录中…" : "手动登录"}
                  </button>
                  <button
                    onClick={testNetwork}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1.5 text-xs transition hover:bg-muted"
                  >
                    <Wifi className="h-3.5 w-3.5" />
                    网络测试
                  </button>
                </div>
              </div>

              <ConsoleHistoryPanel history={history} onToast={showToast} onClear={() => setHistory([])} />
            </div>

            <ConsoleLogPanel {...logPanelProps} />
          </div>
        </div>

        {/* 紧凑版（移动端）：统计 + 实时日志 */}
        <div className={cn("flex min-h-0 flex-1 flex-col gap-2 p-2", !compact && "hidden")}>
          <div className="grid shrink-0 grid-cols-2 gap-1.5">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-1.5 rounded-md border bg-card p-1.5">
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md", s.tone)}>
                    <Icon className="h-3 w-3" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[10px] leading-tight text-muted-foreground">{s.label}</div>
                    <div className="truncate text-[11px] font-semibold leading-tight tabular-nums">{s.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <ConsoleLogPanel {...logPanelProps} />
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute bottom-3 right-3 z-30 rounded-md border bg-card px-3 py-1.5 text-xs shadow-lg">{toast}</div>
      )}
    </div>
  );
}
