import { useEffect, useMemo, useState } from "react";
import { cn, scrollToAnchor } from "@/lib/utils";

export function TableOfContents({ content, className }: { content: string; className?: string }) {
  const [active, setActive] = useState("");

  // 从构建时预渲染的 HTML 里提取 h1-h3 标题（含 id）
  const headings = useMemo(() => {
    const re = /<h([1-3])\s+id="([^"]+)"[^>]*>(.*?)<\/h\1>/g;
    const out: { id: string; text: string; level: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(content))) {
      const level = parseInt(m[1], 10);
      const id = m[2];
      // 去掉标题里可能的 HTML 标签
      const text = m[3].replace(/<[^>]+>/g, "").trim();
      out.push({ id, text, level });
    }
    return out;
  }, [content]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0 },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;
  return (
    <nav className={cn("text-sm", className)}>
      <p className="mb-4 font-semibold">本页内容</p>
      <ul className="space-y-2">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: (h.level - 1) * 12 }}>
            <button onClick={() => scrollToAnchor(h.id)} className={cn("w-full py-1 text-left transition-colors hover:text-foreground", active === h.id ? "font-medium text-primary" : "text-muted-foreground")}>
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
