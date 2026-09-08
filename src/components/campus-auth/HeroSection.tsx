import { motion } from "framer-motion";
import { ArrowRight, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MacOsWindowBar } from "./MacOsWindowBar";
import { ConsoleMock } from "./ConsoleMock";
import { SmartDownload } from "./SmartDownload";
import { useLatestRelease } from "@/hooks/useLatestRelease";
import { SITE } from "@/data/site";

export function HeroSection() {
  const { tag } = useLatestRelease();
  return (
    <section className="relative flex flex-col justify-center overflow-hidden" style={{ minHeight: "100dvh", paddingTop: 64 }}>
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid opacity-[0.18]" />

      <div className="container relative z-10 max-w-[1440px] py-12 md:py-16 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[540px_1fr] lg:gap-10 xl:gap-14">
          <div className="mx-auto max-w-[600px] text-center lg:mx-0 lg:max-w-none lg:text-left">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-sm font-medium dark:bg-primary/15">
                <span aria-hidden>🎉</span> {tag} · 开源免费 · 单文件发行
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
                <img src="/logo.png" alt="Campus-Auth" width={64} height={64} className="h-14 w-14 rounded-xl bg-white p-1.5 shadow-md md:h-16 md:w-16" />
                <h1 className="text-[32px] font-extrabold tracking-tight md:text-[48px] lg:text-[52px]">Campus-Auth</h1>
              </div>

              <p className="mx-auto mt-5 max-w-[520px] text-[18px] font-semibold leading-relaxed md:text-[24px] lg:mx-0">
                校园网自动登录工具，<span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">断网重连</span>、多网络自动切换
              </p>
              <p className="mx-auto mt-4 max-w-[540px] text-sm leading-relaxed text-muted-foreground md:text-[16px] lg:mx-0">
                断线自动重连，更换网络时自动匹配配置，验证码自动识别。单文件发行，解压即用，无需注册，账号数据仅保存在本地。
              </p>
              <ul className="mx-auto mt-5 flex max-w-[540px] flex-wrap justify-center gap-2 text-xs text-muted-foreground lg:mx-0 lg:justify-start">
                <li className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1"><Check className="h-3.5 w-3.5 text-emerald-500" /> Rust 单二进制</li>
                <li className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1"><Check className="h-3.5 w-3.5 text-emerald-500" /> 本地 Web 控制台</li>
                <li className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1"><Check className="h-3.5 w-3.5 text-emerald-500" /> 离线可用</li>
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }} className="mt-7 space-y-3">
              <SmartDownload compact />
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <a href={SITE.docsUrl}>
                  <Button variant="outline" size="lg" className="h-11 bg-background/60 px-7 text-sm backdrop-blur">
                    查看文档 <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
                <a href="#download" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <Terminal className="h-4 w-4" /> Docker 单命令启动 →
                </a>
              </div>
              <p className="text-xs text-muted-foreground">支持 Windows / macOS / Linux，提供 Docker 镜像；服务端口被占用时自动更换。</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="hidden justify-end lg:flex"
          >
            <div className="relative w-full max-w-[860px] xl:max-w-[920px]">
              <div className="absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-br from-primary/20 to-info/20 blur-2xl" />
              <div className="overflow-hidden rounded-[18px] border bg-card shadow-2xl">
                <MacOsWindowBar className="h-11 border-b bg-muted/30 px-4" />
                <ConsoleMock />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-8 max-w-[640px] overflow-hidden rounded-[18px] border bg-card shadow-xl lg:hidden">
          <MacOsWindowBar className="h-10 border-b bg-muted/30 px-3" />
          <ConsoleMock compact />
        </div>
      </div>
    </section>
  );
}
