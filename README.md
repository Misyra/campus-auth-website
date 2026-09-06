# Campus-Auth 官网

Rust 重写版 `Campus-Auth-rs` 的官网，参考 `farion1231/cc-switch-website` 的质感与信息架构。

## 本地开发

```bash
cd E:/campus-auth-website
pnpm install
pnpm dev      # http://localhost:5173
pnpm lint && pnpm typecheck   # eslint 9 flat config / tsc -b
pnpm build && pnpm preview    # build 前会自动重新生成 sitemap
```

## 字体

Inter / Fira Code 已自托管（latin 子集可变字体，`public/fonts/`），不依赖 fonts.googleapis.com（大陆不可达）。中文回退系统字体。如需更新字体：

```bash
pnpm fonts   # node scripts/fetch-fonts.mjs
```

## 真实截图

官网的 `public/screenshots/*.webp` 来自本机管理后台实拍（`http://127.0.0.1:50721`）：

```bash
# 先启动后端（frontend/dist 已存在则直接可用）
cargo run --manifest-path E:/Campus-Auth-rs/Cargo.toml -- --port 50721

# 抓取 10 张页面截图
NO_PROXY="*" no_proxy="*" node scripts/capture.mjs

pnpm build
```

> 注意：本机若配置了系统代理（http_proxy 指向 127.0.0.1:7890），curl/Playwright 访问 127.0.0.1 需走 `NO_PROXY="*"` 绕过代理，否则会得到 502。

## 部署

Cloudflare Pages：`wrangler.toml` 的 `pages_build_output_dir = "dist"`，配合 `public/_headers` / `public/_redirects`。

```bash
pnpm build
# wrangler pages deploy dist  或在 Cloudflare 控制台关联仓库自动构建
```

## 目录

- `src/components/campus-auth/` — Hero / Features / Demo / Tech / Scenarios / Screenshots / FAQ / Download / CTA
- `src/data/site.ts` — 版本、仓库、下载资产等单一事实来源
- `public/screenshots/` — Playwright 实拍（dashboard/profiles/tasks/ai-task/scheduled/scripts/appearance/settings/monitor/browser）
- `scripts/capture.mjs` / `scripts/generate-sitemap.mjs`

## 站点信息

- 仓库：https://github.com/Misyra/Campus-Auth-rs
- 版本：5.0.0-alpha.8
