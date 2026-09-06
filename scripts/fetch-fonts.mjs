// 一次性脚本：从 Google Fonts 拉取 latin 子集可变字体 woff2 到 public/fonts/，
// 生成 src/fonts.css，供自托管（fonts.googleapis.com 在大陆不可达）。
// Google 对现代 UA 返回的是可变字体，同 family 各字重是同一文件，这里按 URL 去重。
import { writeFileSync, mkdirSync } from "fs";

const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const css = await (await fetch(CSS_URL, { headers: { "User-Agent": UA } })).text();

// 按 /* subset */ 注释分段，只保留 latin 块
const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)].filter(
  ([, subset]) => subset === "latin",
);

mkdirSync("public/fonts", { recursive: true });

const families = new Map(); // family -> { file, url }
let out = "/* 自托管字体（latin 子集，可变字体，中文回退系统字体）— 由 scripts/fetch-fonts.mjs 生成 */\n";
for (const [, , body] of blocks) {
  const family = body.match(/font-family:\s*'([^']+)'/)[1];
  const url = body.match(/src:\s*url\((https:[^)]+\.woff2)\)/)[1];
  if (families.has(family)) continue;
  families.set(family, url);
  const slug = family.toLowerCase().replace(/\s+/g, "-");
  const file = `${slug}-var.woff2`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`public/fonts/${file}`, buf);
  out += `@font-face {\n  font-family: '${family}';\n  font-style: normal;\n  font-weight: 100 900;\n  font-display: swap;\n  src: url('/fonts/${file}') format('woff2-variations');\n}\n`;
  console.log(`${file}  ${(buf.length / 1024).toFixed(1)} KB`);
}
writeFileSync("src/fonts.css", out);
console.log("done -> public/fonts/ + src/fonts.css");
