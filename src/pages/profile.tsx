import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionInfo } from "../functions/query";
import {
  clearCurrentSession,
  createUserDeletion,
  verifyUserDeletionPassword,
  completeUserDeletion,
  createEmailChange,
  sendEmailVerificationCode,
  verifyEmailChange,
  verifyEmailChangePassword,
  completeEmailChange,
} from "../functions/faroe-client";
import {
  createPasswordReset,
  completePasswordReset,
} from "../functions/auth-flow";
import PageTitle from "../components/PageTitle";
import "./register.css";
import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useSessionInfo();

  // Email change state
  const [emailChangeStep, setEmailChangeStep] = useState<
    "idle" | "form" | "done"
  >("idle");
  const [newEmail, setNewEmail] = useState("");
  const [emailUpdateToken, setEmailUpdateToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [emailChangeStatus, setEmailChangeStatus] = useState("");
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  // Password reset state
  const [passwordResetStep, setPasswordResetStep] = useState<
    "idle" | "form" | "done"
  >("idle");
  const [resetToken, setResetToken] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordResetStatus, setPasswordResetStatus] = useState("");
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [deletionToken, setDeletionToken] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const handleLogout = async () => {
    try {
      await clearCurrentSession();
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSendCode = async () => {
    setEmailChangeLoading(true);
    setEmailChangeStatus("");
    try {
      const token = await createEmailChange(newEmail);
      setEmailUpdateToken(token);
      await sendEmailVerificationCode(token);
      setCodeSent(true);
      setEmailChangeStatus("✓ Verification code sent to " + newEmail);
    } catch (error) {
      setEmailChangeStatus(
        `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleCompleteChange = async () => {
    setEmailChangeLoading(true);
    setEmailChangeStatus("");
    try {
      await verifyEmailChange(emailUpdateToken, verificationCode);
      await verifyEmailChangePassword(emailUpdateToken, password);
      await completeEmailChange(emailUpdateToken);
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setEmailChangeStep("done");
      setEmailChangeStatus("");
    } catch (error) {
      setEmailChangeStatus(
        `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleStartPasswordReset = async () => {
    if (!session?.user.email) return;

    setPasswordResetLoading(true);
    setPasswordResetStatus("");
    try {
      const result = await createPasswordReset(session.user.email);
      if (result.success && result.signupToken) {
        setResetToken(result.signupToken);
        setPasswordResetStep("form");
        setPasswordResetStatus("✓ Temporary password sent to your email");
      } else {
        setPasswordResetStatus(result.message);
      }
    } catch (error) {
      setPasswordResetStatus(
        `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleCompletePasswordReset = async () => {
    setPasswordResetLoading(true);
    setPasswordResetStatus("");
    try {
      const result = await completePasswordReset(
        resetToken,
        tempPassword,
        newPassword,
      );
      if (result.success) {
        setPasswordResetStep("done");
        setPasswordResetStatus("");
      } else {
        setPasswordResetStatus(result.message);
      }
    } catch (error) {
      setPasswordResetStatus(
        `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleStartDeletion = async () => {
    setDeleteLoading(true);
    setDeleteStatus("");
    try {
      const token = await createUserDeletion();
      setDeletionToken(token);
      setDeleteStatus("");
    } catch (error) {
      setDeleteStatus(
        `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCompleteDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteStatus("");
    try {
      await verifyUserDeletionPassword(deletionToken, deletePassword);
      await completeUserDeletion(deletionToken);
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      navigate("/");
    } catch (error) {
      setDeleteStatus(
        `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
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
          <p>
            Please <a href="/account/login">log in</a> to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <PageTitle title="Profile" />

      <div className="profile-header">
        <h2>
          {session.user.firstname} {session.user.lastname}
        </h2>
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
            {session.user.permissions.length > 0
              ? session.user.permissions.join(", ")
              : "None"}
          </span>
        </div>
      </div>

      {/* Account Management */}
      <div className="profile-actions">
        <h3>Account Management</h3>

        {/* Email Change */}
        {emailChangeStep === "idle" && (
          <button
            onClick={() => setEmailChangeStep("form")}
            className="profile-action-button"
          >
            Change Email
          </button>
        )}

        {emailChangeStep === "form" && (
          <div className="profile-email-change-form">
            <div className="register-form-group">
              <label>New Email:</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new.email@example.com"
                disabled={emailChangeLoading || codeSent}
              />
            </div>
            <div className="register-form-group">
              <label>Verification Code:</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code from email"
                disabled={emailChangeLoading || !codeSent}
              />
              <small className="register-hint">
                {codeSent
                  ? `Check your email at ${newEmail} for the verification code`
                  : "Click 'Send Code' to receive a verification code"}
              </small>
            </div>
            <div className="register-form-group">
              <label>Current Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={emailChangeLoading}
              />
              <small className="register-hint">
                Enter your current password to confirm the email change
              </small>
            </div>
            <div className="profile-form-buttons">
              {!codeSent ? (
                <button
                  onClick={handleSendCode}
                  disabled={emailChangeLoading || !newEmail}
                  className="register-button register-button-primary"
                >
                  Send Code
                </button>
              ) : (
                <button
                  onClick={handleCompleteChange}
                  disabled={
                    emailChangeLoading || !verificationCode || !password
                  }
                  className="register-button register-button-primary"
                >
                  Complete Change
                </button>
              )}
              <button
                onClick={() => {
                  setEmailChangeStep("idle");
                  setNewEmail("");
                  setVerificationCode("");
                  setPassword("");
                  setEmailChangeStatus("");
                  setCodeSent(false);
                }}
                disabled={emailChangeLoading}
                className="register-button register-button-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
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
                setPassword("");
                setEmailChangeStatus("");
                setCodeSent(false);
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

        {/* Password Reset */}
        {passwordResetStep === "form" && (
          <div className="profile-email-change-form">
            <div className="register-form-group">
              <label>Temporary Password:</label>
              <input
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Enter temporary password from email"
                disabled={passwordResetLoading}
              />
              <small className="register-hint">
                Check your email for the temporary password
              </small>
            </div>
            <div className="register-form-group">
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={passwordResetLoading}
              />
            </div>
            <div className="profile-form-buttons">
              <button
                onClick={handleCompletePasswordReset}
                disabled={passwordResetLoading || !tempPassword || !newPassword}
                className="register-button register-button-primary"
              >
                Reset Password
              </button>
              <button
                onClick={() => {
                  setPasswordResetStep("idle");
                  setResetToken("");
                  setTempPassword("");
                  setNewPassword("");
                  setPasswordResetStatus("");
                }}
                disabled={passwordResetLoading}
                className="register-button register-button-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {passwordResetStep === "done" && (
          <div className="register-complete">
            <h4>✓ Password Reset Successfully!</h4>
            <p>Your password has been updated</p>
            <button
              onClick={() => {
                setPasswordResetStep("idle");
                setResetToken("");
                setTempPassword("");
                setNewPassword("");
                setPasswordResetStatus("");
              }}
              className="register-button register-button-primary"
            >
              Done
            </button>
          </div>
        )}

        {passwordResetStatus && (
          <div
            className={`register-status ${
              passwordResetStatus.startsWith("✓")
                ? "register-status-success"
                : "register-status-error"
            }`}
          >
            {passwordResetStatus}
          </div>
        )}

        {passwordResetLoading && (
          <div className="register-loading">
            <p>Processing...</p>
          </div>
        )}

        {/* Other Actions */}
        {emailChangeStep === "idle" && (
          <>
            {passwordResetStep === "idle" && (
              <button
                onClick={handleStartPasswordReset}
                className="profile-action-button"
              >
                Reset Password
              </button>
            )}

            {!showDeleteConfirm && (
              <button
                onClick={() => {
                  setShowDeleteConfirm(true);
                  handleStartDeletion();
                }}
                className="profile-action-button profile-action-button-danger"
              >
                Delete Account
              </button>
            )}

            {showDeleteConfirm && (
              <div className="profile-delete-confirm">
                <p className="profile-delete-confirm-text">
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
                {deletionToken && (
                  <div className="register-form-group">
                    <label>Enter Your Password to Confirm:</label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={deleteLoading}
                    />
                  </div>
                )}
                <div className="profile-form-buttons">
                  <button
                    onClick={handleCompleteDeleteAccount}
                    disabled={
                      deleteLoading || !deletionToken || !deletePassword
                    }
                    className="register-button profile-delete-button"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteStatus("");
                      setDeletionToken("");
                      setDeletePassword("");
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
