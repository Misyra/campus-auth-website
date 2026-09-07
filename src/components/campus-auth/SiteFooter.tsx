import { Github, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "@/data/site";
import { QqGroupPill } from "@/components/campus-auth/QqGroup";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card/50">
      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 rounded-md bg-white p-1" />
              <span className="font-bold">{SITE.name}</span>
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">AGPL-3.0</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">校园网自动认证 · 解压即用。</p>
          </div>

          <div className="flex gap-10 text-sm">
            <div>
              <p className="font-semibold">产品</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li><Link to="/#features" className="hover:text-foreground">功能特性</Link></li>
                <li><Link to="/#download" className="hover:text-foreground">下载</Link></li>
                <li><Link to="/changelog" className="hover:text-foreground">更新日志</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">资源</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li><Link to={SITE.docsUrl} className="hover:text-foreground">使用文档</Link></li>
                <li><Link to="/docs/tasks/browser" className="hover:text-foreground">任务编写</Link></li>
              </ul>
            </div>
            <div className="flex flex-wrap items-start gap-2 pt-1">
              <a href={SITE.repo} target="_blank" rel="noreferrer" aria-label="GitHub" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background"><Github className="h-4 w-4" /></a>
              <a href={SITE.releaseBase} target="_blank" rel="noreferrer" aria-label="Releases" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background"><Download className="h-4 w-4" /></a>
              <Link to={SITE.docsUrl} aria-label="Docs" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background"><FileText className="h-4 w-4" /></Link>
              <QqGroupPill />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-sm text-muted-foreground">© {new Date().getFullYear()} Campus-Auth · <a href="https://github.com/Misyra/campus-auth-website/blob/main/LICENSE" target="_blank" rel="noreferrer" className="underline hover:text-foreground">AGPL-3.0</a> · <a href="https://github.com/Misyra/campus-auth-website" target="_blank" rel="noreferrer" className="underline hover:text-foreground">网站源码</a> · Misyra</div>
      </div>
    </footer>
  );
}
