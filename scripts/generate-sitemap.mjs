import { writeFileSync, mkdirSync } from "fs";
const base = "https://campus-auth.misyra.dev";
const routes = ["", "/download", "/docs", "/changelog"];
const docsSections = [
  "getting-started/introduction",
  "getting-started/install",
  "getting-started/quickstart",
  "getting-started/console",
  "profiles/overview",
  "profiles/match",
  "profiles/redirect",
  "tasks/concepts",
  "tasks/browser",
  "tasks/variables",
  "tasks/scripts",
  "tasks/debug",
  "automation/monitor",
  "automation/scheduled",
  "system/cli",
  "system/update",
  "faq/troubleshoot",
  "faq/browser",
  "faq/startup",
  "reference/browser",
  "reference/monitor",
  "reference/system",
  "reference/files",
];
const urls = [
  ...routes.map((r) => `${base}${r}`),
  ...docsSections.map((s) => `${base}/docs?section=${s.split("/")[0]}&item=${s.split("/")[1]}`),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`;
writeFileSync("public/sitemap.xml", xml);
try {
  mkdirSync("dist", { recursive: true });
  writeFileSync("dist/sitemap.xml", xml);
} catch {}
console.log(`sitemap generated (${urls.length} urls)`);
