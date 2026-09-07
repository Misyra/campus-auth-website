// 构建时抓取最新 release，写入 src/generated/release.ts（供 bundle 使用），
// 国内用户不再依赖运行时访问 GitHub API（大概率超时）。
// 抓取失败时写入空值，前端回落到 SITE.version。
import { writeFileSync, mkdirSync } from "fs";

const REPO = "Misyra/Campus-Auth-rs";

let tag = "";
let name = "";
let published_at = "";

try {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "campus-auth-website-build" },
    signal: AbortSignal.timeout(8000),
  });
  if (res.ok) {
    const data = await res.json();
    tag = typeof data.tag_name === "string" ? data.tag_name : "";
    name = typeof data.name === "string" ? data.name : "";
    published_at = typeof data.published_at === "string" ? data.published_at : "";
  } else {
    console.warn(`GitHub API ${res.status}，回落内置版本号`);
  }
} catch (e) {
  console.warn("抓取 release 失败，回落内置版本号：", e?.message ?? e);
}

const out = `// 由 scripts/fetch-release.mjs 自动生成，勿手改\nexport const BUILD_TIME_RELEASE = ${JSON.stringify({ tag, name, published_at })} as const;\n`;
mkdirSync("src/generated", { recursive: true });
writeFileSync("src/generated/release.ts", out);
console.log(`release: ${tag || "(fallback → SITE.version)"}`);
