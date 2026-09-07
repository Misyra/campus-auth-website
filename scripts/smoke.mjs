// 冒烟测试：验证 SPA 路由行为（预渲染后的页面 + 客户端导航 + 旧链接重定向）
import { chromium } from "playwright";
import { spawn } from "child_process";

const preview = spawn("npx", ["vite", "preview", "--port", "4180", "--strictPort"], {
  shell: true,
  stdio: "ignore",
});
await new Promise((r) => setTimeout(r, 2500));

const origin = "http://localhost:4180";
const browser = await chromium.launch();
const page = await browser.newPage();
let failed = 0;

async function check(name, fn) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${name}: ${e.message}`);
  }
}

await check("direct doc page renders content", async () => {
  await page.goto(`${origin}/docs/tasks/browser`, { waitUntil: "networkidle" });
  await page.waitForSelector("h2");
  const text = await page.textContent("h1");
  if (!text || text.length < 2) throw new Error("h1 empty");
});

await check("/docs redirects to default doc", async () => {
  await page.goto(`${origin}/docs`, { waitUntil: "networkidle" });
  await page.waitForURL("**/docs/getting-started/introduction", { timeout: 5000 });
});

await check("legacy ?section=&item= redirects to path URL", async () => {
  await page.goto(`${origin}/docs?section=tasks&item=browser`, { waitUntil: "networkidle" });
  await page.waitForURL("**/docs/tasks/browser", { timeout: 5000 });
});

await check("sidebar navigation (client-side)", async () => {
  await page.goto(`${origin}/docs/getting-started/introduction`, { waitUntil: "networkidle" });
  await page.locator("button", { hasText: "任务系统" }).first().click();
  await page.waitForURL("**/docs/tasks/**", { timeout: 5000 });
  await page.waitForSelector("h1");
});

await check("doc search opens and finds", async () => {
  await page.keyboard.press("Control+k");
  await page.waitForSelector("input[placeholder='搜索文档…']", { timeout: 3000 });
  await page.fill("input[placeholder='搜索文档…']", "验证码");
  await page.waitForTimeout(300);
  const results = await page.$$eval("button .truncate", (els) => els.map((e) => e.textContent));
  if (!results.some((t) => t && t.length > 1)) throw new Error(`no results: ${JSON.stringify(results)}`);
});

await check("download page renders smart download", async () => {
  await page.goto(`${origin}/download`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=下载");
});

await check("home renders hero", async () => {
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.waitForSelector("h1");
});

await browser.close();
preview.kill();

if (failed) {
  console.error(`${failed} smoke checks failed`);
  process.exit(1);
}
console.log("smoke tests passed");
