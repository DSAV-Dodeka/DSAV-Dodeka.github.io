import type { Config } from "@react-router/dev/config";
import { getWedstrijdPaths } from "./src/functions/wedstrijden";

export default {
  appDirectory: "src",
  ssr: false,
  async prerender() {
    const wedstrijdPaths = getWedstrijdPaths().map(
      (path) => `/wedstrijden${path}`,
    );

    return [
      "/",
      "/owee",
      "/word_lid",
      "/contact",
      "/contact/sponsors",
      "/contact/vcp",
      "/contact/donateurs",
      "/trainingen",
      "/trainingen/trainers",
      "/trainingen/gezocht",
      "/trainingen/sprint_tijden",
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
      "/update",
      "/sprint_tijden",
      "/sprint",
      "/trainings_schema",
      "/training_schema",
    ];
  },
} satisfies Config;
