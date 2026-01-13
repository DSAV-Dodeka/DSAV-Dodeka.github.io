import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import svgrPlugin from "vite-plugin-svgr";
import path from "node:path";
import { browserslistToTargets } from "lightningcss";
import browserslist from "browserslist";

export default defineConfig({
  plugins: [
    reactRouter(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      $images: path.resolve(__dirname, "./src/images"),
      $components: path.resolve(__dirname, "./src/components"),
      $functions: path.resolve(__dirname, "./src/functions"),
      $content: path.resolve(__dirname, "./src/content"),
    },
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: browserslistToTargets(browserslist("baseline widely available")),
      cssModules: true,
      drafts: {
        customMedia: true,
      },
    },
  },
  build: {
    cssMinify: "lightningcss",
    target: "baseline-widely-available",
  },
});
