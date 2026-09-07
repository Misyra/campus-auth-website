import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { DOC_SECTIONS } from "@/content/docs/navigation";
import { getDocContent } from "@/content/docs";
import { usePageMeta } from "@/hooks/usePageMeta";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsMobileNav } from "@/components/docs/DocsMobileNav";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { QqGroupCard } from "@/components/campus-auth/QqGroup";

type Flat = { sid: string; iid: string; title: string };

// 兼容旧书签（?section=/&item= 时代的非法/改名组合回落）
function resolveIds(section: string | undefined, item: string | undefined): { sid: string; iid: string } {
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
  return it ? `${it.title} — ${g!.title} · Campus-Auth 文档` : `${g?.title ?? "文档"} · Campus-Auth 文档`;
}

export default function DocsPage() {
  const navigate = useNavigate();
  const { section, item } = useParams();
  const [searchParams] = useSearchParams();
  const [searchOpen, setSearchOpen] = useState(false);

  const { sid, iid } = resolveIds(section, item);

  // URL 规范化（单一 effect，避免多次 navigate 相互覆盖）：
  // 1) 旧链接 /docs?section=x&item=y → 路径式 /docs/x/y
  // 2) 非法/缺省组合（/docs、/docs/:section）→ 完整默认文档 URL
  useEffect(() => {
    const ls = searchParams.get("section");
    const li = searchParams.get("item");
    if (ls || li) {
      const r = resolveIds(ls ?? undefined, li ?? undefined);
      navigate(`/docs/${r.sid}/${r.iid}`, { replace: true });
      return;
    }
    if (section !== sid || item !== iid) {
      navigate(`/docs/${sid}/${iid}`, { replace: true });
    }
  }, [searchParams, section, item, sid, iid, navigate]);

  // 文档内容构建时已打包，同步取用，无 loading 态
  const content = useMemo(() => getDocContent(sid, iid), [sid, iid]);

  // 文档页每个 section/item 是独立 URL：canonical 必须自引用，否则 sitemap 里的
  // 24 个文档 URL 会被判成重复页
  usePageMeta({
    title: titleFor(sid, iid),
    description: "Campus-Auth 中文文档：安装上手、配置方案、认证任务、自动化与系统设置。",
    path: `/docs/${sid}/${iid}`,
  });

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

  // 提示键按平台显示 ⌘ / Ctrl
  const modKey = useMemo(() => (/mac|iphone|ipad/i.test(navigator.userAgent) ? "⌘" : "Ctrl"), []);

  const onNavigate = useCallback(
    (nsid: string, niid?: string) => {
      const g = DOC_SECTIONS.find((x) => x.id === nsid);
      const nid = niid ?? g?.items[0]?.id ?? DOC_SECTIONS[0].items[0].id;
      navigate(`/docs/${nsid}/${nid}`);
    },
    [navigate],
  );

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
                <kbd className="rounded border bg-background px-1.5 py-0.5 text-xs">{modKey} K</kbd>
              </button>
              <DocsSidebar sections={DOC_SECTIONS} activeSection={sid} activeItem={iid} onNavigate={onNavigate} />
            </div>

            <div className="min-w-0 flex-1">
              <motion.article key={`${sid}-${iid}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="max-w-none xl:max-w-3xl">
                <div className="pb-8">
                  <MarkdownRenderer content={content} />
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
            </div>

            <div className="hidden w-56 shrink-0 xl:block">
              <div className="sticky top-24">
                <TableOfContents content={content} />
                <QqGroupCard />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DocsMobileNav sections={DOC_SECTIONS} activeSection={sid} activeItem={iid} onNavigate={onNavigate} />
    </div>
  );
}
