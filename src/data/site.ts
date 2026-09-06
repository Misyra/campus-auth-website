// 单一事实来源：版本、仓库、下载、导航
export const SITE = {
  name: "Campus-Auth",
  title: "Campus-Auth — 校园网自动认证 · 断网自愈",
  description:
    "校园网自动认证工具：断网自愈、多 Profile 智能匹配、Playwright 真浏览器自动化、验证码 OCR、定时打卡与 Web 控制台，Rust 单二进制解压即用。",
  version: "5.0.0-alpha.8",
  repo: "https://github.com/Misyra/Campus-Auth-rs",
  releaseBase: "https://github.com/Misyra/Campus-Auth-rs/releases",
  docsUrl: "/docs",
  defaultPort: 50721,
} as const;

export const NAV_LINKS = [
  { label: "首页", href: "/" },
  { label: "文档", href: "/docs" },
  { label: "更新日志", href: "/changelog" },
  { label: "下载", href: "/download" },
] as const;

export type DownloadAsset = {
  label: string;
  file: string;
  hint: string;
};

export const DOWNLOAD_ASSETS: DownloadAsset[] = [
  { label: "Windows x64", file: "campus-auth-windows-x86_64.zip", hint: "Windows 10+ · 解压双击即用" },
  { label: "Windows arm64", file: "campus-auth-windows-aarch64.zip", hint: "Surface / arm64" },
  { label: "macOS Apple Silicon", file: "campus-auth-macos-aarch64.tar.gz", hint: "macOS 12+ · xattr -cr 后运行" },
  { label: "macOS Intel", file: "campus-auth-macos-x86_64.tar.gz", hint: "Intel Mac" },
  { label: "Linux x64", file: "campus-auth-linux-x86_64.tar.gz", hint: "需 libgtk-3 / libayatana-appindicator" },
];

export const FEATURES = [
  {
    title: "断网自愈",
    desc: "三探针自动感知，劫持立刻登录。",
    icon: "Wifi" as const,
  },
  {
    title: "多网络切换",
    desc: "按网关与 WiFi 自动匹配，跨楼栋无感漫游。",
    icon: "ArrowLeftRight" as const,
  },
  {
    title: "真浏览器自动化",
    desc: "Playwright 驱动完整表单与断言流程。",
    icon: "Layers" as const,
  },
  {
    title: "验证码 OCR",
    desc: "自动识别与回填，失败重试。",
    icon: "ScanSearch" as const,
  },
  {
    title: "定时打卡",
    desc: "cron 调度，覆盖日常签到与保活。",
    icon: "Clock3" as const,
  },
  {
    title: "控制台 · AI 生成",
    desc: "本地控制台与托盘，拍一张登录页即生成任务。",
    icon: "Sparkles" as const,
  },
];

export const FAQS: { q: string; a: string; href?: string; linkLabel?: string }[] = [
  {
    q: "断网后为什么没有自动触发？",
    a: "确认检测已开启且探针至少启用其一；检查当前配置方案的认证地址是否与校园网一致。",
    href: "/docs?section=automation&item=monitor",
    linkLabel: "查看断网检测",
  },
  {
    q: "多校园如何配置？",
    a: "每个配置方案绑定认证地址与网络匹配规则，系统自动选择最相关的一项。",
    href: "/docs?section=profiles&item=match",
    linkLabel: "查看自动匹配",
  },
  { q: "验证码总是失败？", a: "失败会自动重试；可在任务中增加等待与截图断言，或在调试面板复现并导出反馈包。", href: "/docs?section=automation&item=debug", linkLabel: "查看录制与调试" },
  { q: "Docker 怎么用？", a: "docker compose up -d --build 一键启动，数据在命名卷持久化。", href: "/docs?section=getting-started&item=install", linkLabel: "查看安装与运行" },
  { q: "如何开机自启？", a: "在设置 → 系统中开启开机自启动，或使用 --autostart。", href: "/docs?section=system&item=cli", linkLabel: "查看命令行与目录" },
  { q: "离线能用吗？", a: "认证与定时均在本地；仅 AI 生成与版本检查需联网。" },
];
