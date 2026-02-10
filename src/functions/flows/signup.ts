import { faroeClient } from "$functions/faroe.ts";
import { setSession } from "$functions/backend.ts";

type SignupResult =
  | { ok: true; sessionToken: string }
  | { ok: false; error: string };

export class SignupFlow {
  private emailVerified = false;
  private passwordSet = false;

  async verifyEmail(
    signupToken: string,
    verificationCode: string,
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    if (this.emailVerified) {
      return { ok: true };
    }
    const result = await faroeClient.verifySignupEmailAddressVerificationCode(
      signupToken,
      verificationCode,
    );
    if (!result.ok && result.errorCode !== "email_address_already_verified") {
      return { ok: false, error: result.errorCode };
    }
    this.emailVerified = true;
    return { ok: true };
  }

  async tryComplete(
    signupToken: string,
    verificationCode: string,
    password: string,
  ): Promise<SignupResult> {
    const verifyResult = await this.verifyEmail(signupToken, verificationCode);
    if (!verifyResult.ok) {
      return verifyResult;
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
