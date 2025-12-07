import { faroeClient } from "$functions/flows/faroe.ts";

type RequestDeletionResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

type CompleteDeletionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function requestAccountDeletion(
  sessionToken: string
): Promise<RequestDeletionResult> {
  const result = await faroeClient.createUserDeletion(sessionToken);
  if (!result.ok) {
    return { ok: false, error: result.errorCode };
  }
  return { ok: true, token: result.userDeletionToken };
}

export class AccountDeletionFlow {
  private identityVerified = false;

  async tryComplete(
    sessionToken: string,
    token: string,
    password: string
  ): Promise<CompleteDeletionResult> {
    if (!this.identityVerified) {
      const result = await faroeClient.verifyUserDeletionUserPassword(
        sessionToken,
        token,
        password
      );
      // In case of user_identity_already_verified we know it's already done
      if (!result.ok && result.errorCode !== "user_identity_already_verified") {
        return { ok: false, error: result.errorCode };
      }
      this.identityVerified = true;
    }

    const result = await faroeClient.completeUserDeletion(sessionToken, token);
    if (!result.ok) {
      return { ok: false, error: result.errorCode };
    }

    return { ok: true };
  }
}
