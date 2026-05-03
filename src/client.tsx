import { StrictMode, startTransition } from "react";
import ReactDOM from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

startTransition(() => {
  ReactDOM.hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
