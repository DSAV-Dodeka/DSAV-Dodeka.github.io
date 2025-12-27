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

// Secondary session is used for admin auth during testing
// It doesn't affect the primary logged-in user
// Only polls when logged in to avoid unnecessary network requests
export function useSecondarySessionInfo() {
  return useQuery({
    queryKey: ["session-secondary"],
    queryFn: async () => {
      return backend.getSessionInfo(true);
    },
    // Only poll when logged in - login/logout trigger immediate refetch via invalidateQueries
    refetchInterval: (query) => {
      if (query.state.data) {
        return 30000; // 30 seconds when logged in (session maintenance)
      }
      return false; // Don't poll when not logged in
    },
    staleTime: 10000, // 10 seconds
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
