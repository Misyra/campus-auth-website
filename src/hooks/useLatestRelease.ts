import { useEffect, useState } from "react";
import { SITE } from "@/data/site";

type LatestRelease = {
  tag: string;
  name: string;
  published_at: string;
} | null;

let releasePromise: Promise<LatestRelease> | null = null;

// 模块级缓存：同一次会话里多个组件（导航栏 / Hero / 下载区）共用一次请求，
// 失败时清空缓存以便下次挂载重试
function fetchLatestRelease(): Promise<LatestRelease> {
  if (!releasePromise) {
    releasePromise = (async () => {
      const res = await fetch("https://api.github.com/repos/Misyra/Campus-Auth-rs/releases/latest", {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const data = (await res.json()) as { tag_name: string; name: string; published_at: string };
      return { tag: data.tag_name, name: data.name ?? data.tag_name, published_at: data.published_at };
    })().catch((e) => {
      releasePromise = null;
      throw e;
    });
  }
  return releasePromise;
}

export function useLatestRelease() {
  const [release, setRelease] = useState<LatestRelease>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLatestRelease().then(
      (r) => {
        if (!cancelled) setRelease(r);
      },
      (e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      },
    ).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // fallback to embedded version if API unavailable
  const tag = release?.tag ?? `v${SITE.version}`;
  return { release, tag, loading, error };
}
