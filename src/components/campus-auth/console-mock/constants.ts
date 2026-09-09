import { Activity, AlertTriangle, Calendar, Clock, Code2, FileText, Info, LayoutGrid, LogOut, MoreVertical, Palette, Settings, Sparkles, Wifi } from "lucide-react";
import type { LogEntry } from "./types";
import { makeLog } from "./utils";

export const PORT = 18080;
export const START_BASE_SECONDS = 5 * 60 + 2; // 与原宣传截图一致：0h 5m 2s 起步
export const BASE_TIME = "2026-09-06 18:14:51";

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

export const INITIAL_LOGS: LogEntry[] = [
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

export const NAV_MAIN = [
  { key: "dashboard", label: "仪表盘", icon: LayoutGrid },
  { key: "settings", label: "设置", icon: Settings },
  { key: "tasks", label: "任务管理", icon: FileText },
  { key: "ai", label: "AI 任务", icon: Sparkles },
  { key: "about", label: "关于", icon: Info },
] as const;

export const NAV_MORE = [
  { key: "profiles", label: "配置方案", icon: Wifi },
  { key: "scripts", label: "自定义脚本", icon: Code2 },
  { key: "scheduled", label: "定时任务", icon: Clock },
  { key: "appearance", label: "外观", icon: Palette },
] as const;

export const ICON_BTN =
  "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground";

export { Activity, AlertTriangle, Calendar, Clock, LogOut, MoreVertical };
