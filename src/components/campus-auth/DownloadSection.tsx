import { SectionHeader } from "./SectionHeader";
import { SmartDownload } from "./SmartDownload";

export function DownloadSection() {
  return (
    <section id="download" className="section-y bg-muted/30">
      <div className="container max-w-[1080px]">
        <SectionHeader title="下载" subtitle="自动识别系统并直跳 GitHub 最新发布；展开查看全部平台。" />
        <SmartDownload />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm font-semibold">Docker</p>
            <pre className="mt-3 overflow-auto rounded-xl bg-muted p-4 font-mono text-xs leading-relaxed">
{`docker compose up -d --build
curl http://localhost:50721/api/health`}
            </pre>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm font-semibold">校验与运行</p>
            <pre className="mt-3 overflow-auto rounded-xl bg-muted p-4 font-mono text-xs leading-relaxed">
{`sha256sum -c campus-auth-*.sha256
./campus-auth
./campus-auth --mode once`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
