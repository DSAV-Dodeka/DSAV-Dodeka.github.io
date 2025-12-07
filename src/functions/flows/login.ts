import { faroeClient } from "./faroe";
import { setSession } from "./api";

type LoginResult =
  | { ok: true; sessionToken: string }
  | { ok: false; error: string };

export async function login(
  email: string,
  password: string
): Promise<LoginResult> {
  // Create signin
  const signinResult = await faroeClient.createSignin(email);
  if (!signinResult.ok) {
    return { ok: false, error: signinResult.errorCode };
  }

  // Verify password
  const verifyResult = await faroeClient.verifySigninUserPassword(
    signinResult.signinToken,
    password
  );
  if (!verifyResult.ok) {
    return { ok: false, error: verifyResult.errorCode };
  }

  // Complete signin
  const completeResult = await faroeClient.completeSignin(
    signinResult.signinToken
  );
  if (!completeResult.ok) {
    return { ok: false, error: completeResult.errorCode };
  }

  // Set session
  await setSession(completeResult.sessionToken);

  return { ok: true, sessionToken: completeResult.sessionToken };
}
