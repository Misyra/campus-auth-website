const DOC_PATH_MAP: Record<string, Record<string, string>> = {
  "getting-started": {
    default: "1-getting-started/1.1-start.md",
    start: "1-getting-started/1.1-start.md",
    install: "1-getting-started/1.2-install.md",
    console: "1-getting-started/1.3-console.md",
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
    recorder: "3-tasks/3.2-recorder.md",
    browser: "3-tasks/3.3-browser.md",
    variables: "3-tasks/3.4-variables.md",
    scripts: "3-tasks/3.5-scripts.md",
    debug: "3-tasks/3.6-debug.md",
    repo: "3-tasks/3.7-repo.md",
  },
  automation: {
    default: "4-automation/4.1-monitor.md",
    monitor: "4-automation/4.1-monitor.md",
    scheduled: "4-automation/4.2-scheduled.md",
    autostart: "4-automation/4.3-autostart.md",
  },
  maintenance: {
    default: "5-maintenance/5.1-update.md",
    update: "5-maintenance/5.1-update.md",
    cli: "5-maintenance/5.2-cli.md",
    files: "5-maintenance/5.3-files.md",
  },
  reference: {
    default: "6-reference/6.1-settings.md",
    settings: "6-reference/6.1-settings.md",
  },
  faq: {
    default: "7-faq/7.1-login.md",
    login: "7-faq/7.1-login.md",
    startup: "7-faq/7.2-startup.md",
    browser: "7-faq/7.3-browser.md",
    misc: "7-faq/7.4-misc.md",
  },
};

// 2026-09 文档结构重组：旧 section/item 组合一律重定向到新路由，
// 旧书签与搜索引擎收录不 404。键为 `sid/iid`。
const LEGACY_REDIRECTS: Record<string, { sid: string; iid: string }> = {
  "getting-started/introduction": { sid: "getting-started", iid: "start" },
  "getting-started/quickstart": { sid: "getting-started", iid: "start" },
  "system/cli": { sid: "maintenance", iid: "cli" },
  "system/update": { sid: "maintenance", iid: "update" },
  "system/faq": { sid: "faq", iid: "login" },
  "automation/debug": { sid: "tasks", iid: "debug" },
  "reference/browser": { sid: "reference", iid: "settings" },
  "reference/monitor": { sid: "reference", iid: "settings" },
  "reference/system": { sid: "reference", iid: "settings" },
  "reference/files": { sid: "maintenance", iid: "files" },
  "faq/troubleshoot": { sid: "faq", iid: "login" },
};

// 文档内容构建时由 markdown-plugin 渲染为 HTML（含代码高亮、标题 id、链接转换）
// 运行时零渲染开销，直接展示 HTML
// 不使用 ?raw：.md 统一交由 scripts/markdown-plugin 在构建期转为 HTML 模块，
// 避免 rolldown-vite 生产构建中内置 raw 转换先于 pre 插件执行、把原始 Markdown 泄漏到页面
const HTML_DOCS = import.meta.glob("./zh/**/*.md", { import: "default", eager: true }) as Record<string, string>;

const MSG = {
  notFound: "<h1>页面不存在</h1><p>请求的文档不存在。</p>",
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

const CACHE: Record<string, string> = {};

export function getDocContent(sectionId: string, itemId?: string): string {
  const rel = getRelative(sectionId, itemId);
  if (!rel) return MSG.notFound;
  if (CACHE[rel]) return CACHE[rel];
  const html = HTML_DOCS[`./zh/${rel}`];
  if (html == null) return MSG.notFound;
  return (CACHE[rel] = html);
}

export { LEGACY_REDIRECTS };
