import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// 代码块语言标签的显示归一化（与构建期 markdown-plugin 的 LANG_ALIAS 保持一致）
const LANG_ALIAS: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  terminal: "bash",
  py: "python",
  yml: "yaml",
};

/**
 * MarkdownRenderer — 展示构建时预渲染的 HTML（见 scripts/markdown-plugin.mjs）。
 * 运行时只做轻量交互：代码复制按钮、外链新窗口、图片懒加载。
 */
export function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 给每个代码块加语言标签 + 复制按钮（外层 wrap 由运行时补齐，构建期 HTML 只有裸 <pre>）
    const pres = container.querySelectorAll("pre");
    const cleanups: Array<() => void> = [];

    pres.forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-wrap")) return;
      const code = pre.querySelector("code");
      if (!code) return;
      const text = code.textContent ?? "";
      const raw = /language-([\w+-]+)/.exec(code.className)?.[1]?.toLowerCase() ?? "text";
      const lang = LANG_ALIAS[raw] ?? raw;

      const wrap = document.createElement("div");
      wrap.className = "code-wrap group relative max-w-full";

      const label = document.createElement("div");
      label.className =
        "pointer-events-none absolute left-3 top-2 z-10 select-none text-[11px] uppercase tracking-wider text-muted-foreground/60";
      label.textContent = lang;

      const btn = document.createElement("button");
      btn.className =
        "absolute right-2 top-2 z-10 rounded-lg border border-border/50 bg-muted/80 p-2 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100";
      btn.setAttribute("aria-label", "复制代码");
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;

      const onClick = async () => {
        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><polyline points="20 6 9 17 4 12"/></svg>`;
          setTimeout(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
          }, 1800);
        } catch {
          // 剪贴板写入失败时静默忽略
        }
      };
      btn.addEventListener("click", onClick);

      // 把 pre 移到 wrap 里
      const prevParent = pre.parentNode;
      pre.parentNode?.insertBefore(wrap, pre);
      wrap.append(pre, label, btn);

      // cleanup 时还原 DOM：StrictMode 卸载重挂会重跑本 effect，
      // 不还原的话会叠两层 wrap、旧按钮监听丢失（复制失效）
      cleanups.push(() => {
        btn.removeEventListener("click", onClick);
        prevParent?.insertBefore(pre, wrap);
        wrap.remove();
      });
    });

    // 表格补横向滚动容器（构建期 HTML 只有裸 <table>，宽表在窄屏会撑破布局）
    const tables = container.querySelectorAll("table");
    tables.forEach((table) => {
      if (table.parentElement?.classList.contains("table-wrap")) return;
      const wrap = document.createElement("div");
      wrap.className = "table-wrap mb-6 max-w-full overflow-x-auto rounded-xl border";
      const prevParent = table.parentNode;
      table.parentNode?.insertBefore(wrap, table);
      wrap.appendChild(table);
      cleanups.push(() => {
        prevParent?.insertBefore(table, wrap);
        wrap.remove();
      });
    });

    // 外链新窗口打开
    const links = container.querySelectorAll('a[href^="http"]');
    links.forEach((a) => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });

    // 图片懒加载
    const imgs = container.querySelectorAll("img");
    imgs.forEach((img) => {
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      img.classList.add("my-6", "max-w-full", "rounded-xl", "border", "shadow-lg");
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={cn("prose-docs max-w-full [overflow-wrap:break-word]", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
