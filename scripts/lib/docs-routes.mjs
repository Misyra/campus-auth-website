// 从 src/content/docs/index.ts 的 DOC_PATH_MAP 解析出全部文档路由
// （sitemap 生成与预渲染共用；DOC_PATH_MAP 是 section/item → md 路径的单一事实来源）
import { readFileSync, statSync } from "fs";

export function getDocRoutes() {
  const src = readFileSync("src/content/docs/index.ts", "utf8");
  const mapMatch = src.match(/DOC_PATH_MAP[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!mapMatch) throw new Error("DOC_PATH_MAP not found in src/content/docs/index.ts");
  // section 键可能是带引号（"getting-started"）或裸标识符（profiles）两种写法
  const sectionRe = /"?([\w-]+)"?:\s*\{([^}]*)\}/g;
  const itemRe = /([A-Za-z0-9_-]+):\s*"([^"]+)"/g;
  const routes = [];
  let m;
  while ((m = sectionRe.exec(mapMatch[1]))) {
    const sid = m[1];
    let im;
    while ((im = itemRe.exec(m[2]))) {
      if (im[1] === "default") continue;
      routes.push({ sid, iid: im[1], file: im[2] });
    }
  }
  if (!routes.length) throw new Error("no doc routes parsed");
  return routes;
}

// lastmod 用文档源文件的修改时间
export function fileLastmod(file) {
  try {
    return statSync(`src/content/docs/zh/${file}`).mtime.toISOString().slice(0, 10);
  } catch {
    return undefined;
  }
}
