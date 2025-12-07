import type { Config } from "@react-router/dev/config";
import { getWedstrijdPaths } from "./src/functions/wedstrijden";

export default {
  appDirectory: "src",
  ssr: false,
  async prerender() {
    const wedstrijdPaths = getWedstrijdPaths().map((path) => `/wedstrijden${path}`);

    return [
      "/",
      "/owee",
      "/word_lid",
      "/registreer",
      "/registreer/registered",
      "/contact",
      "/contact/sponsors",
      "/contact/vcp",
      "/trainingen",
      "/trainingen/trainers",
      "/trainingen/gezocht",
      "/vereniging",
      "/vereniging/commissies",
      "/vereniging/bestuur",
      "/vereniging/eregalerij",
      "/vereniging/arnold",
      "/vereniging/gezelligheid",
      "/vereniging/old",
      "/vereniging/reglementen",
      "/wedstrijden",
      "/wedstrijden/hoogtepunten",
      "/wedstrijden/records",
      ...wedstrijdPaths,
      "/nieuws",
      "/nieuws/spike",
    ];
  },
} satisfies Config;
