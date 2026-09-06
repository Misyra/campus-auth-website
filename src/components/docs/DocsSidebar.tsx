import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocSection } from "@/content/docs/navigation";

export function DocsSidebar({ sections, activeSection, activeItem, onNavigate }: { sections: DocSection[]; activeSection: string; activeItem?: string; onNavigate: (sid: string, iid?: string) => void }) {
  const [expanded, setExpanded] = useState<string[]>([activeSection]);
  const toggle = (id: string) => setExpanded((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <aside className="w-64 shrink-0 lg:w-72">
      <nav className="sticky top-24 space-y-1">
        {sections.map((s) => {
          const isExpanded = expanded.includes(s.id);
          const isActiveRoot = activeSection === s.id && !activeItem;
          return (
            <div key={s.id}>
              <button
                onClick={() => {
                  toggle(s.id);
                  onNavigate(s.id);
                }}
                className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors", isActiveRoot ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
              >
                {s.icon ? <span className="text-primary/70">{s.icon}</span> : null}
                <span className="flex-1">{s.title}</span>
                <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.18 }}>
                  <ChevronRight className="h-4 w-4" />
                </motion.span>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="ml-6 mt-1 space-y-0.5 border-l pl-3">
                      {s.items.map((it) => {
                        const active = activeSection === s.id && activeItem === it.id;
                        return (
                          <button key={it.id} onClick={() => onNavigate(s.id, it.id)} className={cn("w-full rounded-lg px-3 py-2 text-left text-sm transition-colors", active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
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
