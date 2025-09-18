import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import svgrPlugin from "vite-plugin-svgr";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRouter(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  base: "/dodekademo/",
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      $images: path.resolve(__dirname, "./src/images"),
    },
  },
});
