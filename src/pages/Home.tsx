import { HeroSection } from "@/components/campus-auth/HeroSection";
import { FeaturesSection } from "@/components/campus-auth/FeaturesSection";
import { DemoSection } from "@/components/campus-auth/DemoSection";
import { FAQSection } from "@/components/campus-auth/FAQSection";
import { DownloadSection } from "@/components/campus-auth/DownloadSection";
import { CTASection } from "@/components/campus-auth/CTASection";
import { usePageMeta } from "@/hooks/usePageMeta";
import { SITE } from "@/data/site";

export default function Home() {
  usePageMeta({ title: SITE.title, description: SITE.description, path: "/" });
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <FAQSection />
      <DownloadSection />
      <CTASection />
    </main>
  );
}
