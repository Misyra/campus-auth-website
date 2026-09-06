import { SectionHeader } from "./SectionHeader";

const SCENARIOS = [
  { title: "宿舍断线重连", shot: "/screenshots/dashboard.webp" },
  { title: "教学楼漫游", shot: "/screenshots/profiles.webp" },
  { title: "实验室 / 软路由", shot: "/screenshots/appearance.webp" },
  { title: "每日打卡", shot: "/screenshots/ai-task.webp" },
] as const;

export function ScenariosSection() {
  return (
    <section className="section-y bg-muted/20">
      <div className="container max-w-[1080px]">
        <SectionHeader title="覆盖真实校园场景" />
        <div className="grid gap-5 md:grid-cols-2">
          {SCENARIOS.map((s) => (
            <div key={s.title} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={s.shot} alt="" width={640} height={400} className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.015]" loading="lazy" decoding="async" />
              </div>
              <div className="px-4 py-3 text-sm font-medium">{s.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
