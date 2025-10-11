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
