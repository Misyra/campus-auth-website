import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { DOC_SECTIONS } from "@/content/docs/navigation";
import { fetchDocContent, getDocFilePath } from "@/content/docs";
import { setPageDescription } from "@/hooks/usePageMeta";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsMobileNav } from "@/components/docs/DocsMobileNav";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";
import { TableOfContents } from "@/components/docs/TableOfContents";

type Flat = { sid: string; iid: string; title: string };

// 兼容旧书签
function resolveIds(section: string | null, item: string | null): { sid: string; iid: string } {
  if (section === "automation" && item === "debug") {
    section = "tasks";
  }
  if (section === "system" && item === "faq") {
    section = "faq";
    item = "troubleshoot";
  }
  const sid = DOC_SECTIONS.find((s) => s.id === section)?.id ?? DOC_SECTIONS[0].id;
  const group = DOC_SECTIONS.find((s) => s.id === sid)!;
  const iid = group.items.find((x) => x.id === item)?.id ?? group.items[0].id;
  return { sid, iid };
}

function titleFor(sid: string, iid: string): string {
  const g = DOC_SECTIONS.find((s) => s.id === sid);
  const it = g?.items.find((x) => x.id === iid);
  return it ? `${it.title} — ${g!.title} · Campus-Auth 文档` : `${g?.title ?? "文档"} · Campus-Auth`;
}

export default function DocsPage() {
  const [params, setParams] = useSearchParams();
  const initial = resolveIds(params.get("section"), params.get("item"));
  const [sid, setSid] = useState(initial.sid);
  const [iid, setIid] = useState(initial.iid);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  // 同步外部 URL（如直接打开 /docs?section=tasks&item=browser）时的非法参数回落
  useEffect(() => {
    const { sid: nsid, iid: niid } = resolveIds(params.get("section"), params.get("item"));
    if (nsid !== sid || niid !== iid) {
      setSid(nsid);
      setIid(niid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    // 非法组合直接回落到已解析的 sid/iid
    const fp = getDocFilePath(sid, iid);
    if (!fp) {
      const fb = resolveIds(null, null);
      setSid(fb.sid);
      setIid(fb.iid);
      return;
    }
    setLoading(true);
    document.title = titleFor(sid, iid);
    setPageDescription("Campus-Auth 中文文档：安装上手、配置方案、认证任务、自动化与系统设置。");
    fetchDocContent(sid, iid).then((c) => {
      setContent(c);
      setLoading(false);
    });
    const p = new URLSearchParams();
    p.set("section", sid);
    p.set("item", iid);
    setParams(p, { replace: true });
    window.scrollTo(0, 0);
  }, [sid, iid, setParams]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onNavigate = useCallback((nsid: string, niid?: string) => {
    const g = DOC_SECTIONS.find((x) => x.id === nsid);
    const nid = niid ?? g?.items[0]?.id ?? DOC_SECTIONS[0].items[0].id;
    setSid(nsid);
    setIid(nid);
  }, []);

  const flat: Flat[] = useMemo(() => {
    const out: Flat[] = [];
    for (const s of DOC_SECTIONS) for (const it of s.items) out.push({ sid: s.id, iid: it.id, title: it.title });
    return out;
  }, []);
  const curIdx = flat.findIndex((x) => x.sid === sid && x.iid === iid);
  const prev = curIdx > 0 ? flat[curIdx - 1] : null;
  const next = curIdx >= 0 && curIdx < flat.length - 1 ? flat[curIdx + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <DocsSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={onNavigate} />
      <div className="pt-[64px] md:pt-[68px]">
        <div className="container max-w-[1400px] py-4 sm:py-6">
          <div className="flex gap-8">
            <div className="hidden lg:block">
              <button onClick={() => setSearchOpen(true)} className="mb-4 flex w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <Search className="h-4 w-4" />
                <span className="flex-1 text-left">搜索文档…</span>
                <kbd className="rounded border bg-background px-1.5 py-0.5 text-xs">⌘K</kbd>
              </button>
              <DocsSidebar sections={DOC_SECTIONS} activeSection={sid} activeItem={iid} onNavigate={onNavigate} />
            </div>

            <main className="min-w-0 flex-1">
              <motion.article key={`${sid}-${iid}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="max-w-none xl:max-w-3xl">
                <div className="pb-8">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    </div>
                  ) : (
                    <MarkdownRenderer content={content} />
                  )}
                </div>
                <div className="mt-8 border-t pt-6">
                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {prev ? (
                      <button onClick={() => onNavigate(prev.sid, prev.iid)} className="group flex flex-col items-start rounded-xl border bg-card p-4 text-left hover:bg-muted/50">
                        <span className="mb-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                          上一篇
                        </span>
                        <span className="font-medium">{prev.title}</span>
                      </button>
                    ) : (
                      <div />
                    )}
                    {next ? (
                      <button onClick={() => onNavigate(next.sid, next.iid)} className="group flex flex-col items-start rounded-xl border bg-card p-4 text-left hover:bg-muted/50 sm:items-end sm:text-right">
                        <span className="mb-1 flex items-center gap-1 text-sm text-muted-foreground">
                          下一篇
                          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                        <span className="font-medium">{next.title}</span>
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </motion.article>
            </main>

            <div className="hidden w-56 shrink-0 xl:block">
              <div className="sticky top-24">
                <TableOfContents content={content} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DocsMobileNav sections={DOC_SECTIONS} activeSection={sid} activeItem={iid} onNavigate={onNavigate} />
    </div>
  );
}
