// 冒烟测试：构建产物本地预览，验证路由标题、字体与控制台错误
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:4173";
const browser = await chromium.launch();
const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push(String(e)));

async function goto(path) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  return page.title();
}

// 1. 首页
let t = await goto("/");
console.log("home title:", t);
if (!t.includes("Campus-Auth")) throw new Error("home title wrong");
await page.waitForSelector("h1");
const fontLoaded = await page.evaluate(() => document.fonts.check('600 16px Inter'));
console.log("Inter loaded:", fontLoaded);
const fontReqFailed = [];
page.on("requestfailed", (r) => fontReqFailed.push(r.url()));

// 2. 文档页标题
t = await goto("/docs");
console.log("docs title:", t);
if (!t.includes("文档")) throw new Error("docs title wrong");

// 3. 返回首页后标题应恢复（此前会残留文档标题）
t = await goto("/");
console.log("back-to-home title:", t);
if (!t.includes("断网自愈") || t.includes("文档")) throw new Error("stale title bug regressed");

// 4. 其余路由
console.log("download title:", await goto("/download"));
console.log("changelog title:", await goto("/changelog"));
t = await goto("/some-unknown-path");
console.log("404 title:", t);

// 5. 字体/截图资源可访问
for (const p of ["/fonts/inter-var.woff2", "/fonts/fira-code-var.woff2", "/screenshots/dashboard.webp", "/sitemap.xml", "/robots.txt"]) {
  const res = await page.request.get(BASE + p);
  console.log(res.status(), p);
  if (res.status() !== 200) throw new Error(`bad status for ${p}`);
}

console.log("console errors:", consoleErrors.length ? consoleErrors : "none");
if (consoleErrors.length) process.exit(1);
console.log("SMOKE OK");
await browser.close();
