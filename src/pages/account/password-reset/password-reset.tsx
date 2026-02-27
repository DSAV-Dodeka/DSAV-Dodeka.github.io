import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  requestPasswordReset,
  PasswordResetFlow,
} from "$functions/flows/password-reset.ts";
import { useSessionInfo } from "$functions/query.ts";
import * as api from "$functions/backend.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./password-reset.css";

export default function PasswordReset() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { data: session, isLoading } = useSessionInfo();

  const resetFlow = useRef(new PasswordResetFlow());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Step 1: Email form
  const [email, setEmail] = useState("");

  // Step 2: Reset form
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    setStatus("");
    try {
      await api.clearSession();
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setStatus("✓ Logged out successfully");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await requestPasswordReset(email);
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      // Navigate to the same page with token in URL
      navigate(`/account/password-reset?token=${result.token}`);
      setStatus(
        "✓ Reset email sent! Check your inbox for the temporary password.",
      );
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReset = async () => {
    if (!token) {
      setStatus("✗ No reset token found");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await resetFlow.current.tryComplete(
        token,
        tempPassword,
        newPassword,
      );
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      setStatus("✓ Password reset successful! Redirecting to login...");

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/account/login");
      }, 2000);
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="password-reset-container">
        <PageTitle title="Reset Password" />
      </div>
    );
  }

  // If user is logged in, show message to logout first
  if (session) {
    return (
      <div className="password-reset-container">
        <PageTitle title="Reset Password" />

        <div className="password-reset-header">
          <h2>Already Logged In</h2>
          <p>
            You are currently logged in. Please logout first to reset your
            password.
          </p>
        </div>

        <div className="password-reset-section">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="password-reset-button password-reset-button-primary"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>

        {status && (
          <div
            className={`password-reset-status ${
              status.startsWith("✓")
                ? "password-reset-status-success"
                : "password-reset-status-error"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="password-reset-container">
      <PageTitle title="Reset Password" />

      {!token ? (
        // Step 1: Request reset
        <>
          <div className="password-reset-header">
            <h2>Reset Your Password</h2>
            <p>Enter your email address to receive a temporary password.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading && email) {
                handleRequestReset();
              }
            }}
          >
            <div className="password-reset-section">
              <div className="password-reset-form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="password-reset-section">
              <button
                type="submit"
                disabled={loading || !email}
                className="password-reset-button password-reset-button-primary"
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </div>
          </form>
        </>
      ) : (
        // Step 2: Complete reset
        <>
          <div className="password-reset-header">
            <h2>Complete Password Reset</h2>
            <p>
              Enter the temporary password from your email and choose a new
              password.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading && tempPassword && newPassword) {
                handleCompleteReset();
              }
            }}
          >
            <div className="password-reset-section">
              <div className="password-reset-form-group">
                <label>Temporary Password:</label>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="Enter temporary password from email"
                />
                <small className="password-reset-hint">
                  Check your email for the temporary password
                </small>
              </div>
              <div className="password-reset-form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="password-reset-section">
              <button
                type="submit"
                disabled={loading || !tempPassword || !newPassword}
                className="password-reset-button password-reset-button-primary"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </>
      )}

      {status && (
        <div
          className={`password-reset-status ${
            status.startsWith("✓")
              ? "password-reset-status-success"
              : "password-reset-status-error"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
