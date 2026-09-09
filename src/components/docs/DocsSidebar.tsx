import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocSection } from "@/content/docs/navigation";

// NapCatQQ 风格分组侧边栏：首组默认展开，其余折叠，点击组头仅展开/收起（不跳转），
// 组间以细分隔线区隔；路由所在组自动展开。
export function DocsSidebar({ sections, activeSection, activeItem, onNavigate }: { sections: DocSection[]; activeSection: string; activeItem?: string; onNavigate: (sid: string, iid?: string) => void }) {
  const [expanded, setExpanded] = useState<string[]>(() => {
    const base = [sections[0]?.id ?? activeSection];
    if (activeSection && !base.includes(activeSection)) base.push(activeSection);
    return base;
  });
  const toggle = (id: string) => setExpanded((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  useEffect(() => {
    setExpanded((p) => (p.includes(activeSection) ? p : [...p, activeSection]));
  }, [activeSection]);
  return (
    <aside className="w-64 shrink-0 lg:w-72">
      <nav className="sticky top-24">
        {sections.map((s, idx) => {
          const isExpanded = expanded.includes(s.id);
          return (
            <div key={s.id} className={cn("py-2.5", idx > 0 && "border-t border-border/60")}>
              <button
                onClick={() => toggle(s.id)}
                aria-expanded={isExpanded}
                className={cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors", activeSection === s.id ? "font-medium text-primary" : "font-medium text-foreground hover:text-primary")}
              >
                {s.icon ? <span className="text-primary/70">{s.icon}</span> : null}
                <span className="flex-1">{s.title}</span>
                <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.18 }}>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="ml-4 mt-1 space-y-0.5 border-l pl-3">
                      {s.items.map((it) => {
                        const active = activeSection === s.id && activeItem === it.id;
                        return (
                          <button key={it.id} onClick={() => onNavigate(s.id, it.id)} className={cn("w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors", active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                            {it.title}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
