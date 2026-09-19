// 终检：遍历构建产物全部路由，检查控制台错误、裂图、横向溢出
import { readdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";

// 从 dist 收集全部路由
const routes = ["/"];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) walk(`${d}/${e.name}`);
    else if (e.name === "index.html") routes.push(d.replace(/^dist/, ""));
  }
})("dist");

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const problems = [];
let errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 100)));
page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 100)));

for (const r of routes) {
  errors = [];
  await page.goto(`http://127.0.0.1:4173${r}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        y += 800;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 40);
        else resolve();
      };
      step();
    });
  });
  await page.waitForTimeout(300);
  const broken = await page.evaluate(() =>
    [...document.querySelectorAll("img")]
      .filter((i) => i.complete && i.naturalWidth === 0)
      .map((i) => i.getAttribute("src")),
  );
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (errors.length) problems.push(`${r} 控制台错误: ${errors.join(" | ")}`);
  if (broken.length) problems.push(`${r} 裂图: ${broken.join(", ")}`);
  if (overflow > 2) problems.push(`${r} 横向溢出 ${overflow}px`);
}
console.log(`共检查 ${routes.length} 个路由`);
console.log(problems.length ? problems.join("\n") : "全部通过：无控制台错误、无裂图、无横向溢出 ✓");
await browser.close();
process.exit(problems.length ? 1 : 0);
