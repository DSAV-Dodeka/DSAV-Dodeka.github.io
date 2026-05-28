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
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useSecondarySessionInfo() {
  return useQuery({
    queryKey: ["session-secondary"],
    queryFn: async () => {
      return backend.getSessionInfo(true);
    },
    refetchInterval: (query) => {
      if (query.state.data) {
        return 30000;
      }
      return false;
    },
    staleTime: 10000,
  });
}

export type { SessionInfo } from "./backend.ts";

export function useRegistrationStatus(registrationId: string | null) {
  return useQuery({
    queryKey: ["registration-status", registrationId],
    queryFn: async () => {
      if (!registrationId) {
        throw new Error("No registration_id provided");
      }
      return backend.getRegistrationStatus(registrationId);
    },
    enabled: !!registrationId,
    retry: false,
  });
}

export type { RegistrationStatus } from "./backend.ts";

// --- Member query options ---

export const memberBirthdaysOptions = queryOptions({
  queryKey: ["member", "birthdays"] as const,
  queryFn: async () => {
    if (import.meta.env.DEV) {
      const { getDebugBirthdays } = await import("./debug-user.ts");
      const debug = getDebugBirthdays();
      if (debug) return debug;
    }
    return backend.getMemberBirthdays();
  },
});

// --- Member query hooks ---

export function useMemberBirthdays(enabled: boolean) {
  return useQuery({ ...memberBirthdaysOptions, enabled });
}

// --- Private key-value store ---

export function usePrivate<T = unknown>(key: string, enabled: boolean) {
  return useQuery({
    queryKey: ["private", key] as const,
    queryFn: () => backend.getPrivate<T>(key),
    enabled: enabled && !!key,
    retry: false,
  });
}

export function useAdminPrivate(key: string, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "private", key] as const,
    queryFn: () => backend.adminGetPrivate(key),
    enabled: enabled && !!key,
    retry: false,
  });
}

export const adminPrivateListOptions = queryOptions({
  queryKey: ["admin", "private", "_list"] as const,
  queryFn: backend.adminListPrivate,
});

export function useAdminPrivateList(enabled: boolean) {
  return useQuery({ ...adminPrivateListOptions, enabled });
}

export function useAdminSetPrivate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      key,
      value,
      role,
    }: {
      key: string;
      value: unknown;
      role?: string;
    }) => backend.adminSetPrivate(key, value, role),
    onSuccess: async (_, { key }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "private", key] }),
        queryClient.invalidateQueries({ queryKey: ["private", key] }),
        queryClient.invalidateQueries({
          queryKey: adminPrivateListOptions.queryKey,
        }),
      ]);
    },
  });
}

// --- Admin query options ---

// Admin data changes rarely and is refreshed explicitly (mutations invalidate,
// the "r" shortcut / refresh buttons refetch). A staleTime keeps mount/focus
// events from hammering the backend; without it (staleTime: 0) every window
// focus refetches the whole admin dashboard.
const ADMIN_STALE_TIME = 60_000;

export const registrationsOptions = queryOptions({
  queryKey: ["admin", "registrations"] as const,
  queryFn: backend.listRegistrations,
  staleTime: ADMIN_STALE_TIME,
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
  staleTime: ADMIN_STALE_TIME,
});

export const syncStatusOptions = queryOptions({
  queryKey: ["admin", "syncStatus"] as const,
  queryFn: backend.getSyncStatus,
  staleTime: ADMIN_STALE_TIME,
});

// --- Admin query hooks ---

export function useRegistrations(enabled: boolean) {
  return useQuery({ ...registrationsOptions, enabled });
}

export function useUsers(enabled: boolean) {
  return useQuery({ ...usersOptions, enabled });
}

export function useSyncStatus(enabled: boolean) {
  return useQuery({ ...syncStatusOptions, enabled });
}

// --- Admin mutations ---

export function useAcceptRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: backend.acceptRegistration,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: registrationsOptions.queryKey,
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
    mutationFn: ({
      csvContent,
      syncStateCounter,
      fileModifiedAt,
    }: {
      csvContent: string;
      syncStateCounter?: number;
      fileModifiedAt?: number;
    }) => backend.importSync(csvContent, syncStateCounter, fileModifiedAt),
  });
}

async function invalidateAllAdmin(queryClient: ReturnType<typeof useQueryClient>) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: syncStatusOptions.queryKey }),
    queryClient.invalidateQueries({ queryKey: registrationsOptions.queryKey }),
    queryClient.invalidateQueries({ queryKey: usersOptions.queryKey }),
  ]);
}

export function useResolveSyncMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bondsnummer,
      kind,
      subjectId,
      syncStateCounter,
    }: {
      bondsnummer: number;
      kind: string;
      subjectId: string | null;
      syncStateCounter?: number;
    }) => backend.resolveSyncMatch(bondsnummer, kind, subjectId, syncStateCounter),
    onSuccess: () => invalidateAllAdmin(queryClient),
  });
}

export function useLinkBondsnummer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      kind,
      subjectId,
      bondsnummer,
    }: {
      kind: string;
      subjectId: string;
      bondsnummer: number;
    }) => backend.linkBondsnummer(kind, subjectId, bondsnummer),
    onSuccess: () => invalidateAllAdmin(queryClient),
  });
}

export function useCompleteSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (syncStateCounter?: number) =>
      backend.completeSync(syncStateCounter),
    onSuccess: () => invalidateAllAdmin(queryClient),
  });
}

export function useResendRegistrationInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (registrationId: string) =>
      backend.resendRegistrationInvite(registrationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: registrationsOptions.queryKey,
      });
    },
  });
}

export function useDeleteRegistration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (registrationId: string) =>
      backend.deleteRegistration(registrationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: registrationsOptions.queryKey,
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => backend.deleteUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersOptions.queryKey });
    },
  });
}
