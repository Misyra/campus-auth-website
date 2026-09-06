import { SectionHeader } from "./SectionHeader";

const SHOTS = [
  { file: "dashboard.webp", label: "仪表盘" },
  { file: "profiles.webp", label: "配置方案" },
  { file: "tasks.webp", label: "任务管理" },
  { file: "ai-task.webp", label: "AI 生成" },
  { file: "monitor.webp", label: "网络检测" },
  { file: "browser.webp", label: "浏览器" },
  { file: "appearance.webp", label: "外观" },
  { file: "scheduled.webp", label: "定时任务" },
  { file: "scripts.webp", label: "自定义脚本" },
  { file: "settings.webp", label: "系统设置" },
] as const;

export function ScreenshotsSection() {
  return (
    <section id="screenshots" className="section-y bg-background">
      <div className="container max-w-[1280px]">
        <SectionHeader title="界面预览" />

        <div className="grid gap-5 md:grid-cols-2">
          {SHOTS.map((s) => (
            <figure key={s.file} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={`/screenshots/${s.file}`} alt="" className="h-full w-full object-cover object-top" loading="lazy" decoding="async" />
              </div>
              <figcaption className="border-t px-4 py-2.5 text-sm font-medium">{s.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
