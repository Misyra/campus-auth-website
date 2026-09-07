import { useEffect, useState } from "react";
import { SITE } from "@/data/site";
import { BUILD_TIME_RELEASE } from "@/generated/release";

type LatestRelease = {
  tag: string;
  name: string;
  published_at: string;
} | null;

// 构建时已注入最新 release（见 scripts/fetch-release.mjs），首屏零等待、零请求；
// 运行时仅做后台刷新：发布新版本但网站未重建时，能连上 GitHub 的用户仍能看到最新 tag。
// GitHub API 未认证限流 60 次/小时/IP；国内基本不通，失败静默即可。
const REQUEST_TIMEOUT_MS = 4000;

let releasePromise: Promise<LatestRelease> | null = null;

function fetchLatestRelease(): Promise<LatestRelease> {
  if (!releasePromise) {
    releasePromise = (async () => {
      const res = await fetch(`https://api.github.com/repos/${SITE.repo.replace("https://github.com/", "")}/releases/latest`, {
        headers: { Accept: "application/vnd.github+json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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

// 构建时注入的值；为空（构建机也连不上 GitHub）时回落内置版本号
const INITIAL: LatestRelease = BUILD_TIME_RELEASE.tag ? BUILD_TIME_RELEASE : null;
const FALLBACK_TAG = INITIAL?.tag ?? `v${SITE.version}`;

export function useLatestRelease() {
  const [release, setRelease] = useState<LatestRelease>(INITIAL);

  useEffect(() => {
    let cancelled = false;
    fetchLatestRelease().then(
      (r) => {
        if (!cancelled && r) setRelease(r);
      },
      () => {
        // 静默失败：构建时注入的值已在展示
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const tag = release?.tag ?? FALLBACK_TAG;
  return { release, tag };
}
