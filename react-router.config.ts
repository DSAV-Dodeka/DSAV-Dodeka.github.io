import type { Config } from "@react-router/dev/config";
import { getWedstrijdPaths } from "./src/functions/wedstrijden";

export default {
  appDirectory: "src",
  ssr: false,
  async prerender() {
    const wedstrijdPaths = getWedstrijdPaths().map((path) => `/wedstrijden${path}`);

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
      "/wedstrijden",
      "/wedstrijden/hoogtepunten",
      ...wedstrijdPaths,
      "/nieuws",
      "/nieuws/spike",
      "/owee",
    ];
  },
} satisfies Config;
