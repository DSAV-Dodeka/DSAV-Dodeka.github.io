import type { ReactNode } from "react";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import AppLayout from "../pages/layout";

export const Route = createRootRoute({
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  return <AppLayout />;
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
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
