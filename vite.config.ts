import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import path from "node:path";
import { browserslistToTargets } from "lightningcss";
import browserslist from "browserslist";
import { getWedstrijdPaths } from "./src/functions/wedstrijden";

const wedstrijdPages = getWedstrijdPaths().map((wedstrijdPath) => ({
  path: `/wedstrijden${wedstrijdPath}`,
}));

export default defineConfig({
  plugins: [
    tanstackStart({
      spa: {
        enabled: true,
        maskPath: "/__spa-shell",
        prerender: {
          crawlLinks: false,
        },
      },
      prerender: {
        failOnError: true,
        crawlLinks: false,
      },
      pages: [
        { path: "/" },
        { path: "/owee" },
        { path: "/word_lid" },
        { path: "/contact" },
        { path: "/contact/sponsors" },
        { path: "/contact/vcp" },
        { path: "/contact/donateurs" },
        { path: "/trainingen" },
        { path: "/trainingen/trainers" },
        { path: "/trainingen/gezocht" },
        { path: "/vereniging" },
        { path: "/vereniging/commissies" },
        { path: "/vereniging/bestuur" },
        { path: "/vereniging/eregalerij" },
        { path: "/vereniging/arnold" },
        { path: "/vereniging/gezelligheid" },
        { path: "/vereniging/old" },
        { path: "/vereniging/reglementen" },
        { path: "/admin" },
        { path: "/huisstijl" },
        { path: "/komkommer" },
        { path: "/update" },
        { path: "/leden" },
        { path: "/leden/verjaardagen" },
        { path: "/account/register" },
        { path: "/account/signup" },
        { path: "/account/password-reset" },
        { path: "/account/login" },
        { path: "/account/email-update" },
        { path: "/account/delete" },
        { path: "/account/profile" },
        { path: "/wedstrijden" },
        { path: "/wedstrijden/hoogtepunten" },
        { path: "/wedstrijden/records" },
        ...wedstrijdPages,
        { path: "/nieuws" },
        { path: "/nieuws/spike" },
        { path: "/Niels" },
      ],
    }),
    viteReact(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
  preview: {
    host: "127.0.0.1",
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
