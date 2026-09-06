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
    if (hash) {
      try {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      } catch {
        // 非法选择器（URL 中异常 hash）按无锚点处理
      }
    }
    window.scrollTo(0, 0);
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
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
