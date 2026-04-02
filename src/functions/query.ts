import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import * as backend from "./backend.ts";

// --- Session queries ---

export function useSessionInfo() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      if (import.meta.env.DEV) {
        const { getDebugSession } = await import("./debug-user.ts");
        const debug = getDebugSession();
        if (debug) return debug;
      }
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

// --- Member query options ---

export const memberBirthdaysOptions = queryOptions({
  queryKey: ["member", "birthdays"] as const,
  queryFn: backend.getMemberBirthdays,
});

// --- Member query hooks ---

export function useMemberBirthdays(enabled: boolean) {
  return useQuery({ ...memberBirthdaysOptions, enabled });
}

// --- Admin query options ---

export const newUsersOptions = queryOptions({
  queryKey: ["admin", "newUsers"] as const,
  queryFn: backend.listNewUsers,
});

export const usersOptions = queryOptions({
  queryKey: ["admin", "users"] as const,
  queryFn: async () => {
    const [users, perms] = await Promise.all([
      backend.listUsers(),
      backend.getAvailablePermissions(),
    ]);
    return { users, perms };
  },
});

export const syncStatusOptions = queryOptions({
  queryKey: ["admin", "syncStatus"] as const,
  queryFn: backend.getSyncStatus,
});

// --- Admin query hooks ---

export function useNewUsers(enabled: boolean) {
  return useQuery({ ...newUsersOptions, enabled });
}

export function useUsers(enabled: boolean) {
  return useQuery({ ...usersOptions, enabled });
}

export function useSyncStatus(enabled: boolean) {
  return useQuery({ ...syncStatusOptions, enabled });
}

// --- Admin mutations ---

export function useAcceptUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: backend.acceptUser,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: newUsersOptions.queryKey }),
        queryClient.invalidateQueries({ queryKey: usersOptions.queryKey }),
      ]);
    },
  });
}

export function useResendSignupEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: backend.resendSignupEmail,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: newUsersOptions.queryKey,
      });
    },
  });
}

export function useAddPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, permission }: { userId: string; permission: string }) =>
      backend.addUserPermission(userId, permission),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersOptions.queryKey });
    },
  });
}

export function useRemovePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, permission }: { userId: string; permission: string }) =>
      backend.removeUserPermission(userId, permission),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersOptions.queryKey });
    },
  });
}

export function useImportSync() {
  return useMutation({
    mutationFn: backend.importSync,
  });
}

export function useAcceptNewSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email?: string) => backend.acceptNewSync(email),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: syncStatusOptions.queryKey,
      });
    },
  });
}

export function useRemoveDeparted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email?: string) => backend.removeDeparted(email),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: syncStatusOptions.queryKey,
      });
    },
  });
}

export function useUpdateExisting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email?: string) => backend.updateExisting(email),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: syncStatusOptions.queryKey,
      });
    },
  });
}
