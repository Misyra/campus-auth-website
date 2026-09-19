import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Github } from "lucide-react";
import { useLatestRelease } from "@/hooks/useLatestRelease";
import { usePageMeta } from "@/hooks/usePageMeta";
import { SITE } from "@/data/site";
import { CHANGELOG, CATEGORY_META, releaseLink } from "@/data/changelog";

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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-display-sm">更新日志</h1>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>当前版本</span>
              <code className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">{tag}</code>
              <span>· 精选重要变化，逐项记录见仓库</span>
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">docs/updatelog.md</code>
            </p>
          </div>
          <a
            href={`${SITE.repo}/releases`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border bg-card px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Github className="h-4 w-4" />
            全部发布
          </a>
        </div>

        {/* 版本时间线 */}
        <div className="relative mt-10 space-y-10 border-l border-border pl-6 md:pl-8">
          {CHANGELOG.map((v, vi) => (
            <section key={v.version} className="relative">
              {/* 时间线节点 */}
              <span
                aria-hidden
                className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-background md:-left-[39px] ${
                  vi === 0 ? "bg-primary ring-4 ring-primary/15" : "bg-muted-foreground/40"
                }`}
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h2 className="font-mono text-xl font-bold tracking-tight">
                  <a id={v.version.slice(1)} href={`#${v.version.slice(1)}`} className="transition-colors hover:text-primary" title="复制此版本的链接">
                    {v.version}
                  </a>
                </h2>
                <time className="text-sm text-muted-foreground">{v.date}</time>
                {v.channel === "stable" ? (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">正式版</span>
                ) : (
                  <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">预览版</span>
                )}
                {vi === 0 && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    最新
                  </span>
                )}
                <a
                  href={releaseLink(v.version)}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{v.summary}</p>

              <div className="mt-5 space-y-6">
                {v.sections.map((sec) => {
                  const meta = CATEGORY_META[sec.category];
                  return (
                    <div key={sec.category}>
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${meta.cls}`}>{meta.label}</span>
                      <ul className="mt-2.5 space-y-2">
                        {sec.items.map((item) => (
                          <li key={item.text} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                            <span aria-hidden className="mt-[9px] h-1 w-1 flex-none rounded-full bg-muted-foreground/50" />
                            <span>
                              {item.text}
                              {item.doc && (
                                <>
                                  {" "}
                                  <Link to={item.doc.href} className="font-medium text-primary underline-offset-2 hover:underline">
                                    {item.doc.label} ↗
                                  </Link>
                                </>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* 底部入口 */}
        <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
          <Link
            to="/docs/getting-started/start"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <BookOpen className="h-4 w-4" />
            阅读使用文档
          </Link>
          <Link
            to="/download"
            className="inline-flex h-10 items-center rounded-full border bg-card px-5 text-sm font-medium transition-colors hover:bg-accent"
          >
            下载最新版本
          </Link>
          <a
            href={`${SITE.repo}/blob/master/docs/updatelog.md`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border bg-card px-5 text-sm font-medium transition-colors hover:bg-accent"
          >
            完整更新记录
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
