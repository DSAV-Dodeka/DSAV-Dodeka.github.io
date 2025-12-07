import { useQuery } from "@tanstack/react-query";
import * as backend from "./backend.ts";

export function useSessionInfo() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      return backend.getSessionInfo();
    },
    // Refetch in background periodically
    refetchInterval: 60000, // 1 minute
    staleTime: 30000, // 30 seconds
  });
}

export type { SessionInfo } from "./backend.ts";

export function useRegistrationStatus(registrationToken: string | null) {
  return useQuery({
    queryKey: ["registration-status", registrationToken],
    queryFn: async () => {
      if (!registrationToken) {
        throw new Error("No registration token provided");
      }
      return backend.getRegistrationStatus(registrationToken);
    },
    enabled: !!registrationToken, // Only run if token exists
    retry: false, // Don't retry on failure
  });
}

export type { RegistrationStatus } from "./backend.ts";
