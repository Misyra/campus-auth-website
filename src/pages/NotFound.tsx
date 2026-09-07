import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function NotFound() {
  usePageMeta({ title: "页面未找到 — Campus-Auth", path: "/404" });
  return (
    <div className="container max-w-[720px] py-20 pt-28">
      <h1 className="text-display-sm">页面未找到</h1>
      <p className="mt-3 text-sm text-muted-foreground">该路径不存在，返回首页继续浏览。</p>
      <Link to="/" className="mt-6 inline-flex h-10 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">
        返回首页
      </Link>
    </div>
  );
}
