import {
  type RouteConfig,
  layout,
  route,
  prefix,
  index,
} from "@react-router/dev/routes";

export default [
  layout("./pages/layout.tsx", [
    ...prefix("registreer", [
      index("./pages/registreer/registreer.tsx"),
      route("registered", "./pages/registreer/registered.tsx"),
    ]),
    ...prefix("contact", [
      index("./pages/contact/contact/contact.tsx"),
      route("sponsors", "./pages/contact/sponsors/sponsors.tsx"),
      route("vcp", "./pages/contact/vcp/vcp.tsx"),
    ]),
    // The flow-test page should only be included in development mode
    ...(import.meta.env.DEV
      ? [route("flow-test", "./pages/flow-test/flow-test.tsx")]
      : []),
    route("admin", "./pages/admin/admin.tsx"),
    // route("register", "./pages/register.tsx"),
    ...prefix("account", [
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
  // * matches all URLs, the ? makes it optional so it will match / as well
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
