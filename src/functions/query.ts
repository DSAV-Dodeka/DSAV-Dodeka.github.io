import { useQuery } from "@tanstack/react-query";

const backendEndpoint = "http://localhost:8000";

async function backendJson(path: string, json: object, options?: RequestInit) {
  let requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  };
  if (options !== undefined) {
    requestInit = {
      ...requestInit,
      ...options,
    };
  }
  return await fetch(`${backendEndpoint}${path}`, requestInit);
}

async function backendGet(path: string, options?: RequestInit) {
  return await fetch(`${backendEndpoint}${path}`, options);
}

interface SessionInfo {
  user: {
    user_id: string;
    email: string;
    firstname: string;
    lastname: string;
    permissions: string[];
  };
  created_at: number;
  expires_at: number | null;
}

export function useSessionInfo() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async (): Promise<SessionInfo | null> => {
      const response = await backendGet("/auth/session_info/", {
        credentials: "include",
      });

      if (response.status !== 200) {
        return null;
      }

      const data = await response.json();

      // Check if the response has an error field
      if (data.error) {
        return null;
      }

      return data as SessionInfo;
    },
    // Refetch in background periodically
    refetchInterval: 60000, // 1 minute
    staleTime: 30000, // 30 seconds
  });
}

export type { SessionInfo };

interface RegistrationStatus {
  email: string;
  accepted: boolean;
  signup_token: string | null;
}

export function useRegistrationStatus(registrationToken: string | null) {
  return useQuery({
    queryKey: ["registration-status", registrationToken],
    queryFn: async (): Promise<RegistrationStatus> => {
      if (!registrationToken) {
        throw new Error("No registration token provided");
      }

      const response = await backendJson("/auth/registration_status", {
        registration_token: registrationToken,
      });

      if (response.status !== 200) {
        throw new Error("Registration token not found");
      }

      return response.json();
    },
    enabled: !!registrationToken, // Only run if token exists
    retry: false, // Don't retry on failure
  });
}

export type { RegistrationStatus };
