import { SectionHeader } from "./SectionHeader";
import { SmartDownload } from "./SmartDownload";

export function DownloadSection() {
  return (
    <section id="download" className="section-y scroll-mt-24 bg-muted/30">
      <div className="container max-w-[1080px]">
        <SectionHeader title="下载" subtitle="根据操作系统自动推荐对应版本，也可在 GitHub Releases 页面查看全部分发与校验文件。" />
        <SmartDownload />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm font-semibold">Docker 运行</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">运行环境已预装，无需另行下载 uv 与 Playwright。</p>
            <pre className="mt-3 overflow-auto rounded-xl bg-muted p-4 font-mono text-xs leading-relaxed">
{`docker compose up -d --build
curl http://localhost:50721/api/health`}
            </pre>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm font-semibold">校验与运行</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">下载页附带 .sha256 校验文件，校验通过后可直接运行。</p>
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
