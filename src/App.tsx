import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SiteNavbar } from "@/components/campus-auth/SiteNavbar";
import { SiteFooter } from "@/components/campus-auth/SiteFooter";

const Home = lazy(() => import("@/pages/Home"));
const DownloadPage = lazy(() => import("@/pages/DownloadPage"));
const DocsPage = lazy(() => import("@/pages/DocsPage"));
const ChangelogPage = lazy(() => import("@/pages/ChangelogPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // instant：不继承 html 的 scroll-behavior: smooth，换页应瞬移
    const toTop = () => window.scrollTo({ top: 0, behavior: "instant" });
    if (!hash) {
      toTop();
      return;
    }
    // 目标可能在懒加载的路由里，首帧还不存在；用 rAF 轮询等它挂载（约 0.5s 上限）
    let raf = 0;
    let tries = 0;
    const tryScroll = () => {
      let el: Element | null = null;
      try {
        el = document.querySelector(hash);
      } catch {
        // 非法选择器（URL 中异常 hash）按无锚点处理
      }
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (tries++ < 30) {
        raf = requestAnimationFrame(tryScroll);
      } else {
        toTop();
      }
    };
    tryScroll();
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <ScrollToTop />
      <main id="main">
        <Suspense fallback={<div className="container py-20 text-sm text-muted-foreground" aria-live="polite">加载中…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/download" element={<DownloadPage />} />
            {/* /docs 与 /docs/:section 由 DocsPage 内部规范化跳转到 /docs/:section/:item */}
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/docs/:section" element={<DocsPage />} />
            <Route path="/docs/:section/:item" element={<DocsPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
