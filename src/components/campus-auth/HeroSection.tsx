import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MacOsWindowBar } from "./MacOsWindowBar";
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

      <div className="container relative z-10 max-w-[1280px] py-10 md:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1.15fr] lg:gap-6">
          <div className="mx-auto max-w-[560px] text-center lg:mx-0 lg:text-left">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-sm font-medium dark:bg-primary/15">
                <span aria-hidden>🎉</span> {tag} 已发布
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
                <img src="/logo.png" alt="Campus-Auth" width={56} height={56} className="h-12 w-12 rounded-xl bg-white p-1.5 shadow-md md:h-14 md:w-14" />
                <h1 className="text-[30px] font-extrabold tracking-tight md:text-[44px]">Campus-Auth</h1>
              </div>

              <p className="mx-auto mt-4 max-w-[520px] text-[17px] font-medium leading-relaxed text-muted-foreground md:text-[22px] lg:mx-0">校园网自动认证 · 断网自愈</p>
              <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed text-muted-foreground md:text-[15px] lg:mx-0">
                单二进制解压即用：真浏览器自动化 + 验证码 OCR + 多 Profile + 定时打卡 + 现代化本地控制台。
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }} className="mt-7 space-y-3">
              <SmartDownload compact />
              <div className="flex justify-center lg:justify-start">
                <a href={SITE.docsUrl}>
                  <Button variant="outline" size="lg" className="h-11 bg-background/60 px-7 text-sm backdrop-blur">
                    查看文档 <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="hidden justify-end lg:flex"
          >
            <div className="relative w-full max-w-[640px]">
              <div className="absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-br from-primary/20 to-info/20 blur-2xl" />
              <div className="overflow-hidden rounded-[18px] border bg-card shadow-2xl">
                <MacOsWindowBar className="h-11 border-b bg-muted/30 px-4" />
                <img src="/screenshots/dashboard.webp" alt="Campus-Auth 控制台仪表盘" width={1280} height={800} className="w-full object-contain" loading="eager" decoding="async" fetchPriority="high" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-8 max-w-[640px] overflow-hidden rounded-[18px] border bg-card shadow-xl lg:hidden">
          <MacOsWindowBar className="h-10 border-b bg-muted/30 px-3" />
          <img src="/screenshots/dashboard.webp" alt="Campus-Auth 控制台仪表盘" width={1280} height={800} className="w-full object-contain" loading="eager" decoding="async" />
        </div>
      </div>
    </section>
  );
}
