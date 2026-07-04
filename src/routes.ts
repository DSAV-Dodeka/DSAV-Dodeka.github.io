import {
  type RouteConfig,
  layout,
  route,
  prefix,
  index,
} from "@react-router/dev/routes";

export default [
  layout("./pages/layout.tsx", [
    index("./pages/home/home.tsx"),
    route("owee", "./pages/owee/owee.tsx"),
    route("word_lid", "./pages/word-lid/word-lid.tsx"),
    ...prefix("contact", [
      index("./pages/contact/contact/contact.tsx"),
      route("sponsors", "./pages/contact/sponsors/sponsors.tsx"),
      route("vcp", "./pages/contact/vcp/vcp.tsx"),
      route("donateurs", "./pages/contact/donateurs/donateurs.tsx"),
    ]),
    ...prefix("trainingen", [
      index("./pages/trainingen/trainingen.tsx"),
      route("trainers", "./pages/vereniging/trainers/trainers.tsx"),
      route("gezocht", "./pages/vereniging/gezocht/gezocht.tsx"),
      route("sprint_tijden", "./pages/sprint-tijden/sprint-tijden.tsx"),
    ]),
    ...prefix("vereniging", [
      index("./pages/vereniging/vereniging/vereniging.tsx"),
      route("commissies", "./pages/vereniging/commissies/commissies.tsx"),
      route("bestuur", "./pages/vereniging/bestuur/bestuur.tsx"),
      route("eregalerij", "./pages/vereniging/eregalerij/eregalerij.tsx"),
      route("arnold", "./pages/vereniging/arnold/arnold.tsx"),
      route("gezelligheid", "./pages/vereniging/gezelligheid/gezelligheid.tsx"),
      route("old", "./pages/vereniging/old/old.tsx"),
      route("reglementen", "./pages/vereniging/reglementen/reglementen.tsx"),
    ]),
    // The flow-test page should only be included in development mode
    ...(import.meta.env.DEV
      ? [route("flow-test", "./pages/flow-test/flow-test.tsx")]
      : []),
    route("admin", "./pages/admin/admin.tsx"),
    route("huisstijl", "./pages/Branding/Branding.tsx"),
    route("komkommer", "./pages/komkommer/komkommer.tsx"),
    route("turfjes", "./pages/turfjes/turfjes.tsx"),
    route("reactietest", "./pages/reactietest/reactietest.tsx"),
    route("sprint", "./pages/sprint-tijden/sprint-alias.tsx"),
    route("sprint_tijden", "./pages/sprint-tijden/sprint-tijden-alias.tsx"),
    route("trainings_schema", "./pages/sprint-tijden/trainings-schema-alias.tsx"),
    route("training_schema", "./pages/sprint-tijden/training-schema-alias.tsx"),
    route("update", "./pages/update/update/update.tsx"),
    ...prefix("leden", [
      index("./pages/leden/leden/leden.tsx"),
      route(
        "verjaardagen",
        "./pages/leden/verjaardagen/verjaardagen.tsx",
      ),
      route("hordes", "./pages/leden/hordes/Hordes.tsx"),
      route("fotos", "./pages/leden/fotos/fotos.tsx"),
    ]),
    ...prefix("account", [
      route("register", "./pages/account/register/register.tsx"),
      route("signup", "./pages/account/signup/signup.tsx"),
      route(
        "password-reset",
        "./pages/account/password-reset/password-reset.tsx",
      ),
      route("login", "./pages/account/login/login.tsx"),
      route("email-update", "./pages/account/email-update/email-update.tsx"),
      route("delete", "./pages/account/delete/delete.tsx"),
      route("profile", "./pages/account/profile/profile.tsx"),
    ]),
    ...prefix("wedstrijden", [
      index("./pages/wedstrijden/wedstrijden/wedstrijden.tsx"),
      route(
        "hoogtepunten",
        "./pages/wedstrijden/hoogtepunten/hoogtepunten.tsx",
      ),
      route("records", "./pages/wedstrijden/records/records.tsx"),
      route(":wedstrijdPath", "./pages/wedstrijden/eigen/wedstrijd-loader.tsx"),
    ]),
    ...prefix("nieuws", [
      index("./pages/nieuws/nieuws/nieuws.tsx"),
      route("spike", "./pages/nieuws/spike/spike.tsx"),
    ]),
    route("Niels", "./pages/nieuws/niels-redirect.tsx"),
  ]),
  // * matches all URLs, the? makes it optional so it will match / as well
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
