// 构建后预渲染：用 Playwright 逐路由渲染 dist 站点，把 DOM 快照写回静态 HTML。
// 纯 CSR 的空壳 HTML 对 Bing/百度等爬虫不友好，预渲染后每个 URL 都有完整内容 + 正确 meta。
import { createServer } from "http";
import { readFileSync, existsSync, mkdirSync, writeFileSync, statSync } from "fs";
import path from "path";
import { chromium } from "playwright";
import { getDocRoutes } from "./lib/docs-routes.mjs";

const DIST = path.resolve("dist");
const PORT = 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".map": "application/json",
};

// 简易静态服务器：目录找 index.html，未命中回落 SPA 壳
const server = createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    pathname = "/";
  }
  const candidates = [
    path.join(DIST, pathname),
    path.join(DIST, pathname, "index.html"),
    path.join(DIST, "index.html"),
  ];
  const file = candidates.find((c) => existsSync(c) && statSync(c).isFile());
  if (!file) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});

await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
const origin = `http://127.0.0.1:${PORT}`;

const routes = [
  "/",
  "/download",
  "/changelog",
  "/docs",
  ...getDocRoutes().map((r) => `/docs/${r.sid}/${r.iid}`),
];

const browser = await chromium.launch();
const page = await browser.newPage();
// 预渲染用构建时注入的 tag，不打运行时刷新的 GitHub API
await page.route(/api\.github\.com/, (route) => route.abort());

let failed = 0;
for (const route of routes) {
  try {
    await page.goto(origin + route, { waitUntil: "networkidle", timeout: 15000 });
    // 等 React 挂载完成 + 动画结束（入场动画最长 ~0.6s）
    await page.waitForFunction(() => (document.querySelector("#root")?.childElementCount ?? 0) > 0, { timeout: 10000 });
    await page.waitForTimeout(800);
    const html = await page.content();
    const outDir = path.join(DIST, route === "/" ? "" : route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, "index.html"), html);
    console.log(`prerendered ${route || "/"}`);
  } catch (e) {
    failed++;
    console.error(`FAILED ${route}: ${e.message}`);
  }
}

// 404 页：Cloudflare Pages 会自动使用 dist/404.html
try {
  await page.goto(`${origin}/__not_found__`, { waitUntil: "networkidle", timeout: 15000 });
  await page.waitForTimeout(800);
  writeFileSync(path.join(DIST, "404.html"), await page.content());
  console.log("prerendered /404.html");
} catch (e) {
  console.error(`FAILED 404: ${e.message}`);
  failed++;
}

await browser.close();
server.close();
if (failed) {
  console.error(`${failed} route(s) failed`);
  process.exitCode = 1;
} else {
  console.log(`prerender done (${routes.length + 1} pages)`);
}
