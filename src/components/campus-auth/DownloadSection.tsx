import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, Rocket, MonitorDown, FileCheck2, ScrollText } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SmartDownload } from "./SmartDownload";
import { useLatestRelease } from "@/hooks/useLatestRelease";

/** 代码块 + 右上角复制按钮（与文档页代码块行为一致） */
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative mt-3">
      <pre className="overflow-auto rounded-xl bg-muted p-4 font-mono text-xs leading-relaxed">{code}</pre>
      <button
        aria-label="复制命令"
        className="absolute right-2 top-2 rounded-lg border border-border/50 bg-card/80 p-1.5 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {
            /* 剪贴板不可用时静默 */
          }
        }}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
    </div>
  );
}

const NEXT_STEPS = [
  {
    icon: Rocket,
    title: "启动程序",
    desc: "解压到固定目录后运行主程序，浏览器会自动打开本机控制台。",
    href: "/docs/getting-started/install",
    link: "分平台安装说明",
  },
  {
    icon: MonitorDown,
    title: "完成初始化",
    desc: "在初始化向导中同意协议（需滚动到弹窗底部），进入控制台仪表盘。",
    href: "/docs/getting-started/start",
    link: "新手上路",
  },
  {
    icon: FileCheck2,
    title: "填写方案即用",
    desc: "编辑内置方案填入校园网账号，内置通用登录任务多数校园网开箱即用。",
    href: "/docs/getting-started/start",
    link: "首次配置",
  },
];

export function DownloadSection() {
  const { tag } = useLatestRelease();
  return (
    <section id="download" className="section-y scroll-mt-24 bg-muted/30">
      <div className="container max-w-[1080px]">
        <SectionHeader title="下载" subtitle="根据操作系统自动推荐对应版本，也可在 GitHub Releases 页面查看全部分发与校验文件。" />
        <SmartDownload />

        {/* 安装后的三步 */}
        <div className="mt-10">
          <h2 className="text-base font-semibold">下载之后</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {NEXT_STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border bg-card p-5">
                <span className="absolute right-4 top-4 font-mono text-3xl font-bold text-muted-foreground/15">{i + 1}</span>
                <s.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                <Link to={s.href} className="mt-3 inline-block text-xs font-medium text-primary hover:underline">
                  {s.link} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm font-semibold">Docker 运行</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              镜像已预装 Python 与 Chromium，默认拉取 GHCR 预构建多架构镜像，无需本地构建。
            </p>
            <CodeBlock code={"docker compose pull && docker compose up -d\ncurl http://localhost:50721/api/health"} />
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm font-semibold">校验与运行</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">下载页附带 .sha256 校验文件，校验通过后可直接运行。</p>
            <CodeBlock code={"sha256sum -c campus-auth-*.sha256\n./campus-auth\n./campus-auth --mode login-once"} />
          </div>
        </div>

        {/* 更新日志入口 */}
        <Link
          to="/changelog"
          className="group mt-6 flex items-center gap-4 rounded-2xl border bg-card p-5 transition-colors hover:bg-accent/50"
        >
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary/10">
            <ScrollText className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              {tag} 更新了什么？
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">直连请求登录、任务按方案绑定、手动更新与 AI 生成增强——查看更新日志精选。</p>
          </div>
          <span className="flex-none text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </section>
  );
}
