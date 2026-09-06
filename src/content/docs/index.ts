const DOC_PATH_MAP: Record<string, Record<string, string>> = {
  "getting-started": {
    default: "1-getting-started/1.1-introduction.md",
    introduction: "1-getting-started/1.1-introduction.md",
    install: "1-getting-started/1.2-install.md",
    console: "1-getting-started/1.3-console.md",
    quickstart: "1-getting-started/1.4-quickstart.md",
  },
  profiles: {
    default: "2-profiles/2.1-overview.md",
    overview: "2-profiles/2.1-overview.md",
    match: "2-profiles/2.2-match.md",
    redirect: "2-profiles/2.3-redirect.md",
  },
  tasks: {
    default: "3-tasks/3.1-concepts.md",
    concepts: "3-tasks/3.1-concepts.md",
    browser: "3-tasks/3.2-browser.md",
    variables: "3-tasks/3.3-variables.md",
    scripts: "3-tasks/3.4-scripts.md",
  },
  automation: {
    default: "4-automation/4.1-monitor.md",
    monitor: "4-automation/4.1-monitor.md",
    debug: "4-automation/4.2-debug.md",
    scheduled: "4-automation/4.3-scheduled.md",
  },
  system: {
    default: "5-system/5.1-cli.md",
    cli: "5-system/5.1-cli.md",
    update: "5-system/5.2-update.md",
    faq: "5-system/5.3-faq.md",
  },
};

const DOC_CACHE: Record<string, string> = {};

const MSG = {
  notFound: "# 页面不存在\n\n请求的文档不存在。",
  loadFailed: "# 加载失败\n\n文档加载失败，请稍后重试。",
} as const;

const DOC_ROUTE_BY_PATH = new Map<string, { sectionId: string; itemId: string }>();
for (const [sid, items] of Object.entries(DOC_PATH_MAP)) {
  for (const [iid, p] of Object.entries(items)) {
    if (iid === "default" || DOC_ROUTE_BY_PATH.has(p)) continue;
    DOC_ROUTE_BY_PATH.set(p, { sectionId: sid, itemId: iid });
  }
}

function getRelative(sectionId: string, itemId?: string): string | null {
  const s = DOC_PATH_MAP[sectionId];
  if (!s) return null;
  if (itemId && s[itemId]) return s[itemId];
  return s.default ?? null;
}

export function getDocFilePath(sectionId: string, itemId?: string): string | null {
  const rel = getRelative(sectionId, itemId);
  return rel ? `/docs/zh/${rel}` : null;
}

function resolveDocLink(currentRel: string, href: string): string {
  const [raw, hash = ""] = href.split("#");
  const resolved = new URL(raw, `https://campus-auth.local/${currentRel}`).pathname.replace(/^\//, "");
  const route = DOC_ROUTE_BY_PATH.get(resolved);
  if (!route) return href;
  const q = `?section=${encodeURIComponent(route.sectionId)}&item=${encodeURIComponent(route.itemId)}`;
  return hash ? `${q}#${hash}` : q;
}

function processContent(content: string, currentRel: string): string {
  return content.replace(
    /\]\(((?!https?:\/\/|mailto:|#|\/|\?)[^)]+\.md(?:#[^)]+)?)\)/g,
    (_: string, href: string) => `](${resolveDocLink(currentRel, href)})`,
  );
}

export async function fetchDocContent(sectionId: string, itemId?: string): Promise<string> {
  const filePath = getDocFilePath(sectionId, itemId);
  if (!filePath) return MSG.notFound;
  const key = `${sectionId}-${itemId ?? "default"}`;
  if (DOC_CACHE[key]) return DOC_CACHE[key];
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(String(res.status));
    const raw = await res.text();
    const rel = getRelative(sectionId, itemId) ?? "";
    const processed = processContent(raw, rel);
    DOC_CACHE[key] = processed;
    return processed;
  } catch (e) {
    console.error("Failed to load doc", e);
    return MSG.loadFailed;
  }
}
