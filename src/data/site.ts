// 单一事实来源：版本、仓库、下载、导航
export const SITE = {
  name: "Campus-Auth",
  title: "Campus-Auth — 校园网小助手 · 断网重连",
  description:
    "校园网小助手，断网重连、跨网无感切换，全天候一键在线。Playwright 真浏览器自动化与验证码 OCR 自动搞定登录，定时打卡也一并完成。Rust 单文件解压即用，本地运行隐私不离机。",
  version: "5.0.0-alpha.8",
  repo: "https://github.com/Misyra/Campus-Auth-rs",
  releaseBase: "https://github.com/Misyra/Campus-Auth-rs/releases",
  qqGroup: "1105307735",
  docsUrl: "/docs",
} as const;

export const NAV_LINKS = [
  { label: "首页", href: "/" },
  { label: "文档", href: "/docs" },
  { label: "更新日志", href: "/changelog" },
  { label: "下载", href: "/download" },
] as const;

export const FEATURES = [
  {
    title: "断网重连",
    desc: "三重探针盯紧网络，断线或被劫持时 30 秒内自动重连——宿舍熄灯、教学楼漫游也不掉线。",
    icon: "Wifi" as const,
  },
  {
    title: "多网络切换",
    desc: "按网关 IP 与 WiFi 自动选对配置方案与账号，跨校区来回跑也无需手动切换。",
    icon: "ArrowLeftRight" as const,
  },
  {
    title: "真浏览器自动化",
    desc: "Playwright 驱动真实浏览器，二次跳转、iframe 嵌套、运营商下拉都能点对。",
    icon: "Layers" as const,
  },
  {
    title: "验证码 OCR",
    desc: "验证码自动识别回填，失败就重试，不用再盯着模糊字符手输。",
    icon: "ScanSearch" as const,
  },
  {
    title: "定时打卡",
    desc: "cron 一行搞定每日签到与在线保活，浏览器任务到点自动跑。",
    icon: "Clock3" as const,
  },
  {
    title: "控制台 · AI 生成",
    desc: "本地 Web 控制台 + 系统托盘，给登录页截个图，AI 帮你生成可用任务。",
    icon: "Sparkles" as const,
  },
];

export const FAQS: { q: string; a: string; href?: string; linkLabel?: string }[] = [
  {
    q: "断网后为什么没有自动触发？",
    a: "先看设置 → 网络监测里至少开一种检测（默认 204 开启）；再核对当前配置方案的认证地址与校园网是否一致。",
    href: "/docs/automation/monitor",
    linkLabel: "查看断网检测",
  },
  {
    q: "uv / Python 环境下载失败怎么办？",
    a: "多为校园网未认证、代理不通或镜像限速：先连好校园网，设置 → 系统里点“初始化 Python 环境”重试；代理环境在系统设置填好代理地址后重试。",
    href: "/docs/faq/troubleshoot",
    linkLabel: "查看排障指南",
  },
  {
    q: "Playwright 浏览器一直装不上？",
    a: "默认走 npmmirror 镜像，若本机有 Edge/Chrome 可直接复用无需下载；失败时在设置 → 浏览器一键安装 Chromium，或检查代理与磁盘空间。",
    href: "/docs/faq/troubleshoot",
    linkLabel: "查看排障指南",
  },
  {
    q: "多校区、双运营商怎么配？",
    a: "每个校区/运营商各建一条配置方案，填好网关或 WiFi 匹配规则并绑定各自任务，系统会自动选最匹配的一条。",
    href: "/docs/profiles/match",
    linkLabel: "查看自动匹配",
  },
  { q: "验证码总是识别失败？", a: "失败会自动重试；可调大等待、在任务里加截图断言，或在调试面板复现并导出反馈包。", href: "/docs/tasks/debug", linkLabel: "查看录制与调试" },
  { q: "Docker 怎么用？", a: "docker compose up -d --build 一键启动，数据落在命名卷持久化，开箱即带完整环境。", href: "/docs/getting-started/install", linkLabel: "查看安装与运行" },
  { q: "如何开机自启？", a: "在设置 → 系统 → 启动与运行中开启「开机自启动」，或执行 campus-auth --autostart enable。", href: "/docs/system/cli", linkLabel: "查看常用命令与文件说明" },
  { q: "离线能用吗？", a: "能。认证与定时都在本地跑，仅 AI 生成与版本检查需要联网。" },
];
