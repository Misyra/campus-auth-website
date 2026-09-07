import { ArrowLeftRight, Clock3, Layers, ScanSearch, Sparkles, Wifi } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { FEATURES } from "@/data/site";

const iconMap = {
  Wifi,
  ArrowLeftRight,
  Layers,
  ScanSearch,
  Clock3,
  Sparkles,
} as const;

export function FeaturesSection() {
  return (
    <section id="features" className="section-y bg-background">
      <div className="container max-w-[1220px]">
        <SectionHeader
          eyebrow="WHY CAMPUS-AUTH"
          title={<>为校园网而生的<br />自动化套件</>}
          subtitle="cc-switch 把 Codex 代理到免费 API，Campus-Auth 把你的登录页代理到本地后台——从检测到登录到打卡，覆盖宿舍、教学楼与软路由，换个网络也能无感接上。"
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = iconMap[f.icon];
            return (
              <div key={f.title} className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-[15px] font-semibold leading-snug">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
          参考 MAA「一键长草」与 cc-switch「三步上手」的叙事：把零碎的手动操作收敛为一个常驻的本地小助手——开箱即用，不打扰日常。
        </p>
      </div>
    </section>
  );
}
