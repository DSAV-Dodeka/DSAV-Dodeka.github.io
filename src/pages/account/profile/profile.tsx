import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionInfo } from "$functions/query.ts";
import * as api from "$functions/backend.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useSessionInfo();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    setStatus("");
    try {
      await api.clearSession();
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setStatus("✓ Logged out successfully");

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/account/login");
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
      <div className="profile-container">
        <PageTitle title="Profile" />
      </div>
    );
  }

  // If user is not logged in, show message
  if (!session) {
    return (
      <div className="profile-container">
        <PageTitle title="Profile" />

        <div className="profile-header">
          <h2>Login Required</h2>
          <p>You must be logged in to view your profile.</p>
        </div>

        <div className="profile-section">
          <button
            onClick={() => navigate("/account/login")}
            className="profile-button profile-button-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <PageTitle title="Profile" />
      <div className="profile-header">
        <h2>Your Profile</h2>
        <p>Manage your account settings and information.</p>
      </div>

      {session.pending_approval ? (
        <div className="profile-pending-banner">
          <strong>Lidmaatschap in behandeling</strong>
          <p>
            Je account is aangemaakt, maar je lidmaatschap wordt nog beoordeeld
            door het bestuur. Dit duurt meestal enkele werkdagen.
          </p>
        </div>
      ) : !session.user.permissions.includes("member") ? (
        <div className="profile-inactive-banner">
          <strong>Lidmaatschap inactief</strong>
          <p>
            Je account is niet meer actief als lid van D.S.A.V. Dodeka. Neem
            contact op met het bestuur als je denkt dat dit niet klopt.
          </p>
        </div>
      ) : null}

      {/* Session Actions */}
      <div className="profile-section">
        <h3>Session</h3>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="profile-button profile-button-secondary"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* Account Information */}
      <div className="profile-section">
        <h3>Account Information</h3>
        <div className="profile-info">
          <div className="profile-info-row">
            <span className="profile-info-label">Name:</span>
            <span className="profile-info-value">
              {session.user.firstname} {session.user.lastname}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Email:</span>
            <span className="profile-info-value">{session.user.email}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">User ID:</span>
            <span className="profile-info-value">{session.user.user_id}</span>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="profile-section">
        <h3>Account Settings</h3>
        <div className="profile-actions">
          <Link to="/account/email-update" className="profile-action-card">
            <div className="profile-action-icon">📧</div>
            <div className="profile-action-content">
              <h4>Update Email Address</h4>
              <p>Change your email address</p>
            </div>
          </Link>

          <Link to="/account/password-reset" className="profile-action-card">
            <div className="profile-action-icon">🔒</div>
            <div className="profile-action-content">
              <h4>Reset Password</h4>
              <p>Change your password</p>
            </div>
          </Link>

          <Link
            to="/account/delete"
            className="profile-action-card profile-action-card-danger"
          >
            <div className="profile-action-icon">⚠️</div>
            <div className="profile-action-content">
              <h4>Delete Account</h4>
              <p>Permanently delete your account</p>
            </div>
          </Link>
        </div>
      </div>

      {status && (
        <div
          className={`profile-status ${
            status.startsWith("✓")
              ? "profile-status-success"
              : "profile-status-error"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
