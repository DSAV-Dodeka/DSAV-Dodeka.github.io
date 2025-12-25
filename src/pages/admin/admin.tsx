import { useState, useEffect } from "react";
import {
  listNewUsers,
  acceptUser,
  resendSignupEmail,
  type NewUser,
} from "$functions/backend.ts";
import { useSessionInfo, useSecondarySessionInfo } from "$functions/query.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./admin.css";

export default function Admin() {
  const { data: session, isLoading: sessionLoading } = useSessionInfo();
  const { data: secondarySession, isLoading: secondaryLoading } =
    useSecondarySessionInfo();

  const [newUsers, setNewUsers] = useState<NewUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [processingEmail, setProcessingEmail] = useState<string | null>(null);

  // Check if user has admin permission in either session
  const isAdmin =
    session?.user.permissions.includes("admin") ||
    secondarySession?.user.permissions.includes("admin");
  const authLoading = sessionLoading || secondaryLoading;

  const loadNewUsers = async () => {
    setLoading(true);
    setStatus("");
    try {
      const users = await listNewUsers();
      setNewUsers(users);
      setStatus(`✓ Loaded ${users.length} registration request(s)`);
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptUser = async (email: string) => {
    setProcessingEmail(email);
    setStatus("");
    try {
      const result = await acceptUser(email);
      setStatus(`✓ ${result.message}`);
      // Reload the list
      await loadNewUsers();
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setProcessingEmail(null);
    }
  };

  const handleResendEmail = async (email: string) => {
    setProcessingEmail(email);
    setStatus("");
    try {
      const result = await resendSignupEmail(email);
      setStatus(`✓ ${result.message}`);
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setProcessingEmail(null);
    }
  };

  useEffect(() => {
    // Only load users if we're admin
    if (isAdmin) {
      loadNewUsers();
    }
  }, [isAdmin]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="admin-container">
        <PageTitle title="Admin Dashboard" />
        <div className="admin-loading">Checking permissions...</div>
      </div>
    );
  }

  // Show not authorized if not admin
  if (!isAdmin) {
    return (
      <div className="admin-container">
        <div className="admin-not-authorized">
          <h2>Not Authorized</h2>
          <p>You need admin permissions to access this page.</p>
          {import.meta.env.DEV && (
            <p>
              Log in as admin via the <a href="/flow-test">flow-test page</a>.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <PageTitle title="Admin Dashboard" />

      <div className="admin-header">
        <h2>User Registration Requests</h2>
        <button
          onClick={loadNewUsers}
          disabled={loading}
          className="admin-button admin-button-refresh"
        >
          Refresh List
        </button>
      </div>

      {status && (
        <div
          className={`admin-status ${
            status.startsWith("✓")
              ? "admin-status-success"
              : "admin-status-error"
          }`}
        >
          {status}
        </div>
      )}

      {loading && newUsers.length === 0 ? (
        <div className="admin-loading">Loading...</div>
      ) : newUsers.length === 0 ? (
        <div className="admin-empty">No registration requests found</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {newUsers.map((user) => (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>
                    <span
                      className={`admin-status-badge ${
                        user.accepted
                          ? "admin-status-badge-accepted"
                          : "admin-status-badge-pending"
                      }`}
                    >
                      {user.accepted ? "Accepted" : "Pending"}
                    </span>
                  </td>
                  <td>
                    {!user.accepted ? (
                      <button
                        onClick={() => handleAcceptUser(user.email)}
                        disabled={processingEmail === user.email}
                        className="admin-button admin-button-accept"
                      >
                        {processingEmail === user.email ? "Processing..." : "Accept"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResendEmail(user.email)}
                        disabled={processingEmail === user.email}
                        className="admin-button admin-button-resend"
                      >
                        {processingEmail === user.email
                          ? "Sending..."
                          : "Resend Email"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
