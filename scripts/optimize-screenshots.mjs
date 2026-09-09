// 截图优化：生成 AVIF 版本（WebP 作为回退保持原样）
// 用法：node scripts/optimize-screenshots.mjs
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import sharp from "sharp";

const dir = join(process.cwd(), "public/screenshots");
const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));

let totalOld = 0;
let totalAvif = 0;

for (const file of files) {
  const src = join(dir, file);
  const oldSize = statSync(src).size;
  const base = file.replace(".webp", "");
  const avifOut = join(dir, `${base}.avif`);

  // 先写到系统临时目录，再移动过来，避免目录监视锁
  const tmpOut = join(tmpdir(), `screenshot-${base}-${Date.now()}.avif`);
  await sharp(src).avif({ quality: 50, effort: 9 }).toFile(tmpOut);

  const { renameSync } = await import("fs");
  renameSync(tmpOut, avifOut);
  const avifSize = statSync(avifOut).size;

  totalOld += oldSize;
  totalAvif += avifSize;

  console.log(`${file}: ${(oldSize / 1024).toFixed(1)}KB → avif ${(avifSize / 1024).toFixed(1)}KB (省 ${((1 - avifSize / oldSize) * 100).toFixed(0)}%)`);
}

console.log(`\n总计: webp ${(totalOld / 1024).toFixed(1)}KB → avif ${(totalAvif / 1024).toFixed(1)}KB (省 ${((1 - totalAvif / totalOld) * 100).toFixed(0)}%)`);
