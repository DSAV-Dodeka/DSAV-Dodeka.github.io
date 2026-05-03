import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import * as backend from "./backend.ts";

// --- Session queries ---

export const sessionInfoOptions = queryOptions({
  queryKey: ["session"] as const,
  queryFn: () => backend.getSessionInfo(),
  staleTime: 30000,
});

export const secondarySessionInfoOptions = queryOptions({
  queryKey: ["session-secondary"] as const,
  queryFn: () => backend.getSessionInfo(true),
  staleTime: 10000,
});

export function useSessionInfo() {
  return useQuery({
    ...sessionInfoOptions,
    refetchInterval: 60000,
  });
}

export function useSecondarySessionInfo() {
  return useQuery({
    ...secondarySessionInfoOptions,
    refetchInterval: (query) => {
      if (query.state.data) {
        return 30000;
      }
      return false;
    },
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
    if (import.meta.env.DEV && typeof window !== "undefined") {
      const { getDebugBirthdays } = await import("./debug-user.ts");
      const debugBirthdays = getDebugBirthdays();
      if (debugBirthdays) return debugBirthdays;
    }

    return backend.getMemberBirthdays();
  },
});

// --- Member query hooks ---

export function useMemberBirthdays(enabled: boolean) {
  return useQuery({ ...memberBirthdaysOptions, enabled });
}

// --- Admin query options ---

export const registrationsOptions = queryOptions({
  queryKey: ["admin", "registrations"] as const,
  queryFn: backend.listRegistrations,
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
