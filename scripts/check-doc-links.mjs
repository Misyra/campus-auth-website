// 文档 QA：① 校验 zh 文档内相对 .md 链接均能落到实际文件；
// ② 校验源码/文档中的绝对 /docs/<section>/<item> 路由均在 DOC_PATH_MAP 内。
// 运行：node scripts/check-doc-links.mjs（或 pnpm check:docs）
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname, normalize } from "node:path";

function walk(d) {
  return readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)],
  );
}

// ---- ① 相对 .md 链接 + 截图引用 ----
const mdFiles = walk("src/content/docs/zh").filter((f) => f.endsWith(".md"));
let bad = 0;
for (const f of mdFiles) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(/\]\(([^)#]+?\.md)\)/g)) {
    const resolved = normalize(join(dirname(f), m[1])).split("\\").join("/");
    if (!existsSync(resolved)) {
      console.log("死链(相对):", f, "->", m[1]);
      bad++;
    }
  }
  // 截图引用：avif 必须存在，且对应的 webp 兜底也要存在
  for (const m of text.matchAll(/screenshots\/docs\/([\w-]+)\.avif/g)) {
    if (!existsSync(`public/screenshots/docs/${m[1]}.avif`)) {
      console.log("裂图( avif ):", f, "->", m[0]);
      bad++;
    }
    if (!existsSync(`public/screenshots/docs/${m[1]}.webp`)) {
      console.log("缺 webp 兜底:", f, "->", m[1]);
      bad++;
    }
  }
}
console.log(`相对链接: ${bad === 0 ? "全部有效" : bad + " 个死链"}（${mdFiles.length} 篇）`);

// ---- ② 绝对 /docs 路由 ----
// 从 src/content/docs/index.ts 的 DOC_PATH_MAP 提取合法 section/item 组合
const indexSrc = readFileSync("src/content/docs/index.ts", "utf8");
const routes = new Set();
const mapStart = indexSrc.indexOf("DOC_PATH_MAP");
const mapSrc = indexSrc.slice(mapStart);
for (const sec of mapSrc.matchAll(/^\s{2}"?([\w-]+)"?:\s*\{/gm)) {
  const secStart = sec.index + sec[0].length;
  const closeAt = mapSrc.slice(secStart).search(/\r?\n  \},/);
  const body = mapSrc.slice(secStart, closeAt === -1 ? undefined : secStart + closeAt);
  // item 键大多无引号（default:），个别含连字符带引号（"http-login":）
  for (const item of body.matchAll(/"?([\w-]+)"?:\s*"[^"]*"/g)) {
    routes.add(`/docs/${sec[1]}/${item[1]}`);
  }
}
console.log(`路由表: ${routes.size} 条`);

let badAbs = 0;
const absTargets = [
  ...walk("src/content/docs/zh").filter((f) => f.endsWith(".md")).map((f) => [f, readFileSync(f, "utf8")]),
  ["src/data/site.ts", readFileSync("src/data/site.ts", "utf8")],
  ["src/data/changelog.ts", readFileSync("src/data/changelog.ts", "utf8")],
];
for (const [f, text] of absTargets) {
  for (const m of text.matchAll(/"?(\/docs\/[\w-]+\/[\w-]+)#?/g)) {
    if (!routes.has(m[1])) {
      console.log("死链(绝对):", f, "->", m[1]);
      badAbs++;
    }
  }
}
console.log(`绝对路由: ${badAbs === 0 ? "全部有效" : badAbs + " 个死链"}`);

if (bad + badAbs > 0) process.exit(1);
