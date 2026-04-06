import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type SyntheticEvent,
  type ChangeEvent,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
  AdminRegistrationRecord,
  SyncStatus,
  SyncReviewItem,
  SyncFieldDiff,
  SyncNewRegistrationItem,
  SyncRegistrationItem,
  SyncUserItem,
  SyncDepartedItem,
  SyncDataChangeItem,
} from "$functions/backend.ts";
import {
  useSessionInfo,
  useSecondarySessionInfo,
  useRegistrations,
  useUsers,
  useSyncStatus,
  useAcceptRegistration,
  useAddPermission,
  useRemovePermission,
  useImportSync,
  useResolveSyncMatch,
  useCompleteSync,
  useResendRegistrationInvite,
  registrationsOptions,
  usersOptions,
  syncStatusOptions,
} from "$functions/query.ts";
import PageTitle from "$components/PageTitle.tsx";
import { useAdminKeyboard } from "./useAdminKeyboard.ts";
import "./admin.css";

// Permission display configuration
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

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function RegistrationStatusBadge({ reg }: { reg: AdminRegistrationRecord }) {
  if (reg.accepted && reg.signup_active) {
    return (
      <span className="admin-tooltip">
        <span className="admin-status-badge admin-status-badge-warning">Pending</span>
        <span className="admin-tooltip-text">
          Accepted and signup email sent. Awaiting account creation.
        </span>
      </span>
    );
  }
  if (reg.accepted) {
    return (
      <span className="admin-tooltip">
        <span className="admin-status-badge admin-status-badge-info">Invited</span>
        <span className="admin-tooltip-text">
          Accepted. The user will receive an invite email with a signup link.
        </span>
      </span>
    );
  }
  return (
    <span className="admin-tooltip">
      <span className="admin-status-badge admin-status-badge-muted">&mdash;</span>
      <span className="admin-tooltip-text">
        Not yet approved. Approve first to send an invite email.
      </span>
    </span>
  );
}

type AdminTab = "users" | "registrations" | "sync";

export default function Admin() {
  const queryClient = useQueryClient();
  const { data: session, isLoading: sessionLoading } = useSessionInfo();
  const { data: secondarySession, isLoading: secondaryLoading } =
    useSecondarySessionInfo();

  const [activeTab, setActiveTabRaw] = useState<AdminTab>("users");
  const [status, setStatus] = useState("");
  const [highlightedRow, setHighlightedRow] = useState(-1);
  const [highlightedCol, setHighlightedCol] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setActiveTab = useCallback((tab: AdminTab) => {
    setActiveTabRaw(tab);
    setHighlightedRow(-1);
    setHighlightedCol(0);
  }, []);

  // Local UI state
  const [addingPermUser, setAddingPermUser] = useState<string | null>(null);
  const [selectedPermForUser, setSelectedPermForUser] = useState<string>("");
  const [confirmingRemoval, setConfirmingRemoval] = useState<{
    userId: string;
    perm: string;
  } | null>(null);

  const isAdmin =
    session?.user.permissions.includes("admin") ||
    secondarySession?.user.permissions.includes("admin");
  const authLoading = sessionLoading || secondaryLoading;

  // --- Queries ---

  const needsData = !!isAdmin && (activeTab === "users" || activeTab === "registrations");
  const regsQuery = useRegistrations(needsData);
  const usersQuery = useUsers(needsData);
  const syncStatusQuery = useSyncStatus(!!isAdmin && activeTab === "sync");

  const registrations: AdminRegistrationRecord[] = regsQuery.data ?? [];
  const { users = [], perms: allPerms = [] } = usersQuery.data ?? {};
  const availablePerms = allPerms.filter(
    (p) => p !== "admin" && p !== "member",
  );
  const syncStatus: SyncStatus | null = syncStatusQuery.data ?? null;
  const { refetch: refetchSyncStatus } = syncStatusQuery;

  const addingUser = addingPermUser
    ? users.find((u) => u.user_id === addingPermUser)
    : null;
  const addablePerms = addingUser
    ? availablePerms.filter((p) => !addingUser.permissions.includes(p))
    : [];
  const effectivePerm =
    addablePerms.includes(selectedPermForUser)
      ? selectedPermForUser
      : addablePerms[0] || "";

  // --- Mutations ---

  const acceptRegMut = useAcceptRegistration();
  const resendInviteMut = useResendRegistrationInvite();
  const addPermMut = useAddPermission();
  const removePermMut = useRemovePermission();
  const importSyncMut = useImportSync();
  const resolveSyncMut = useResolveSyncMatch();
  const completeSyncMut = useCompleteSync();

  const processingRegId =
    acceptRegMut.isPending ? acceptRegMut.variables : null;

  const loading = regsQuery.isFetching;
  const usersLoading = usersQuery.isFetching;
  const syncLoading = syncStatusQuery.isFetching ||
    importSyncMut.isPending ||
    resolveSyncMut.isPending ||
    completeSyncMut.isPending;

  // --- Registration handlers ---

  const handleAcceptRegistration = (registrationId: string) => {
    setStatus("");
    acceptRegMut.mutate(registrationId, {
      onSuccess: () => setStatus("Registration accepted, invite sent"),
      onError: (error) => setStatus(`Error: ${formatError(error)}`),
    });
  };

  const handleResendInvite = (registrationId: string) => {
    setStatus("");
    resendInviteMut.mutate(registrationId, {
      onSuccess: (result) => setStatus(`Invite resent to ${result.email}`),
      onError: (error) => setStatus(`Error: ${formatError(error)}`),
    });
  };

  // --- Permissions handlers ---

  const handleAddPermission = (e: SyntheticEvent, userId: string) => {
    e.preventDefault();
    if (!effectivePerm) return;
    setStatus("");
    addPermMut.mutate(
      { userId, permission: effectivePerm },
      {
        onSuccess: () => {
          setStatus(`Added ${getPermissionDisplay(effectivePerm)} permission`);
          setAddingPermUser(null);
        },
        onError: (error) => setStatus(`Error: ${formatError(error)}`),
      },
    );
  };

  const handleRemovePermission = (userId: string, permission: string) => {
    if (permission === "admin") return;
    setStatus("");
    removePermMut.mutate(
      { userId, permission },
      {
        onSuccess: () =>
          setStatus(`Removed ${getPermissionDisplay(permission)} permission`),
        onError: (error) => setStatus(`Error: ${formatError(error)}`),
      },
    );
  };

  const handlePermSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPermForUser(e.target.value);
  };

  // --- Sync handlers ---

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (syncStatus?.sync_in_progress) {
      const confirmed = window.confirm(
        "A sync session is already in progress. Importing a new file will discard all recorded decisions. Continue?",
      );
      if (!confirmed) {
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    setStatus("");
    const content = await file.text();
    const counter = syncStatus?.sync_state_counter;
    importSyncMut.mutate(
      counter !== undefined ? { csvContent: content, syncStateCounter: counter } : { csvContent: content },
      {
        onSuccess: (result) => {
          setStatus(`Imported ${result.imported} member(s) from CSV`);
          queryClient.invalidateQueries({ queryKey: syncStatusOptions.queryKey });
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: (error) => setStatus(`Error: ${formatError(error)}`),
      },
    );
  };

  const handleResolveMatch = (
    bondsnummer: number,
    kind: string,
    subjectId: string | null,
  ) => {
    setStatus("");
    const counter = syncStatus?.sync_state_counter;
    resolveSyncMut.mutate(
      counter !== undefined
        ? { bondsnummer, kind, subjectId, syncStateCounter: counter }
        : { bondsnummer, kind, subjectId },
      {
        onSuccess: (result) => {
          setStatus(result.message);
          refetchSyncStatus();
        },
        onError: (error) => setStatus(`Error: ${formatError(error)}`),
      },
    );
  };

  const handleCompleteSync = () => {
    setStatus("");
    completeSyncMut.mutate(syncStatus?.sync_state_counter, {
      onSuccess: (result) => {
        const parts = [
          `${result.volta_rows_applied} volta rows applied`,
          `${result.registrations_created} registrations created`,
          `${result.registrations_accepted} accepted`,
          `${result.registrations_updated} updated`,
          `${result.users_refreshed} users refreshed`,
          `${result.users_departed} departed`,
        ];
        setStatus(`Sync complete: ${parts.join(", ")}`);
        refetchSyncStatus();
      },
      onError: (error) => setStatus(`Error: ${formatError(error)}`),
    });
  };

  // --- Keyboard navigation ---

  const TABS: AdminTab[] = ["users", "registrations", "sync"];

  const sortByName = (a: { firstname: string; lastname: string }, b: { firstname: string; lastname: string }) => {
    const aName = `${a.firstname} ${a.lastname}`.toLowerCase();
    const bName = `${b.firstname} ${b.lastname}`.toLowerCase();
    return aName.localeCompare(bName);
  };
  const activeUsers = users.filter((u) => u.permissions.length > 0).sort(sortByName);
  const inactiveUsers = users
    .filter((u) => u.permissions.length === 0)
    .sort(sortByName);

  // Sync navigation indices
  let syncRowCount = 0;
  if (syncStatus) {
    syncRowCount =
      syncStatus.review_required.length +
      syncStatus.registrations_created.length +
      syncStatus.registrations_accepted.length +
      syncStatus.pending_registrations_updated.length +
      syncStatus.live_users_enriched.length +
      syncStatus.departed_users.length +
      1; // complete sync button
  }

  const rowCount =
    activeTab === "users"
      ? activeUsers.length
      : activeTab === "registrations"
        ? registrations.length
        : syncRowCount;

  const handleRefresh = useCallback(() => {
    if (activeTab === "users") {
      queryClient.invalidateQueries({ queryKey: usersOptions.queryKey });
    } else if (activeTab === "registrations") {
      queryClient.invalidateQueries({ queryKey: registrationsOptions.queryKey });
    } else if (activeTab === "sync") {
      refetchSyncStatus();
    }
  }, [activeTab, queryClient, refetchSyncStatus]);

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

  useEffect(() => {
    if (!addingPermUser) return;
    requestAnimationFrame(() => {
      const select = document.querySelector(
        ".admin-perm-select",
      ) as HTMLSelectElement | null;
      if (select) select.focus();
    });
  }, [addingPermUser]);

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
                <h2>Pending Registrations</h2>
                <button
                  onClick={() => regsQuery.refetch()}
                  disabled={loading}
                  className="admin-button admin-button-refresh admin-button-icon"
                  title="Refresh (r)"
                >
                  <RefreshIcon />
                </button>
              </div>

              {loading && registrations.length === 0 ? (
                <div className="admin-loading">Loading...</div>
              ) : registrations.length === 0 ? (
                <div className="admin-empty">No registration requests found</div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table admin-cols-registrations">
                    <colgroup><col /><col /><col /><col /><col /><col /></colgroup>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Accepted</th>
                        <th>Status</th>
                        <th>Bondsnummer</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg, idx) => (
                        <tr key={reg.registration_id} className={highlightedRow === idx ? "admin-nav-highlight" : ""}>
                          <td>{reg.email}</td>
                          <td>{reg.firstname} {reg.lastname}</td>
                          <td>
                            <span
                              className={`admin-status-badge ${
                                reg.accepted
                                  ? "admin-status-badge-accepted"
                                  : "admin-status-badge-pending"
                              }`}
                            >
                              {reg.accepted ? "Yes" : "No"}
                            </span>
                          </td>
                          <td>
                            <RegistrationStatusBadge reg={reg} />
                          </td>
                          <td>{reg.bondsnummer ?? "\u2014"}</td>
                          <td>
                            {!reg.accepted ? (
                              <button
                                onClick={() => handleAcceptRegistration(reg.registration_id)}
                                disabled={processingRegId === reg.registration_id}
                                className="admin-button admin-button-accept"
                              >
                                {processingRegId === reg.registration_id
                                  ? "Processing..."
                                  : "Approve"}
                              </button>
                            ) : (
                              reg.available_actions?.some((a) => a.kind === "resend_registration_invite") && (
                                <button
                                  onClick={() => handleResendInvite(reg.registration_id)}
                                  disabled={resendInviteMut.isPending}
                                  className="admin-button admin-button-refresh"
                                >
                                  {resendInviteMut.isPending ? "Sending..." : "Resend Invite"}
                                </button>
                              )
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
                  onClick={() => usersQuery.refetch()}
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
                        <table className="admin-table admin-cols-members">
                          <colgroup><col /><col /><col /><col /></colgroup>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Bondsnummer</th>
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
                                <td>{user.bondsnummer ?? "\u2014"}</td>
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
                                              &times;
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
                                      onClick={() => {
                                        setSelectedPermForUser("");
                                        setAddingPermUser(user.user_id);
                                      }}
                                      disabled={
                                        availablePerms.filter(
                                          (p) => !user.permissions.includes(p),
                                        ).length === 0
                                      }
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
                                        value={effectivePerm}
                                        onChange={handlePermSelectChange}
                                        className="admin-perm-select"
                                      >
                                        {addablePerms.map((perm) => (
                                          <option key={perm} value={perm}>
                                            {getPermissionDisplay(perm)}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        type="submit"
                                        className="admin-button admin-button-accept"
                                        disabled={!effectivePerm}
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
                          <table className="admin-table admin-cols-inactive">
                            <colgroup><col /><col /></colgroup>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Bondsnummer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inactiveUsers.map((user) => (
                                <tr key={user.user_id}>
                                  <td>
                                    {user.firstname} {user.lastname}
                                    <div className="admin-user-email">{user.email}</div>
                                  </td>
                                  <td>{user.bondsnummer ?? "\u2014"}</td>
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
                  ref={fileInputRef}
                />
                {syncStatus?.sync_in_progress && (
                  <p className="admin-sync-import-hint">
                    A sync session is in progress. Importing a new file will replace it.
                  </p>
                )}
              </div>

              <div className="admin-sync-section">
                <div className="admin-header">
                  <h2>Sync status</h2>
                  <button
                    onClick={() => refetchSyncStatus()}
                    disabled={syncLoading}
                    className="admin-button admin-button-refresh admin-button-icon"
                    title="Refresh (r)"
                  >
                    <RefreshIcon />
                  </button>
                </div>

                {syncStatusQuery.isLoading && (
                  <div className="admin-loading">Loading sync status...</div>
                )}

                {syncStatus && (
                  <>
                    {/* Sync session info */}
                    <div className="admin-sync-group">
                      <div className="admin-sync-info">
                        {syncStatus.sync_in_progress ? (
                          <span className="admin-status-badge admin-status-badge-warning">Sync in progress</span>
                        ) : (
                          <span className="admin-status-badge admin-status-badge-muted">No active sync</span>
                        )}
                      </div>
                    </div>

                    {syncStatus.sync_in_progress && (
                      <>
                        {/* Review required */}
                        <div className="admin-sync-group">
                          <h3>
                            Review required{" "}
                            <span className="admin-sync-count">
                              ({syncStatus.review_required.length})
                            </span>
                          </h3>
                          {syncStatus.review_required.length > 0 ? (
                            <div className="admin-review-list">
                              {syncStatus.review_required.map((item) => (
                                <SyncReviewCard
                                  key={item.bondsnummer}
                                  item={item}
                                  disabled={syncLoading}
                                  onResolve={handleResolveMatch}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="admin-empty">No items need review</div>
                          )}
                        </div>

                        {/* New registrations */}
                        <SyncNewRegistrations items={syncStatus.registrations_created} />

                        {/* Matched registrations */}
                        <SyncRegistrationGroup
                          title="Matched registrations"
                          items={syncStatus.registrations_accepted}
                        />

                        {/* Existing registrations */}
                        <SyncRegistrationGroup
                          title="Existing registrations"
                          items={syncStatus.pending_registrations_updated}
                        />

                        {/* Current members */}
                        <SyncUserGroup
                          title="Current members"
                          items={syncStatus.live_users_enriched}
                        />

                        {/* Departed members */}
                        <SyncDepartedGroup items={syncStatus.departed_users} />

                        {/* Import data overview */}
                        <SyncDataChanges items={syncStatus.volta_data_changes} />

                        {/* Complete sync */}
                        <div className="admin-sync-group admin-sync-complete">
                          <button
                            onClick={handleCompleteSync}
                            disabled={syncLoading || !syncStatus.can_complete}
                            className="admin-button admin-button-accept"
                            title={syncStatus.can_complete ? "Apply all pending changes" : "Resolve all review items first"}
                          >
                            Complete sync
                          </button>
                          {!syncStatus.can_complete && (
                            <span className="admin-sync-hint">
                              Resolve all review items before completing
                            </span>
                          )}
                        </div>
                      </>
                    )}
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

// --- Sync detail components ---

function FieldDiffs({ diffs }: { diffs: SyncFieldDiff[] }) {
  if (diffs.length === 0) return null;
  return (
    <div className="admin-field-diffs">
      {diffs.map((d) => (
        <div key={d.field} className="admin-field-diff">
          <span className="admin-field-diff-label">{d.field}:</span>{" "}
          <span className="admin-field-diff-old">{d.current || "\u2014"}</span>
          {" \u2192 "}
          <span className="admin-field-diff-new">{d.incoming || "\u2014"}</span>
        </div>
      ))}
    </div>
  );
}

function SyncNewRegistrations({ items }: { items: SyncNewRegistrationItem[] }) {
  return (
    <div className="admin-sync-group">
      <h3>
        New registrations{" "}
        <span className="admin-sync-count">({items.length})</span>
      </h3>
      {items.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bondsnummer</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.bondsnummer}>
                  <td>{item.bondsnummer}</td>
                  <td>{item.firstname} {item.lastname}</td>
                  <td>{item.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">None</div>
      )}
    </div>
  );
}

function SyncRegistrationGroup({
  title,
  items,
}: {
  title: string;
  items: SyncRegistrationItem[];
}) {
  return (
    <div className="admin-sync-group">
      <h3>
        {title}{" "}
        <span className="admin-sync-count">({items.length})</span>
      </h3>
      {items.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bondsnummer</th>
                <th>Name</th>
                <th>Email</th>
                <th>Changes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.bondsnummer}>
                  <td>{item.bondsnummer}</td>
                  <td>
                    {item.registration.firstname} {item.registration.lastname}
                    <div className="admin-user-email">{item.registration.email}</div>
                  </td>
                  <td>
                    {item.email_will_change ? (
                      <span className="admin-status-badge admin-status-badge-warning">
                        Email will change
                      </span>
                    ) : (
                      "\u2014"
                    )}
                  </td>
                  <td>
                    {item.field_diffs.length > 0 ? (
                      <FieldDiffs diffs={item.field_diffs} />
                    ) : (
                      <span className="admin-sync-no-changes">Up to date</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">None</div>
      )}
    </div>
  );
}

function SyncUserGroup({
  title,
  items,
}: {
  title: string;
  items: SyncUserItem[];
}) {
  const withChanges = items.filter((item) => item.field_diffs.length > 0);

  return (
    <div className="admin-sync-group">
      <h3>
        {title}{" "}
        <span className="admin-sync-count">({items.length})</span>
        {withChanges.length > 0 && (
          <span className="admin-changes">{withChanges.length} with changes</span>
        )}
      </h3>
      {items.length > 0 ? (
        <>
          {withChanges.length > 0 && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Bondsnummer</th>
                    <th>Name</th>
                    <th>Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {withChanges.map((item) => (
                    <tr key={item.bondsnummer}>
                      <td>{item.bondsnummer}</td>
                      <td>
                        {item.user.firstname} {item.user.lastname}
                        <div className="admin-user-email">{item.user.email}</div>
                      </td>
                      <td><FieldDiffs diffs={item.field_diffs} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {withChanges.length === 0 && (
            <div className="admin-empty">
              All {items.length} members are up to date
            </div>
          )}
        </>
      ) : (
        <div className="admin-empty">None</div>
      )}
    </div>
  );
}

function SyncDepartedGroup({ items }: { items: SyncDepartedItem[] }) {
  return (
    <div className="admin-sync-group">
      <h3>
        Departed members{" "}
        <span className="admin-sync-count">({items.length})</span>
      </h3>
      {items.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Bondsnummer</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.user_id}>
                  <td>{d.firstname} {d.lastname}</td>
                  <td>{d.email}</td>
                  <td>{d.bondsnummer ?? "\u2014"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">None</div>
      )}
    </div>
  );
}

function SyncDataChanges({ items }: { items: SyncDataChangeItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const withChanges = items.filter((item) => item.field_diffs.length > 0);
  const removals = items.filter((item) => item.incoming_volta_data == null);

  return (
    <div className="admin-sync-group">
      <h3>
        Import data overview{" "}
        <span className="admin-sync-count">({items.length})</span>
        {(withChanges.length > 0 || removals.length > 0) && (
          <span className="admin-changes">
            {withChanges.length > 0 && `${withChanges.length} changed`}
            {withChanges.length > 0 && removals.length > 0 && ", "}
            {removals.length > 0 && `${removals.length} removed`}
          </span>
        )}
        {items.length > 0 && (
          <button
            className="admin-button admin-button-add"
            onClick={() => setExpanded(!expanded)}
            style={{ marginLeft: "0.5em" }}
          >
            {expanded ? "Hide" : "Details"}
          </button>
        )}
      </h3>
      {expanded && items.length > 0 && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bondsnummer</th>
                <th>Status</th>
                <th>Changes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isRemoval = item.incoming_volta_data == null;
                const isNew = item.current_volta_data == null && !isRemoval;
                return (
                  <tr key={item.bondsnummer}>
                    <td>{item.bondsnummer}</td>
                    <td>
                      {isRemoval && (
                        <span className="admin-status-badge admin-status-badge-pending">Removed</span>
                      )}
                      {isNew && (
                        <span className="admin-status-badge admin-status-badge-accepted">New</span>
                      )}
                      {!isRemoval && !isNew && item.field_diffs.length === 0 && "\u2014"}
                      {!isRemoval && !isNew && item.field_diffs.length > 0 && (
                        <span className="admin-status-badge admin-status-badge-warning">Changed</span>
                      )}
                    </td>
                    <td>
                      {item.field_diffs.length > 0 ? (
                        <FieldDiffs diffs={item.field_diffs} />
                      ) : (
                        "\u2014"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {items.length === 0 && (
        <div className="admin-empty">No import data</div>
      )}
    </div>
  );
}

// --- Sync Review Card ---

function SyncReviewCard({
  item,
  disabled,
  onResolve,
}: {
  item: SyncReviewItem;
  disabled: boolean;
  onResolve: (bondsnummer: number, kind: string, subjectId: string | null) => void;
}) {
  const voltaEmail = String(item.incoming_volta_data["email"] ?? "");
  const voltaName = [
    String(item.incoming_volta_data["voornaam"] ?? ""),
    String(item.incoming_volta_data["tussenvoegsel"] ?? ""),
    String(item.incoming_volta_data["achternaam"] ?? ""),
  ].filter(Boolean).join(" ");

  return (
    <div className="admin-review-card">
      <div className="admin-review-card-header">
        <span className="admin-review-card-bn">#{item.bondsnummer}</span>
        <span className="admin-review-card-name">{voltaName}</span>
        <span className="admin-review-card-email">{voltaEmail}</span>
      </div>

      {item.candidates.length === 0 ? (
        <div className="admin-review-card-body">
          <span className="admin-review-card-none">No matching registrations or users found</span>
          <button
            className="admin-button admin-button-accept"
            disabled={disabled}
            onClick={() => onResolve(item.bondsnummer, "none", null)}
          >
            Create new registration
          </button>
        </div>
      ) : (
        <div className="admin-review-card-body">
          {item.candidates.map((c) => (
            <div key={`${c.kind}-${c.subject_id}`} className="admin-review-candidate">
              <div className="admin-review-candidate-info">
                <span className="admin-review-candidate-type">{c.kind}</span>
                <span className="admin-review-candidate-name">{c.display_name}</span>
                <span className="admin-review-candidate-email">{c.email}</span>
                <span className="admin-review-candidate-reasons">
                  {c.reasons.map((r) => r.replace("_", " ")).join(", ")}
                </span>
              </div>
              <button
                className="admin-button admin-button-accept"
                disabled={disabled}
                onClick={() => onResolve(item.bondsnummer, c.kind, c.subject_id)}
              >
                Link
              </button>
            </div>
          ))}
          <div className="admin-review-candidate admin-review-candidate-none">
            <span className="admin-review-candidate-info">None of the above</span>
            <button
              className="admin-button admin-button-danger"
              disabled={disabled}
              onClick={() => onResolve(item.bondsnummer, "none", null)}
            >
              Create new
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
