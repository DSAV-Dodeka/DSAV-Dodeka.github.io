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
    route("flow-test", "./pages/flow-test/flow-test.tsx"),
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
  ]),
  // * matches all URLs, the ? makes it optional so it will match / as well
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
