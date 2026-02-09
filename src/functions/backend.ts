const BACKEND_URL = import.meta.env.DEV
  ? "http://localhost:12780"
  : (import.meta.env.VITE_BACKEND_URL ?? "https://backend.dsavdodeka.nl");

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

// Get email verification code from the token store (for test automation)
// action: "signup_verification", "password_reset", "email_update", etc.
export async function getToken(
  action: string,
  email: string,
): Promise<TokenResult | null> {
  try {
    const result = await privateCommand("get_token", { action, email });
    return JSON.parse(result);
  } catch {
    // 404 means token not found
    return null;
  }
}

// Registration flow
export interface RegistrationResult {
  registration_token: string;
  signup_token: string | null;
}

export async function requestRegistration(
  email: string,
  firstname: string,
  lastname: string,
): Promise<RegistrationResult> {
  const response = await post("/auth/request_registration", {
    email,
    firstname,
    lastname,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to request registration: ${text}`);
  }
  const data = await response.json();
  return {
    registration_token: data.registration_token,
    signup_token: data.signup_token,
  };
}

export interface RegistrationStatus {
  email: string;
  accepted: boolean;
  signup_token: string | null;
}

export async function getRegistrationStatus(
  registrationToken: string,
): Promise<RegistrationStatus> {
  const response = await post("/auth/registration_status", {
    registration_token: registrationToken,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get registration status: ${text}`);
  }
  return response.json();
}

export interface LookupResult {
  found: boolean;
  token?: string;
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

// Admin actions
export interface NewUser {
  email: string;
  firstname: string;
  lastname: string;
  accepted: boolean;
  email_send_count: number;
  has_signup_token: boolean;
  is_registered: boolean;
  registration_token: string | null;
}

export async function listNewUsers(): Promise<NewUser[]> {
  const response = await get("/admin/list_newusers/", true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to list new users: ${text}`);
  }
  return response.json();
}

export async function acceptUser(
  email: string,
): Promise<{ success: boolean; message: string }> {
  const response = await post("/admin/accept_user/", { email }, true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to accept user: ${text}`);
  }
  return response.json();
}

export async function resendSignupEmail(
  email: string,
): Promise<{ success: boolean; message: string }> {
  const response = await post("/admin/resend_signup_email/", { email }, true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to resend signup email: ${text}`);
  }
  return response.json();
}

// Renew expired signup (creates new Faroe signup, sends new verification email)
export interface RenewSignupResult {
  success: boolean;
  signup_token: string;
  email: string;
}

export async function renewSignup(
  registrationToken: string,
): Promise<RenewSignupResult> {
  const response = await post("/auth/renew_signup", {
    registration_token: registrationToken,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to renew signup: ${text}`);
  }
  return response.json();
}

// Session management
// secondary=true uses the secondary session cookie (for admin auth during testing)
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
  disabled: boolean;
}

export interface SessionInfo {
  user: SessionUser;
  created_at: number;
  expires_at: number | null;
  pending_approval: boolean;
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
export interface User {
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  permissions: string[];
  disabled: boolean;
}

export async function listUsers(): Promise<User[]> {
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
export interface SyncEntry {
  email: string;
  voornaam: string;
  tussenvoegsel: string;
  achternaam: string;
  bondsnummer?: number;
  geslacht?: string;
  geboortedatum?: string;
}

export interface ExistingPair {
  sync: SyncEntry;
  current: SyncEntry | null;
}

export interface EmailChange {
  old_email: string;
  new_email: string;
  bondsnummer: number;
}

export interface SyncStatus {
  departed: string[];
  to_accept: SyncEntry[];
  pending_signup: string[];
  existing: ExistingPair[];
  email_changes: EmailChange[];
}

export interface SyncImportResult {
  imported: number;
}

export interface AcceptNewResult {
  added: number;
  skipped: number;
  emails_sent: number;
  emails_failed: number;
}

export interface RemoveResult {
  removed: number;
}

export interface UpdateResult {
  updated: number;
  email_changes_applied?: number;
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

export async function acceptNewSync(
  email?: string,
): Promise<AcceptNewResult> {
  const body = email ? { email } : {};
  const response = await post("/admin/accept_new_sync/", body, true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to accept new: ${text}`);
  }
  return response.json();
}

export async function removeDeparted(
  email?: string,
): Promise<RemoveResult> {
  const body = email ? { email } : {};
  const response = await post("/admin/remove_departed/", body, true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to remove departed: ${text}`);
  }
  return response.json();
}

export async function updateExisting(
  email?: string,
): Promise<UpdateResult> {
  const body = email ? { email } : {};
  const response = await post("/admin/update_existing/", body, true);
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

export async function markSystemUser(email: string): Promise<void> {
  const response = await post("/admin/mark_system_user/", { email }, true);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to mark system user: ${text}`);
  }
}

export async function unmarkSystemUser(email: string): Promise<void> {
  const response = await post(
    "/admin/unmark_system_user/",
    { email },
    true,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to unmark system user: ${text}`);
  }
}

// Birthday types
export interface Birthday {
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
