import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionInfo } from "../functions/query";
import {
  clearCurrentSession,
  deleteAccount,
  faroeClient,
} from "../functions/faroe-client";
import PageTitle from "../components/PageTitle";
import "./register.css";
import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useSessionInfo();

  // Email change state
  const [emailChangeStep, setEmailChangeStep] = useState<
    "idle" | "enter-email" | "verify-code" | "done"
  >("idle");
  const [newEmail, setNewEmail] = useState("");
  const [emailUpdateToken, setEmailUpdateToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailChangeStatus, setEmailChangeStatus] = useState("");
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);

  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");

  const handleLogout = async () => {
    try {
      await clearCurrentSession();
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleStartEmailChange = async () => {
    setEmailChangeLoading(true);
    setEmailChangeStatus("");
    try {
      // Get session token from cookie via backend
      const tokenResponse = await fetch("http://localhost:8000/auth/get_session_token/", {
        method: "GET",
        credentials: "include",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get session token");
      }

      const { session_token } = await tokenResponse.json();

      // Create email change with Faroe
      const result = await faroeClient.createUserEmailAddressUpdate(session_token, newEmail);

      if (!result.ok) {
        throw new Error("Failed to initiate email change");
      }

      setEmailUpdateToken(result.userEmailAddressUpdateToken);

      // Send verification code
      const sendResult = await faroeClient.sendUserEmailAddressUpdateEmailAddressVerificationCode(
        session_token,
        result.userEmailAddressUpdateToken
      );

      if (!sendResult.ok) {
        throw new Error("Failed to send verification code");
      }

      setEmailChangeStep("verify-code");
      setEmailChangeStatus("✓ Verification code sent to " + newEmail);
    } catch (error) {
      setEmailChangeStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleVerifyEmailChange = async () => {
    setEmailChangeLoading(true);
    setEmailChangeStatus("");
    try {
      // Get session token from cookie via backend
      const tokenResponse = await fetch("http://localhost:8000/auth/get_session_token/", {
        method: "GET",
        credentials: "include",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get session token");
      }

      const { session_token } = await tokenResponse.json();

      // Verify email change
      const verifyResult = await faroeClient.verifyUserEmailAddressUpdateEmailAddressVerificationCode(
        session_token,
        emailUpdateToken,
        verificationCode
      );

      if (!verifyResult.ok) {
        throw new Error("Failed to verify email");
      }

      // Complete email change
      const completeResult = await faroeClient.completeUserEmailAddressUpdate(
        session_token,
        emailUpdateToken
      );

      if (!completeResult.ok) {
        throw new Error("Failed to complete email change");
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setEmailChangeStep("done");
      setEmailChangeStatus("");
    } catch (error) {
      setEmailChangeStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteStatus("");
    try {
      await deleteAccount();
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      navigate("/");
    } catch (error) {
      setDeleteStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="register-container">
        <PageTitle title="Profile" />
        <div className="register-loading">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="register-container">
        <PageTitle title="Profile" />
        <div className="register-header">
          <h2>Not Logged In</h2>
          <p>Please <a href="/login">log in</a> to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <PageTitle title="Profile" />

      <div className="profile-header">
        <h2>{session.user.firstname} {session.user.lastname}</h2>
        <p className="profile-email">{session.user.email}</p>
      </div>

      {/* Account Information */}
      <div className="profile-info-card">
        <h3>Account Information</h3>
        <div className="profile-info-row">
          <span className="profile-info-label">User ID:</span>
          <span className="profile-info-value">{session.user.user_id}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Email:</span>
          <span className="profile-info-value">{session.user.email}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Permissions:</span>
          <span className="profile-info-value">
            {session.user.permissions.length > 0 ? session.user.permissions.join(", ") : "None"}
          </span>
        </div>
      </div>

      {/* Account Management */}
      <div className="profile-actions">
        <h3>Account Management</h3>

        {/* Email Change */}
        {emailChangeStep === "idle" && (
          <button
            onClick={() => setEmailChangeStep("enter-email")}
            className="profile-action-button"
          >
            Change Email
          </button>
        )}

        {emailChangeStep === "enter-email" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!emailChangeLoading && newEmail) {
                handleStartEmailChange();
              }
            }}
          >
            <div className="register-form-group">
              <label>New Email:</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new.email@example.com"
              />
            </div>
            <div className="profile-form-buttons">
              <button
                type="submit"
                disabled={emailChangeLoading || !newEmail}
                className="register-button register-button-primary"
              >
                Send Verification Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailChangeStep("idle");
                  setNewEmail("");
                  setEmailChangeStatus("");
                }}
                className="register-button register-button-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {emailChangeStep === "verify-code" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!emailChangeLoading && verificationCode) {
                handleVerifyEmailChange();
              }
            }}
          >
            <div className="register-form-group">
              <label>Verification Code:</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code from email"
              />
              <small className="register-hint">
                Check your email at {newEmail} for the verification code
              </small>
            </div>
            <div className="profile-form-buttons">
              <button
                type="submit"
                disabled={emailChangeLoading || !verificationCode}
                className="register-button register-button-primary"
              >
                Verify and Complete
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailChangeStep("idle");
                  setNewEmail("");
                  setVerificationCode("");
                  setEmailChangeStatus("");
                }}
                className="register-button register-button-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {emailChangeStep === "done" && (
          <div className="register-complete">
            <h4>✓ Email Changed Successfully!</h4>
            <p>Your email has been updated to {newEmail}</p>
            <button
              onClick={() => {
                setEmailChangeStep("idle");
                setNewEmail("");
                setVerificationCode("");
                setEmailChangeStatus("");
              }}
              className="register-button register-button-primary"
            >
              Done
            </button>
          </div>
        )}

        {emailChangeStatus && (
          <div
            className={`register-status ${
              emailChangeStatus.startsWith("✓")
                ? "register-status-success"
                : "register-status-error"
            }`}
          >
            {emailChangeStatus}
          </div>
        )}

        {emailChangeLoading && (
          <div className="register-loading">
            <p>Processing...</p>
          </div>
        )}

        {/* Other Actions */}
        {emailChangeStep === "idle" && (
          <>
            <button
              onClick={() => navigate("/password-reset")}
              className="profile-action-button"
            >
              Reset Password
            </button>

            {!showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="profile-action-button profile-action-button-danger"
              >
                Delete Account
              </button>
            )}

            {showDeleteConfirm && (
              <div className="profile-delete-confirm">
                <p style={{ color: "#d32f2f", fontWeight: "bold" }}>
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="profile-form-buttons">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="register-button"
                    style={{ backgroundColor: "#d32f2f" }}
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteStatus("");
                    }}
                    disabled={deleteLoading}
                    className="register-button register-button-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {deleteStatus && (
              <div className="register-status register-status-error">
                {deleteStatus}
              </div>
            )}

            {deleteLoading && (
              <div className="register-loading">
                <p>Deleting account...</p>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="profile-action-button profile-action-button-logout"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
