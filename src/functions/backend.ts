const BACKEND_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : "https://backend.dsavdodeka.nl";

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
const PRIVATE_URL = "http://127.0.0.2:8079";

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
export async function requestRegistration(
  email: string,
  firstname: string,
  lastname: string,
): Promise<string> {
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
  return data.registration_token;
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

// Admin actions
export interface NewUser {
  email: string;
  firstname: string;
  lastname: string;
  accepted: boolean;
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
): Promise<{ success: boolean; message: string; signup_token: string }> {
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
