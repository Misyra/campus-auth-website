// Vite 插件：构建时把 .md 文件渲染为 HTML 字符串
// 运行时无需 react-markdown / remark-gfm / prismjs，大幅减小 DocsPage chunk
import { marked } from "marked";
import Prism from "prismjs";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-powershell.js";
import "prismjs/components/prism-batch.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-yaml.js";
import "prismjs/components/prism-toml.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-");
}

// 语言别名归一化：Prism 无 sh/zsh/shell/terminal 语法包，不归一会静默回退 clike 丢高亮
const LANG_ALIAS = {
  js: "javascript",
  ts: "typescript",
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  terminal: "bash",
  py: "python",
  yml: "yaml",
};

// 自定义 renderer：给标题加 id（行内格式需 parseInline，token.text 是原始 markdown），
// 代码块用 prismjs 高亮
const renderer = new marked.Renderer();
renderer.heading = function ({ text, tokens, depth }) {
  const id = slugify(text);
  const inner = this.parser.parseInline(tokens);
  return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
};
renderer.code = function ({ text, lang }) {
  const raw = (lang || "").trim().toLowerCase();
  const language = LANG_ALIAS[raw] || raw || "text";
  const grammar = Prism.languages[language] || Prism.languages.clike;
  const highlighted = Prism.highlight(text, grammar, language);
  return `<pre class="language-${language}"><code class="language-${language}">${highlighted}</code></pre>\n`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
});

// 文档相对路径 → 路由映射（与 src/content/docs/index.ts 的 DOC_PATH_MAP 保持一致）
const DOC_ROUTE_BY_PATH = {};
const DOC_PATH_MAP = {
  "getting-started": {
    start: "1-getting-started/1.1-start.md",
    install: "1-getting-started/1.2-install.md",
    console: "1-getting-started/1.3-console.md",
  },
  profiles: {
    overview: "2-profiles/2.1-overview.md",
    match: "2-profiles/2.2-match.md",
    redirect: "2-profiles/2.3-redirect.md",
  },
    tasks: {
    concepts: "3-tasks/3.1-concepts.md",
    recorder: "3-tasks/3.2-recorder.md",
    browser: "3-tasks/3.3-browser.md",
    variables: "3-tasks/3.4-variables.md",
    scripts: "3-tasks/3.5-scripts.md",
    debug: "3-tasks/3.6-debug.md",
    repo: "3-tasks/3.7-repo.md",
  },
  automation: {
    monitor: "4-automation/4.1-monitor.md",
    scheduled: "4-automation/4.2-scheduled.md",
    autostart: "4-automation/4.3-autostart.md",
  },
  maintenance: {
    update: "5-maintenance/5.1-update.md",
    cli: "5-maintenance/5.2-cli.md",
    files: "5-maintenance/5.3-files.md",
  },
  reference: {
    settings: "6-reference/6.1-settings.md",
  },
  faq: {
    login: "7-faq/7.1-login.md",
    startup: "7-faq/7.2-startup.md",
    browser: "7-faq/7.3-browser.md",
    misc: "7-faq/7.4-misc.md",
  },
};
for (const [sid, items] of Object.entries(DOC_PATH_MAP)) {
  for (const [iid, p] of Object.entries(items)) {
    DOC_ROUTE_BY_PATH[p] = `/docs/${sid}/${iid}`;
  }
}

function resolveDocLink(currentRel, href) {
  const [raw, hash = ""] = href.split("#");
  try {
    const resolved = new URL(raw, `https://campus-auth.local/${currentRel}`).pathname.replace(/^\//, "");
    const route = DOC_ROUTE_BY_PATH[resolved];
    if (route) return hash ? `${route}#${hash}` : route;
  } catch {}
  return href;
}

// GitHub 风格提示块：> [!NOTE] / [!TIP] / [!IMPORTANT] / [!WARNING]
// 构建期展开为带标签的 HTML，让「说明 / 提示 / 重要 / 注意」在页面上分级可辨
const CALLOUT_KINDS = {
  NOTE: { label: "说明", cls: "note" },
  TIP: { label: "提示", cls: "tip" },
  IMPORTANT: { label: "重要", cls: "important" },
  WARNING: { label: "注意", cls: "warning" },
};

const CALLOUT_START = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING)\]\s*$/;
const CALLOUT_BODY = /^>\s?/;

/**
 * 把提示块语法展开为 HTML。必须在链接转换之后、marked 渲染之前执行，
 * 这样块内相对 .md 链接同样会被解析为站内路由。
 */
function renderCallouts(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const head = CALLOUT_START.exec(lines[i].trim());
    if (!head) {
      out.push(lines[i]);
      i += 1;
      continue;
    }
    const kind = CALLOUT_KINDS[head[1]];
    const body = [];
    i += 1;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      // 遇到下一个提示块的起始标记即结束当前块（相邻两块之间通常只隔一个空行）
      if (CALLOUT_START.test(trimmed)) break;
      if (CALLOUT_BODY.test(line)) {
        body.push(line.replace(CALLOUT_BODY, ""));
        i += 1;
        continue;
      }
      // 块内空行：仅当后面仍属同一提示块时才保留（否则视为块结束）
      const next = (lines[i + 1] ?? "").trim();
      if (trimmed === "" && !CALLOUT_START.test(next) && CALLOUT_BODY.test(lines[i + 1] ?? "")) {
        body.push("");
        i += 1;
        continue;
      }
      break;
    }
    const inner = marked.parse(body.join("\n"));
    out.push(
      `<div class="doc-callout doc-callout--${kind.cls}">` +
        `<p class="doc-callout__label">${kind.label}</p>${inner}</div>`,
    );
  }
  return out.join("\n");
}

function processContent(content, currentRel) {
  // 转换相对 .md 链接为路由
  const withLinks = content.replace(
    /\]\(((?!https?:\/\/|mailto:|#|\/|\?)[^)]+\.md(?:#[^)]+)?)\)/g,
    (_, href) => `](${resolveDocLink(currentRel, href)})`,
  );
  return marked.parse(renderCallouts(withLinks));
}

export function markdownPlugin() {
  return {
    name: "markdown-to-html",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".md?raw") && !id.endsWith(".md")) return null;
      // 只处理文档目录下的 markdown
      if (!id.includes("/content/docs/zh/")) return null;

      const cleanId = id.replace(/\?raw$/, "");
      // 计算相对路径（相对于 content/docs/zh/）
      const match = cleanId.match(/\/content\/docs\/zh\/(.+\.md)$/);
      if (!match) return null;
      const rel = match[1];

      const html = processContent(code, rel);
      return {
        code: `export default ${JSON.stringify(html)};`,
        map: null,
      };
    },
  };
}
