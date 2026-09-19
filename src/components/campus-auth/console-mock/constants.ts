import { Activity, AlertTriangle, Calendar, Clock, Info, LayoutGrid, Layers, LogOut, MoreVertical, Settings, Settings2 } from "lucide-react";
import type { LogEntry } from "./types";
import { makeLog } from "./utils";

export const PORT = 50721;
export const START_BASE_SECONDS = 5 * 60 + 2; // 演示起步时长：0h 5m 2s
export const BASE_TIME = "2026-09-18 20:32:10";

// 与原版 utils/constants.ts 的 LOG_SOURCE_LABELS 保持一致
export const SOURCE_LABELS: Record<string, string> = {
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

export const PERIODIC_LOGS = [
  "执行周期检测: scope=periodic",
  "网络状态正常: Online（延迟 12ms）",
  "探测完成: 认证有效，无需登录",
];

// 日志文案与 v5.0.0 真实启动序列一致
export const INITIAL_LOGS: LogEntry[] = [
  makeLog("INFO", "app", `应用启动 mode=full port=${PORT} version=5.0.0`, BASE_TIME),
  makeLog("INFO", "launcher", `准备 Axum 监听端口 bind_ip=127.0.0.1 requested_port=${PORT}`, BASE_TIME),
  makeLog("INFO", "app", "正在初始化服务...", BASE_TIME),
  makeLog("INFO", "tasks", "已内置默认登录任务 default（通用登录），新装开箱即用", BASE_TIME),
  makeLog("INFO", "app", "后台服务已启动（定时调度器 + Bridge）", BASE_TIME),
  makeLog("INFO", "web", `Web 控制台已启动: http://127.0.0.1:${PORT}`, BASE_TIME),
  makeLog("INFO", "app", "完整模式运行中", BASE_TIME),
  makeLog("INFO", "engine", "环境检查: uv=true, python=true, playwright=true, system_browser=true", BASE_TIME),
  makeLog("INFO", "monitor", "启动检测: 手动触发", BASE_TIME),
  makeLog("INFO", "monitor", "网络状态变化: Offline → Online", BASE_TIME),
  makeLog("INFO", "bridge", `正在连接日志通道 ws://127.0.0.1:${PORT}/ws/logs`, BASE_TIME),
  makeLog("INFO", "bridge", "已连接日志通道", BASE_TIME),
];

// v5.0.0 起导航固定为五项，不再有「更多」折叠
export const NAV_MAIN = [
  { key: "dashboard", label: "仪表盘", icon: LayoutGrid },
  { key: "profiles", label: "方案", icon: Settings2 },
  { key: "tasks", label: "任务", icon: Layers },
  { key: "settings", label: "设置", icon: Settings },
  { key: "about", label: "关于", icon: Info },
] as const;

export const ICON_BTN =
  "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground";

export { Activity, AlertTriangle, Calendar, Clock, LogOut, MoreVertical };
export const APP_NAME = "认证喵";
