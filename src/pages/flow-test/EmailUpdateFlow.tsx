import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { requestEmailUpdate, EmailUpdateFlow } from "$functions/flows/email-update.ts";
import * as api from "$functions/backend.ts";

export default function EmailUpdateFlowTest() {
  const queryClient = useQueryClient();
  const updateFlow = useRef(new EmailUpdateFlow());
  const [step, setStep] = useState<"email" | "verify" | "complete">("email");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [newEmail, setNewEmail] = useState("newemail@example.com");
  const [updateToken, setUpdateToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("L6E4X4UPZRPPUQ");

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

      setUpdateToken(result.token);
      setStatus("✓ Verification code sent to new email");
      setStep("verify");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteUpdate = async () => {
    setLoading(true);
    setStatus("");
    try {
      // Get session token
      const sessionToken = await api.getSessionToken();

      const result = await updateFlow.current.tryComplete(
        sessionToken,
        updateToken,
        verificationCode,
        password
      );
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setStatus("✓ Email address updated successfully");
      setStep("complete");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep("email");
    setStatus("");
    setUpdateToken("");
    setVerificationCode("");
    updateFlow.current = new EmailUpdateFlow();
  };

  return (
    <>
      <h2>Email Update Flow</h2>
      <p>
        Test the email update flow: enter new email → verify code → verify
        password
      </p>

      {step === "email" && (
        <form
          className="flow-test-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRequestUpdate();
          }}
        >
          <div className="flow-test-field">
            <label>New Email Address</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <div className="flow-test-actions">
            <button
              type="submit"
              className="flow-test-btn flow-test-btn-primary"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        </form>
      )}

      {step === "verify" && (
        <>
          <div className="flow-test-info">
            <strong>Update Token:</strong> {updateToken}
            <br />
            <strong>New Email:</strong> {newEmail}
          </div>

          <p>Check Faroe console logs for the verification code.</p>

          <form
            className="flow-test-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleCompleteUpdate();
            }}
          >
            <div className="flow-test-field">
              <label>Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code from email"
                required
              />
              <small style={{ color: "#666", fontSize: "12px" }}>
                8-character code sent to new email address
              </small>
            </div>
            <div className="flow-test-field">
              <label>Current Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <small style={{ color: "#666", fontSize: "12px" }}>
                Your current password to confirm your identity
              </small>
            </div>
            <div className="flow-test-actions">
              <button
                type="submit"
                className="flow-test-btn flow-test-btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Email"}
              </button>
              <button
                type="button"
                className="flow-test-btn flow-test-btn-secondary"
                onClick={handleStartOver}
              >
                Start Over
              </button>
            </div>
          </form>
        </>
      )}

      {step === "complete" && (
        <div className="flow-test-complete">
          <h3>✓ Email Update Complete</h3>
          <p>Email address has been successfully updated.</p>
          <button
            className="flow-test-btn flow-test-btn-secondary"
            onClick={handleStartOver}
          >
            Update Email Again
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
