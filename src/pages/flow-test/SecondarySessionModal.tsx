import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSecondarySessionInfo } from "$functions/query.ts";
import { loginSecondary } from "$functions/flows/login.ts";
import { clearSession, getAdminCredentials } from "$functions/backend.ts";
import "./SecondarySessionModal.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SecondarySessionModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const { data: secondarySession, isLoading } = useSecondarySessionInfo();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Sync dialog open state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Handle dialog close (ESC key or backdrop click)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const result = await loginSecondary(email, password);
      if (!result.ok) {
        setStatus(`Login failed: ${result.error}`);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["session-secondary"],
        });
        setStatus("Logged in");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setStatus("");
    try {
      await clearSession(true);
      await queryClient.invalidateQueries({ queryKey: ["session-secondary"] });
      setStatus("Logged out");
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAdminCredentials = async () => {
    setLoading(true);
    setStatus("");
    try {
      const creds = await getAdminCredentials();
      setEmail(creds.email);
      setPassword(creds.password);
      setStatus("Admin credentials loaded");
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="secondary-session-modal"
      onClick={handleBackdropClick}
    >
      <div className="secondary-session-content">
        <header className="secondary-session-header">
          <h2>Secondary Session (Admin)</h2>
          <button
            type="button"
            className="secondary-session-close"
            onClick={onClose}
          >
            &times;
          </button>
        </header>

        <div className="secondary-session-body">
          <p className="secondary-session-description">
            Log in with admin credentials to authorize admin actions during
            testing. This does not affect your primary session.
          </p>

          <div className="secondary-session-status-box">
            <strong>Status:</strong>{" "}
            {isLoading ? (
              "Loading..."
            ) : secondarySession ? (
              <span className="status-logged-in">
                Logged in as {secondarySession.user.email}
                {secondarySession.user.permissions.includes("admin") && (
                  <span className="admin-badge">admin</span>
                )}
              </span>
            ) : (
              <span className="status-logged-out">Not logged in</span>
            )}
          </div>

          {secondarySession ? (
            <div className="secondary-session-actions">
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? "..." : "Logout Secondary Session"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="secondary-session-form">
              <div className="form-field">
                <label htmlFor="sec-email">Email</label>
                <input
                  id="sec-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-field">
                <label htmlFor="sec-password">Password</label>
                <input
                  id="sec-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="secondary-session-actions">
                <button type="submit" className="btn-login" disabled={loading}>
                  {loading ? "..." : "Login"}
                </button>
                <button
                  type="button"
                  className="btn-load-admin"
                  onClick={handleLoadAdminCredentials}
                  disabled={loading}
                >
                  Load Admin Credentials
                </button>
              </div>
            </form>
          )}

          {status && (
            <div
              className={`secondary-session-message ${status.includes("Error") || status.includes("failed") ? "error" : "success"}`}
            >
              {status}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
