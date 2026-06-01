import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { requestAccountDeletion, AccountDeletionFlow } from "$functions/flows/account-deletion.ts";
import * as api from "$functions/backend.ts";

export default function AccountDeletionFlowTest() {
  const queryClient = useQueryClient();
  const deletionFlow = useRef(new AccountDeletionFlow());
  const [step, setStep] = useState<"confirm" | "password" | "complete">("confirm");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [deletionToken, setDeletionToken] = useState("");
  const [password, setPassword] = useState("L6E4X4UPZRPPUQ");

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

      setDeletionToken(result.token);
      setStatus("✓ Deletion initiated");
      setStep("password");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDeletion = async () => {
    setLoading(true);
    setStatus("");
    try {
      // Get session token
      const sessionToken = await api.getSessionToken();

      const result = await deletionFlow.current.tryComplete(
        sessionToken,
        deletionToken,
        password
      );
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setStatus("✓ Account deleted successfully");
      setStep("complete");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep("confirm");
    setStatus("");
    setDeletionToken("");
    deletionFlow.current = new AccountDeletionFlow();
  };

  return (
    <>
      <h2>Account Deletion Flow</h2>
      <p>
        Test the account deletion flow: confirm deletion → verify password →
        complete
      </p>

      {step === "confirm" && (
        <div className="flow-test-form">
          <div className="flow-test-info flow-test-info-warning">
            <strong>⚠️ Warning:</strong> This will permanently delete the account.
            You will need to re-register to test other flows.
          </div>
          <div className="flow-test-actions">
            <button
              onClick={handleRequestDeletion}
              className="flow-test-btn flow-test-btn-primary flow-test-btn-danger"
              disabled={loading}
            >
              {loading ? "Initiating..." : "Start Account Deletion"}
            </button>
          </div>
        </div>
      )}

      {step === "password" && (
        <>
          <div className="flow-test-info">
            <strong>Deletion Token:</strong> {deletionToken}
          </div>

          <form
            className="flow-test-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleCompleteDeletion();
            }}
          >
            <div className="flow-test-field">
              <label>Current Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <small className="flow-test-field-hint">
                Confirm your identity with your current password
              </small>
            </div>
            <div className="flow-test-actions">
              <button
                type="submit"
                className="flow-test-btn flow-test-btn-primary flow-test-btn-danger"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
              <button
                type="button"
                className="flow-test-btn flow-test-btn-secondary"
                onClick={handleStartOver}
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}

      {step === "complete" && (
        <div className="flow-test-complete">
          <h3>✓ Account Deleted</h3>
          <p>Account has been permanently deleted. Session invalidated.</p>
          <button
            className="flow-test-btn flow-test-btn-secondary"
            onClick={handleStartOver}
          >
            Back to Start
          </button>
        </div>
      )}

      {status && (
        <div
          className={`flow-test-status ${
            status.startsWith("✓") ? "success" : "error"
          }`}
        >
          {status}
        </div>
      )}
    </>
  );
}
