import { Link } from "react-router-dom";
import { useLatestRelease } from "@/hooks/useLatestRelease";
import { usePageMeta } from "@/hooks/usePageMeta";
import { SITE } from "@/data/site";

export default function ChangelogPage() {
  const { tag } = useLatestRelease();
  usePageMeta({
    title: "更新日志 — 认证喵",
    description: "认证喵（Campus-Auth）版本更新记录：新功能、修复与改进，完整发布见 GitHub Releases。",
    path: "/changelog",
  });
  return (
    <div className="pt-[64px] md:pt-[68px]">
      <div className="container max-w-[820px] py-12 md:py-16">
        <h1 className="text-display-sm">更新日志</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          当前 {tag} · 完整记录在仓库{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/changelog.md</code>
          ，站内文档已覆盖关键变更。
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm font-semibold">v5.0.0-alpha.10 · 2026-09-17</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>新增直连请求登录：简单门户无需 Python、Playwright 或浏览器</li>
              <li>方案按网络绑定浏览器任务，新增默认 / 调试运行模式与暂停时段控制</li>
              <li>更新文档、任务校验、OCR 环境与托盘入口，和当前实现保持一致</li>
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
            <Link to="/docs/maintenance/update" className="inline-flex h-10 items-center rounded-full border bg-card px-5 text-sm font-medium hover:bg-accent">
              查看站内文档
            </Link>
            <a href={`${SITE.repo}/releases`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
              在 GitHub 查看全部发布
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
