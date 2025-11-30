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
  const response = await fetch(`${BACKEND_URL}/auth/prepare_user`, {
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
