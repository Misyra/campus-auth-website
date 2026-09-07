import type { ReactNode } from "react";
import { BookOpen, HelpCircle, Layers, Rocket, Settings2, ShieldCheck } from "lucide-react";

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
      { id: "quickstart", title: "快速开始" },
      { id: "console", title: "控制台导览" },
    ],
  },
  {
    id: "profiles",
    title: "多网络配置",
    icon: <ShieldCheck className="h-4 w-4" />,
    items: [
      { id: "overview", title: "配置方案概览" },
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
      { id: "debug", title: "录制与调试" },
    ],
  },
  {
    id: "automation",
    title: "自动化与检测",
    icon: <Settings2 className="h-4 w-4" />,
    items: [
      { id: "monitor", title: "断网检测" },
      { id: "scheduled", title: "定时任务" },
    ],
  },
  {
    id: "system",
    title: "系统设置",
    icon: <Settings2 className="h-4 w-4" />,
    items: [
      { id: "cli", title: "命令与文件说明" },
      { id: "update", title: "自动更新" },
    ],
  },
  {
    id: "faq",
    title: "常见问题",
    icon: <HelpCircle className="h-4 w-4" />,
    items: [
      { id: "troubleshoot", title: "故障排查" },
      { id: "browser", title: "浏览器相关" },
      { id: "startup", title: "定时与开机" },
    ],
  },
  {
    id: "reference",
    title: "配置参考",
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      { id: "browser", title: "浏览器配置" },
      { id: "monitor", title: "监测与重试" },
      { id: "system", title: "应用与日志" },
      { id: "files", title: "配置文件与目录" },
    ],
  },
];
