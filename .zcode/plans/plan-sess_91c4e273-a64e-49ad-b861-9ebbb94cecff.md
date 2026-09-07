# 文档排列结构优化 — 实施计划

## 上下文

当前文档 IA：6 组 21 篇（`navigation.tsx` + `index.ts DOC_PATH_MAP` + `public/docs/zh/N-*/N.M-*.md` + `generate-sitemap.mjs` 硬编码三源真值）。本次不新增内容，只重排、去重、消除命名冲突。已于 2026-09-07 完成 17→21 篇重构，发现以下结构问题：

**已验证的痛点（3 个 Explore 并发确认）：**

1. **重复** — `6-reference` 的 4 篇与教程页近 1:1 重复：`4.1-monitor` vs `6.2-monitor`（三探针表、默认目标、204 必须 http 的原因）、`6.1-browser` vs `1.4-quickstart §3`/`1.3-console`/`5.3-faq`（`headless`/`low_resource_mode`/`persistent_context` 等）、`5.1-cli` vs `6.4-files`（目录树）、`6.3-system` vs `5.1`/`5.2`（`auto_restart_hours`/`keep_alive`/`proxy_url` 链路）。改一个阈值要动 3-5 个文件。
2. **顺序错位** — `1.3 控制台导览` 在 `1.4 快速开始` 之前，新用户被迫先读界面再跑通 happy path；`4.2 录制与调试` 属于任务编写，却放在 `4-自动化` 下；`5.3 常见问题` 藏在末尾但排查时最常需要；`6-reference` 作为线性附录却用数字 `6.` 暗示必读。
3. **命名/路由** — 目录/文件名 `N.M-*.md` 与 `navigation.tsx id` + `DOC_PATH_MAP` 重复编码；`browser`/`monitor` 两个 `item id` 跨 `tasks`/`automation` vs `reference` 重名；新增文件需同步 3-4 处（`navigation.tsx` + `index.ts` + `sitemap.mjs` + `site.ts` FAQ 链接）。

## 目标

- 新用户 5 分钟跑通路径更顺：`简介 → 安装 → 快速开始 → 控制台`。
- 按用户心智分组：编写任务相关归一处，运行时相关归一处，查表相关集中附录。
- `reference` 成为唯一真值表，教程页只保留概念 + 链向附录，不再复制参数表。
- 最小化改动、保持旧 `?section=&item=` 链接可用（`resolveIds` 回落 + 可选兼容映射）。

## 推荐方案：A — 用户旅程重排 + 附录保留（最小风险）

**新 IA（6 组 21 篇，组数不变，组内重排 + 1 篇跨组移动）：**

```
1 快速入门   introduction → install → quickstart → console
            （仅调换 quickstart/console 顺序，文件不动，navigation 数组重排）

2 多网络配置 overview → match → redirect
            （不变）

3 任务       concepts → browser → variables → scripts → debug
            （4.2 录制与调试 从 automation 移入，成为 3.5；最符合“写任务”心智）

4 自动化     monitor → scheduled
            （剩 2 篇；monitor 瘦身为概念/选型指南，参数表只链向 6.2）

5 系统与运维 cli → update → faq
            （不变，但 faq 在侧边栏置顶提示，或标题改为“故障排查”）

6 配置参考   browser → monitor → system → files
            （不变，作为唯一真值附录）
```

**为什么选 A：**
- 对现有用户最友好：console 侧边栏 `/profiles` `/tasks` 心智不变，仅 `debug` 换组。
- 改动面最小：`navigation.tsx` 2 处数组重排 + `index.ts` 1 个 key 移动 + 磁盘 1 个文件移动 + `sitemap.mjs` 1 行移动 + 约 10 处 md 内链更新。
- 去重可增量做：先加“详见配置参考”链，再逐步删教程页中的重复表，不一次性重写。

**备选 B — 合并附录（激进，适合 40+ 篇时）：**
将 `6-reference` 4 篇分别合并进宿主章节（`6.1` → `3.2` 末尾折叠、`6.2` → `4.1`、`6.3` → `5.1`/`5.2`、`6.4` → `5.1`），删除 `reference` 组。优点是单源真值、零跳转；缺点是单篇变长、全局查表能力丧失、迁移成本高。不推荐本次执行，但作为下一步演进方向。

## 实施步骤

### 1. 代码层（4 文件）

| 文件 | 改动 |
|---|---|
| `src/content/docs/navigation.tsx` | `getting-started.items` 重排 `quickstart` 到 `console` 之前；`tasks.items` 追加 `{id:"debug", title:"录制与调试"}`；`automation.items` 删除 `debug` |
| `src/content/docs/index.ts` | `DOC_PATH_MAP.tasks.debug = "3-tasks/3.5-debug.md"`；删除 `automation.debug`；`getting-started` 内 `console`/`quickstart` 的 value 不变仅 key 顺序无关，但为可读性可重排 |
| `scripts/generate-sitemap.mjs` | `docsSections` 数组同步重排：`getting-started/quickstart` 提到 `console` 前；`tasks/debug` 新增；`automation/debug` 删除 |
| `src/data/site.ts`（及 `SiteFooter.tsx`/`ChangelogPage.tsx` 若有） | `FAQS` 中 `href:"/docs?section=automation&item=debug"` → `"/docs?section=tasks&item=debug"`；其余 FAQ 链接保持 |

### 2. 磁盘层（1 次移动）

```bash
git mv public/docs/zh/4-automation/4.2-debug.md public/docs/zh/3-tasks/3.5-debug.md
# dist/ 由 vite 构建自动同步，无需手移
```

*备选：保留文件不动仅改 `DOC_PATH_MAP` 指向旧路径也可，但为一致性建议移动。*

### 3. 内容层（去重，不新增文件）

- `4.1-monitor.md`：删除与 `6.2` 重复的完整参数表，保留三探针概念、默认目标、选型建议，顶部加 `> 完整参数见 [配置参考 · 监测与重试](../6-reference/6.2-monitor.md)`。
- `1.4-quickstart.md §3/§6`：浏览器/监测两处表格各删半，保留“先关后台运行”等操作建议，参数链向 `6.1`/`6.2`。
- `1.3-console.md`：保留路由表，删除对 `browser/monitor` 字段的枚举，改为链向附录。
- `5.1-cli.md` 与 `6.4-files.md`：`5.1` 保留命令表，目录树注明 `详见 [配置文件与目录](../6-reference/6.4-files.md)`。
- `3.5-debug.md`（新位）：首行加 `> 录制器属于任务编写，已从“自动化”移至本组` 的迁移提示（1 个版本后可删）。

### 4. 内链修复（批量）

```bash
grep -r "4-automation/4.2-debug\|automation.*debug\|6-reference/6\." public/docs/zh --include="*.md" -n
# 将 ../4-automation/4.2-debug.md → ../3-tasks/3.5-debug.md
# 校验剩余 ../6-reference/6.* 链仍经 DOC_ROUTE_BY_PATH 可解析
```

### 5. 兼容性

- 旧书签 `?section=automation&item=debug` 在 `DocsPage.tsx resolveIds` 会回落到 `automation` 首篇而非 404。为避免困惑，可在 `DocsPage.tsx` 加一次性兼容映射：`if (sid==="automation" && iid==="debug") { sid="tasks"; iid="debug"; }`（可选，1 个版本后移除）。

### 6. 验证

```bash
npm run typecheck
npm run generate:sitemap && cat public/sitemap.xml  # 确认 25 URL 顺序与新 IA 一致
npm run build
npx vite preview --port 4173 & node scripts/smoke.mjs  # 需通过：/docs 标题、/sitemap.xml、字体 200
# 手测：/docs?section=tasks&item=debug 与旧 ?section=automation&item=debug 均可达；搜索“录制”命中新位置；上一篇/下一篇跨组跳转正确
```

## 风险与缓解

| 风险 | 缓解 |
|---|---|
| 旧外链失效 | 保留 `resolveIds` 回落 + 可选兼容映射；sitemap 同步更新后搜索引擎逐步收敛 |
| 三源真值再次漂移 | 本次仅改排序与 1 次移动，不改 `N.M` 文件名前缀；后续可考虑脚本从 `navigation.tsx` 生成 `DOC_PATH_MAP`/`sitemap` 以单源化（不在本次做） |
| 去重导致教程页信息不足 | 采用“链向附录”而非“删表”，保留最小操作建议，用户仍可在不跳转时完成 quickstart |

## 不做事项（明确范围外）

- 不重命名 `N.M-*.md` 前缀为 slug 目录（如 `getting-started/introduction.md`）—— 改动面大且需全量内链重写，留待下一次单源化改造。
- 不拆分 `5.3-faq` 为独立“故障排查”顶级分组 —— 可在标题微调中完成，不新增分组。
- 不改 URL 方案（`?section=&item=` → `/docs/:section/:id`）—— 涉及路由与 SEO 重定向，超出本次排列优化范围。

## 待你确认

1. 是否接受 A 方案（重排 + debug 跨组移动 + 附录去重）作为本次执行？若倾向 B（合并附录），我会将 `6-reference` 4 篇直接并入宿主章节并删除该分组。
2. `5.3 常见问题` 是否改名为 `故障排查` 并在侧边栏加醒目样式？（仅标题改动，无路由影响）
