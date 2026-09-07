import { DownloadSection } from "@/components/campus-auth/DownloadSection";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function DownloadPage() {
  usePageMeta({
    title: "下载 Campus-Auth — Windows / macOS / Linux 安装包",
    description:
      "下载 Campus-Auth 各平台安装包：Windows x64 / arm64、macOS Apple Silicon / Intel、Linux x64，Rust 单二进制解压即用。",
    path: "/download",
  });
  return (
    <div className="pt-16 md:pt-[72px]">
      <DownloadSection />
    </div>
  );
}
