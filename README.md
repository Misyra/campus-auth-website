# 认证喵（Campus-Auth）官网

Rust 重写版 `Campus-Auth-rs` 的官网与使用文档，参考 `farion1231/cc-switch-website` 的质感与信息架构。

## 本地开发

```bash
cd E:/campus-auth-website
pnpm install
pnpm dev      # http://localhost:5173
pnpm lint && pnpm typecheck   # eslint 9 flat config / tsc -b
pnpm check:docs               # 校验文档相对链接与 /docs 路由（27 篇 + 35 条路由）
pnpm smoke                    # 冒烟测试（需先 pnpm build；校验路由/侧栏/搜索/下载页）
pnpm build && pnpm preview    # build 前会自动重新生成 sitemap 与 release 快照
```

## 文档

中文文档源为 `src/content/docs/zh/` 下的 Markdown（8 个章节、28 篇），构建时由
`scripts/markdown-plugin.mjs` 渲染为 HTML（GFM 提示块、站内链接改写、Prism 高亮、
截图写入 1280×720 固有尺寸防 CLS）。新增/调整章节需同步：

- `src/content/docs/index.ts` 与 `scripts/markdown-plugin.mjs` 的 `DOC_PATH_MAP`
- `src/content/docs/navigation.tsx` 的侧栏目录
- `public/sitemap.xml`（或依赖构建时 `generate-sitemap.mjs`）

> [!IMPORTANT]
> 客户端（`Campus-Auth-rs`）的界面里有若干个按钮**直接指向本站的具体路由**，例如
> `LoginChannelField.vue` 的「脚本登录文档」→ `/docs/profiles/script-login`。
> 这些链接不受 `pnpm check:docs` 保护（它只扫本站源码），**改路由名或删页面前先改客户端**，
> 并在 `src/content/docs/index.ts` 的 `LEGACY_REDIRECTS` 里留一条旧路径重定向——
> 已发布的客户端版本不会跟着一起更新。

## 截图

- **文档截图**（`public/screenshots/docs/*.avif` + `*.webp`，1280×720）：来自全新安装实例
  实拍。重拍方式：启动应用（`campus-auth.exe --base-path <空目录> --port <空闲端口> --no-browser --no-tray`，
  再 `POST /api/agree` 同意条款），用浏览器自动化把视口设为 **1280×720** 后逐页截 PNG，
  再 `node scripts/optimize-doc-shots.mjs <png 目录>` 生成 avif（quality 52）+ webp（quality 82）
  并覆盖同名文件；`pnpm check:docs` 会校验两个扩展名都存在。
  正文插图只写 `.avif`——构建期由 `markdown-plugin.mjs` 包成 `<picture>`（webp 兜底）。

- **首页演示**：Hero 的 ConsoleMock 为手绘 React 动效组件
  （`src/components/campus-auth/console-mock/`），文案与 v5.0.0 真实启动序列保持一致；
  「控制台界面」标签页直接引用 `public/screenshots/docs/` 下的实拍图。

## 字体

Inter / Fira Code 已自托管（latin 子集可变字体，`public/fonts/`），不依赖 fonts.googleapis.com（大陆不可达）。中文使用 Noto Sans SC（站点按需分片加载），回退系统字体。如需更新字体：

```bash
pnpm fonts   # node scripts/fetch-fonts.mjs
```

## 部署

Cloudflare Pages：`wrangler.jsonc` 配合 `public/_headers` / `public/_redirects`。

```bash
pnpm build
# wrangler pages deploy dist  或在 Cloudflare 控制台关联仓库自动构建
```

## 目录

- `src/content/docs/zh/` — 中文文档源（Markdown，构建期渲染）
- `src/components/campus-auth/` — Hero / Features / Demo / Tech / FAQ / Download / CTA
- `src/components/docs/` — 文档页组件（侧栏、目录、搜索、Markdown 渲染与图片灯箱）
- `src/data/site.ts` — 版本、仓库、FAQ 等单一事实来源
- `src/data/changelog.ts` — 更新日志页的精选数据（完整记录见仓库 docs/updatelog.md）
- `public/screenshots/docs/` — 文档与首页引用的 v5.0.0 实拍截图
- `scripts/check-doc-links.mjs` — 文档链接 QA（pnpm check:docs）
- `scripts/markdown-plugin.mjs` — 构建期 Markdown 渲染

## 站点信息

- 仓库：https://github.com/Misyra/Campus-Auth-rs
- 当前版本：5.0.0（构建时由 `scripts/fetch-release.mjs` 自动同步）

## 协议

本站点代码以 [AGPL-3.0](LICENSE) 授权。
