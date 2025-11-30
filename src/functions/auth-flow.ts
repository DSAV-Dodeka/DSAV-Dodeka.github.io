import { faroeClient, prepareUser, setSession } from "./faroe-client";

export type RegistrationStep = "preregister" | "signup" | "verify" | "password" | "complete";

export interface RegistrationState {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  signupToken: string | null;
  step: RegistrationStep;
}

export interface StepResult {
  success: boolean;
  message: string;
  nextStep?: RegistrationStep;
  signupToken?: string;
  sessionToken?: string;
}

/**
 * Pre-register a user in the newusers table with accepted=true
 */
export async function preregisterUser(
  email: string,
  firstname: string,
  lastname: string
): Promise<StepResult> {
  try {
    await prepareUser(email, [firstname, lastname]);
    return {
      success: true,
      message: "✓ User pre-registered successfully! Now proceed to signup.",
      nextStep: "signup",
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Create a Faroe signup and send verification email
 */
export async function createSignup(email: string): Promise<StepResult> {
  try {
    const result = await faroeClient.createSignup(email);

    if (!result.ok) {
      return {
        success: false,
        message: `✗ Signup failed: ${JSON.stringify(result)}`,
      };
    }

    return {
      success: true,
      message: "✓ Signup created! Check your email for verification code (or check SMTP server logs).",
      nextStep: "verify",
      signupToken: result.signupToken,
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Verify email address with verification code
 */
export async function verifyEmail(
  signupToken: string,
  verificationCode: string
): Promise<StepResult> {
  try {
    const result = await faroeClient.verifySignupEmailAddressVerificationCode(
      signupToken,
      verificationCode
    );

    if (!result.ok) {
      return {
        success: false,
        message: `✗ Verification failed: ${JSON.stringify(result)}`,
      };
    }

    return {
      success: true,
      message: "✓ Email verified! Now set your password.",
      nextStep: "password",
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Set password and complete signup, establishing session
 */
export async function setPasswordAndComplete(
  signupToken: string,
  password: string
): Promise<StepResult> {
  try {
    // Set password
    const setPasswordResult = await faroeClient.setSignupPassword(signupToken, password);

    if (!setPasswordResult.ok) {
      return {
        success: false,
        message: `✗ Set password failed: ${JSON.stringify(setPasswordResult)}`,
      };
    }

    // Complete signup
    const completeResult = await faroeClient.completeSignup(signupToken);

    if (!completeResult.ok) {
      return {
        success: false,
        message: `✗ Complete signup failed: ${JSON.stringify(completeResult)}`,
      };
    }

    // Set session cookie
    await setSession(completeResult.sessionToken);

    return {
      success: true,
      message: `✓ Registration complete! Session token: ${completeResult.sessionToken.substring(0, 20)}...`,
      nextStep: "complete",
      sessionToken: completeResult.sessionToken,
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Complete registration flow for a user who already has a signup token
 * and has verified their email
 */
export async function completeRegistration(
  signupToken: string,
  password: string
): Promise<StepResult> {
  return setPasswordAndComplete(signupToken, password);
}

/**
 * Sign in - create signin flow
 */
export async function createSignin(email: string): Promise<StepResult> {
  try {
    const result = await faroeClient.createSignin(email);

    if (!result.ok) {
      return {
        success: false,
        message: `✗ Signin failed: ${JSON.stringify(result)}`,
      };
    }

    return {
      success: true,
      message: "✓ Signin created! Enter your password.",
      signupToken: result.signinToken,
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Verify signin password and complete signin
 */
export async function verifySigninPassword(
  signinToken: string,
  password: string
): Promise<StepResult> {
  try {
    const verifyResult = await faroeClient.verifySigninUserPassword(signinToken, password);

    if (!verifyResult.ok) {
      return {
        success: false,
        message: `✗ Password verification failed: ${JSON.stringify(verifyResult)}`,
      };
    }

    const completeResult = await faroeClient.completeSignin(signinToken);

    if (!completeResult.ok) {
      return {
        success: false,
        message: `✗ Complete signin failed: ${JSON.stringify(completeResult)}`,
      };
    }

    // Set session cookie
    await setSession(completeResult.sessionToken);

    return {
      success: true,
      message: `✓ Signed in successfully! Session token: ${completeResult.sessionToken.substring(0, 20)}...`,
      sessionToken: completeResult.sessionToken,
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Password Reset - create password reset flow
 */
export async function createPasswordReset(email: string): Promise<StepResult> {
  try {
    const result = await faroeClient.createUserPasswordReset(email);

    if (!result.ok) {
      return {
        success: false,
        message: `✗ Password reset failed: ${JSON.stringify(result)}`,
      };
    }

    return {
      success: true,
      message: "✓ Password reset created! Check email for temporary password.",
      signupToken: result.userPasswordResetToken,
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Verify temporary password and set new password for password reset
 */
export async function completePasswordReset(
  resetToken: string,
  tempPassword: string,
  newPassword: string
): Promise<StepResult> {
  try {
    const verifyResult = await faroeClient.verifyUserPasswordResetTemporaryPassword(
      resetToken,
      tempPassword
    );

    if (!verifyResult.ok) {
      return {
        success: false,
        message: `✗ Temporary password verification failed: ${JSON.stringify(verifyResult)}`,
      };
    }

    const setPasswordResult = await faroeClient.setUserPasswordResetNewPassword(
      resetToken,
      newPassword
    );

    if (!setPasswordResult.ok) {
      return {
        success: false,
        message: `✗ Set new password failed: ${JSON.stringify(setPasswordResult)}`,
      };
    }

    const completeResult = await faroeClient.completeUserPasswordReset(resetToken);

    if (!completeResult.ok) {
      return {
        success: false,
        message: `✗ Complete password reset failed: ${JSON.stringify(completeResult)}`,
      };
    }

    return {
      success: true,
      message: "✓ Password reset complete! You can now sign in with your new password.",
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
