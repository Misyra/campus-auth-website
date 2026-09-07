import { SectionHeader } from "./SectionHeader";

export function TechSection() {
  return (
    <section className="section-y bg-background">
      <div className="container max-w-[1080px]">
        <SectionHeader
          title="稳重、可移植、易排障"
          subtitle="单二进制 + Python Worker 按需启动，账户本地加密、端口自动避让，出问题有日志与一键取证。"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
            <img src="/screenshots/browser.webp" alt="" width={1280} height={800} className="w-full object-contain" loading="lazy" decoding="async" />
          </div>

          <div className="overflow-hidden rounded-2xl border bg-[#0f172a] text-slate-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="text-xs font-semibold tracking-widest text-slate-300">campus-auth/</span>
              <span className="rounded bg-white/10 px-2 py-1 font-mono text-xs">单二进制</span>
            </div>
            <pre className="overflow-auto p-4 font-mono text-xs leading-relaxed">
{`campus-auth(.exe)      # 主程序
resources/              # 图标与脚本
python_worker/          # 浏览器与 OCR

./campus-auth             # 默认仅监听 127.0.0.1:50721
./campus-auth --mode login-once   # 单次登录后退出`}
            </pre>
            <p className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-slate-300">Windows / macOS / Linux · Docker · 端口冲突自动重试，日志落盘可回溯。</p>
          </div>
        </div>
      </div>
    </section>
  );
}
