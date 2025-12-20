import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import PageTitle from "$components/PageTitle.tsx";
import * as api from "$functions/backend.ts";
import RegisterFlow from "./RegisterFlow";
import LoginFlow from "./LoginFlow";
import PasswordResetFlow from "./PasswordResetFlow";
import EmailUpdateFlow from "./EmailUpdateFlow";
import AccountDeletionFlow from "./AccountDeletionFlow";
import { TEST_PASSWORD } from "./constants";
import "./flow-test.css";

type Tab = "register" | "login" | "password-reset" | "email-update" | "account-deletion";

export default function FlowTest() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("register");
  const [loading, setLoading] = useState(false);
  const [clearStatus, setClearStatus] = useState("");

  const resetTables = async () => {
    setLoading(true);
    setClearStatus("");
    try {
      await api.resetTables();
      setClearStatus("✓ Tables reset");
    } catch (error) {
      setClearStatus("✗ Failed to reset tables");
      console.error("Error resetting tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setClearStatus("");
    try {
      await api.clearSession();
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setClearStatus("✓ Logged out");
    } catch (error) {
      setClearStatus("✗ Failed to logout");
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flow-test">
      <PageTitle title="Flow Test" />

      <div className="flow-test-container">
        <div className="flow-test-sidebar">
          <div className="flow-test-actions-section">
            <h3>Actions</h3>
            <button onClick={resetTables} disabled={loading}>
              Reset Tables
            </button>
            <button onClick={logout} disabled={loading}>
              Logout
            </button>
          </div>

          <div className="flow-test-actions-section">
            <h3>Links</h3>
            <Link to="/admin" className="flow-test-link">
              Admin Page
            </Link>
          </div>

          <div className="flow-test-actions-section">
            <h3>Test Data</h3>
            <div className="flow-test-password">
              <label>Password:</label>
              <code>{TEST_PASSWORD}</code>
            </div>
          </div>

          {clearStatus && (
            <div
              className={`flow-test-sidebar-status ${clearStatus.startsWith("✓") ? "success" : "error"}`}
            >
              {clearStatus}
            </div>
          )}
        </div>

        <div className="flow-test-main">
          <div className="flow-test-tabs">
            <button
              className={`flow-test-tab ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
            <button
              className={`flow-test-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flow-test-tab ${activeTab === "password-reset" ? "active" : ""}`}
              onClick={() => setActiveTab("password-reset")}
            >
              Password Reset
            </button>
            <button
              className={`flow-test-tab ${activeTab === "email-update" ? "active" : ""}`}
              onClick={() => setActiveTab("email-update")}
            >
              Email Update
            </button>
            <button
              className={`flow-test-tab ${activeTab === "account-deletion" ? "active" : ""}`}
              onClick={() => setActiveTab("account-deletion")}
            >
              Delete Account
            </button>
          </div>

          <div className="flow-test-content">
            {activeTab === "register" && <RegisterFlow />}
            {activeTab === "login" && <LoginFlow />}
            {activeTab === "password-reset" && <PasswordResetFlow />}
            {activeTab === "email-update" && <EmailUpdateFlow />}
            {activeTab === "account-deletion" && <AccountDeletionFlow />}
          </div>
        </div>
      </div>
    </div>
  );
}
