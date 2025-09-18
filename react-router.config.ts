import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: false,
  async prerender() {
    return ["/", "/word_lid", "/contact"];
  },
} satisfies Config;
