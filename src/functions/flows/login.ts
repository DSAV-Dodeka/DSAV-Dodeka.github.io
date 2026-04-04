import { faroeClient } from "$functions/faroe.ts";
import { setSession } from "$functions/backend.ts";

type LoginResult =
  | { ok: true; sessionToken: string }
  | { ok: false; error: string };

// Core login logic without setting session cookie
async function performLogin(
  email: string,
  password: string,
): Promise<LoginResult> {
  // Create signin
  const signinResult = await faroeClient.createSignin(email);
  if (!signinResult.ok) {
    return { ok: false, error: signinResult.errorCode };
  }

  // Verify password
  const verifyResult = await faroeClient.verifySigninUserPassword(
    signinResult.signinToken,
    password,
  );
  if (!verifyResult.ok) {
    return { ok: false, error: verifyResult.errorCode };
  }

  // Complete signin
  const completeResult = await faroeClient.completeSignin(
    signinResult.signinToken,
  );
  if (!completeResult.ok) {
    return { ok: false, error: completeResult.errorCode };
  }

  return { ok: true, sessionToken: completeResult.sessionToken };
}

// Login and set primary session cookie
export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  const result = await performLogin(email, password);
  if (result.ok) {
    await setSession(result.sessionToken);
  }
  return result;
}

// Login and set secondary session cookie (for admin auth during testing)
export async function loginSecondary(
  email: string,
  password: string,
): Promise<LoginResult> {
  const result = await performLogin(email, password);
  if (result.ok) {
    await setSession(result.sessionToken, true);
  }
  return result;
}
