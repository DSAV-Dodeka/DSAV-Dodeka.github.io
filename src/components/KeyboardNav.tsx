// The single global keyboard handler for the whole app.
//
// Global shortcuts (available everywhere):
//   ?               → toggle the keyboard shortcut help overlay
//   \a or \admin    → navigate to /admin
//   \s or \session  → refresh admin secondary session (DEV only)
//   \du             → toggle debug user with member permissions (DEV only)
//
// Backslash (\) is a leader key: press it, then type a command within 500ms.
// Bare keys other than "?" are dispatched to contextual scopes that pages
// register via useKeyboardScope (e.g. the admin dashboard's table navigation),
// so there is exactly one keydown listener in the app.
//
// Ignored when focus is in an input, textarea, select, or contenteditable.
// A wrapper component skips rendering during prerendering (static pages are
// prerendered without a QueryClientProvider).

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  dispatchToScopes,
  getScopes,
  subscribeScopes,
} from "./keyboardRegistry.ts";
import "./KeyboardNav.css";

const LEADER_KEY = "\\";
const LEADER_TIMEOUT_MS = 500;
const TOAST_DURATION_MS = 4000;

// Leader commands available in all environments
const COMMANDS: Record<string, string> = {
  a: "admin",
  admin: "admin",
};

// Leader commands only available in development
const DEV_COMMANDS: Record<string, string> = {
  s: "session",
  session: "session",
  du: "debug-user",
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

interface Toast {
  message: string;
  type: "info" | "success" | "error";
}

// Wrapper: skip during prerender since there is no QueryClientProvider
export default function KeyboardNav() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <KeyboardNavClient />;
}

function KeyboardNavClient() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const leaderActive = useRef(false);
  const buffer = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busyRef = useRef(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const showHelpRef = useRef(showHelp);
  showHelpRef.current = showHelp;

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const resetLeader = useCallback(() => {
    leaderActive.current = false;
    buffer.current = "";
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const executeCommand = useCallback(
    async (command: string) => {
      resetLeader();

      if (command === "admin") {
        navigate("/admin");
        return;
      }

      if (command === "debug-user") {
        const { toggleDebugUser } = await import("$functions/debug-user.ts");
        const active = toggleDebugUser();
        await queryClient.invalidateQueries({ queryKey: ["session"] });
        setToast({
          message: active ? "Debug user ON (member)" : "Debug user OFF",
          type: active ? "success" : "info",
        });
        return;
      }

      if (command === "session") {
        if (busyRef.current) return;
        busyRef.current = true;
        setToast({ message: "Refreshing admin session...", type: "info" });
        try {
          // Dynamic import so admin-session code is not bundled in production
          const { loginAdminSession } = await import(
            "$functions/flows/admin-session.ts"
          );
          const result = await loginAdminSession();
          if (result.ok) {
            await queryClient.invalidateQueries({
              queryKey: ["session-secondary"],
            });
            setToast({ message: "Admin session refreshed", type: "success" });
          } else {
            setToast({
              message: `Session failed: ${result.error}`,
              type: "error",
            });
          }
        } catch (error) {
          setToast({
            message: `Session error: ${error instanceof Error ? error.message : String(error)}`,
            type: "error",
          });
        } finally {
          busyRef.current = false;
        }
      }
    },
    [navigate, queryClient, resetLeader],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      // While the help overlay is open, only "?" / Escape are meaningful.
      if (showHelpRef.current) {
        if (e.key === "?" || e.key === "Escape") {
          e.preventDefault();
          setShowHelp(false);
          resetLeader();
        }
        return;
      }

      // Leader sequence: accumulate a command after backslash
      if (leaderActive.current) {
        // Ignore modifier-only / non-character keys (Shift, Arrow*, …)
        if (e.key.length !== 1) return;

        buffer.current += e.key.toLowerCase();
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(resetLeader, LEADER_TIMEOUT_MS);

        const key = buffer.current;
        const command =
          COMMANDS[key] ?? (import.meta.env.DEV ? DEV_COMMANDS[key] : undefined);
        if (command) executeCommand(command);
        return;
      }

      // Activate leader on backslash
      if (e.key === LEADER_KEY) {
        leaderActive.current = true;
        buffer.current = "";
        timerRef.current = setTimeout(resetLeader, LEADER_TIMEOUT_MS);
        return;
      }

      // Bare "?" toggles the unified help overlay
      if (e.key === "?") {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Anything else: let contextual page scopes handle it (e.g. admin nav)
      dispatchToScopes(e);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [executeCommand, resetLeader]);

  return (
    <>
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
      {toast && <FeedbackToast toast={toast} />}
    </>
  );
}

function FeedbackToast({ toast }: { toast: Toast }) {
  return (
    <div className={`keyboard-nav-toast keyboard-nav-toast-${toast.type}`}>
      {toast.message.split("\n").map((line, i) => (
        <div key={i} className="keyboard-nav-toast-line">
          {line}
        </div>
      ))}
    </div>
  );
}

function HelpOverlay({ onClose }: { onClose: () => void }) {
  // Subscribe to the scope registry so contextual sections appear/disappear
  const scopes = useSyncExternalStore(subscribeScopes, getScopes, getScopes);

  return (
    <div className="keyboard-help-overlay" onClick={onClose}>
      <div className="keyboard-help-panel" onClick={(e) => e.stopPropagation()}>
        <h3>Keyboard Shortcuts</h3>

        {scopes.map((scope) => (
          <div key={scope.id}>
            <h4>{scope.title}</h4>
            <table className="keyboard-help-table">
              <tbody>
                {scope.entries.map((entry) => (
                  <tr key={entry.keys}>
                    <td className="keyboard-help-key">{entry.keys}</td>
                    <td>{entry.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <h4>Global</h4>
        <table className="keyboard-help-table">
          <tbody>
            <tr>
              <td className="keyboard-help-key">?</td>
              <td>Toggle this help</td>
            </tr>
            <tr>
              <td className="keyboard-help-key">\a</td>
              <td>Go to admin page</td>
            </tr>
            {import.meta.env.DEV && (
              <>
                <tr>
                  <td className="keyboard-help-key">\s</td>
                  <td>Refresh admin session</td>
                </tr>
                <tr>
                  <td className="keyboard-help-key">\du</td>
                  <td>Toggle debug user</td>
                </tr>
              </>
            )}
          </tbody>
        </table>

        <button className="keyboard-help-close" onClick={onClose}>
          Close
        </button>
        <div className="keyboard-help-hint">Press ? or Escape to dismiss</div>
      </div>
    </div>
  );
}
