import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  layout("./pages/layout.tsx", [
    route("/registreer", "./pages/registreer.tsx"),
  ]),
  // * matches all URLs, the ? makes it optional so it will match / as well
  route("*?", "catchall.tsx"),
] satisfies RouteConfig;
