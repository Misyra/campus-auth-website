import { SectionHeader } from "./SectionHeader";
import { SmartDownload } from "./SmartDownload";

export function DownloadSection() {
  return (
    <section id="download" className="section-y bg-muted/30">
      <div className="container max-w-[1080px]">
        <SectionHeader title="下载" subtitle="自动识别你的系统，一键直达 GitHub 最新发布；展开可看全部平台与校验方式。" />
        <SmartDownload />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm font-semibold">Docker 一键起</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">已预装完整环境，无需再等 uv / Playwright 下载。</p>
            <pre className="mt-3 overflow-auto rounded-xl bg-muted p-4 font-mono text-xs leading-relaxed">
{`docker compose up -d --build
curl http://localhost:50721/api/health`}
            </pre>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm font-semibold">校验与运行</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">下载页附 .sha256，校验后即开即用。</p>
            <pre className="mt-3 overflow-auto rounded-xl bg-muted p-4 font-mono text-xs leading-relaxed">
{`sha256sum -c campus-auth-*.sha256
./campus-auth
./campus-auth --mode login-once`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
