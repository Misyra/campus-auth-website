import type { ReactNode } from "react";
import { HelpCircle, Layers, Rocket, Settings2, ShieldCheck } from "lucide-react";

export type DocSection = {
  id: string;
  title: string;
  icon?: ReactNode;
  items: { id: string; title: string }[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    title: "快速入门",
    icon: <Rocket className="h-4 w-4" />,
    items: [
      { id: "introduction", title: "项目简介" },
      { id: "install", title: "安装与运行" },
      { id: "console", title: "控制台导览" },
      { id: "quickstart", title: "五分钟跑通" },
    ],
  },
  {
    id: "profiles",
    title: "多网络配置",
    icon: <ShieldCheck className="h-4 w-4" />,
    items: [
      { id: "overview", title: "Profile 概览" },
      { id: "match", title: "自动匹配" },
      { id: "redirect", title: "重定向模式" },
    ],
  },
  {
    id: "tasks",
    title: "任务系统",
    icon: <Layers className="h-4 w-4" />,
    items: [
      { id: "concepts", title: "三类任务" },
      { id: "browser", title: "浏览器任务" },
      { id: "variables", title: "变量与成功判定" },
      { id: "scripts", title: "自定义脚本" },
    ],
  },
  {
    id: "automation",
    title: "自动化与检测",
    icon: <Settings2 className="h-4 w-4" />,
    items: [
      { id: "monitor", title: "断网检测" },
      { id: "debug", title: "录制与调试" },
      { id: "scheduled", title: "定时任务" },
    ],
  },
  {
    id: "system",
    title: "系统与运维",
    icon: <HelpCircle className="h-4 w-4" />,
    items: [
      { id: "cli", title: "命令行与目录" },
      { id: "update", title: "自动更新" },
      { id: "faq", title: "常见问题" },
    ],
  },
];
