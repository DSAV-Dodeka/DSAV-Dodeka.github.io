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
    route("auth-test", "./pages/test-register-tabs.tsx"),
    route("admin", "./pages/admin.tsx"),
    route("register", "./pages/register.tsx"),
    route("login", "./pages/login.tsx"),
    route("password-reset", "./pages/password-reset.tsx"),
    route("profile", "./pages/profile.tsx"),
  ]),
  // * matches all URLs, the ? makes it optional so it will match / as well
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
