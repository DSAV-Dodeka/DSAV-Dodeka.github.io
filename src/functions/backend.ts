const BACKEND_URL = "http://localhost:8000";

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

export async function clearTables(): Promise<void> {
  const response = await post("/private/clear_tables", {});
  if (!response.ok) {
    throw new Error(`Failed to clear tables: ${response.statusText}`);
  }
}

export async function prepareUser(
  email: string,
  names: string[],
): Promise<void> {
  const response = await post("/private/prepare_user", { email, names });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to prepare user: ${text}`);
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
  const response = await get("/admin/list_newusers/");
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to list new users: ${text}`);
  }
  return response.json();
}

export async function acceptUser(
  email: string,
): Promise<{ success: boolean; message: string; signup_token: string }> {
  const response = await post("/admin/accept_user/", { email });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to accept user: ${text}`);
  }
  return response.json();
}

// Session management
export async function setSession(sessionToken: string): Promise<void> {
  const response = await post(
    "/cookies/set_session/",
    {
      session_token: sessionToken,
    },
    true,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to set session: ${text}`);
  }
}

export async function clearSession(): Promise<void> {
  const response = await post("/cookies/clear_session/", {}, true);
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

export async function getSessionInfo(): Promise<SessionInfo | null> {
  const response = await get("/auth/session_info/", true);
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
