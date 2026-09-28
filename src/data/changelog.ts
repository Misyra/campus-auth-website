import { SITE } from "@/data/site";

// 更新日志的站内精选版。完整逐项记录见仓库 docs/updatelog.md 与 GitHub Releases，
// 这里保留用户最需要知道的变化，每条一行；重要条目附站内文档深链。
export type ChangelogCategory = "breaking" | "feature" | "improve" | "perf" | "fix" | "deploy";

export type ChangelogItem = {
  text: string;
  doc?: { href: string; label: string };
};

export type ChangelogVersion = {
  version: string;
  date: string;
  channel: "stable" | "pre";
  summary: string;
  sections: { category: ChangelogCategory; items: ChangelogItem[] }[];
};

const D = (href: string, label: string) => ({ href, label });

export const CHANGELOG: ChangelogVersion[] = [
  {
    version: "v5.1.0",
    date: "2026-09-27",
    channel: "stable",
    summary: "任务页大改版：直连配置独立为「直连任务」，列表 + 编辑页 + 自动保存；直连支持前置请求与退出登录。",
    sections: [
      {
        category: "breaking",
        items: [
          {
            text: "直连请求的配置从「方案」搬进独立的「直连任务」：同一门户的不同账号可共用一份请求配置，也便于分享；升级时自动搬迁为「<方案名> 直连」并绑定好，无需手工处理（搬迁单向，不建议回退旧版本）",
            doc: D("/docs/profiles/http-login", "直连请求登录"),
          },
          {
            text: "旧「方案分享」文件里的直连配置导入时会被忽略并提示，请在 任务 · 直连任务 里重新配置；直连任务本身的分享走任务导出 / 任务仓库，不受影响",
          },
        ],
      },
      {
        category: "feature",
        items: [
          {
            text: "任务页改版：列表页 + 二级编辑页，改动停手半秒自动落盘，页头状态字说明保存进度，地址栏记住 ?task=<id> 可直达；浏览器任务 / 直连任务 / 脚本 / 定时任务四个子页同一套交互",
          },
          {
            text: "「任务」页新增「直连任务」Tab：按填写顺序分六组并带配置向导；新增可选的「前置请求」与「退出登录请求」，先取令牌（如 CSRF）的两步式门户、要先踢旧会话的门户也能直连",
            doc: D("/docs/profiles/http-login", "直连请求登录"),
          },
          {
            text: "直连任务可复用、可分享：任务仓库按类型各有一份索引（浏览器任务 index.json / 直连任务 index.http.json），导入即落盘并当场打开编辑页；直连任务还可填自己的「认证地址」，留空沿用方案的",
          },
          {
            text: "「卸载」现在是真的卸载：程序退出后由更新助手完成删除，弹窗逐项列出将删内容，可选「保留配置与任务」（加密密钥一并保留，重装后方案任务都还在）",
          },
        ],
      },
      {
        category: "improve",
        items: [
          { text: "直连任务支持拖拽排序，自带「发送测试请求」（手填测试账号密码，结果中的凭据回显为 ***）；方案侧选「直连请求」后也可直接发送测试请求" },
          { text: "定时任务页改版：与其他任务子页同一套表格与编辑页；目标直接显示任务名（已删除标红），侧栏显示「下次执行」，执行历史与登录历史同款式" },
          { text: "Web 服务新增 Host 头校验，阻断 DNS rebinding 攻击；正常本地访问无任何变化" },
        ],
      },
      {
        category: "fix",
        items: [
          { text: "新建任务不再「点一下就留一个空任务」：新建只是草稿，改了才创建；字段改回原样也不再写盘" },
          { text: "修复浏览器任务与直连任务自动 ID 撞号导致「改一类删掉另一类」的问题；换任务前会先补存最后一笔改动" },
          { text: "非每日的定时表达式不再被无关编辑静默改成「每天 08:00」；定时任务「已存在却存不上」的问题修复" },
          { text: "新建脚本不再因打字停顿被锁名；脚本 ID 命名放宽为 1~64 位字母、数字、下划线或连字符" },
          { text: "含危险步骤 / 凭据脚本的任务在编辑器里常驻安全说明；「加载默认模板」会先确认" },
        ],
      },
    ],
  },
  {
    version: "v5.0.2",
    date: "2026-09-20",
    channel: "stable",
    summary: "修复应用内更新下载完成后无法生效的问题。",
    sections: [
      {
        category: "fix",
        items: [
          { text: "点「立即更新」并选择「立即重启」后不再停留在旧版本：带待应用更新重启时不再生成锁住主程序文件的替代进程，更新由助手完成替换后直接用新版启动" },
        ],
      },
    ],
  },
  {
    version: "v5.0.1",
    date: "2026-09-19",
    channel: "stable",
    summary: "修复「启动后执行：登录一次后退出」不退出的问题。",
    sections: [
      {
        category: "fix",
        items: [
          { text: "「启动后执行：登录一次后退出」现在真的会退出：登录成功后程序自动关闭，失败或取消时保持运行便于查看原因" },
        ],
      },
    ],
  },
  {
    version: "v5.0.0",
    date: "2026-09-18",
    channel: "stable",
    summary: "认证喵 5.0 正式版：直连请求登录、任务按方案绑定、AI 生成增强与手动更新。",
    sections: [
      {
        category: "breaking",
        items: [
          {
            text: "浏览器任务改为按方案绑定：切换方案即切换任务，旧的全局选择自动迁移给当前方案，不会丢失",
          },
          {
            text: "认证地址收敛为「填了直接用、留空跟随重定向」，原「重定向模式」开关移除，自定义触发地址收进「重定向高级设置」",
            doc: D("/docs/profiles/redirect", "重定向说明"),
          },
          {
            text: "新增「登录严格模式」且默认开启；「先登学校门户再认证」的两级认证网络如遇不自动恢复，请在 设置 · 检测 关闭它",
          },
          {
            text: "界面导航固定为五项，定时任务 / 外观分别归入任务、设置页，旧地址自动跳转、书签不失效",
          },
        ],
      },
      {
        category: "feature",
        items: [
          {
            text: "直连请求登录：门户登录只是一个 HTTP 请求时，免 Python、免浏览器直接完成认证，并附四步配置向导",
            doc: D("/docs/profiles/http-login", "使用指南"),
          },
          {
            text: "方案页新增「重定向检测」：打开可见浏览器实测门户跳转，判断认证地址是否需要填写",
            doc: D("/docs/profiles/redirect", "重定向说明"),
          },
          {
            text: "定时任务新增「启动后执行」：每次开机后延迟执行，支持每日成功上限与失败重试，签到不再漏跑",
            doc: D("/docs/automation/scheduled", "定时任务"),
          },
          {
            text: "手动更新两条路：「选择安装包」本地直接安装，或把发布包放进 update/ 目录跳过联网下载",
            doc: D("/docs/maintenance/update", "更新说明"),
          },
          {
            text: "方案可导出 JSON 分享给同学：不含账号密码，导入前会展示内容与凭据脚本原文",
          },
          {
            text: "AI 生成浏览器任务增强：结构化页面上下文、服务商卡片向导（OpenCode Zen 内置体验 Key）、测试连接",
            doc: D("/docs/tasks/recorder", "录制器与 AI"),
          },
          {
            text: "「设置 · 系统」新增运行模式预设：日常使用 / 排查问题一键切换，改动项先列清单再确认",
          },
        ],
      },
      {
        category: "improve",
        items: [
          { text: "软件中文名定为「认证喵」，全站字体改为 Noto Sans SC 可变字重" },
          { text: "方案页成为账号类唯一入口：打开即停在当前方案，表单一次保存全部生效" },
          { text: "主题色默认改为黑白（日间黑 / 夜间白）；已有配置保留原选择" },
          { text: "本机已装 Edge / Chrome 时不再下载 Chromium，省约 150 MB" },
          { text: "新安装默认不自动开始检测，并默认启用 23:00–06:00 夜间暂停时段" },
          { text: "密码框区分「已保存 / 未设置」，支持清除并撤销；浅色主题文字整体加深更清晰" },
        ],
      },
      {
        category: "perf",
        items: [
          { text: "登录历史接口按需读取：2 万条时约 61ms → 1.8ms，不再随历史总量变慢" },
          { text: "实时日志推送缓冲收窄，16 个标签页常驻内存降低约 79%" },
        ],
      },
      {
        category: "fix",
        items: [
          {
            text: "直连登录补齐四处：HTTPS 证书策略、Chrome UA 兜底、响应头展示、保存时体积校验",
            doc: D("/docs/profiles/http-login", "直连登录"),
          },
          { text: "重定向门户「明明没网却一直不登录」：严格模式误判时谨慎放行一次浏览器" },
          { text: "任务执行结果区分「跑完」与「认证成功」，不再弹误导性的绿色成功提示" },
          { text: "「选择安装包」不再触发整页刷新；GUI 构建下命令行输出不再静默丢失" },
          { text: "默认端口被系统保留时自动改配可用端口，控制台照常启动" },
          { text: "定时任务不再被并发登录打断；卸载 OCR 依赖不再截断正在执行的任务" },
          { text: "任务录制器说明改为「生成 AI 提示词」，不再让人以为点完就有任务" },
        ],
      },
      {
        category: "deploy",
        items: [
          { text: "「安装录制器」脚本随镜像分发，容器内不再 404" },
          { text: "compose 补 40s 优雅停机与 init，容器停止不再留下孤儿 Chromium 进程" },
          { text: "容器内不再安装开发依赖；部署文档统一「不暴露公网」口径" },
        ],
      },
    ],
  },
  {
    version: "v5.0.0-alpha.10",
    date: "2026-09-11",
    channel: "pre",
    summary: "网络检测口径重做与安装体验修复。",
    sections: [
      {
        category: "improve",
        items: [
          { text: "默认仅开启 HTTP 204 门户检测，TCP 与 URL 内容检测改为按需启用的补充手段" },
          { text: "网络结论新增「等待检测 / 证据不足」状态，不再把弱证据误报为离线" },
          { text: "仪表盘会说明网络结论的原因，以及接下来会观察、登录还是等待修复配置" },
          { text: "Docker 默认拉取 GHCR x64/ARM64 多架构预构建镜像，部署机不再重复编译" },
        ],
      },
      {
        category: "fix",
        items: [
          { text: "Worker 首次启动失败会自动修复环境并重试当前操作" },
          { text: "修复 OCR 依赖安装 / 卸载时的命令拼接错误；虚拟环境损坏时自动重建" },
        ],
      },
    ],
  },
];

export function releaseLink(version: string): string {
  return `${SITE.repo}/releases/tag/${version}`;
}

export const CATEGORY_META: Record<
  ChangelogCategory,
  { label: string; cls: string }
> = {
  breaking: {
    label: "不兼容变更",
    cls: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  feature: {
    label: "新功能",
    cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  improve: {
    label: "体验",
    cls: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  perf: {
    label: "性能",
    cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  fix: {
    label: "修复",
    cls: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  deploy: {
    label: "Docker 部署",
    cls: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  },
};
