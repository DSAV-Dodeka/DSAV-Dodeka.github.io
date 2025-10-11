import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: false,
  async prerender() {
    return [
      "/",
      "/word_lid",
      "/registreer",
      "/vereniging",
      "/vereniging/gezelligheid",
      "/vereniging/arnold",
      "/contact",
      "/contact/sponsors",
      "/trainingen",
      "/trainingen/gezocht",
      // "/wedstrijden",
      // "/wedstrijden/hoogtepunten",
      // "/wedstrijden/nskmeerkamp",
      "/owee",
    ];
  },
} satisfies Config;
