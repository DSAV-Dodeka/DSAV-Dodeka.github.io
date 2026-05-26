import { createCollection } from "@tanstack/react-db";
import { QueryClient } from "@tanstack/react-query";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { z } from "zod";
import * as backend from "$functions/backend.ts";

const queryClient = new QueryClient();

export const adminUserActionSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("add_permission"), permission: z.string() }),
  z.object({ kind: z.literal("remove_permission"), permission: z.string() }),
  z.object({ kind: z.literal("delete_user") }),
]);

export const adminUserRecordSchema = z.object({
  user_id: z.string(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  permissions: z.array(z.string()),
  bondsnummer: z.number().nullable(),
  volta_data: z.record(z.string(), z.unknown()).nullable(),
});

export const adminUserRowSchema = adminUserRecordSchema.extend({
  sort_name: z.string(),
  member_state: z.enum(["active", "inactive"]),
  available_actions: z.array(adminUserActionSchema),
});

type AdminUserRow = z.infer<typeof adminUserRowSchema>;

function normalizePermissions(permissions: string[]): string[] {
  return Array.from(new Set(permissions)).sort();
}

function toAdminUserRow(
  user: AdminUserRecord,
  allPerms: string[],
): AdminUserRow {
  const permissions = normalizePermissions(user.permissions);
  return {
    ...user,
    permissions,
    sort_name: getSortName(user),
    member_state: permissions.length > 0 ? "active" : "inactive",
    available_actions: getUserActions(permissions, allPerms),
  };
}

const usersCollection = createCollection(
  queryCollectionOptions({
    id: "admin-users",
    queryKey: ["admin", "users", "collection"] as const,
    queryClient,
    staleTime: 30000,
    schema: adminUserRowSchema,
    getKey: (user) => user.user_id,
    queryFn: async (): Promise<AdminUserRow[]> => {
      const [users, perms] = await Promise.all([
        backend.listUsers(),
        backend.getAvailablePermissions(),
      ]);
      return users.map((user) => toAdminUserRow(user, perms));
    },
    onUpdate: async ({ transaction }) => {
      for (const mutation of transaction.mutations) {
        const userId = mutation.key as string;
        const previous = normalizePermissions(
          mutation.original.permissions ?? [],
        );
        const next = normalizePermissions(mutation.modified.permissions ?? []);
        const added = next.filter(
          (permission) => !previous.includes(permission),
        );
        const removed = previous.filter(
          (permission) => !next.includes(permission),
        );

        for (const permission of added) {
          await backend.addUserPermission(userId, permission);
        }
        for (const permission of removed) {
          await backend.removeUserPermission(userId, permission);
        }
      }
    },
    onDelete: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((mutation) => {
          backend.deleteUser(mutation.key);
        }),
      );
    },
  }),
);
