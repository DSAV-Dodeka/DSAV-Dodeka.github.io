import { createRoute, createRootRouteWithContext, createRouter as createTanStackRouter, redirect } from "@tanstack/react-router";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import type { ReactNode } from "react";
import { z } from "zod";

import "./index.scss";
import AppLayout from "./pages/layout";
import Home from "./pages/home/home";
import Owee from "./pages/owee/owee";
import WordLid from "./pages/word-lid/word-lid";
import ContactHome from "./pages/contact/contact/contact";
import Sponsors from "./pages/contact/sponsors/sponsors";
import Vcp from "./pages/contact/vcp/vcp";
import Donateurs from "./pages/contact/donateurs/donateurs";
import Trainingen from "./pages/trainingen/trainingen";
import Trainers from "./pages/vereniging/trainers/trainers";
import Gezocht from "./pages/vereniging/gezocht/gezocht";
import VerenigingHome from "./pages/vereniging/vereniging/vereniging";
import Commissies from "./pages/vereniging/commissies/commissies";
import Bestuur from "./pages/vereniging/bestuur/bestuur";
import Eregalerij from "./pages/vereniging/eregalerij/eregalerij";
import Arnold from "./pages/vereniging/arnold/arnold";
import Gezelligheid from "./pages/vereniging/gezelligheid/gezelligheid";
import Old from "./pages/vereniging/old/old";
import Reglementen from "./pages/vereniging/reglementen/reglementen";
import FlowTest from "./pages/flow-test/flow-test";
import Admin from "./pages/admin/admin";
import Branding from "./pages/Branding/Branding";
import Komkommer from "./pages/komkommer/komkommer";
import Update from "./pages/update/update/update";
import LedenHome from "./pages/leden/leden/leden";
import Verjaardagen from "./pages/leden/verjaardagen/verjaardagen";
import Register from "./pages/account/register/register";
import Signup from "./pages/account/signup/signup";
import PasswordReset from "./pages/account/password-reset/password-reset";
import Login from "./pages/account/login/login";
import EmailUpdate from "./pages/account/email-update/email-update";
import DeleteAccount from "./pages/account/delete/delete";
import Profile from "./pages/account/profile/profile";
import WedstrijdenHome from "./pages/wedstrijden/wedstrijden/wedstrijden";
import Hoogtepunten from "./pages/wedstrijden/hoogtepunten/hoogtepunten";
import Records from "./pages/wedstrijden/records/records";
import WedstrijdLoader from "./pages/wedstrijden/eigen/wedstrijd-loader";
import NieuwsHome from "./pages/nieuws/nieuws/nieuws";
import Spike from "./pages/nieuws/spike/spike";
import NielsRedirect from "./pages/nieuws/niels-redirect";
import Catchall from "./catchall";
import {
  secondarySessionInfoOptions,
  sessionInfoOptions,
} from "./functions/query";

const cacheTime = 1000 * 60;

interface RouterContext {
  queryClient: QueryClient;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: cacheTime,
        retry: 1,
        throwOnError: false,
      },
    },
  });
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      {
        name: "description",
        content:
          "D.S.A.V. Dodeka is dé studenten atletiekvereniging van Delft. Bij Dodeka kan je alle atletiekonderdelen, op elk niveau trainen. Daarnaast doen we mee aan wedstrijden en hebben we vaak gezellige borrels en leuke activiteiten.",
      },
    ],
    links: [
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://use.typekit.net", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://p.typekit.net", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://use.typekit.net/bby6uhw.css" },
    ],
    title: "D.S.A.V. Dodeka - Delftse Studenten Atletiekvereniging",
  }),
  component: RootComponent,
  notFoundComponent: () => <Catchall />,
  shellComponent: RootDocument,
});

function RootComponent() {
  return <AppLayout />;
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

type AuthGuardLocation = {
  href: string;
};

function redirectToLogin(location: AuthGuardLocation): never {
  throw redirect({
    to: "/account/login",
    search: {
      redirect: location.href,
    },
  });
}

async function requireSession(
  context: RouterContext,
  location: AuthGuardLocation,
) {
  const session = await context.queryClient.fetchQuery(sessionInfoOptions);
  if (!session) {
    redirectToLogin(location);
  }
  return session;
}

async function requireAdmin(
  context: RouterContext,
  location: AuthGuardLocation,
) {
  const [session, secondarySession] = await Promise.all([
    context.queryClient.fetchQuery(sessionInfoOptions),
    context.queryClient.fetchQuery(secondarySessionInfoOptions),
  ]);
  if (
    !session?.user.permissions.includes("admin") &&
    !secondarySession?.user.permissions.includes("admin")
  ) {
    redirectToLogin(location);
  }
}

function sanitizeRedirect(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const spaShellRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "__spa-shell",
  component: () => null,
});

const oweeRoute = createRoute({ getParentRoute: () => rootRoute, path: "owee", component: Owee });
const wordLidRoute = createRoute({ getParentRoute: () => rootRoute, path: "word_lid", component: WordLid });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: "contact", component: ContactHome });
const contactSponsorsRoute = createRoute({ getParentRoute: () => rootRoute, path: "contact/sponsors", component: Sponsors });
const contactVcpRoute = createRoute({ getParentRoute: () => rootRoute, path: "contact/vcp", component: Vcp });
const contactDonateursRoute = createRoute({ getParentRoute: () => rootRoute, path: "contact/donateurs", component: Donateurs });
const trainingenRoute = createRoute({ getParentRoute: () => rootRoute, path: "trainingen", component: Trainingen });
const trainingenTrainersRoute = createRoute({ getParentRoute: () => rootRoute, path: "trainingen/trainers", component: Trainers });
const trainingenGezochtRoute = createRoute({ getParentRoute: () => rootRoute, path: "trainingen/gezocht", component: Gezocht });
const verenigingRoute = createRoute({ getParentRoute: () => rootRoute, path: "vereniging", component: VerenigingHome });
const verenigingCommissiesRoute = createRoute({ getParentRoute: () => rootRoute, path: "vereniging/commissies", component: Commissies });
const verenigingBestuurRoute = createRoute({ getParentRoute: () => rootRoute, path: "vereniging/bestuur", component: Bestuur });
const verenigingEregalerijRoute = createRoute({ getParentRoute: () => rootRoute, path: "vereniging/eregalerij", component: Eregalerij });
const verenigingArnoldRoute = createRoute({ getParentRoute: () => rootRoute, path: "vereniging/arnold", component: Arnold });
const verenigingGezelligheidRoute = createRoute({ getParentRoute: () => rootRoute, path: "vereniging/gezelligheid", component: Gezelligheid });
const verenigingOldRoute = createRoute({ getParentRoute: () => rootRoute, path: "vereniging/old", component: Old });
const verenigingReglementenRoute = createRoute({ getParentRoute: () => rootRoute, path: "vereniging/reglementen", component: Reglementen });
const flowTestRoute = createRoute({ getParentRoute: () => rootRoute, path: "flow-test", component: FlowTest });
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "admin",
  beforeLoad: ({ context, location }) => requireAdmin(context, location),
  component: Admin,
});
const brandingRoute = createRoute({ getParentRoute: () => rootRoute, path: "huisstijl", component: Branding });
const komkommerRoute = createRoute({ getParentRoute: () => rootRoute, path: "komkommer", component: Komkommer });
const updateRoute = createRoute({ getParentRoute: () => rootRoute, path: "update", component: Update });
const ledenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "leden",
  beforeLoad: ({ context, location }) => requireSession(context, location),
  component: LedenHome,
});
const ledenVerjaardagenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "leden/verjaardagen",
  beforeLoad: ({ context, location }) => requireSession(context, location),
  component: Verjaardagen,
});
const accountRegisterRoute = createRoute({ getParentRoute: () => rootRoute, path: "account/register", component: Register });
const accountSignupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "account/signup",
  validateSearch: z.object({
    registration_id: z.string().optional(),
    code: z.string().optional(),
  }),
  component: Signup,
});
const accountPasswordResetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "account/password-reset",
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  component: PasswordReset,
});
const accountLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "account/login",
  validateSearch: z.object({
    redirect: z.string().optional().transform(sanitizeRedirect),
  }),
  beforeLoad: async ({ context, search }) => {
    const session = await context.queryClient.fetchQuery(sessionInfoOptions);
    if (session) {
      throw redirect({ to: search.redirect });
    }
  },
  component: Login,
});
const accountEmailUpdateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "account/email-update",
  beforeLoad: ({ context, location }) => requireSession(context, location),
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  component: EmailUpdate,
});
const accountDeleteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "account/delete",
  beforeLoad: ({ context, location }) => requireSession(context, location),
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  component: DeleteAccount,
});
const accountProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "account/profile",
  beforeLoad: ({ context, location }) => requireSession(context, location),
  component: Profile,
});
const wedstrijdenRoute = createRoute({ getParentRoute: () => rootRoute, path: "wedstrijden", component: WedstrijdenHome });
const wedstrijdenHoogtepuntenRoute = createRoute({ getParentRoute: () => rootRoute, path: "wedstrijden/hoogtepunten", component: Hoogtepunten });
const wedstrijdenRecordsRoute = createRoute({ getParentRoute: () => rootRoute, path: "wedstrijden/records", component: Records });
const wedstrijdenEigenRoute = createRoute({ getParentRoute: () => rootRoute, path: "wedstrijden/$wedstrijdPath", component: WedstrijdLoader });
const nieuwsRoute = createRoute({ getParentRoute: () => rootRoute, path: "nieuws", component: NieuwsHome });
const nieuwsSpikeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "nieuws/spike",
  beforeLoad: ({ context, location }) => requireSession(context, location),
  component: Spike,
});
const nielsRoute = createRoute({ getParentRoute: () => rootRoute, path: "Niels", component: NielsRedirect });

const routeTree = rootRoute.addChildren([
  indexRoute,
  spaShellRoute,
  oweeRoute,
  wordLidRoute,
  contactRoute,
  contactSponsorsRoute,
  contactVcpRoute,
  contactDonateursRoute,
  trainingenRoute,
  trainingenTrainersRoute,
  trainingenGezochtRoute,
  verenigingRoute,
  verenigingCommissiesRoute,
  verenigingBestuurRoute,
  verenigingEregalerijRoute,
  verenigingArnoldRoute,
  verenigingGezelligheidRoute,
  verenigingOldRoute,
  verenigingReglementenRoute,
  flowTestRoute,
  adminRoute,
  brandingRoute,
  komkommerRoute,
  updateRoute,
  ledenRoute,
  ledenVerjaardagenRoute,
  accountRegisterRoute,
  accountSignupRoute,
  accountPasswordResetRoute,
  accountLoginRoute,
  accountEmailUpdateRoute,
  accountDeleteRoute,
  accountProfileRoute,
  wedstrijdenRoute,
  wedstrijdenHoogtepuntenRoute,
  wedstrijdenRecordsRoute,
  wedstrijdenEigenRoute,
  nieuwsRoute,
  nieuwsSpikeRoute,
  nielsRoute,
]);

export function createAppRouter() {
  const queryClient = createQueryClient();
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}

export function getRouter() {
  return createAppRouter();
}
