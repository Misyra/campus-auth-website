import { Link } from "react-router-dom";
import { useLatestRelease } from "@/hooks/useLatestRelease";
import { usePageMeta } from "@/hooks/usePageMeta";
import { SITE } from "@/data/site";

export default function ChangelogPage() {
  const { tag } = useLatestRelease();
  usePageMeta({
    title: "更新日志 — Campus-Auth",
    description: "Campus-Auth 版本更新记录：新功能、修复与改进，完整发布见 GitHub Releases。",
    path: "/changelog",
  });
  return (
    <main className="pt-[64px] md:pt-[68px]">
      <div className="container max-w-[820px] py-12 md:py-16">
        <h1 className="text-display-sm">更新日志</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          当前 {tag} · 完整记录在仓库{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/changelog.md</code>
          ，站内文档已覆盖关键变更。
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm font-semibold">{tag} · 2026-09-05</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>AI 任务生成实测与执行结果修复</li>
              <li>模型配置可收起、浏览器高级启动参数、手动执行误报修复</li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm font-semibold">v5.0.0-alpha.7</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>重定向型门户 trigger_url · 内置默认登录任务（include_str! 编进二进制）</li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm font-semibold">v5.0.0 · 2026-09-02</p>
            <p className="mt-2 text-sm text-muted-foreground">正式版基线，四端统一与全面检查修复。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/docs?section=system&item=update" className="inline-flex h-10 items-center rounded-full border bg-card px-5 text-sm font-medium hover:bg-accent">
              查看站内文档
            </Link>
            <a href={`${SITE.repo}/releases`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
              在 GitHub 查看全部发布
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
