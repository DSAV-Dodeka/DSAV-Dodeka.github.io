import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <meta charSet="UTF-8"></meta>
        <link rel="manifest" href="manifest.json" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="stylesheet" href="https://use.typekit.net/bby6uhw.css" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <title>D.S.A.V. Dodeka - Delftse Studenten Atletiekvereniging</title>
        <meta
          name="description"
          content="D.S.A.V. Dodeka is dé studenten atletiekvereniging van Delft. Bij Dodeka kan je alle atletiekonderdelen, op elk niveau trainen. Daarnaast doen we mee aan wedstrijden en hebben we vaak gezellige borrels en leuke activiteiten."
        ></meta>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
