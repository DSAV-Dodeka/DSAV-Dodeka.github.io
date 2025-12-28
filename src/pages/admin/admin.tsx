import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import {
  listNewUsers,
  acceptUser,
  resendSignupEmail,
  listUsers,
  getAvailablePermissions,
  addUserPermission,
  removeUserPermission,
  type NewUser,
  type User,
} from "$functions/backend.ts";
import { useSessionInfo, useSecondarySessionInfo } from "$functions/query.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./admin.css";

// Permission display configuration: backend name -> { display, color, light }
const PERMISSION_CONFIG: Record<
  string,
  { display: string; color: string; light: boolean }
> = {
  member: { display: "Lid", color: "#001f48", light: false },
  admin: { display: "Admin", color: "#dc3545", light: false },
  bestuur: { display: "Bestuur", color: "#001f48", light: false },
  comcom: { display: ".ComCom", color: "#4D8B31", light: false },
  batcie: { display: "BatCie", color: "#94FBAB", light: true },
  barco: { display: "BarCo", color: "#FB3640", light: false },
  lustrum: { display: "Lustrum", color: "#EEABC4", light: true },
  focus: { display: "Focus", color: "#F5FDC6", light: true },
  "nsk-meerkamp": { display: "NSK Meerkamp", color: "#08a4bd", light: false },
  redaxii: { display: "RedaXII", color: "#0B7A75", light: false },
  sax: { display: "SAX", color: "#9B5DE5", light: false },
  snowdeka: { display: "Snowdeka", color: "#87F1FF", light: true },
  sunrice: { display: "Sunrice", color: "#F9CB40", light: true },
  trainers: { display: "Trainers", color: "#F58A07", light: false },
};

function getPermissionStyle(permission: string): {
  backgroundColor: string;
  color: string;
} {
  const config = PERMISSION_CONFIG[permission];
  if (config) {
    return {
      backgroundColor: config.color,
      color: config.light ? "#000000" : "#ffffff",
    };
  }
  return { backgroundColor: "#666666", color: "#ffffff" };
}

function getPermissionDisplay(permission: string): string {
  return PERMISSION_CONFIG[permission]?.display ?? permission;
}

export default function Admin() {
  const { data: session, isLoading: sessionLoading } = useSessionInfo();
  const { data: secondarySession, isLoading: secondaryLoading } =
    useSecondarySessionInfo();

  const [newUsers, setNewUsers] = useState<NewUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [processingEmail, setProcessingEmail] = useState<string | null>(null);

  // User permissions state
  const [users, setUsers] = useState<User[]>([]);
  const [availablePerms, setAvailablePerms] = useState<string[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [addingPermUser, setAddingPermUser] = useState<string | null>(null);
  const [selectedPerm, setSelectedPerm] = useState<string>("");

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

  // User permissions handlers
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const [userList, perms] = await Promise.all([
        listUsers(),
        getAvailablePermissions(),
      ]);
      setUsers(userList);
      setAvailablePerms(perms.filter((p) => p !== "admin")); // Filter out admin
      if (perms.length > 0 && !selectedPerm) {
        setSelectedPerm(perms.find((p) => p !== "admin") ?? perms[0]);
      }
    } catch (error) {
      setStatus(
        `✗ Error loading users: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setUsersLoading(false);
    }
  };

  const handleAddPermission = async (e: FormEvent, userId: string) => {
    e.preventDefault();
    if (!selectedPerm) return;
    setStatus("");
    try {
      await addUserPermission(userId, selectedPerm);
      setStatus(`✓ Added ${getPermissionDisplay(selectedPerm)} permission`);
      setAddingPermUser(null);
      await loadUsers();
    } catch (error) {
      setStatus(
        `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const handleRemovePermission = async (userId: string, permission: string) => {
    if (permission === "admin") return; // Safety check
    setStatus("");
    try {
      await removeUserPermission(userId, permission);
      setStatus(`✓ Removed ${getPermissionDisplay(permission)} permission`);
      await loadUsers();
    } catch (error) {
      setStatus(
        `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const handlePermSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPerm(e.target.value);
  };

  useEffect(() => {
    // Only load data if we're admin
    if (isAdmin) {
      loadNewUsers();
      loadUsers();
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

      {/* User Permissions Section */}
      <div className="admin-header" style={{ marginTop: "40px" }}>
        <h2>User Permissions</h2>
        <button
          onClick={loadUsers}
          disabled={usersLoading}
          className="admin-button admin-button-refresh"
        >
          Refresh
        </button>
      </div>

      {usersLoading && users.length === 0 ? (
        <div className="admin-loading">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="admin-empty">No users found</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>
                    {user.firstname} {user.lastname}
                    <div className="admin-user-email">{user.email}</div>
                  </td>
                  <td>
                    <div className="admin-perm-list">
                      {user.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="admin-perm-badge"
                          style={getPermissionStyle(perm)}
                        >
                          {getPermissionDisplay(perm)}
                          {perm !== "admin" && (
                            <button
                              className="admin-perm-remove"
                              style={{ color: getPermissionStyle(perm).color }}
                              onClick={() =>
                                handleRemovePermission(user.user_id, perm)
                              }
                              title={`Remove ${getPermissionDisplay(perm)}`}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                      {user.permissions.length === 0 && (
                        <span className="admin-perm-none">No permissions</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {addingPermUser !== user.user_id ? (
                      <button
                        className="admin-button admin-button-add"
                        onClick={() => setAddingPermUser(user.user_id)}
                      >
                        + Add
                      </button>
                    ) : (
                      <form
                        className="admin-add-perm-form"
                        onSubmit={(e) => handleAddPermission(e, user.user_id)}
                      >
                        <select
                          value={selectedPerm}
                          onChange={handlePermSelectChange}
                          className="admin-perm-select"
                        >
                          {availablePerms
                            .filter((p) => !user.permissions.includes(p))
                            .map((perm) => (
                              <option key={perm} value={perm}>
                                {getPermissionDisplay(perm)}
                              </option>
                            ))}
                        </select>
                        <button
                          type="submit"
                          className="admin-button admin-button-accept"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="admin-button"
                          onClick={() => setAddingPermUser(null)}
                        >
                          Cancel
                        </button>
                      </form>
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
