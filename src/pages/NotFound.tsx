import { Link } from "react-router-dom";
import { BookOpen, Home, ScrollText } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function NotFound() {
  usePageMeta({ title: "页面未找到 — 认证喵 Campus-Auth", path: "/404" });
  return (
    <div className="container flex min-h-[calc(100vh-320px)] max-w-[720px] flex-col justify-center py-20 pt-28">
      <p className="font-mono text-6xl font-bold text-primary/25">404</p>
      <h1 className="mt-4 text-display-sm">页面未找到</h1>
      <p className="mt-3 text-sm text-muted-foreground">该路径不存在。旧版文档地址已迁移，可从下方入口继续浏览。</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Home className="h-4 w-4" />
          返回首页
        </Link>
        <Link to="/docs/getting-started/start" className="inline-flex h-10 items-center gap-1.5 rounded-full border bg-card px-5 text-sm font-medium transition-colors hover:bg-accent">
          <BookOpen className="h-4 w-4" />
          快速开始
        </Link>
        <Link to="/changelog" className="inline-flex h-10 items-center gap-1.5 rounded-full border bg-card px-5 text-sm font-medium transition-colors hover:bg-accent">
          <ScrollText className="h-4 w-4" />
          更新日志
        </Link>
      </div>
    </div>
  );
}
