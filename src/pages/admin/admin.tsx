import {
  useState,
  useEffect,
  useCallback,
  type FormEvent,
  type ChangeEvent,
} from "react";
import {
  listNewUsers,
  acceptUser,
  resendSignupEmail,
  listUsers,
  getAvailablePermissions,
  addUserPermission,
  removeUserPermission,
  importSync,
  getSyncStatus,
  acceptNewSync,
  removeDeparted,
  updateExisting,
  type NewUser,
  type User,
  type SyncStatus,
} from "$functions/backend.ts";
import { useSessionInfo, useSecondarySessionInfo } from "$functions/query.ts";
import PageTitle from "$components/PageTitle.tsx";
import { useAdminKeyboard } from "./useAdminKeyboard.ts";
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

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function HelpOverlay({
  isAdmin,
  onClose,
}: {
  isAdmin: boolean;
  onClose: () => void;
}) {
  return (
    <div className="admin-help-overlay" onClick={onClose}>
      <div className="admin-help-panel" onClick={(e) => e.stopPropagation()}>
        <h3>Keyboard Shortcuts</h3>
        {isAdmin && (
          <>
            <h4>Admin Navigation</h4>
            <table className="admin-help-table">
              <tbody>
                <tr><td className="admin-help-key">[ / ]</td><td>Previous / next tab</td></tr>
                <tr><td className="admin-help-key">j / k</td><td>Move highlight down / up</td></tr>
                <tr><td className="admin-help-key">h / l</td><td>Cycle actions within highlighted item</td></tr>
                <tr><td className="admin-help-key">Enter</td><td>Click focused action</td></tr>
                <tr><td className="admin-help-key">r</td><td>Refresh current tab</td></tr>
                <tr><td className="admin-help-key">Escape</td><td>Clear highlight / close help</td></tr>
              </tbody>
            </table>
          </>
        )}
        <h4>Global</h4>
        <table className="admin-help-table">
          <tbody>
            <tr><td className="admin-help-key">?</td><td>Toggle this help</td></tr>
            <tr><td className="admin-help-key">\a</td><td>Go to admin page</td></tr>
            {import.meta.env.DEV && (
              <tr><td className="admin-help-key">\s</td><td>Refresh admin session</td></tr>
            )}
          </tbody>
        </table>
        <button className="admin-button admin-help-close" onClick={onClose}>Close</button>
        <div className="admin-help-hint">Press ? or Escape to dismiss</div>
      </div>
    </div>
  );
}

type AdminTab = "users" | "registrations" | "sync";

export default function Admin() {
  const { data: session, isLoading: sessionLoading } = useSessionInfo();
  const { data: secondarySession, isLoading: secondaryLoading } =
    useSecondarySessionInfo();

  const [activeTab, setActiveTabRaw] = useState<AdminTab>("users");
  const [status, setStatus] = useState("");
  const [highlightedRow, setHighlightedRow] = useState(-1);
  const [highlightedCol, setHighlightedCol] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // Reset row highlight when switching tabs
  const setActiveTab = useCallback((tab: AdminTab) => {
    setActiveTabRaw(tab);
    setHighlightedRow(-1);
    setHighlightedCol(0);
  }, []);

  // Registration state
  const [newUsers, setNewUsers] = useState<NewUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingEmail, setProcessingEmail] = useState<string | null>(null);

  // Permissions state
  const [users, setUsers] = useState<User[]>([]);
  const [availablePerms, setAvailablePerms] = useState<string[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [addingPermUser, setAddingPermUser] = useState<string | null>(null);
  const [selectedPerm, setSelectedPerm] = useState<string>("");
  const [confirmingRemoval, setConfirmingRemoval] = useState<{
    userId: string;
    perm: string;
  } | null>(null);

  // Sync state
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);

  const isAdmin =
    session?.user.permissions.includes("admin") ||
    secondarySession?.user.permissions.includes("admin");
  const authLoading = sessionLoading || secondaryLoading;

  // --- Registration handlers ---

  const loadNewUsers = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await listNewUsers();
      setNewUsers(result);
      setStatus(`Loaded ${result.length} registration request(s)`);
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptUser = async (email: string) => {
    setProcessingEmail(email);
    setStatus("");
    try {
      const result = await acceptUser(email);
      setStatus(result.message);
      await loadNewUsers();
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setProcessingEmail(null);
    }
  };

  const handleResendEmail = async (email: string) => {
    setProcessingEmail(email);
    setStatus("");
    try {
      const result = await resendSignupEmail(email);
      setStatus(result.message);
      await loadNewUsers();
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setProcessingEmail(null);
    }
  };

  // --- Permissions handlers ---

  const loadUsers = async () => {
    setUsersLoading(true);
    setStatus("");
    try {
      const [userList, perms] = await Promise.all([
        listUsers(),
        getAvailablePermissions(),
      ]);
      setUsers(userList);
      setAvailablePerms(perms.filter((p) => p !== "admin" && p !== "member"));
      setStatus(`Loaded ${userList.length} user(s)`);
      if (perms.length > 0 && !selectedPerm) {
        setSelectedPerm(perms.find((p) => p !== "admin") ?? perms[0] ?? "");
      }
    } catch (error) {
      setStatus(
        `Error loading users: ${error instanceof Error ? error.message : String(error)}`,
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
      setStatus(`Added ${getPermissionDisplay(selectedPerm)} permission`);
      setAddingPermUser(null);
      await loadUsers();
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const handleRemovePermission = async (userId: string, permission: string) => {
    if (permission === "admin") return;
    setStatus("");
    try {
      await removeUserPermission(userId, permission);
      setStatus(`Removed ${getPermissionDisplay(permission)} permission`);
      await loadUsers();
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const handlePermSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPerm(e.target.value);
  };

  // --- Sync handlers ---

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSyncLoading(true);
    setStatus("");
    try {
      const content = await file.text();
      const result = await importSync(content);
      setStatus(`Imported ${result.imported} member(s) from CSV`);
      setSyncStatus(null);
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setSyncLoading(false);
    }
  };

  const handleComputeStatus = async () => {
    setSyncLoading(true);
    setStatus("");
    try {
      const result = await getSyncStatus();
      setSyncStatus(result);
      setStatus(
        `${result.new.length} new, ${result.pending.length} pending, ${result.existing.length} existing, ${result.departed.length} departed`,
      );
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setSyncLoading(false);
    }
  };

  const handleAcceptNew = async (email?: string) => {
    setSyncLoading(true);
    setStatus("");
    try {
      const result = await acceptNewSync(email);
      const parts = [`Added ${result.added}, skipped ${result.skipped}`];
      if (result.emails_sent > 0) {
        parts.push(`emails sent: ${result.emails_sent}`);
      }
      if (result.emails_failed > 0) {
        parts.push(`emails failed: ${result.emails_failed}`);
      }
      setStatus(parts.join(", "));
      await handleComputeStatus();
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      setSyncLoading(false);
    }
  };

  const handleRemoveDeparted = async (email?: string) => {
    setSyncLoading(true);
    setStatus("");
    try {
      const result = await removeDeparted(email);
      setStatus(`Removed ${result.removed} departed user(s)`);
      await handleComputeStatus();
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      setSyncLoading(false);
    }
  };

  const handleUpdateExisting = async (email?: string) => {
    setSyncLoading(true);
    setStatus("");
    try {
      const result = await updateExisting(email);
      setStatus(`Updated ${result.updated} existing user(s)`);
      await handleComputeStatus();
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      setSyncLoading(false);
    }
  };

  // --- Keyboard navigation ---

  const TABS: AdminTab[] = ["users", "registrations", "sync"];

  // Split users into active members (have permissions) and inactive (no permissions).
  // Exclude users still in the newusers table from inactive — they show up
  // on the Registrations tab instead (pending acceptance).
  const sortByName = (a: User, b: User) => {
    const aName = `${a.firstname} ${a.lastname}`.toLowerCase();
    const bName = `${b.firstname} ${b.lastname}`.toLowerCase();
    return aName.localeCompare(bName);
  };
  const newUserEmails = new Set(newUsers.map((u) => u.email));
  const activeUsers = users.filter((u) => u.permissions.length > 0).sort(sortByName);
  const inactiveUsers = users
    .filter((u) => u.permissions.length === 0 && !newUserEmails.has(u.email))
    .sort(sortByName);

  // Compute sync navigation indices (flat index across all sync sections)
  // Order: New → Pending → Departed → Existing (existing last, usually largest)
  let syncRowCount = 0;
  let syncNewBulkNav = -1;
  let syncNewStartNav = -1;
  let syncDepBulkNav = -1;
  let syncDepStartNav = -1;
  let syncExBulkNav = -1;
  let syncExStartNav = -1;
  // Pre-compute which existing members have changes
  const existingChanged = syncStatus?.existing.filter((pair) =>
    pair.current &&
    (pair.sync.voornaam !== pair.current.voornaam ||
      pair.sync.achternaam !== pair.current.achternaam ||
      pair.sync.tussenvoegsel !== pair.current.tussenvoegsel),
  ) ?? [];
  if (syncStatus) {
    if (syncStatus.new.length > 0) {
      syncNewBulkNav = syncRowCount++;
      syncNewStartNav = syncRowCount;
      syncRowCount += syncStatus.new.length;
    }
    if (syncStatus.pending.length > 0) {
      syncRowCount += syncStatus.pending.length;
    }
    if (syncStatus.departed.length > 0) {
      syncDepBulkNav = syncRowCount++;
      syncDepStartNav = syncRowCount;
      syncRowCount += syncStatus.departed.length;
    }
    if (existingChanged.length > 0) {
      syncExBulkNav = syncRowCount++;
      syncExStartNav = syncRowCount;
      syncRowCount += existingChanged.length;
    }
  }

  const rowCount =
    activeTab === "users"
      ? activeUsers.length
      : activeTab === "registrations"
        ? newUsers.length
        : syncRowCount;

  const handleRefresh = useCallback(() => {
    if (activeTab === "users") loadUsers();
    else if (activeTab === "registrations") loadNewUsers();
    else if (activeTab === "sync") handleComputeStatus();
  }, [activeTab]);

  const handleToggleHelp = useCallback(() => {
    setShowHelp((prev) => !prev);
  }, []);

  const handleCancel = useCallback(() => {
    if (confirmingRemoval) {
      setConfirmingRemoval(null);
      return true;
    }
    if (addingPermUser) {
      setAddingPermUser(null);
      return true;
    }
    return false;
  }, [addingPermUser, confirmingRemoval]);

  useAdminKeyboard({
    tabs: TABS,
    activeTab,
    setActiveTab: setActiveTab as (tab: string) => void,
    highlightedRow,
    setHighlightedRow,
    highlightedCol,
    setHighlightedCol,
    rowCount,
    onRefresh: handleRefresh,
    showHelp,
    onToggleHelp: handleToggleHelp,
    onCancel: handleCancel,
  });

  // Auto-focus the permission select when the add form opens
  useEffect(() => {
    if (!addingPermUser) return;
    requestAnimationFrame(() => {
      const select = document.querySelector(
        ".admin-perm-select",
      ) as HTMLSelectElement | null;
      if (select) select.focus();
    });
  }, [addingPermUser]);

  // Load users + newusers together (newusers needed to filter inactive list)
  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === "users" || activeTab === "registrations") {
      loadUsers();
      loadNewUsers();
    }
  }, [isAdmin, activeTab]);

  return (
    <div className="admin-container">
      {showHelp && (
        <HelpOverlay isAdmin={!!isAdmin} onClose={handleToggleHelp} />
      )}

      {authLoading ? (
        <>
          <PageTitle title="Admin Dashboard" />
          <div className="admin-loading">Checking permissions...</div>
        </>
      ) : !isAdmin ? (
        <div className="admin-not-authorized">
          <h2>Not Authorized</h2>
          <p>You need admin permissions to access this page.</p>
          {import.meta.env.DEV && (
            <p>
              Log in as admin via the <a href="/flow-test">flow-test page</a>,
              or press <code>\s</code> to refresh the admin session.
            </p>
          )}
          <p className="admin-help-hint">Press ? for keyboard shortcuts</p>
        </div>
      ) : (
        <>
          <PageTitle title="Admin Dashboard" />

          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`admin-tab ${activeTab === "registrations" ? "active" : ""}`}
              onClick={() => setActiveTab("registrations")}
            >
              Registrations
            </button>
            <button
              className={`admin-tab ${activeTab === "sync" ? "active" : ""}`}
              onClick={() => setActiveTab("sync")}
            >
              Sync
            </button>
          </div>

          {status && (
            <div
              className={`admin-status ${
                status.startsWith("Error")
                  ? "admin-status-error"
                  : "admin-status-success"
              }`}
            >
              {status}
            </div>
          )}

          {/* Registrations Tab */}
          {activeTab === "registrations" && (
            <>
              <div className="admin-header">
                <h2>User Registration Requests</h2>
                <button
                  onClick={loadNewUsers}
                  disabled={loading}
                  className="admin-button admin-button-refresh admin-button-icon"
                  title="Refresh (r)"
                >
                  <RefreshIcon />
                </button>
              </div>

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
                        <th>Approved</th>
                        <th>Account</th>
                        <th>Emails Sent</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newUsers.map((user, idx) => (
                        <tr key={user.email} className={highlightedRow === idx ? "admin-nav-highlight" : ""}>
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
                              {user.accepted ? "Yes" : "No"}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`admin-status-badge ${
                                user.is_registered
                                  ? "admin-status-badge-accepted"
                                  : user.has_signup_token
                                    ? "admin-status-badge-warning"
                                    : "admin-status-badge-pending"
                              }`}
                            >
                              {user.is_registered
                                ? "Created"
                                : user.has_signup_token
                                  ? "Pending"
                                  : "None"}
                            </span>
                          </td>
                          <td>{user.email_send_count}</td>
                          <td>
                            {!user.accepted ? (
                              <button
                                onClick={() => handleAcceptUser(user.email)}
                                disabled={processingEmail === user.email}
                                className="admin-button admin-button-accept"
                              >
                                {processingEmail === user.email
                                  ? "Processing..."
                                  : "Approve"}
                              </button>
                            ) : !user.has_signup_token ? (
                              <button
                                onClick={() => handleResendEmail(user.email)}
                                disabled={processingEmail === user.email}
                                className="admin-button admin-button-accept"
                              >
                                {processingEmail === user.email
                                  ? "Sending..."
                                  : "Resend Invite"}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleResendEmail(user.email)}
                                disabled={processingEmail === user.email}
                                className="admin-button admin-button-resend"
                              >
                                {processingEmail === user.email
                                  ? "Sending..."
                                  : "Resend Code"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <>
              <div className="admin-header">
                <h2>Users</h2>
                <button
                  onClick={loadUsers}
                  disabled={usersLoading}
                  className="admin-button admin-button-refresh admin-button-icon"
                  title="Refresh (r)"
                >
                  <RefreshIcon />
                </button>
              </div>

              {usersLoading && users.length === 0 ? (
                <div className="admin-loading">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="admin-empty">No users found</div>
              ) : (
                <>
                  {/* Active Members */}
                  <div className="admin-sync-group">
                    <h3>
                      Members{" "}
                      <span className="admin-sync-count">
                        ({activeUsers.length})
                      </span>
                    </h3>
                    {activeUsers.length > 0 ? (
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
                            {activeUsers.map((user, idx) => (
                              <tr
                                key={user.user_id}
                                className={highlightedRow === idx ? "admin-nav-highlight" : ""}
                              >
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
                                        {perm !== "admin" && perm !== "member" &&
                                          (confirmingRemoval?.userId === user.user_id &&
                                          confirmingRemoval?.perm === perm ? (
                                            <span className="admin-perm-confirm">
                                              <button
                                                className="admin-perm-confirm-yes"
                                                onClick={() => {
                                                  handleRemovePermission(user.user_id, perm);
                                                  setConfirmingRemoval(null);
                                                }}
                                              >
                                                Yes
                                              </button>
                                              <button
                                                className="admin-perm-confirm-no"
                                                ref={(el) => el?.focus()}
                                                onClick={() => setConfirmingRemoval(null)}
                                                onKeyDown={(e) => {
                                                  if (e.key === "Escape") {
                                                    e.preventDefault();
                                                    setConfirmingRemoval(null);
                                                  }
                                                }}
                                              >
                                                No
                                              </button>
                                            </span>
                                          ) : (
                                            <button
                                              className="admin-perm-remove"
                                              style={{
                                                color: getPermissionStyle(perm).color,
                                              }}
                                              onClick={() =>
                                                setConfirmingRemoval({
                                                  userId: user.user_id,
                                                  perm,
                                                })
                                              }
                                              title={`Remove ${getPermissionDisplay(perm)}`}
                                            >
                                              ×
                                            </button>
                                          ))}
                                      </span>
                                    ))}
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
                                      onSubmit={(e) =>
                                        handleAddPermission(e, user.user_id)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                          e.preventDefault();
                                          setAddingPermUser(null);
                                        }
                                      }}
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
                    ) : (
                      <div className="admin-empty">No active members</div>
                    )}
                  </div>

                  {/* Inactive / Former Members */}
                  <div className="admin-sync-group">
                    <h3>
                      Inactive{" "}
                      <span className="admin-sync-count">
                        ({inactiveUsers.length})
                      </span>
                    </h3>
                    {inactiveUsers.length > 0 ? (
                      <>
                        <div className="admin-table-container">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inactiveUsers.map((user) => (
                                <tr key={user.user_id}>
                                  <td>
                                    {user.firstname} {user.lastname}
                                    <div className="admin-user-email">{user.email}</div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="admin-inactive-hint">
                          Re-add inactive users as members via the Sync tab.
                        </p>
                      </>
                    ) : (
                      <div className="admin-empty">No inactive users</div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* Sync Tab */}
          {activeTab === "sync" && (
            <>
              <div className="admin-sync-section">
                <div className="admin-header">
                  <h2>Import CSV</h2>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={syncLoading}
                  className="admin-file-input"
                />
              </div>

              <div className="admin-sync-section">
                <div className="admin-header">
                  <h2>Sync Status</h2>
                  <button
                    onClick={handleComputeStatus}
                    disabled={syncLoading}
                    className="admin-button admin-button-refresh admin-button-icon"
                    title="Compute Status (r)"
                  >
                    <RefreshIcon />
                  </button>
                </div>

                {syncStatus && (
                  <>
                    {/* New members */}
                    <div className="admin-sync-group">
                      <h3>
                        New Members{" "}
                        <span className="admin-sync-count">
                          ({syncStatus.new.length})
                        </span>
                      </h3>
                      {syncStatus.new.length > 0 && (
                        <>
                          <div className={`admin-nav-item ${highlightedRow === syncNewBulkNav ? "admin-nav-highlight" : ""}`}>
                            <button
                              onClick={() => handleAcceptNew()}
                              disabled={syncLoading}
                              className="admin-button admin-button-accept"
                            >
                              Accept All New
                            </button>
                          </div>
                          <div className="admin-table-container">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Email</th>
                                  <th>Name</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {syncStatus.new.map((entry, idx) => (
                                  <tr key={entry.email} className={highlightedRow === syncNewStartNav + idx ? "admin-nav-highlight" : ""}>
                                    <td>{entry.email}</td>
                                    <td>
                                      {entry.voornaam}{" "}
                                      {entry.tussenvoegsel
                                        ? `${entry.tussenvoegsel} `
                                        : ""}
                                      {entry.achternaam}
                                    </td>
                                    <td>
                                      <button
                                        onClick={() =>
                                          handleAcceptNew(entry.email)
                                        }
                                        disabled={syncLoading}
                                        className="admin-button admin-button-accept"
                                      >
                                        Accept
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                      {syncStatus.new.length === 0 && (
                        <div className="admin-empty">No new members</div>
                      )}
                    </div>

                    {/* Pending members (accepted, awaiting signup) */}
                    <div className="admin-sync-group">
                      <h3>
                        Pending Signup{" "}
                        <span className="admin-sync-count">
                          ({syncStatus.pending.length})
                        </span>
                      </h3>
                      {syncStatus.pending.length > 0 && (
                        <div className="admin-table-container">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {syncStatus.pending.map((email) => (
                                <tr key={email}>
                                  <td>{email}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {syncStatus.pending.length === 0 && (
                        <div className="admin-empty">No pending signups</div>
                      )}
                    </div>

                    {/* Departed members */}
                    <div className="admin-sync-group">
                      <h3>
                        Departed Members{" "}
                        <span className="admin-sync-count">
                          ({syncStatus.departed.length})
                        </span>
                      </h3>
                      {syncStatus.departed.length > 0 && (
                        <>
                          <div className={`admin-nav-item ${highlightedRow === syncDepBulkNav ? "admin-nav-highlight" : ""}`}>
                            <button
                              onClick={() => handleRemoveDeparted()}
                              disabled={syncLoading}
                              className="admin-button admin-button-danger"
                            >
                              Remove All Departed
                            </button>
                          </div>
                          <div className="admin-table-container">
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Email</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {syncStatus.departed.map((email, idx) => (
                                  <tr key={email} className={highlightedRow === syncDepStartNav + idx ? "admin-nav-highlight" : ""}>
                                    <td>{email}</td>
                                    <td>
                                      <button
                                        onClick={() =>
                                          handleRemoveDeparted(email)
                                        }
                                        disabled={syncLoading}
                                        className="admin-button admin-button-danger"
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                      {syncStatus.departed.length === 0 && (
                        <div className="admin-empty">No departed members</div>
                      )}
                    </div>

                    {/* Existing members */}
                    <div className="admin-sync-group">
                      <h3>
                        Existing Members{" "}
                        <span className="admin-sync-count">
                          ({syncStatus.existing.length})
                        </span>
                        {existingChanged.length > 0 && (
                          <span className="admin-changes">
                            {existingChanged.length} changed
                          </span>
                        )}
                      </h3>
                      {syncStatus.existing.length > 0 ? (
                        existingChanged.length > 0 ? (
                          <>
                            <div className={`admin-nav-item ${highlightedRow === syncExBulkNav ? "admin-nav-highlight" : ""}`}>
                              <button
                                onClick={() => handleUpdateExisting()}
                                disabled={syncLoading}
                                className="admin-button admin-button-refresh"
                              >
                                Update All Changed
                              </button>
                            </div>
                            <div className="admin-table-container">
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th>Email</th>
                                    <th>Sync Name</th>
                                    <th>Current Name</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {existingChanged.map((pair, idx) => (
                                    <tr key={pair.sync.email} className={highlightedRow === syncExStartNav + idx ? "admin-nav-highlight" : ""}>
                                      <td>{pair.sync.email}</td>
                                      <td>
                                        {pair.sync.voornaam}{" "}
                                        {pair.sync.tussenvoegsel
                                          ? `${pair.sync.tussenvoegsel} `
                                          : ""}
                                        {pair.sync.achternaam}
                                      </td>
                                      <td>
                                        {pair.current!.voornaam}{" "}
                                        {pair.current!.tussenvoegsel
                                          ? `${pair.current!.tussenvoegsel} `
                                          : ""}
                                        {pair.current!.achternaam}
                                      </td>
                                      <td>
                                        <button
                                          onClick={() =>
                                            handleUpdateExisting(pair.sync.email)
                                          }
                                          disabled={syncLoading}
                                          className="admin-button admin-button-refresh"
                                        >
                                          Update
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <div className="admin-empty">
                            All {syncStatus.existing.length} existing members are up to date
                          </div>
                        )
                      ) : (
                        <div className="admin-empty">No existing members</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
