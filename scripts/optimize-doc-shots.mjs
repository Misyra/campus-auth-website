// 把重拍的控制台截图（1280×720 PNG）转成文档用的 avif + webp
//
// 用法：node scripts/optimize-doc-shots.mjs <png 或目录> [...]
//   产物写进 public/screenshots/docs/，文件名沿用源文件名（两侧扩展名各一份）：
//   - .avif：markdown 里引用的那一份，构建期由 markdown-plugin.mjs 包成 <picture>
//   - .webp：<img> 兜底，供不支持 AVIF 的旧浏览器（check-doc-links.mjs 会校验两者都在）
//
// 尺寸必须是 1280×720（文档正文的固有尺寸假设，见 markdown-plugin.mjs 的 renderer.image）；
// 不符直接报错而不是悄悄缩放——缩过的截图在页面里会被拉回 1280×720 而变形。
import { readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const OUT_DIR = "public/screenshots/docs";
const WANT = { width: 1280, height: 720 };
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 52;

const inputs = process.argv.slice(2).flatMap((arg) =>
  statSync(arg).isDirectory()
    ? readdirSync(arg)
        .filter((f) => extname(f).toLowerCase() === ".png")
        .map((f) => join(arg, f))
    : [arg],
);
if (inputs.length === 0) {
  console.error("用法：node scripts/optimize-doc-shots.mjs <png 或目录> [...]");
  process.exit(1);
}

let failed = 0;
for (const src of inputs) {
  const img = sharp(src);
  const meta = await img.metadata();
  if (meta.width !== WANT.width || meta.height !== WANT.height) {
    console.error(`✗ ${src}: ${meta.width}×${meta.height}，要求 ${WANT.width}×${WANT.height}`);
    failed++;
    continue;
  }
  const stem = basename(src, extname(src));
  const avif = join(OUT_DIR, `${stem}.avif`);
  const webp = join(OUT_DIR, `${stem}.webp`);
  await sharp(src).avif({ quality: AVIF_QUALITY, effort: 4 }).toFile(avif);
  await sharp(src).webp({ quality: WEBP_QUALITY }).toFile(webp);
  const kb = (f) => (statSync(f).size / 1024).toFixed(1);
  console.log(`${stem}: avif ${kb(avif)} KB / webp ${kb(webp)} KB`);
}

if (failed > 0) process.exit(1);
