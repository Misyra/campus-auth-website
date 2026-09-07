import { useEffect } from "react";

const CANONICAL_BASE = "https://amiya.cc";

/**
 * 每个路由的 title / description / canonical。
 * SPA 里 document.title 会被上一个页面残留，所有顶层路由都应调用本 hook 声明元信息。
 * path 需带完整查询串（文档页的 ?section=&item= 是独立 URL，canonical 必须自引用）。
 */
export function usePageMeta({ title, description, path }: { title: string; description?: string; path?: string }) {
  useEffect(() => {
    document.title = title;
    if (description) {
      let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
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
