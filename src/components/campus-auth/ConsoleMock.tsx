import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Code2,
  FileText,
  Info,
  LayoutGrid,
  LogIn,
  LogOut,
  MoreVertical,
  Palette,
  Pause,
  Play,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Wifi,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ConsoleMock — 官网首页 Hero 的"可交互控制台演示"（16:9 窗口）。
 * 按真实软件（Campus-Auth-rs/frontend，Vue 版）的仪表盘还原为纯前端 React
 * 框架 UI：可点击监控开关、手动登录、网络测试、筛选日志，数据为本地模拟，无后端。
 */

type LogLevel = "INFO" | "WARN" | "ERROR";
type LogEntry = { seq: number; time: string; level: LogLevel; source: string; msg: string };
type HistoryEntry = { time: string; duration: string; profile: string; source: string; ok: boolean };

// 与原版 utils/constants.ts 的 LOG_SOURCE_LABELS 保持一致
const SOURCE_LABELS: Record<string, string> = {
  app: "应用",
  launcher: "启动器",
  engine: "引擎",
  login: "登录",
  monitor: "检测",
  bridge: "Bridge",
  scheduler: "调度",
  web: "Web",
  config: "配置",
  updater: "更新",
  network: "网络",
  tasks: "任务",
  environment: "环境",
};

const START_BASE_SECONDS = 5 * 60 + 2; // 与原宣传截图一致：0h 5m 2s 起步
const BASE_TIME = "2026-09-06 18:14:51";
const PORT = 18080;

let seqCounter = 0;

function fmtDuration(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}h ${m}m ${s}s`;
}
function pad(n: number): string {
  return String(n).padStart(2, "0");
}
function fmtShort(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fmtFull(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function makeLog(level: LogLevel, source: string, msg: string, time?: string): LogEntry {
  seqCounter += 1;
  return { seq: seqCounter, time: time ?? fmtFull(new Date()), level, source, msg };
}

const INITIAL_LOGS: LogEntry[] = [
  makeLog("INFO", "config", "加载已保存配置 v9 + v8", BASE_TIME),
  makeLog("INFO", "config", "启动前预检完成（定时增量重置 + Bridge）", BASE_TIME),
  makeLog("INFO", "app", "后台资源初始化完成", BASE_TIME),
  makeLog("INFO", "engine", "Axum 服务器就绪", BASE_TIME),
  makeLog("INFO", "web", `控制台已启动: http://127.0.0.1:${PORT}`, BASE_TIME),
  makeLog("INFO", "monitor", "startup_action:monitor 已启动检测", BASE_TIME),
  makeLog("INFO", "tasks", "未匹配到启动任务", BASE_TIME),
  makeLog("INFO", "launcher", "远程模式启动", BASE_TIME),
  makeLog("INFO", "monitor", "系统任务已创建", BASE_TIME),
  makeLog("INFO", "environment", "环境就绪: python=true, playwright=true", BASE_TIME),
  makeLog("WARN", "monitor", "第 1 次探测超时，重试后恢复", BASE_TIME),
  makeLog("INFO", "monitor", "网络状态变化: Offline → Online", BASE_TIME),
  makeLog("INFO", "monitor", "开始检测: scope=config-init", BASE_TIME),
  makeLog("INFO", "monitor", "配置化重试: scope=config", BASE_TIME),
  makeLog("INFO", "monitor", "初始化完成 scope=init", BASE_TIME),
  makeLog("INFO", "bridge", `正在连接日志通道 ws://127.0.0.1:${PORT}/ws/logs`, BASE_TIME),
  makeLog("INFO", "bridge", "已连接日志通道", BASE_TIME),
];

const PERIODIC_LOGS = [
  "执行周期检测: scope=periodic",
  "网络状态正常: Online（延迟 12ms）",
  "探测完成: 认证有效，无需登录",
];

const NAV_MAIN = [
  { key: "dashboard", label: "仪表盘", icon: LayoutGrid },
  { key: "settings", label: "设置", icon: Settings },
  { key: "tasks", label: "任务管理", icon: FileText },
  { key: "ai", label: "AI 任务", icon: Sparkles },
  { key: "about", label: "关于", icon: Info },
] as const;
const NAV_MORE = [
  { key: "profiles", label: "配置方案", icon: Wifi },
  { key: "scripts", label: "自定义脚本", icon: Code2 },
  { key: "scheduled", label: "定时任务", icon: Clock },
  { key: "appearance", label: "外观", icon: Palette },
] as const;

const iconBtn =
  "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground";

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
  const [moreOpen, setMoreOpen] = useState(false);
  const logViewerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tickRef = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [inViewport, setInViewport] = useState(true);

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

  function pushLog(level: LogLevel, source: string, msg: string) {
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

  const filteredLogs = logs.filter(
    (l) =>
      (!levelFilter || l.level === levelFilter) &&
      (!sourceFilter || l.source === sourceFilter) &&
      (!search || l.msg.toLowerCase().includes(search.toLowerCase())),
  );
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

  const sidebar = (
    <nav className={cn("flex shrink-0 flex-col border-r bg-muted/40", compact ? "w-10" : "w-[136px]")}>
      <div className={cn("flex items-center gap-2 border-b px-3", compact ? "h-9 justify-center py-2" : "h-11")}>
        <img src="/logo.png" alt="" className="h-6 w-6 rounded-md bg-white p-0.5 shadow-sm" />
        {!compact && <span className="text-[13px] font-bold text-cyan-600 dark:text-cyan-400">校园网认证</span>}
      </div>

      <div className={cn("min-h-0 flex-1 space-y-0.5 overflow-y-auto p-1.5", compact && "flex flex-col items-center")}>
        {NAV_MAIN.map((n) => {
          const Icon = n.icon;
          const active = n.key === "dashboard";
          return (
            <button
              key={n.key}
              onClick={() => n.key !== "dashboard" && showToast("演示版：仅实现仪表盘页面")}
              title={n.label}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition",
                compact && "justify-center px-0",
                active ? "bg-cyan-500/10 font-medium text-cyan-600 dark:text-cyan-400" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!compact && <span>{n.label}</span>}
            </button>
          );
        })}

        <button
          onClick={() => setMoreOpen((o) => !o)}
          title="更多"
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground",
            compact && "justify-center px-0",
          )}
        >
          <MoreVertical className="h-4 w-4 shrink-0" />
          {!compact && (
            <>
              <span>更多</span>
              <ChevronDown className={cn("ml-auto h-3.5 w-3.5 transition-transform", moreOpen && "rotate-180")} />
            </>
          )}
        </button>
        {moreOpen &&
          NAV_MORE.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.key}
                onClick={() => showToast("演示版：仅实现仪表盘页面")}
                title={n.label}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md py-1.5 pl-6 pr-2 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  compact && "justify-center px-0 pl-0",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!compact && <span>{n.label}</span>}
              </button>
            );
          })}
      </div>

      <div className="space-y-1.5 border-t p-1.5">
        <div
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-md bg-emerald-500/10 py-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
            !monitoring && "bg-muted text-muted-foreground",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full bg-emerald-500", !monitoring && "bg-muted-foreground/50")} />
          {!compact && <span>{monitoring ? "运行中" : "已停止"}</span>}
        </div>
        <button
          onClick={() => showToast("演示模式：退出仅存在于真实应用")}
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-red-500/30 py-1.5 text-[11px] text-red-500 transition hover:bg-red-500/10"
          title="退出应用"
        >
          <LogOut className="h-3.5 w-3.5" />
          {!compact && <span>退出</span>}
        </button>
      </div>
    </nav>
  );

  const stats = [
    { label: "开始检测时长", value: fmtDuration(seconds), icon: Clock, tone: "text-emerald-500 bg-emerald-500/10" },
    { label: "检测次数", value: String(checkCount), icon: Activity, tone: "text-sky-500 bg-sky-500/10" },
    { label: "登录次数", value: String(loginCount), icon: AlertTriangle, tone: "text-amber-500 bg-amber-500/10" },
    { label: "最后检测", value: lastCheck, icon: Calendar, tone: "text-violet-500 bg-violet-500/10" },
  ];

  return (
    <div ref={rootRef} className="relative flex aspect-video w-full overflow-hidden bg-card text-foreground">
      {sidebar}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶栏 */}
        <header className={cn("flex shrink-0 items-center justify-between gap-2 border-b px-3", compact ? "h-9" : "h-11")}>
          <h2 className="text-sm font-semibold">仪表盘</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setBellOpen((o) => !o)} className={iconBtn} title="通知历史" aria-label="通知历史">
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

              <div className="flex min-h-0 flex-1 flex-col rounded-lg border bg-card">
                <div className="flex shrink-0 items-center justify-between border-b px-2.5 py-1.5">
                  <span className="text-xs font-semibold">登录历史</span>
                  <div className="flex items-center gap-1">
                    <button className={cn(iconBtn, "h-6 w-6")} title="刷新" onClick={() => showToast("已刷新（演示）")}>
                      <RefreshCw className="h-3 w-3" />
                    </button>
                    <button className={cn(iconBtn, "h-6 w-6")} title="清空" disabled={!history.length} onClick={() => setHistory([])}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="min-h-0 flex-1 p-2">
                  {history.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
                      <Clock className="h-5 w-5 opacity-40" />
                      <span className="text-[11px]">暂无登录记录</span>
                    </div>
                  ) : (
                    <div className="h-full space-y-1.5 overflow-y-auto">
                      {history.map((h, i) => (
                        <div key={i} className="rounded-md border px-2 py-1.5 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            {h.ok ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-red-500" />}
                            <span className="font-medium">{h.time}</span>
                            <span className="ml-auto text-muted-foreground">{h.duration}</span>
                          </div>
                          <div className="mt-0.5 text-muted-foreground">
                            {h.profile} · {h.source}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 实时日志 */}
            <div className="flex min-h-0 flex-col rounded-lg border bg-card">
              <div className="flex shrink-0 items-center justify-between border-b px-2.5 py-1.5">
                <span className="text-xs font-semibold">实时日志</span>
                <div className="flex items-center gap-1">
                  <button
                    className={cn(iconBtn, "h-6 w-6", autoScroll && "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400")}
                    title={autoScroll ? "自动滚动：开" : "自动滚动：关"}
                    onClick={() => setAutoScroll((a) => !a)}
                  >
                    {autoScroll ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  </button>
                  <button className={cn(iconBtn, "h-6 w-6")} title="刷新" onClick={() => pushLog("INFO", "web", "日志已刷新（演示）")}>
                    <RefreshCw className="h-3 w-3" />
                  </button>
                  <button className={cn(iconBtn, "h-6 w-6")} title="清空" onClick={() => setLogs([])}>
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2">
                <div className="flex shrink-0 items-center gap-1.5">
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
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
                    onChange={(e) => setSourceFilter(e.target.value)}
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
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="搜索日志..."
                      className="h-6 w-full rounded-md border bg-background pl-6 pr-1.5 text-[11px] outline-none focus:border-cyan-500/60"
                    />
                  </div>
                </div>
                <div ref={logViewerRef} className="min-h-0 flex-1 overflow-y-auto rounded-md bg-muted/40 p-1.5 font-mono text-[10px] leading-relaxed">
                  {filteredLogs.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      {search || levelFilter || sourceFilter ? "无匹配日志" : "暂无日志"}
                    </div>
                  ) : (
                    filteredLogs.map((l) => (
                      <div key={l.seq} className="flex gap-1.5 py-px">
                        <span className="shrink-0 text-muted-foreground">{l.time}</span>
                        <span
                          className={cn(
                            "shrink-0 font-semibold",
                            l.level === "INFO" && "text-sky-600 dark:text-sky-400",
                            l.level === "WARN" && "text-amber-600 dark:text-amber-400",
                            l.level === "ERROR" && "text-red-600 dark:text-red-400",
                          )}
                        >
                          {l.level}
                        </span>
                        <span className="shrink-0 text-muted-foreground">{SOURCE_LABELS[l.source] ?? l.source}</span>
                        <span className="min-w-0 break-words">{l.msg}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
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
          <div className="flex min-h-0 flex-1 flex-col rounded-lg border bg-card">
            <div className="flex shrink-0 items-center justify-between border-b px-2 py-1.5">
              <span className="text-[11px] font-semibold">实时日志</span>
              <button className={cn(iconBtn, "h-6 w-6")} title="清空" onClick={() => setLogs([])}>
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            <div ref={compact ? logViewerRef : undefined} className="min-h-0 flex-1 overflow-y-auto rounded-md bg-muted/40 p-1.5 font-mono text-[9px] leading-relaxed">
              {logs.map((l) => (
                <div key={l.seq} className="flex gap-1 py-px">
                  <span className="shrink-0 text-muted-foreground">{l.time}</span>
                  <span
                    className={cn(
                      "shrink-0 font-semibold",
                      l.level === "INFO" && "text-sky-600 dark:text-sky-400",
                      l.level === "WARN" && "text-amber-600 dark:text-amber-400",
                      l.level === "ERROR" && "text-red-600 dark:text-red-400",
                    )}
                  >
                    {l.level}
                  </span>
                  <span className="shrink-0 text-muted-foreground">{SOURCE_LABELS[l.source] ?? l.source}</span>
                  <span className="min-w-0 break-words">{l.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute bottom-3 right-3 z-30 rounded-md border bg-card px-3 py-1.5 text-xs shadow-lg">{toast}</div>
      )}
    </div>
  );
}
