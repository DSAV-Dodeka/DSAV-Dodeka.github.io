const BACKEND_URL = import.meta.env.DEV
  ? "http://127.0.0.1:12780"
  : (import.meta.env['VITE_BACKEND_URL'] ?? "https://backend.dsavdodeka.nl");

// HTTP helpers
async function post(
  path: string,
  body: object,
  withCredentials = false,
): Promise<Response> {
  const options: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  if (withCredentials) {
    options.credentials = "include";
  }
  return fetch(`${BACKEND_URL}${path}`, options);
}

async function get(path: string, withCredentials = false): Promise<Response> {
  const options: RequestInit = {};
  if (withCredentials) {
    options.credentials = "include";
  }
  return fetch(`${BACKEND_URL}${path}`, options);
}

// Private API for dev/testing - only accessible on localhost
const PRIVATE_URL = "http://127.0.0.2:12790";

async function privateCommand(
  command: string,
  params: Record<string, unknown> = {},
): Promise<string> {
  const response = await fetch(`${PRIVATE_URL}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command, ...params }),
  });
  if (!response.ok) {
    throw new Error(`Private command failed: ${response.statusText}`);
  }
  return response.text();
}

export async function resetTables(): Promise<string> {
  return privateCommand("reset");
}

export async function prepareUser(
  email: string,
  firstname?: string,
  lastname?: string,
): Promise<string> {
  const names: string[] = [];
  if (firstname) names.push(firstname);
  if (lastname) names.push(lastname);
  return privateCommand("prepare_user", { email, names });
}

export interface AdminCredentials {
  email: string;
  password: string;
}

export async function getAdminCredentials(): Promise<AdminCredentials> {
  const result = await privateCommand("get_admin_credentials");
  return JSON.parse(result);
}

export interface TokenResult {
  found: boolean;
  code: string;
}

export async function getToken(
  action: string,
  email: string,
): Promise<TokenResult | null> {
  try {
    const result = await privateCommand("get_token", { action, email });
    return JSON.parse(result);
  } catch {
    return null;
  }
}

// Registration flow

export async function requestRegistration(
  email: string,
  firstname: string,
  lastname: string,
): Promise<{ success: boolean; message: string }> {
  const response = await post("/auth/request_registration", {
    email,
    firstname,
    lastname,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to request registration: ${text}`);
  }
  return response.json();
}

export interface RegistrationStatus {
  exists: boolean;
  email: string;
  accepted: boolean;
  signup_token: string | null;
}

export class RegistrationNotFoundError extends Error {
  constructor() {
    super("Registration not found");
  }
}

export async function getRegistrationStatus(
  registrationId: string,
): Promise<RegistrationStatus> {
  const response = await post("/auth/registration_status", {
    registration_id: registrationId,
  });
  if (response.status === 404) {
    throw new RegistrationNotFoundError();
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get registration status: ${text}`);
  }
  return response.json();
}

export interface LookupResult {
  found: boolean;
  registration_id?: string;
}

export async function lookupRegistration(
  email: string,
  code: string,
): Promise<LookupResult> {
  const response = await post("/auth/lookup_registration", { email, code });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to lookup registration: ${text}`);
  }
  return response.json();
}

// Admin: registrations

export interface RegistrationAction {
  kind: string;
}

export interface AdminRegistrationRecord {
  registration_id: string;
  email: string;
  firstname: string;
  lastname: string;
  accepted: boolean;
  bondsnummer: number | null;
  signup_active: boolean;
  volta_data: Record<string, unknown> | null;
  available_actions: RegistrationAction[];
}

export async function listRegistrations(): Promise<AdminRegistrationRecord[]> {
  const response = await get("/admin/list_registrations/", true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to list registrations: ${text}`);
  }
  return response.json();
}

export async function acceptRegistration(
  registrationId: string,
): Promise<{ success: boolean }> {
  const response = await post(
    "/admin/accept_registration/",
    { registration_id: registrationId },
    true,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to accept registration: ${text}`);
  }
  return response.json();
}

export async function deleteRegistration(
  registrationId: string,
): Promise<{ success: boolean }> {
  const response = await post(
    "/admin/delete_registration/",
    { registration_id: registrationId },
    true,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to delete registration: ${text}`);
  }
  return response.json();
}

export async function deleteUser(
  userId: string,
): Promise<{ success: boolean }> {
  const response = await post(
    "/admin/delete_user/",
    { user_id: userId },
    true,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to delete user: ${text}`);
  }
  return response.json();
}

export async function resendRegistrationInvite(
  registrationId: string,
): Promise<{ success: boolean; email: string }> {
  const response = await post(
    "/admin/resend_registration_invite/",
    { registration_id: registrationId },
    true,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to resend invite: ${text}`);
  }
  return response.json();
}

// Renew signup (creates new Faroe signup, sends new verification email)
export interface RenewSignupResult {
  success: boolean;
  signup_token: string;
  email: string;
}

export async function renewSignup(
  registrationId: string,
): Promise<RenewSignupResult> {
  const response = await post("/auth/renew_signup", {
    registration_id: registrationId,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to renew signup: ${text}`);
  }
  return response.json();
}

// Session management
export async function setSession(
  sessionToken: string,
  secondary = false,
): Promise<void> {
  const response = await post(
    "/cookies/set_session/",
    {
      session_token: sessionToken,
      secondary,
    },
    true,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to set session: ${text}`);
  }
}

export async function clearSession(secondary = false): Promise<void> {
  const response = await post(
    "/cookies/clear_session/",
    secondary ? { secondary: true } : {},
    true,
  );
  if (!response.ok) {
    throw new Error(`Failed to clear session: ${response.statusText}`);
  }
}

export interface SessionUser {
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  permissions: string[];
}

export interface SessionInfo {
  user: SessionUser;
  created_at: number;
  expires_at: number | null;
}

async function getDebugSessionInfo(
  secondary: boolean,
): Promise<SessionInfo | null> {
  if (secondary || !import.meta.env.DEV || typeof window === "undefined") {
    return null;
  }

  const { getDebugSession } = await import("./debug-user.ts");
  return getDebugSession();
}

export async function getSessionInfo(
  secondary = false,
): Promise<SessionInfo | null> {
  const debugSession = await getDebugSessionInfo(secondary);
  if (debugSession) {
    return debugSession;
  }

  const path = secondary
    ? "/auth/session_info/?secondary=true"
    : "/auth/session_info/";
  let response: Response;
  try {
    response = await get(path, true);
  } catch {
    return null;
  }
  if (!response.ok) {
    return null;
  }
  const text = await response.text();
  if (!text || text.trim() === "no_session") {
    return null;
  }
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (
    !data ||
    typeof data !== "object" ||
    "error" in data ||
    !("user" in data)
  ) {
    return null;
  }
  return data as SessionInfo;
}

export async function getSessionToken(): Promise<string> {
  const response = await get("/cookies/session_token/", true);
  if (!response.ok) {
    throw new Error("No session token found");
  }
  const data = await response.json();
  return data.session_token;
}

// Legacy onboarding (for word-lid page)
export async function onboardSignup(data: {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  privacy: boolean;
}): Promise<void> {
  const response = await post("/onboard/signup/", data);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to submit signup: ${text}`);
  }
}

// User management

export interface AdminUserRecord {
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  permissions: string[];
  bondsnummer: number | null;
  volta_data: Record<string, unknown> | null;
}

export async function listUsers(): Promise<AdminUserRecord[]> {
  const response = await get("/admin/list_users/", true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to list users: ${text}`);
  }
  return response.json();
}

export async function getAvailablePermissions(): Promise<string[]> {
  const response = await get("/admin/available_permissions/", true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get permissions: ${text}`);
  }
  const data = await response.json();
  return data.permissions;
}

export async function addUserPermission(
  userId: string,
  permission: string,
): Promise<void> {
  const response = await post(
    "/admin/add_permission/",
    { user_id: userId, permission },
    true,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to add permission: ${text}`);
  }
}

export async function removeUserPermission(
  userId: string,
  permission: string,
): Promise<void> {
  const response = await post(
    "/admin/remove_permission/",
    { user_id: userId, permission },
    true,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to remove permission: ${text}`);
  }
}

// Sync types

export interface SyncMatchCandidate {
  kind: "registration" | "user";
  subject_id: string;
  email: string;
  display_name: string;
  reasons: string[];
}

export interface SyncReviewItem {
  bondsnummer: number;
  incoming_volta_data: Record<string, unknown>;
  candidates: SyncMatchCandidate[];
}

export interface SyncFieldDiff {
  field: string;
  current: string;
  incoming: string;
}

export interface SyncNewRegistrationItem {
  bondsnummer: number;
  email: string;
  firstname: string;
  lastname: string;
}

export interface SyncRegistrationItem {
  bondsnummer: number;
  registration: {
    email: string;
    firstname: string;
    lastname: string;
  };
  field_diffs: SyncFieldDiff[];
  email_will_change?: boolean;
}

export interface SyncUserItem {
  bondsnummer: number;
  user: {
    email: string;
    firstname: string;
    lastname: string;
  };
  field_diffs: SyncFieldDiff[];
}

export interface SyncDepartedItem {
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  bondsnummer: number | null;
}

export interface SyncDataChangeItem {
  bondsnummer: number;
  current_volta_data: Record<string, unknown> | null;
  incoming_volta_data: Record<string, unknown> | null;
  field_diffs: SyncFieldDiff[];
}

export interface SyncStatus {
  sync_in_progress: boolean;
  sync_state_counter: number;
  file_modified_at: number | null;
  can_complete: boolean;
  review_required: SyncReviewItem[];
  registrations_created: SyncNewRegistrationItem[];
  registrations_accepted: SyncRegistrationItem[];
  pending_registrations_updated: SyncRegistrationItem[];
  live_users_enriched: SyncUserItem[];
  departed_users: SyncDepartedItem[];
  volta_data_changes: SyncDataChangeItem[];
}

export interface SyncImportResult {
  imported: number;
}

export interface CompleteSyncResult {
  success: boolean;
  volta_rows_applied: number;
  registrations_created: number;
  registrations_accepted: number;
  registrations_updated: number;
  users_refreshed: number;
  users_departed: number;
}

// Sync functions
export async function importSync(
  csvContent: string,
  syncStateCounter?: number,
  fileModifiedAt?: number,
): Promise<SyncImportResult> {
  const body: {
    csv_content: string;
    sync_state_counter?: number;
    file_modified_at?: number;
  } = {
    csv_content: csvContent,
  };
  if (syncStateCounter !== undefined) {
    body.sync_state_counter = syncStateCounter;
  }
  if (fileModifiedAt !== undefined) {
    body.file_modified_at = fileModifiedAt;
  }
  const response = await post("/admin/import_sync/", body, true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to import sync: ${text}`);
  }
  return response.json();
}

export async function getSyncStatus(): Promise<SyncStatus> {
  const response = await get("/admin/sync_status/", true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get sync status: ${text}`);
  }
  return response.json();
}

export async function resolveSyncMatch(
  bondsnummer: number,
  kind: string,
  subjectId: string | null,
  syncStateCounter?: number,
): Promise<{ success: boolean; message: string }> {
  const body: {
    bondsnummer: number;
    kind: string;
    subject_id: string | null;
    sync_state_counter?: number;
  } = { bondsnummer, kind, subject_id: subjectId };
  if (syncStateCounter !== undefined) {
    body.sync_state_counter = syncStateCounter;
  }
  const response = await post("/admin/resolve_sync_match/", body, true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to resolve sync match: ${text}`);
  }
  return response.json();
}

export async function linkBondsnummer(
  kind: string,
  subjectId: string,
  bondsnummer: number,
): Promise<{ success: boolean; message: string }> {
  const response = await post(
    "/admin/link_bondsnummer/",
    { kind, subject_id: subjectId, bondsnummer },
    true,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to link bondsnummer: ${text}`);
  }
  return response.json();
}

export async function completeSync(
  syncStateCounter?: number,
): Promise<CompleteSyncResult> {
  const body: { sync_state_counter?: number } = {};
  if (syncStateCounter !== undefined) {
    body.sync_state_counter = syncStateCounter;
  }
  const response = await post("/admin/complete_sync/", body, true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to complete sync: ${text}`);
  }
  return response.json();
}

export async function listSystemUsers(): Promise<string[]> {
  const response = await get("/admin/list_system_users/", true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to list system users: ${text}`);
  }
  const data = await response.json();
  return data.system_users;
}

// Birthday types
export interface Birthday {
  user_id: string;
  voornaam: string;
  tussenvoegsel: string;
  achternaam: string;
  geboortedatum: string;
}

export async function getMemberBirthdays(): Promise<Birthday[]> {
  const response = await get("/members/birthdays/", true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get birthdays: ${text}`);
  }
  return response.json();
}
