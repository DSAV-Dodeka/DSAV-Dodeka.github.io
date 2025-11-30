import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { faroeClient, setSession } from "../functions/faroe-client";
import PageTitle from "../components/PageTitle";
import "./register.css";

export default function Login() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    setStatus("");

    try {
      // Step 1: Create signin
      const signinResult = await faroeClient.createSignin(email);

      if (!signinResult.ok) {
        setStatus(`✗ Sign in failed: ${JSON.stringify(signinResult)}`);
        setLoading(false);
        return;
      }

      // Step 2: Verify password
      const verifyResult = await faroeClient.verifySigninPassword(
        signinResult.signinToken,
        password
      );

      if (!verifyResult.ok) {
        setStatus(`✗ Invalid email or password`);
        setLoading(false);
        return;
      }

      // Step 3: Set session cookie
      await setSession(verifyResult.sessionToken);

      // Invalidate session query to update login indicator
      await queryClient.invalidateQueries({ queryKey: ["session"] });

      setStatus("✓ Login successful! Redirecting...");

      // Redirect to home after short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <PageTitle title="Login" />

      <div className="register-header">
        <h2>Login to Your Account</h2>
        <p>Enter your email and password to access your account.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading && email && password) {
            handleSignIn();
          }
        }}
      >
        <div className="register-section">
          <div className="register-form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>
          <div className="register-form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
        </div>

        <div className="register-section">
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="register-button register-button-primary"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      <div className="register-section" style={{ textAlign: "center", marginTop: "10px" }}>
        <a href="/password-reset" style={{ color: "#2196F3", textDecoration: "none" }}>
          Forgot your password?
        </a>
      </div>

      {status && (
        <div
          className={`register-status ${
            status.startsWith("✓")
              ? "register-status-success"
              : "register-status-error"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
