import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Menu, Moon, Sun, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/data/site";
import { useLatestRelease } from "@/hooks/useLatestRelease";

export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { tag } = useLatestRelease();
  const loc = useLocation();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => setOpen(false), [loc.pathname]);

  function handleDownloadClick(e: React.MouseEvent) {
    if (loc.pathname === "/") {
      e.preventDefault();
      document.getElementById("download")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
      return;
    }
    // 非首页：跳到 /download
    // 让 Link 默认行为处理，这里仅关闭抽屉
    setOpen(false);
  }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:shadow">
        跳到主要内容
      </a>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all",
          scrolled ? "bg-background/85 backdrop-blur-xl shadow-sm" : "border-transparent bg-transparent",
        )}
      >
        <div className="container flex h-[64px] items-center justify-between gap-4 md:h-[68px]">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img src="/logo.png" alt="Campus-Auth" width={32} height={32} className="h-8 w-8 shrink-0 rounded-lg bg-white p-1 shadow-sm" />
            <span className="text-[15px] font-bold tracking-tight md:text-[16px]">{SITE.name}</span>
            <span className="hidden items-center rounded-full border bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary md:inline-flex">
              {tag}
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.href} className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card hover:bg-accent"
                aria-label="切换主题"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            )}
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            {loc.pathname === "/" ? (
              <a
                href="#download"
                onClick={handleDownloadClick}
                className="inline-flex h-9 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
              >
                免费下载
              </a>
            ) : (
              <Link
                to="/download"
                className="inline-flex h-9 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
              >
                免费下载
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card" aria-label="切换主题">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            <button onClick={() => setOpen((v) => !v)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-card" aria-label={open ? "关闭菜单" : "打开菜单"} aria-expanded={open}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 pt-[64px] backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <div className="container flex flex-col gap-1 py-6" onClick={(e) => e.stopPropagation()}>
              {NAV_LINKS.map((l) => (
                <Link key={l.label} to={l.href} className="rounded-xl px-4 py-3 text-[17px] font-semibold hover:bg-accent">
                  {l.label}
                </Link>
              ))}
              {loc.pathname === "/" ? (
                <a href="#download" onClick={handleDownloadClick} className="mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground">
                  免费下载
                </a>
              ) : (
                <Link to="/download" onClick={() => setOpen(false)} className="mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground">
                  免费下载
                </Link>
              )}
              <a href={SITE.repo} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 py-4 text-muted-foreground">
                <Github className="h-5 w-5" /> GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
