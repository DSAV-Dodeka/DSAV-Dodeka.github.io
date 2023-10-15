import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { visualizer } from "rollup-plugin-visualizer";
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      svgrPlugin({
        svgrOptions: {
          icon: true,
        },
      }),
      splitVendorChunkPlugin(),
      visualizer()
  ],
  server: {
    port: 3000
  }

})

