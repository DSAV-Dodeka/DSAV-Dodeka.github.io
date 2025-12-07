import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { requestAccountDeletion, AccountDeletionFlow } from "$functions/flows/account-deletion.ts";
import { useSessionInfo } from "$functions/query.ts";
import * as api from "$functions/flows/api.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./delete.css";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { data: session, isLoading } = useSessionInfo();
  const deletionFlow = useRef(new AccountDeletionFlow());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Step 2: Password confirmation
  const [password, setPassword] = useState("");

  const handleRequestDeletion = async () => {
    setLoading(true);
    setStatus("");
    try {
      // Get session token
      const sessionToken = await api.getSessionToken();

      const result = await requestAccountDeletion(sessionToken);
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      // Navigate to the same page with token in URL
      navigate(`/account/delete?token=${result.token}`);
      setStatus("✓ Deletion initiated. Confirm with your password.");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDeletion = async () => {
    if (!token) {
      setStatus("✗ No deletion token found");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      // Get session token
      const sessionToken = await api.getSessionToken();

      const result = await deletionFlow.current.tryComplete(
        sessionToken,
        token,
        password
      );
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setStatus("✓ Account deleted successfully. Redirecting...");

      // Redirect to home after a short delay
      setTimeout(() => {
        navigate("/");
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
      <div className="delete-container">
        <PageTitle title="Delete Account" />
      </div>
    );
  }

  // If user is not logged in, show message
  if (!session) {
    return (
      <div className="delete-container">
        <PageTitle title="Delete Account" />

        <div className="delete-header">
          <h2>Login Required</h2>
          <p>
            You must be logged in to delete your account.
          </p>
        </div>

        <div className="delete-section">
          <button
            onClick={() => navigate("/account/login")}
            className="delete-button delete-button-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="delete-container">
      <PageTitle title="Delete Account" />

      {!token ? (
        // Step 1: Confirmation
        <>
          <div className="delete-header delete-header-warning">
            <h2>Delete Your Account</h2>
            <p>
              <strong>⚠️ Warning:</strong> This action is permanent and cannot
              be undone.
            </p>
            <p>
              Deleting your account will permanently remove all your data,
              including your profile and all associated information.
            </p>
          </div>

          <div className="delete-section">
            <button
              onClick={handleRequestDeletion}
              disabled={loading}
              className="delete-button delete-button-danger"
            >
              {loading ? "Initiating..." : "Continue with Account Deletion"}
            </button>
          </div>

          <div className="delete-section">
            <button
              onClick={() => navigate("/profile")}
              className="delete-button delete-button-secondary"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        // Step 2: Password confirmation
        <>
          <div className="delete-header delete-header-warning">
            <h2>Confirm Account Deletion</h2>
            <p>
              Enter your password to permanently delete your account.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading && password) {
                handleCompleteDeletion();
              }
            }}
          >
            <div className="delete-section">
              <div className="delete-form-group">
                <label>Current Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  autoFocus
                />
                <small className="delete-hint">
                  Confirm your identity with your current password
                </small>
              </div>
            </div>

            <div className="delete-section">
              <button
                type="submit"
                disabled={loading || !password}
                className="delete-button delete-button-danger"
              >
                {loading ? "Deleting Account..." : "Delete My Account Permanently"}
              </button>
            </div>

            <div className="delete-section">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="delete-button delete-button-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}

      {status && (
        <div
          className={`delete-status ${
            status.startsWith("✓")
              ? "delete-status-success"
              : "delete-status-error"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
