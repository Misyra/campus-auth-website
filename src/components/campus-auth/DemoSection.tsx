import { useState } from "react";
import { Activity, Clock3, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { MacOsWindowBar } from "./MacOsWindowBar";

type Tab = "monitor" | "tasks" | "schedule";

const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; shot: string }[] = [
  { key: "monitor", label: "检测 · 配置", icon: Activity, shot: "monitor" },
  { key: "tasks", label: "任务 · 步骤", icon: Layers, shot: "tasks" },
  { key: "schedule", label: "定时 · 排班", icon: Clock3, shot: "scheduled" },
];

export function DemoSection() {
  const [tab, setTab] = useState<Tab>("monitor");
  const activeShot = tabs.find((t) => t.key === tab)?.shot ?? tabs[0].shot;

  return (
    <section className="section-y bg-muted/30">
      <div className="container max-w-[1080px]">
        <SectionHeader title="控制台界面" subtitle="网络检测、任务编排与定时调度集中于同一控制台，无需在多个窗口之间切换。" />

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
            <source srcSet={`/screenshots/${activeShot}.avif`} type="image/avif" />
            <img src={`/screenshots/${activeShot}.webp`} alt="" width={1280} height={800} className="w-full object-contain" loading="lazy" decoding="async" />
          </picture>
        </div>
      </div>
    </section>
  );
}
