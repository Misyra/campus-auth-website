import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { DocsSidebar } from "./DocsSidebar";
import type { DocSection } from "@/content/docs/navigation";

export function DocsMobileNav({ sections, activeSection, activeItem, onNavigate }: { sections: DocSection[]; activeSection: string; activeItem?: string; onNavigate: (sid: string, iid?: string) => void }) {
  const [open, setOpen] = useState(false);
  const go = (sid: string, iid?: string) => {
    onNavigate(sid, iid);
    setOpen(false);
  };
  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-lg hover:bg-primary/90 lg:hidden" aria-label="打开文档导航">
        <Menu className="h-6 w-6" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto border-r bg-background shadow-xl lg:hidden">
              <div className="flex items-center justify-between border-b p-4">
                <span className="font-semibold">文档</span>
                <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-muted" aria-label="关闭">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <DocsSidebar sections={sections} activeSection={activeSection} activeItem={activeItem} onNavigate={go} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
