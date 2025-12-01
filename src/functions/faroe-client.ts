import { Client, type ActionInvocationEndpointClient } from "@faroe/client";

const FAROE_URL = "http://localhost:3777/";
const BACKEND_URL = "http://localhost:8000";

class FaroeEndpointClient implements ActionInvocationEndpointClient {
  async sendActionInvocationEndpointRequest(body: string): Promise<string> {
    const response = await fetch(FAROE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (response.status !== 200) {
      throw new Error(`Faroe request failed: ${response.status}`);
    }

    return response.text();
  }
}

export const faroeClient = new Client(new FaroeEndpointClient());

export async function prepareUser(
  email: string,
  names: string[],
): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/test/prepare_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, names }),
  });

  if (response.status !== 200) {
    throw new Error(`Prepare user failed: ${await response.text()}`);
  }
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  registration_token: string;
}

export async function registerUser(
  email: string,
  firstname: string,
  lastname: string,
): Promise<RegisterUserResponse> {
  const response = await fetch(`${BACKEND_URL}/auth/register_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, firstname, lastname }),
  });

  if (response.status !== 200) {
    throw new Error(`Register user failed: ${await response.text()}`);
  }

  return response.json();
}

export interface RegistrationStatus {
  email: string;
  accepted: boolean;
  signup_token: string | null;
}

export async function getRegistrationStatus(
  registrationToken: string,
): Promise<RegistrationStatus> {
  const response = await fetch(`${BACKEND_URL}/auth/registration_status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ registration_token: registrationToken }),
  });

  if (response.status !== 200) {
    throw new Error(`Get registration status failed: ${await response.text()}`);
  }

  return response.json();
}

export async function clearTables(): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/auth/clear_tables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (response.status !== 200) {
    throw new Error(`Clear tables failed: ${await response.text()}`);
  }
}

export async function setSession(sessionToken: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/auth/set_session/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ session_token: sessionToken }),
  });

  if (response.status !== 200) {
    throw new Error(`Set session failed: ${await response.text()}`);
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

export interface SessionResponse {
  error?: string;
  user?: SessionUser;
  created_at?: number;
  expires_at?: number | null;
}

export async function getSessionInfo(): Promise<SessionInfo | null> {
  const response = await fetch(`${BACKEND_URL}/auth/session_info/`, {
    method: "GET",
    credentials: "include",
  });

  if (response.status !== 200) {
    throw new Error(`Get session info failed: ${await response.text()}`);
  }

  const data: SessionResponse = await response.json();

  if (data.error) {
    return null;
  }

  if (!data.user || data.created_at === undefined) {
    return null;
  }

  return {
    user: data.user,
    created_at: data.created_at,
    expires_at: data.expires_at ?? null,
  };
}

export async function clearCurrentSession(): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/auth/clear_session/`, {
    method: "POST",
    credentials: "include",
  });

  if (response.status !== 200) {
    throw new Error(`Clear session failed: ${await response.text()}`);
  }
}

export interface NewUser {
  email: string;
  firstname: string;
  lastname: string;
  accepted: boolean;
}

export async function listNewUsers(): Promise<NewUser[]> {
  const response = await fetch(`${BACKEND_URL}/admin/list_newusers/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    throw new Error(`List new users failed: ${await response.text()}`);
  }

  return response.json();
}

export interface AcceptUserResponse {
  success: boolean;
  message: string;
  signup_token: string;
}

export async function acceptUser(email: string): Promise<AcceptUserResponse> {
  const response = await fetch(`${BACKEND_URL}/admin/accept_user/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (response.status !== 200) {
    throw new Error(`Accept user failed: ${await response.text()}`);
  }

  return response.json();
}

// Get session token from cookie
async function getSessionToken(): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/auth/get_session_token/`, {
    method: "GET",
    credentials: "include",
  });

  if (response.status !== 200) {
    throw new Error(`Get session token failed: ${await response.text()}`);
  }

  const data = await response.json();
  return data.session_token;
}

// Email change functions
export async function createEmailChange(newEmail: string): Promise<string> {
  const sessionToken = await getSessionToken();
  const result = await faroeClient.createUserEmailAddressUpdate(
    sessionToken,
    newEmail,
  );

  if (!result.ok) {
    throw new Error("Failed to initiate email change");
  }

  return result.userEmailAddressUpdateToken;
}

export async function sendEmailVerificationCode(
  emailUpdateToken: string,
): Promise<void> {
  const sessionToken = await getSessionToken();
  const result =
    await faroeClient.sendUserEmailAddressUpdateEmailAddressVerificationCode(
      sessionToken,
      emailUpdateToken,
    );

  if (!result.ok) {
    throw new Error("Failed to send verification code");
  }
}

export async function verifyEmailChange(
  emailUpdateToken: string,
  verificationCode: string,
): Promise<void> {
  const sessionToken = await getSessionToken();
  const result =
    await faroeClient.verifyUserEmailAddressUpdateEmailAddressVerificationCode(
      sessionToken,
      emailUpdateToken,
      verificationCode,
    );

  if (!result.ok) {
    throw new Error("Failed to verify email");
  }
}

export async function verifyEmailChangePassword(
  emailUpdateToken: string,
  password: string,
): Promise<void> {
  const sessionToken = await getSessionToken();
  const result = await faroeClient.verifyUserEmailAddressUpdateUserPassword(
    sessionToken,
    emailUpdateToken,
    password,
  );

  if (!result.ok) {
    throw new Error("Failed to verify password");
  }
}

export async function completeEmailChange(
  emailUpdateToken: string,
): Promise<void> {
  const sessionToken = await getSessionToken();
  const result = await faroeClient.completeUserEmailAddressUpdate(
    sessionToken,
    emailUpdateToken,
  );

  if (!result.ok) {
    throw new Error("Failed to complete email change");
  }
}

// Account deletion functions using Faroe client
export async function createUserDeletion(): Promise<string> {
  const sessionToken = await getSessionToken();
  const result = await faroeClient.createUserDeletion(sessionToken);

  if (!result.ok) {
    throw new Error("Failed to create user deletion");
  }

  return result.userDeletionToken;
}

export async function verifyUserDeletionPassword(
  userDeletionToken: string,
  password: string,
): Promise<void> {
  const sessionToken = await getSessionToken();
  const result = await faroeClient.verifyUserDeletionUserPassword(
    sessionToken,
    userDeletionToken,
    password,
  );

  if (!result.ok) {
    throw new Error("Failed to verify password for deletion");
  }
}

export async function completeUserDeletion(
  userDeletionToken: string,
): Promise<void> {
  const sessionToken = await getSessionToken();
  const result = await faroeClient.completeUserDeletion(
    sessionToken,
    userDeletionToken,
  );

  if (!result.ok) {
    throw new Error("Failed to complete user deletion");
  }
}
