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
    debug: "3-tasks/3.5-debug.md",
  },
  automation: {
    default: "4-automation/4.1-monitor.md",
    monitor: "4-automation/4.1-monitor.md",
    scheduled: "4-automation/4.3-scheduled.md",
  },
  system: {
    default: "5-system/5.1-cli.md",
    cli: "5-system/5.1-cli.md",
    update: "5-system/5.2-update.md",
  },
  faq: {
    default: "7-faq/7.1-troubleshoot.md",
    troubleshoot: "7-faq/7.1-troubleshoot.md",
    browser: "7-faq/7.2-browser.md",
    startup: "7-faq/7.3-startup.md",
  },
  reference: {
    default: "6-reference/6.1-browser.md",
    browser: "6-reference/6.1-browser.md",
    monitor: "6-reference/6.2-monitor.md",
    system: "6-reference/6.3-system.md",
    files: "6-reference/6.4-files.md",
  },
};

// 文档源文件构建时打包进 bundle（eager raw glob），运行时零网络请求、切换零延迟
const RAW_DOCS = import.meta.glob("./zh/**/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

const MSG = {
  notFound: "# 页面不存在\n\n请求的文档不存在。",
} as const;

const DOC_ROUTE_BY_PATH = new Map<string, { sectionId: string; itemId: string }>();
for (const [sid, items] of Object.entries(DOC_PATH_MAP)) {
  for (const [iid, p] of Object.entries(items)) {
    if (iid === "default" || DOC_ROUTE_BY_PATH.has(p)) continue;
    DOC_ROUTE_BY_PATH.set(p, { sectionId: sid, itemId: iid });
  }
}

export function getRelative(sectionId: string, itemId?: string): string | null {
  const s = DOC_PATH_MAP[sectionId];
  if (!s) return null;
  if (itemId && s[itemId]) return s[itemId];
  return s.default ?? null;
}

function resolveDocLink(currentRel: string, href: string): string {
  const [raw, hash = ""] = href.split("#");
  const resolved = new URL(raw, `https://campus-auth.local/${currentRel}`).pathname.replace(/^\//, "");
  const route = DOC_ROUTE_BY_PATH.get(resolved);
  if (!route) return href;
  const path = `/docs/${route.sectionId}/${route.itemId}`;
  return hash ? `${path}#${hash}` : path;
}

function processContent(content: string, currentRel: string): string {
  return content.replace(
    /\]\(((?!https?:\/\/|mailto:|#|\/|\?)[^)]+\.md(?:#[^)]+)?)\)/g,
    (_: string, href: string) => `](${resolveDocLink(currentRel, href)})`,
  );
}

const PROCESSED_CACHE: Record<string, string> = {};

export function getDocContent(sectionId: string, itemId?: string): string {
  const rel = getRelative(sectionId, itemId);
  if (!rel) return MSG.notFound;
  if (PROCESSED_CACHE[rel]) return PROCESSED_CACHE[rel];
  const raw = RAW_DOCS[`./zh/${rel}`];
  if (raw == null) return MSG.notFound;
  return (PROCESSED_CACHE[rel] = processContent(raw, rel));
}
