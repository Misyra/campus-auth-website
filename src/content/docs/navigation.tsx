import type { ReactNode } from "react";
import { BookOpen, HelpCircle, Layers, Rocket, ShieldCheck, Wrench, Zap } from "lucide-react";

export type DocSection = {
  id: string;
  title: string;
  icon?: ReactNode;
  items: { id: string; title: string }[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    title: "快速开始",
    icon: <Rocket className="h-4 w-4" />,
    items: [
      { id: "start", title: "新手上路" },
      { id: "install", title: "下载与安装" },
      { id: "console", title: "控制台导览" },
    ],
  },
  {
    id: "profiles",
    title: "配置方案",
    icon: <ShieldCheck className="h-4 w-4" />,
    items: [
      { id: "overview", title: "配置方案概览" },
      { id: "match", title: "自动匹配网络" },
      { id: "redirect", title: "劫持门户（重定向）" },
    ],
  },
  {
    id: "tasks",
    title: "任务",
    icon: <Layers className="h-4 w-4" />,
    items: [
      { id: "concepts", title: "三类任务" },
      { id: "recorder", title: "任务录制器" },
      { id: "browser", title: "浏览器任务" },
      { id: "variables", title: "变量与成功判定" },
      { id: "scripts", title: "脚本与 Shell 任务" },
      { id: "debug", title: "调试与取证" },
      { id: "repo", title: "从仓库下载共享任务" },
    ],
  },
  {
    id: "automation",
    title: "自动化",
    icon: <Zap className="h-4 w-4" />,
    items: [
      { id: "monitor", title: "断网自动重连" },
      { id: "scheduled", title: "定时任务" },
      { id: "autostart", title: "开机自启与托盘" },
    ],
  },
  {
    id: "maintenance",
    title: "运行维护",
    icon: <Wrench className="h-4 w-4" />,
    items: [
      { id: "update", title: "自动更新" },
      { id: "cli", title: "CLI 与运行模式" },
      { id: "files", title: "目录与文件" },
    ],
  },
  {
    id: "reference",
    title: "配置参考",
    icon: <BookOpen className="h-4 w-4" />,
    items: [{ id: "settings", title: "settings.json 配置参考" }],
  },
  {
    id: "faq",
    title: "常见问题",
    icon: <HelpCircle className="h-4 w-4" />,
    items: [
      { id: "login", title: "无法自动登录" },
      { id: "startup", title: "启动与安装故障" },
      { id: "browser", title: "浏览器与验证码" },
      { id: "misc", title: "定时、自启与更新" },
    ],
  },
];
