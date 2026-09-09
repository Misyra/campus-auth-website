import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
// @ts-expect-error — mjs 插件由 Vite 运行时加载，无需 tsc 类型检查
import { markdownPlugin } from "./scripts/markdown-plugin.mjs";

export default defineConfig({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [react(), markdownPlugin()],
  resolve: {
    alias: {
      "@": import.meta.dirname + "/src",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom|scheduler)[\\/]/.test(id)) {
            return "vendor-react";
          }
          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) {
            return "vendor-framer-motion";
          }
          if (/[\\/]node_modules[\\/]@radix-ui[\\/]/.test(id)) {
            return "vendor-radix";
          }
          return undefined;
        },
      },
    },
  },
});
