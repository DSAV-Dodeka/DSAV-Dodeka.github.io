import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  requestEmailUpdate,
  EmailUpdateFlow,
} from "$functions/flows/email-update.ts";
import { useSessionInfo } from "$functions/query.ts";
import * as api from "$functions/backend.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./email-update.css";

export default function EmailUpdate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { data: session, isLoading } = useSessionInfo();
  const updateFlow = useRef(new EmailUpdateFlow());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Step 1: New email form
  const [newEmail, setNewEmail] = useState("");

  // Step 2: Verification form
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");

  const handleRequestUpdate = async () => {
    setLoading(true);
    setStatus("");
    try {
      // Get session token
      const sessionToken = await api.getSessionToken();

      const result = await requestEmailUpdate(sessionToken, newEmail);
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      // Navigate to the same page with token in URL
      navigate(`/account/email-update?token=${result.token}`);
      setStatus("✓ Verification code sent! Check your new email address.");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteUpdate = async () => {
    if (!token) {
      setStatus("✗ No update token found");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      // Get session token
      const sessionToken = await api.getSessionToken();

      const result = await updateFlow.current.tryComplete(
        sessionToken,
        token,
        verificationCode,
        password,
      );
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setStatus("✓ Email address updated successfully! Redirecting...");

      // Redirect to profile after a short delay
      setTimeout(() => {
        navigate("/account/profile");
      }, 1000);
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="email-update-container">
        <PageTitle title="Update Email" />
      </div>
    );
  }

  // If user is not logged in, show message
  if (!session) {
    return (
      <div className="email-update-container">
        <PageTitle title="Update Email" />

        <div className="email-update-header">
          <h2>Login Required</h2>
          <p>You must be logged in to update your email address.</p>
        </div>

        <div className="email-update-section">
          <button
            onClick={() => navigate("/account/login")}
            className="email-update-button email-update-button-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="email-update-container">
      <PageTitle title="Update Email" />

      {!token ? (
        // Step 1: Enter new email
        <>
          <div className="email-update-header">
            <h2>Update Your Email Address</h2>
            <p>
              Current email: <strong>{session.user.email}</strong>
            </p>
            <p>
              Enter your new email address. A verification code will be sent to
              the new address.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading && newEmail) {
                handleRequestUpdate();
              }
            }}
          >
            <div className="email-update-section">
              <div className="email-update-form-group">
                <label>New Email Address:</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="your.new.email@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="email-update-section">
              <button
                type="submit"
                disabled={loading || !newEmail}
                className="email-update-button email-update-button-primary"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </div>
          </form>
        </>
      ) : (
        // Step 2: Verify and confirm
        <>
          <div className="email-update-header">
            <h2>Verify Email Update</h2>
            <p>
              A verification code has been sent to your new email address. Enter
              the code and your current password to complete the update.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading && verificationCode && password) {
                handleCompleteUpdate();
              }
            }}
          >
            <div className="email-update-section">
              <div className="email-update-form-group">
                <label>Verification Code:</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code from email"
                />
                <small className="email-update-hint">
                  Check your new email address for the 8-character verification
                  code
                </small>
              </div>
              <div className="email-update-form-group">
                <label>Current Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                />
                <small className="email-update-hint">
                  Confirm your identity with your current password
                </small>
              </div>
            </div>

            <div className="email-update-section">
              <button
                type="submit"
                disabled={loading || !verificationCode || !password}
                className="email-update-button email-update-button-primary"
              >
                {loading ? "Updating..." : "Update Email Address"}
              </button>
            </div>
          </form>
        </>
      )}

      {status && (
        <div
          className={`email-update-status ${
            status.startsWith("✓")
              ? "email-update-status-success"
              : "email-update-status-error"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
