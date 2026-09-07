import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

export function CTASection() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient">
        <div className="container max-w-[1080px] py-12 md:py-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[22px] font-bold tracking-tight text-white md:text-[26px]">让校园网不再打断你</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">解压即用，断线自连，多校区自动切——把登录这件小事交给本地后台。</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href="#download">
                <Button variant="secondary" className="h-11 w-full bg-white px-6 text-primary hover:bg-white/90 sm:w-auto">立即下载</Button>
              </a>
              <a href={SITE.repo} target="_blank" rel="noreferrer">
                <Button variant="outline" className="h-11 w-full border-white/35 bg-transparent px-6 text-white hover:bg-white/10 sm:w-auto">
                  <Github className="h-4 w-4" /> GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
