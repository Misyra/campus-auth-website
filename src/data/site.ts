// 单一事实来源：版本、仓库、下载、导航
export const SITE = {
  name: "Campus-Auth",
  title: "Campus-Auth — 校园网自动登录工具",
  description:
    "校园网自动登录工具：支持断网自动重连与多网络配置切换。基于真实浏览器执行登录流程，支持验证码自动识别与定时任务。Rust 单文件发行，解压即用，账号数据仅保存在本地。",
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
    desc: "通过多种检测方式监控网络状态，断线或认证失效时在 30 秒内自动重连，适用于宿舍、教学楼等场景。",
    icon: "Wifi" as const,
  },
  {
    title: "多网络切换",
    desc: "依据网关 IP 与 WiFi 名称自动选用对应的配置方案与账号，多校区场景无需手动切换。",
    icon: "ArrowLeftRight" as const,
  },
  {
    title: "真浏览器自动化",
    desc: "基于 Playwright 驱动真实浏览器完成登录操作，支持页面跳转、嵌套框架与下拉选项等情形。",
    icon: "Layers" as const,
  },
  {
    title: "验证码 OCR",
    desc: "自动识别并填写验证码，识别失败时自动重试，无需人工输入。",
    icon: "ScanSearch" as const,
  },
  {
    title: "定时打卡",
    desc: "支持以 cron 表达式配置每日签到与在线保活任务，到达设定时间自动执行。",
    icon: "Clock3" as const,
  },
  {
    title: "控制台 · AI 生成",
    desc: "提供本地 Web 控制台与系统托盘。上传登录页截图后，可由 AI 生成可用的任务配置。",
    icon: "Sparkles" as const,
  },
];

export const FAQS: { q: string; a: string; href?: string; linkLabel?: string }[] = [
  {
    q: "没有校园网账号，能用这个软件吗？",
    a: "不能。使用本软件需要有效的校园网账号，其仅实现自动登录认证，不提供破解或绕过认证的功能。",
  },
  {
    q: "断网后为什么没有自动触发？",
    a: "请检查设置 → 网络监测中是否启用了至少一种检测方式（默认启用 204 检测）；并确认当前配置方案中的认证地址与校园网一致。",
    href: "/docs/automation/monitor",
    linkLabel: "查看断网检测",
  },
  {
    q: "uv / Python 环境下载失败怎么办？",
    a: "通常由校园网未认证、代理不通或镜像限速引起：请先完成校园网认证，再于设置 → 系统中点击“初始化 Python 环境”重试；使用代理的环境请先在系统设置中填写代理地址。",
    href: "/docs/faq/troubleshoot",
    linkLabel: "查看排障指南",
  },
  {
    q: "Playwright 浏览器一直装不上？",
    a: "默认使用 npmmirror 镜像下载；若本机已安装 Edge 或 Chrome，可直接复用，无需下载。若安装失败，可在设置 → 浏览器中一键安装 Chromium，或检查代理设置与磁盘空间。",
    href: "/docs/faq/troubleshoot",
    linkLabel: "查看排障指南",
  },
  {
    q: "多校区、双运营商怎么配？",
    a: "每个校区或运营商分别创建一条配置方案，填写网关或 WiFi 匹配规则并绑定各自的任务，系统将自动选用匹配度最高的一条。",
    href: "/docs/profiles/match",
    linkLabel: "查看自动匹配",
  },
  { q: "验证码总是识别失败？", a: "识别失败时会自动重试；可适当增大等待时间、在任务中增加截图断言，或在调试面板中复现并导出反馈包。", href: "/docs/tasks/debug", linkLabel: "查看录制与调试" },
  { q: "Docker 怎么用？", a: "执行 docker compose up -d --build 即可启动，数据持久化于命名卷中，运行环境已预装。", href: "/docs/getting-started/install", linkLabel: "查看安装与运行" },
  { q: "如何开机自启？", a: "可在设置 → 系统 → 启动与运行中开启开机自启动，或执行 campus-auth --autostart enable。", href: "/docs/system/cli", linkLabel: "查看常用命令与文件说明" },
  { q: "离线能用吗？", a: "认证与定时任务均在本地执行，离线可用；仅 AI 生成功能与版本检查需要联网。" },
];
