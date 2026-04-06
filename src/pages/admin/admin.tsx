import {
  useState,
  useEffect,
  useCallback,
  type SyntheticEvent,
  type ChangeEvent,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
  AdminRegistrationRecord,
  SyncStatus,
  SyncReviewItem,
  VoltaFieldDiff,
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
  useRemoveDeparted,
  useUpdateExisting,
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

function FieldDiffs({ diffs }: { diffs: VoltaFieldDiff[] }) {
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
  const syncStatusQuery = useSyncStatus(false);

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
  const addPermMut = useAddPermission();
  const removePermMut = useRemovePermission();
  const importSyncMut = useImportSync();
  const resolveSyncMut = useResolveSyncMatch();
  const removeDepartedMut = useRemoveDeparted();
  const updateExistingMut = useUpdateExisting();

  const processingRegId =
    acceptRegMut.isPending ? acceptRegMut.variables : null;

  const loading = regsQuery.isFetching;
  const usersLoading = usersQuery.isFetching;
  const syncLoading = syncStatusQuery.isFetching ||
    importSyncMut.isPending ||
    resolveSyncMut.isPending ||
    removeDepartedMut.isPending ||
    updateExistingMut.isPending;

  // --- Registration handlers ---

  const handleAcceptRegistration = (registrationId: string) => {
    setStatus("");
    acceptRegMut.mutate(registrationId, {
      onSuccess: () => setStatus("Registration accepted, invite sent"),
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
    setStatus("");
    const content = await file.text();
    importSyncMut.mutate(content, {
      onSuccess: (result) => {
        setStatus(`Imported ${result.imported} member(s) from CSV`);
        queryClient.removeQueries({ queryKey: syncStatusOptions.queryKey });
      },
      onError: (error) => setStatus(`Error: ${formatError(error)}`),
    });
  };

  const handleComputeStatus = () => {
    setStatus("");
    refetchSyncStatus().then((result) => {
      if (result.data) {
        const s = result.data;
        const parts = [
          `${s.review_required.length} review required`,
          `${s.linked_registrations.length} linked registrations`,
          `${s.existing.length} existing`,
          `${s.departed.length} departed`,
        ];
        setStatus(parts.join(", "));
      }
      if (result.error) {
        setStatus(`Error: ${formatError(result.error)}`);
      }
    });
  };

  const handleResolveMatch = (
    bondsnummer: number,
    kind: string,
    subjectId: string | null,
  ) => {
    setStatus("");
    resolveSyncMut.mutate(
      { bondsnummer, kind, subjectId },
      {
        onSuccess: (result) => {
          setStatus(result.message);
          refetchSyncStatus();
        },
        onError: (error) => setStatus(`Error: ${formatError(error)}`),
      },
    );
  };

  const handleRemoveDeparted = () => {
    setStatus("");
    removeDepartedMut.mutate(undefined, {
      onSuccess: (result) => {
        setStatus(`Removed ${result.removed} departed user(s)`);
        refetchSyncStatus();
      },
      onError: (error) => setStatus(`Error: ${formatError(error)}`),
    });
  };

  const handleUpdateExisting = () => {
    setStatus("");
    updateExistingMut.mutate(undefined, {
      onSuccess: (result) => {
        setStatus(
          `Updated ${result.registrations_updated} registration(s), ` +
          `refreshed ${result.users_refreshed} user(s)`,
        );
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
      syncStatus.linked_registrations.length +
      syncStatus.existing.length +
      syncStatus.departed.length +
      2; // bulk buttons for departed + update
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
                            {!reg.accepted && (
                              <button
                                onClick={() => handleAcceptRegistration(reg.registration_id)}
                                disabled={processingRegId === reg.registration_id}
                                className="admin-button admin-button-accept"
                              >
                                {processingRegId === reg.registration_id
                                  ? "Processing..."
                                  : "Approve"}
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
                    {/* Review Required */}
                    <div className="admin-sync-group">
                      <h3>
                        Review Required{" "}
                        <span className="admin-sync-count">
                          ({syncStatus.review_required.length})
                        </span>
                      </h3>
                      {syncStatus.review_required.length > 0 ? (
                        <div className="admin-table-container">
                          <table className="admin-table admin-cols-review">
                            <colgroup><col /><col /><col /><col /></colgroup>
                            <thead>
                              <tr>
                                <th>Bondsnummer</th>
                                <th>Volta Email</th>
                                <th>Candidates</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {syncStatus.review_required.map((item) => (
                                <SyncReviewRow
                                  key={item.bondsnummer}
                                  item={item}
                                  disabled={syncLoading}
                                  onResolve={handleResolveMatch}
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="admin-empty">No items need review</div>
                      )}
                    </div>

                    {/* Linked Registrations */}
                    <div className="admin-sync-group">
                      <h3>
                        Linked Registrations{" "}
                        <span className="admin-sync-count">
                          ({syncStatus.linked_registrations.length})
                        </span>
                      </h3>
                      {syncStatus.linked_registrations.length > 0 ? (
                        <div className="admin-table-container">
                          <table className="admin-table admin-cols-linked">
                            <colgroup><col /><col /><col /><col /><col /></colgroup>
                            <thead>
                              <tr>
                                <th>Bondsnummer</th>
                                <th>Registration Email</th>
                                <th>Name</th>
                                <th>Email Change</th>
                                <th>Changes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {syncStatus.linked_registrations.map((lr) => (
                                <tr key={lr.bondsnummer}>
                                  <td>{lr.bondsnummer}</td>
                                  <td>{lr.registration.email}</td>
                                  <td>{lr.registration.firstname} {lr.registration.lastname}</td>
                                  <td>
                                    {lr.email_will_change ? (
                                      <span className="admin-status-badge admin-status-badge-warning">
                                        Will update
                                      </span>
                                    ) : (
                                      "\u2014"
                                    )}
                                  </td>
                                  <td>
                                    <FieldDiffs diffs={lr.field_diffs} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="admin-empty">No linked registrations</div>
                      )}
                    </div>

                    {/* Existing Members */}
                    <div className="admin-sync-group">
                      <h3>
                        Existing Members{" "}
                        <span className="admin-sync-count">
                          ({syncStatus.existing.length})
                        </span>
                        {syncStatus.existing.some((e) => e.field_diffs.length > 0) && (
                          <span className="admin-changes">
                            {syncStatus.existing.filter((e) => e.field_diffs.length > 0).length} changed
                          </span>
                        )}
                      </h3>
                      {syncStatus.existing.length > 0 || syncStatus.linked_registrations.length > 0 ? (
                        <>
                          <div className="admin-nav-item">
                            <button
                              onClick={handleUpdateExisting}
                              disabled={syncLoading}
                              className="admin-button admin-button-refresh"
                            >
                              Update All
                            </button>
                          </div>
                          {syncStatus.existing.filter((e) => e.field_diffs.length > 0).length > 0 && (
                            <div className="admin-table-container">
                              <table className="admin-table admin-cols-existing">
                                <colgroup><col /><col /><col /></colgroup>
                                <thead>
                                  <tr>
                                    <th>Bondsnummer</th>
                                    <th>Email</th>
                                    <th>Changes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {syncStatus.existing
                                    .filter((e) => e.field_diffs.length > 0)
                                    .map((ex) => (
                                      <tr key={ex.bondsnummer}>
                                        <td>{ex.bondsnummer}</td>
                                        <td>{ex.user.email}</td>
                                        <td>
                                          <FieldDiffs diffs={ex.field_diffs} />
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          {syncStatus.existing.filter((e) => e.field_diffs.length > 0).length === 0 && syncStatus.linked_registrations.length === 0 && (
                            <div className="admin-empty">
                              All {syncStatus.existing.length} existing members are up to date
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="admin-empty">No existing members</div>
                      )}
                    </div>

                    {/* Departed Members */}
                    <div className="admin-sync-group">
                      <h3>
                        Departed Members{" "}
                        <span className="admin-sync-count">
                          ({syncStatus.departed.length})
                        </span>
                      </h3>
                      {syncStatus.departed.length > 0 ? (
                        <>
                          <div className="admin-nav-item">
                            <button
                              onClick={handleRemoveDeparted}
                              disabled={syncLoading}
                              className="admin-button admin-button-danger"
                            >
                              Remove All Departed
                            </button>
                          </div>
                          <div className="admin-table-container">
                            <table className="admin-table admin-cols-departed">
                              <colgroup><col /><col /><col /></colgroup>
                              <thead>
                                <tr>
                                  <th>Email</th>
                                  <th>Name</th>
                                  <th>Bondsnummer</th>
                                </tr>
                              </thead>
                              <tbody>
                                {syncStatus.departed.map((d) => (
                                  <tr key={d.user_id}>
                                    <td>{d.email}</td>
                                    <td>{d.firstname} {d.lastname}</td>
                                    <td>{d.bondsnummer ?? "\u2014"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <div className="admin-empty">No departed members</div>
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

// --- Sync Review Row ---

function SyncReviewRow({
  item,
  disabled,
  onResolve,
}: {
  item: SyncReviewItem;
  disabled: boolean;
  onResolve: (bondsnummer: number, kind: string, subjectId: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const voltaEmail = String(item.incoming_volta_data["email"] ?? "");

  return (
    <tr>
      <td>{item.bondsnummer}</td>
      <td>{voltaEmail}</td>
      <td>
        {item.candidates.length === 0 ? (
          <span className="admin-sync-no-candidates">No matches found</span>
        ) : (
          <button
            className="admin-button admin-button-add"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide" : `${item.candidates.length} candidate(s)`}
          </button>
        )}
        {expanded && (
          <div className="admin-candidate-list">
            {item.candidates.map((c) => (
              <div key={`${c.kind}-${c.subject_id}`} className="admin-candidate-row">
                <span className="admin-candidate-kind">{c.kind}</span>
                <span className="admin-candidate-name">{c.display_name}</span>
                <span className="admin-candidate-email">{c.email}</span>
                <span className="admin-candidate-reasons">
                  {c.reasons.join(", ")}
                </span>
                <button
                  className="admin-button admin-button-accept"
                  disabled={disabled}
                  onClick={() => onResolve(item.bondsnummer, c.kind, c.subject_id)}
                >
                  Match
                </button>
              </div>
            ))}
          </div>
        )}
      </td>
      <td>
        <button
          className="admin-button admin-button-danger"
          disabled={disabled}
          onClick={() => onResolve(item.bondsnummer, "none", null)}
        >
          No Match
        </button>
      </td>
    </tr>
  );
}
