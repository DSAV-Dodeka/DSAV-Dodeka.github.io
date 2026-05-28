import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import "./index.scss";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const cacheTime = 1000 * 60; // 1 minute

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: cacheTime,
      retry: 1,
      throwOnError: false,
      // Don't refetch on every window/tab focus. Freshness comes from explicit
      // refetchInterval (session) or invalidation (admin mutations); without
      // this, queries with staleTime: 0 refetch on every focus event.
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HydratedRouter />
    </QueryClientProvider>
  </React.StrictMode>,
);
