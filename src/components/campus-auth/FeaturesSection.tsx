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
    <section id="features" className="section-y scroll-mt-24 bg-background">
      <div className="container max-w-[1220px]">
        <SectionHeader
          eyebrow="WHY CAMPUS-AUTH"
          title={<>面向校园网场景的<br />自动化工具</>}
          subtitle="涵盖断线检测、自动登录与定时任务，适用于宿舍、教学楼及软路由环境。全部流程在本地执行，账号数据不出本机。"
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
      </div>
    </section>
  );
}
