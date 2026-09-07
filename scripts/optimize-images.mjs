// 生成 favicon / apple-touch-icon / og-image，并重压缩 logo.png（一次性脚本，产物提交进仓库）
// 用法：node scripts/optimize-images.mjs
import sharp from "sharp";

const SRC = "public/logo.png";

// logo.png：1254×1254/229KB → 512×512 调色板压缩（页面里最大显示 32px，512 足够含 retina 余量）
await sharp(SRC)
  .resize(512, 512)
  .png({ palette: true, compressionLevel: 9 })
  .toFile("public/logo.tmp.png");

// favicon 32×32
await sharp(SRC)
  .resize(32, 32)
  .png({ palette: true, compressionLevel: 9 })
  .toFile("public/favicon-32.png");

// apple-touch-icon 180×180（iOS 不支持透明，垫白底）
const logo180 = await sharp(SRC).resize(160, 160).toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: "#ffffff" } })
  .composite([{ input: logo180, gravity: "center" }])
  .png({ palette: true, compressionLevel: 9 })
  .toFile("public/apple-touch-icon.png");

// og:image 1200×630：浅底 + logo + 站名
const logo320 = await sharp(SRC).resize(300, 300).toBuffer();
const text = Buffer.from(`
<svg width="1200" height="630">
  <rect width="1200" height="630" fill="#f8fafc"/>
  <text x="600" y="520" text-anchor="middle" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-size="72" font-weight="700" fill="#0f172a">Campus-Auth</text>
  <text x="600" y="578" text-anchor="middle" font-family="Segoe UI, Microsoft YaHei, sans-serif" font-size="34" fill="#475569">校园网小助手 · 断网重连 · 全天候在线</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#f8fafc" } })
  .composite([
    { input: logo320, left: 450, top: 80 },
    { input: text, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile("public/og-image.png");

const { renameSync, statSync } = await import("fs");
renameSync("public/logo.tmp.png", SRC);

for (const f of ["logo.png", "favicon-32.png", "apple-touch-icon.png", "og-image.png"]) {
  console.log(`${f}: ${(statSync(`public/${f}`).size / 1024).toFixed(1)} KB`);
}
