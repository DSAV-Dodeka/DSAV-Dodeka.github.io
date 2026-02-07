// Combines loading admin credentials from the private API with logging in
// as a secondary session. Used by dev keyboard shortcuts and can be reused
// by any testing code that needs a quick admin session.

import { getAdminCredentials } from "$functions/backend.ts";
import { loginSecondary } from "$functions/flows/login.ts";

export async function loginAdminSession(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const creds = await getAdminCredentials();
  const result = await loginSecondary(creds.email, creds.password);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  return { ok: true };
}
