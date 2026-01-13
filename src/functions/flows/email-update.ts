import { faroeClient } from "$functions/faroe.ts";

type RequestEmailUpdateResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

type CompleteEmailUpdateResult =
  | { ok: true }
  | { ok: false; error: string };

export async function requestEmailUpdate(
  sessionToken: string,
  newEmail: string
): Promise<RequestEmailUpdateResult> {
  const result = await faroeClient.createUserEmailAddressUpdate(
    sessionToken,
    newEmail
  );
  if (!result.ok) {
    return { ok: false, error: result.errorCode };
  }
  return { ok: true, token: result.userEmailAddressUpdateToken };
}

export class EmailUpdateFlow {
  private emailVerified = false;
  private identityVerified = false;

  async tryComplete(
    sessionToken: string,
    token: string,
    verificationCode: string,
    password: string
  ): Promise<CompleteEmailUpdateResult> {
    if (!this.emailVerified) {
      const result = await faroeClient.verifyUserEmailAddressUpdateEmailAddressVerificationCode(
        sessionToken,
        token,
        verificationCode
      );
      // In case of email_address_already_verified we know it's already done
      if (!result.ok && result.errorCode !== "email_address_already_verified") {
        return { ok: false, error: result.errorCode };
      }
      this.emailVerified = true;
    }

    if (!this.identityVerified) {
      const result = await faroeClient.verifyUserEmailAddressUpdateUserPassword(
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

    const result = await faroeClient.completeUserEmailAddressUpdate(
      sessionToken,
      token
    );
    if (!result.ok) {
      return { ok: false, error: result.errorCode };
    }

    return { ok: true };
  }
}
