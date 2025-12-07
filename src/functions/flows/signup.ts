import { faroeClient } from "$functions/faroe.ts";
import { setSession } from "$functions/backend.ts";

type SignupResult =
  | { ok: true; sessionToken: string }
  | { ok: false; error: string };

export class SignupFlow {
  private emailVerified = false;
  private passwordSet = false;

  async tryComplete(
    signupToken: string,
    verificationCode: string,
    password: string,
  ): Promise<SignupResult> {
    if (!this.emailVerified) {
      const result = await faroeClient.verifySignupEmailAddressVerificationCode(
        signupToken,
        verificationCode,
      );
      // In case of the email_address_already_verified code we know it's already done
      if (!result.ok && result.errorCode !== "email_address_already_verified") {
        return { ok: false, error: result.errorCode };
      }
      this.emailVerified = true;
    }

    if (!this.passwordSet) {
      const result = await faroeClient.setSignupPassword(signupToken, password);
      // In case of password_already_set we know it's already one
      if (!result.ok && result.errorCode !== "password_already_set") {
        return { ok: false, error: result.errorCode };
      }
      this.passwordSet = true;
    }

    const result = await faroeClient.completeSignup(signupToken);
    if (!result.ok) {
      return { ok: false, error: result.errorCode };
    }

    await setSession(result.sessionToken);
    return { ok: true, sessionToken: result.sessionToken };
  }
}
