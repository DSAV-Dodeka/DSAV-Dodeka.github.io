import { faroeClient } from "$functions/flows/faroe.ts";

type RequestResetResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

type CompleteResetResult =
  | { ok: true }
  | { ok: false; error: string };

export async function requestPasswordReset(
  email: string
): Promise<RequestResetResult> {
  const result = await faroeClient.createUserPasswordReset(email);
  if (!result.ok) {
    return { ok: false, error: result.errorCode };
  }
  return { ok: true, token: result.userPasswordResetToken };
}

export class PasswordResetFlow {
  private tempPasswordVerified = false;
  private newPasswordSet = false;

  async tryComplete(
    token: string,
    tempPassword: string,
    newPassword: string
  ): Promise<CompleteResetResult> {
    if (!this.tempPasswordVerified) {
      const result = await faroeClient.verifyUserPasswordResetTemporaryPassword(
        token,
        tempPassword
      );
      // In case of temporary_password_already_verified we know it's already done
      if (!result.ok && result.errorCode !== "temporary_password_already_verified") {
        return { ok: false, error: result.errorCode };
      }
      this.tempPasswordVerified = true;
    }

    if (!this.newPasswordSet) {
      const result = await faroeClient.setUserPasswordResetNewPassword(
        token,
        newPassword
      );
      // In case of new_password_already_set we know it's already set
      if (!result.ok && result.errorCode !== "new_password_already_set") {
        return { ok: false, error: result.errorCode };
      }
      this.newPasswordSet = true;
    }

    const result = await faroeClient.completeUserPasswordReset(token);
    if (!result.ok) {
      return { ok: false, error: result.errorCode };
    }

    return { ok: true };
  }
}
