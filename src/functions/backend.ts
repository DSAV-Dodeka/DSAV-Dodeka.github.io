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

export interface AdminRegistrationRecord {
  registration_id: string;
  email: string;
  firstname: string;
  lastname: string;
  accepted: boolean;
  bondsnummer: number | null;
  signup_active: boolean;
  volta_data: Record<string, unknown> | null;
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

export async function getSessionInfo(
  secondary = false,
): Promise<SessionInfo | null> {
  const path = secondary
    ? "/auth/session_info/?secondary=true"
    : "/auth/session_info/";
  const response = await get(path, true);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  if (data.error) {
    return null;
  }
  return data;
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

export interface VoltaFieldDiff {
  field: string;
  current: string;
  incoming: string;
}

export interface SyncReviewItem {
  bondsnummer: number;
  incoming_volta_data: Record<string, unknown>;
  candidates: SyncMatchCandidate[];
}

export interface PendingRegistrationSyncRecord {
  bondsnummer: number;
  registration: AdminRegistrationRecord;
  current_volta_data: Record<string, unknown> | null;
  incoming_volta_data: Record<string, unknown>;
  field_diffs: VoltaFieldDiff[];
  email_will_change: boolean;
}

export interface ExistingSyncRecord {
  bondsnummer: number;
  user: AdminUserRecord;
  current_volta_data: Record<string, unknown> | null;
  incoming_volta_data: Record<string, unknown>;
  field_diffs: VoltaFieldDiff[];
}

export interface DepartedUserRecord {
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  permissions: string[];
  bondsnummer: number | null;
  volta_data: Record<string, unknown> | null;
}

export interface SyncStatus {
  review_required: SyncReviewItem[];
  linked_registrations: PendingRegistrationSyncRecord[];
  existing: ExistingSyncRecord[];
  departed: DepartedUserRecord[];
}

export interface SyncImportResult {
  imported: number;
}

export interface RemoveResult {
  removed: number;
}

export interface UpdateExistingResult {
  registrations_updated: number;
  users_refreshed: number;
  details: Array<Record<string, unknown>>;
}

// Sync functions
export async function importSync(
  csvContent: string,
): Promise<SyncImportResult> {
  const response = await post(
    "/admin/import_sync/",
    { csv_content: csvContent },
    true,
  );
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
): Promise<{ success: boolean; message: string }> {
  const response = await post(
    "/admin/resolve_sync_match/",
    { bondsnummer, kind, subject_id: subjectId },
    true,
  );
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

export async function removeDeparted(): Promise<RemoveResult> {
  const response = await post("/admin/remove_departed/", {}, true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to remove departed: ${text}`);
  }
  return response.json();
}

export async function updateExisting(): Promise<UpdateExistingResult> {
  const response = await post("/admin/update_existing/", {}, true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update existing: ${text}`);
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
