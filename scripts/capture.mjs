import { chromium } from "playwright";
import { mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/screenshots");
mkdirSync(outDir, { recursive: true });

const base = "http://127.0.0.1:50721";
const shots = [
  { path: "/", file: "dashboard.webp", wait: "networkidle", full: true },
  { path: "/profiles", file: "profiles.webp", wait: "networkidle", full: true },
  { path: "/tasks", file: "tasks.webp", wait: "networkidle", full: true },
  { path: "/ai-task", file: "ai-task.webp", wait: "networkidle", full: true },
  { path: "/scheduled", file: "scheduled.webp", wait: "networkidle", full: true },
  { path: "/scripts", file: "scripts.webp", wait: "networkidle", full: true },
  { path: "/appearance", file: "appearance.webp", wait: "networkidle", full: true },
  { path: "/settings", file: "settings.webp", wait: "networkidle", full: true },
  { path: "/settings/monitor", file: "monitor.webp", wait: "networkidle", full: true },
  { path: "/settings/browser", file: "browser.webp", wait: "networkidle", full: true },
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

// bypass proxy for localhost is handled by no_proxy env, but also set extra headers
for (const s of shots) {
  const url = base + s.path;
  console.log(`capturing ${s.path} -> ${s.file}`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 20000 }).catch(async (e) => {
    console.log(`  goto failed: ${e.message}, retry with domcontentloaded`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
  });
  await page.waitForTimeout(1200);
  // hide scrollbars clutter if any
  const out = join(outDir, s.file);
  await page.screenshot({ path: out, fullPage: s.full, type: "webp", quality: 85 });
  console.log(`  saved ${out}`);
}

await browser.close();
console.log("done");
