import { useEffect } from "react";

const CANONICAL_BASE = "https://campus-auth.misyra.dev";

function setMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.assign(el, attrs);
}

/** 仅更新 meta description（文档页标题/内容随 section 变化时用） */
export function setPageDescription(description: string) {
  setMeta('meta[name="description"]', { name: "description", content: description });
}

/**
 * 每个路由的 title / description / canonical。
 * SPA 里 document.title 会被上一个页面残留（此前只有文档页会设置），
 * 所有顶层路由都应调用本 hook 声明自己的元信息。
 */
export function usePageMeta({ title, description, path }: { title: string; description?: string; path?: string }) {
  useEffect(() => {
    document.title = title;
    if (description) setMeta('meta[name="description"]', { name: "description", content: description });
    const url = `${CANONICAL_BASE}${path ?? window.location.pathname}`;
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description, path]);
}
