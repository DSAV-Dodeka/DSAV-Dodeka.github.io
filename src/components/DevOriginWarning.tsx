// Dev-only banner that nudges the developer from http://localhost:* to
// http://127.0.0.1:* when the backend is reachable but the frontend is on
// a hostname the backend doesn't trust for CORS.
//
// The probe uses `mode: "no-cors"` so a CORS-restricted server still produces
// a resolved (opaque) response, which confirms the server is alive without
// requiring it to allow our origin.

import { useEffect, useState } from "react";
import { BACKEND_URL } from "$functions/backend.ts";
import "./DevOriginWarning.css";

function buildSwitchUrl(targetHost: string): string {
  const url = new URL(window.location.href);
  url.hostname = targetHost;
  return url.toString();
}

export default function DevOriginWarning() {
  const [show, setShow] = useState(false);
  const [switchUrl, setSwitchUrl] = useState<string>("");

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let backendHost: string;
    try {
      backendHost = new URL(BACKEND_URL).hostname;
    } catch {
      return;
    }

    const frontendHost = window.location.hostname;
    if (frontendHost === backendHost) return;
    if (frontendHost !== "localhost" && frontendHost !== "[::1]") return;

    const probe = new AbortController();
    fetch(`${BACKEND_URL}/auth/session_info/`, {
      method: "GET",
      mode: "no-cors",
      credentials: "omit",
      signal: probe.signal,
    })
      .then(() => {
        setSwitchUrl(buildSwitchUrl(backendHost));
        setShow(true);
      })
      .catch(() => {
        // Backend unreachable — no point nagging.
      });

    return () => probe.abort();
  }, []);

  if (!show) return null;

  return (
    <div className="dev-origin-warning" role="alert">
      <span>
        The backend is running but only accepts requests from{" "}
        <code>127.0.0.1</code>. You're on <code>{window.location.hostname}</code>,
        so authenticated calls (cookies, CORS) will fail.
      </span>
      <a href={switchUrl}>Open on 127.0.0.1 →</a>
    </div>
  );
}
