import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { login } from "$functions/flows/login.ts";
import { TEST_EMAIL, TEST_PASSWORD } from "./constants";

export default function LoginFlow() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"form" | "complete">("form");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [email, setEmail] = useState(TEST_EMAIL);
  const [password, setPassword] = useState(TEST_PASSWORD);

  const handleLogin = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await login(email, password);
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setStatus("✓ Login successful, session established");
      setStep("complete");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("form");
    setStatus("");
  };

  return (
    <>
      <h2>Login Flow</h2>
      <p>Test the login flow: enter credentials → verify → establish session</p>

      {step === "form" && (
        <form
          className="flow-test-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="flow-test-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flow-test-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flow-test-actions">
            <button
              type="submit"
              className="flow-test-btn flow-test-btn-primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      )}

      {step === "complete" && (
        <div className="flow-test-complete">
          <h3>✓ Login Complete</h3>
          <p>Session established successfully.</p>
          <button
            className="flow-test-btn flow-test-btn-secondary"
            onClick={handleReset}
          >
            Login Again
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
