import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { DOC_SECTIONS } from "@/content/docs/navigation";
import { fetchDocContent } from "@/content/docs";

type Hit = { sid: string; iid?: string; title: string; group: string; excerpt?: string };

export function DocsSearch({ isOpen, onClose, onNavigate }: { isOpen: boolean; onClose: () => void; onNavigate: (sid: string, iid?: string) => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [bodyHits, setBodyHits] = useState<Hit[]>([]);

  const titleIndex = useMemo(() => {
    const out: Hit[] = [];
    for (const s of DOC_SECTIONS) {
      out.push({ sid: s.id, title: s.title, group: s.title });
      for (const it of s.items) out.push({ sid: s.id, iid: it.id, title: it.title, group: s.title });
    }
    return out;
  }, []);

  const titleFiltered = useMemo(() => {
    if (!q.trim()) return titleIndex.slice(0, 8);
    const low = q.toLowerCase();
    return titleIndex.filter((x) => x.title.toLowerCase().includes(low)).slice(0, 8);
  }, [q, titleIndex]);

  // 正文检索：仅在无标题命中时触发，按需拉 md 文本匹配 excerpt
  useEffect(() => {
    if (!isOpen || !q.trim() || titleFiltered.length > 0) {
      setBodyHits([]);
      return;
    }
    let cancelled = false;
    const low = q.toLowerCase();
    (async () => {
      const out: Hit[] = [];
      for (const s of DOC_SECTIONS) {
        for (const it of s.items) {
          if (out.length >= 8) break;
          const md = await fetchDocContent(s.id, it.id);
          const plain = md.replace(/[#*`>[\]()]/g, " ").toLowerCase();
          const pos = plain.indexOf(low);
          if (pos >= 0) {
            const start = Math.max(0, pos - 32);
            const excerpt = plain.slice(start, start + 72).replace(/\s+/g, " ").trim();
            out.push({ sid: s.id, iid: it.id, title: it.title, group: s.title, excerpt });
          }
        }
      }
      if (!cancelled) setBodyHits(out.slice(0, 8));
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, q, titleFiltered.length]);

  const filtered = titleFiltered.length > 0 ? titleFiltered : bodyHits;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((p) => (p < filtered.length - 1 ? p + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((p) => (p > 0 ? p - 1 : filtered.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const r = filtered[idx];
        if (r) {
          onNavigate(r.sid, r.iid);
          onClose();
        }
      } else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, filtered, idx, onNavigate, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQ("");
      setIdx(0);
      setBodyHits([]);
    }
  }, [isOpen]);

  useEffect(() => setIdx(0), [q]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.97, y: -12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -12 }} transition={{ duration: 0.15 }} className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 px-4">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl">
              <div className="flex items-center gap-3 border-b px-4 py-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索文档…" className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none" autoFocus />
                <kbd className="hidden rounded border bg-muted px-2 py-1 text-xs text-muted-foreground sm:inline-flex">ESC</kbd>
              </div>
              <div className="max-h-[380px] overflow-y-auto p-2">
                {filtered.length ? (
                  <div className="space-y-1">
                    {filtered.map((r, i) => (
                      <button key={`${r.sid}-${r.iid ?? ""}`} onClick={() => { onNavigate(r.sid, r.iid); onClose(); }} onMouseEnter={() => setIdx(i)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors", idx === i ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted")}>
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="truncate text-sm font-medium">{r.title}</span>
                          {r.excerpt ? <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{r.excerpt}</span> : null}
                        </span>
                        <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">{r.group}</span>
                        <ArrowRight className={cn("h-4 w-4 shrink-0 transition-opacity", idx === i ? "opacity-100" : "opacity-0")} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">无结果：{q || "输入关键词"}</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
