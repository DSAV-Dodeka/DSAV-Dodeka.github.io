// Keyboard navigation using a backslash (\) leader key.
// After pressing backslash, type a command within 500ms:
//   \a or \admin    → navigate to /admin
//   \s or \session  → load admin credentials and login as secondary session (DEV only)
// Ignored when focus is in an input, textarea, or contenteditable element.
//
// Uses a wrapper component to skip rendering during prerendering (static pages
// listed in react-router.config.ts are prerendered without QueryClientProvider).

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const LEADER_KEY = "\\";
const LEADER_TIMEOUT_MS = 500;
const TOAST_DURATION_MS = 3000;

// Commands available in all environments
const COMMANDS: Record<string, string> = {
  a: "admin",
  admin: "admin",
};

// Commands only available in development
const DEV_COMMANDS: Record<string, string> = {
  s: "session",
  session: "session",
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

const TOAST_COLORS = {
  info: { bg: "#d1ecf1", fg: "#0c5460", border: "#bee5eb" },
  success: { bg: "#d4edda", fg: "#155724", border: "#c3e6cb" },
  error: { bg: "#f8d7da", fg: "#721c24", border: "#f5c6cb" },
} as const;

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

      // Activate leader on backslash
      if (e.key === LEADER_KEY && !leaderActive.current) {
        leaderActive.current = true;
        buffer.current = "";
        timerRef.current = setTimeout(resetLeader, LEADER_TIMEOUT_MS);
        return;
      }

      if (!leaderActive.current) return;

      // Accumulate buffer and reset timeout on each keystroke
      buffer.current += e.key.toLowerCase();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(resetLeader, LEADER_TIMEOUT_MS);

      // Check if buffer matches a known command
      const key = buffer.current;
      const command =
        COMMANDS[key] ?? (import.meta.env.DEV ? DEV_COMMANDS[key] : undefined);
      if (command) {
        executeCommand(command);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [executeCommand, resetLeader]);

  if (!toast) return null;

  const colors = TOAST_COLORS[toast.type];
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: "10px 16px",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        zIndex: 10000,
        backgroundColor: colors.bg,
        color: colors.fg,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {toast.message}
    </div>
  );
}
