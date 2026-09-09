import { writeFileSync } from "fs";
import { getDocRoutes, fileLastmod } from "./lib/docs-routes.mjs";

const base = "https://campus-auth.misyra.com";
const routes = ["", "/docs", "/download", "/changelog"];

const urls = [
  ...routes.map((r) => ({ loc: `${base}${r}` })),
  ...getDocRoutes().map((r) => ({ loc: `${base}/docs/${r.sid}/${r.iid}`, lastmod: fileLastmod(r.file) })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`)
  .join("\n")}\n</urlset>\n`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap generated (${urls.length} urls)`);
