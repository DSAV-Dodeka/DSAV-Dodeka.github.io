import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import svgrPlugin from "vite-plugin-svgr";

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
});
