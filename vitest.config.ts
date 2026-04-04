import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      $images: path.resolve(__dirname, "./src/images"),
      $components: path.resolve(__dirname, "./src/components"),
      $functions: path.resolve(__dirname, "./src/functions"),
      $content: path.resolve(__dirname, "./src/content"),
    },
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "jsdom",
  },
});
