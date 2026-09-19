import { useState } from "react";
import { Gauge, Layers, Settings2, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { MacOsWindowBar } from "./MacOsWindowBar";

type Tab = "dashboard" | "profile" | "tasks" | "settings";

// 截图为 v5.0.0 实际控制台（public/screenshots/docs/，1280×720），与文档保持同源；avif 优先、webp 兜底
const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; shot: string }[] = [
  { key: "dashboard", label: "仪表盘", icon: Gauge, shot: "/screenshots/docs/02-dashboard" },
  { key: "profile", label: "方案", icon: Settings2, shot: "/screenshots/docs/04-profile-auth" },
  { key: "tasks", label: "任务", icon: Layers, shot: "/screenshots/docs/11-tasks" },
  { key: "settings", label: "设置", icon: SlidersHorizontal, shot: "/screenshots/docs/06-settings-detection" },
];

export function DemoSection() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const activeShot = tabs.find((t) => t.key === tab)?.shot ?? tabs[0].shot;

  return (
    <section className="section-y bg-muted/30">
      <div className="container max-w-[1080px]">
        <SectionHeader title="控制台界面" subtitle="网络检测、方案配置与任务编排集中于同一控制台，无需在多个窗口之间切换。" />

        <div className="mx-auto flex w-fit rounded-full border bg-card p-1 shadow-sm">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition", active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-6 max-w-[920px] overflow-hidden rounded-2xl border bg-card shadow-2xl">
          <MacOsWindowBar className="h-11 border-b bg-muted/40 px-4" />
          <picture>
            <source srcSet={`${activeShot}.avif`} type="image/avif" />
            <img
              src={`${activeShot}.webp`}
              alt={`认证喵控制台 ${tabs.find((t) => t.key === tab)?.label ?? ""}界面截图`}
              width={1280}
              height={720}
              className="w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
