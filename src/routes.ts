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
    // route("register", "./pages/register.tsx"),
    ...prefix("account", [
      route("register", "./pages/account/register/register.tsx"),
      route("registered", "./pages/account/registered/registered.tsx"),
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
  ]),
  // * matches all URLs, the? makes it optional so it will match / as well
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
