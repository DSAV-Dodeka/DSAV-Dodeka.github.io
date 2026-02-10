# Authentication Flow Documentation

## Type Checking

Run `npm run check` to type-check the project. Note: there are pre-existing errors in legacy `AdminOld`/`LedenOld` code that can be ignored.

## Overview

This project implements a registration and login flow using:
- **Faroe** (Go auth server) - Handles authentication primitives
- **Backend API** (Python) - Manages user data and newuser pre-registration
- **Frontend** (React with React Router 7) - User interface

## Architecture

### Components

1. **tiauth-faroe** (Port 12770)
   - Go-based Faroe server distribution
   - Handles signup, signin, password reset, etc.
   - Uses external user store (our Python backend)
   - Sends verification emails via SMTP

2. **dodeka/backend** (Port 12780)
   - Python API server using hfree
   - Implements Faroe user store protocol
   - Manages newusers pre-registration flow
   - Provides session management endpoints

3. **dodekafrontend** (this repo)
   - React application with React Router 7
   - Consumes both Faroe and backend APIs

## Authentication Flow Patterns (Current Implementation)

All authentication flows in this project follow a consistent, well-tested pattern. This section describes the standard approach for implementing new authentication flows.

### Flow Architecture Pattern

Each authentication flow consists of three layers:

1. **Flow Logic** (`src/functions/flows/*.ts`)
   - Pure TypeScript functions with no React dependencies
   - Reusable across both testing and production
   - Handles Faroe API calls and error responses

2. **Flow-Test Component** (`src/pages/flow-test/*Flow.tsx`)
   - Testing UI for the flow
   - Uses React state for token storage
   - Pre-filled test data
   - Debugging information visible (tokens, status)

3. **Production Page** (`src/pages/account/*/*.tsx`)
   - User-facing implementation
   - URL parameters for token storage (survives page refresh)
   - Session checks and redirects
   - Clean UX without debug information

### Standard Flow Pattern

#### 1. Flow Logic (`src/functions/flows/[flow-name].ts`)

**Structure:**
```typescript
// Step 1: Request function (returns token)
export async function request[Flow](
  sessionToken: string,  // if requires login
  ...params
): Promise<{ ok: true; token: string } | { ok: false; error: string }>

// Step 2: Flow class (stateful, handles retries)
export class [Flow]Flow {
  private step1Verified = false;
  private step2Verified = false;

  async tryComplete(
    sessionToken: string,  // if requires login
    token: string,
    ...verificationParams
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    // Verify each step, tracking state internally
    // Skip already-completed steps on retry
    // Handle specific error codes (e.g., already_verified)
    // Return simple ok/error result
  }
}
```

**Key Principles:**
- **State machine classes**: Track progress through multi-step flows
- **Retry support**: Skip completed steps when user retries (e.g., weak password)
- **Error handling**: Check for `already_verified` type errors and skip those steps
- **Simple returns**: Always `{ ok: true }` or `{ ok: false, error: string }`
- **No React**: Pure TypeScript for maximum reusability

#### 2. Flow-Test Component (`src/pages/flow-test/[Flow]Flow.tsx`)

**Structure:**
```typescript
export default function [Flow]FlowTest() {
  const flowInstance = useRef(new [Flow]Flow());
  const [step, setStep] = useState<"initial" | "verify" | "complete">("initial");
  const [token, setToken] = useState("");
  // ... form state

  // Step 1: Request flow
  const handleRequest = async () => {
    const result = await request[Flow](...);
    if (!result.ok) { setStatus(`✗ ${result.error}`); return; }
    setToken(result.token);
    setStep("verify");
  };

  // Step 2: Complete flow
  const handleComplete = async () => {
    const result = await flowInstance.current.tryComplete(token, ...);
    if (!result.ok) { setStatus(`✗ ${result.error}`); return; }
    setStep("complete");
  };

  return /* Multi-step form UI with debug info */;
}
```

**Features:**
- Pre-filled test data from `constants.ts`
- Shows tokens and debug information
- "Start Over" button to reset flow
- Uses React state for token storage (simple for testing)
- Clear step-by-step progression

#### 3. Production Page (`src/pages/account/[flow]/[flow].tsx`)

**Structure:**
```typescript
export default function [Flow]() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { data: session, isLoading } = useSessionInfo(); // if requires login

  // Check session if needed
  if (!session) { return <LoginRequired />; }

  // Step 1: No token in URL
  if (!token) {
    const handleRequest = async () => {
      const result = await request[Flow](...);
      navigate(`/account/[flow]?token=${result.token}`);
    };
    return /* Initial form */;
  }

  // Step 2: Token in URL
  const handleComplete = async () => {
    const result = await flowInstance.current.tryComplete(token, ...);
    await queryClient.invalidateQueries({ queryKey: ["session"] });
    navigate("/next-page");
  };
  return /* Completion form */;
}
```

**Features:**
- URL parameter for token (`?token=xxx`)
- Session checking with `useSessionInfo()`
- Redirects on success
- No debug information
- Loading states
- Clean error messages

### Implemented Flows

**Current flows following this pattern:**

1. **Login** (`src/functions/flows/login.ts`)
   - Single function (no state machine needed)
   - Returns session token
   - Production page: `/account/login`

2. **Password Reset** (`src/functions/flows/password-reset.ts`)
   - Request → temp password emailed
   - Verify temp password + set new password
   - Does NOT require existing session
   - Production page: `/account/password-reset?token=xxx`
   - Token in URL, no session needed

3. **Email Update** (`src/functions/flows/email-update.ts`)
   - Request → verification code to new email
   - Verify code + confirm with password
   - REQUIRES active session
   - Production page: `/account/email-update?token=xxx`
   - Token in URL, session required

4. **Account Deletion** (`src/functions/flows/account-deletion.ts`)
   - Request → creates deletion token
   - Confirm with password
   - REQUIRES active session
   - Production page: `/account/delete?token=xxx`
   - Token in URL, session required

### File Organization

```
src/
├── functions/
│   └── flows/
│       ├── api.ts           # Backend API calls
│       ├── faroe.ts         # Faroe client
│       ├── login.ts
│       ├── signup.ts
│       ├── password-reset.ts
│       ├── email-update.ts
│       └── account-deletion.ts
├── pages/
│   ├── flow-test/
│   │   ├── flow-test.tsx    # Main test page with tabs
│   │   ├── flow-test.css
│   │   ├── constants.ts     # TEST_EMAIL, TEST_PASSWORD, etc.
│   │   ├── RegisterFlow.tsx
│   │   ├── LoginFlow.tsx
│   │   ├── PasswordResetFlow.tsx
│   │   ├── EmailUpdateFlow.tsx
│   │   └── AccountDeletionFlow.tsx
│   └── account/
│       ├── login/
│       │   ├── login.tsx
│       │   └── login.css
│       ├── password-reset/
│       │   ├── password-reset.tsx
│       │   └── password-reset.css
│       ├── email-update/
│       │   ├── email-update.tsx
│       │   └── email-update.css
│       └── delete/
│           ├── delete.tsx
│           └── delete.css
```

### Import Pattern

All imports use `$`-based aliases with file extensions:

```typescript
import { flowFunction } from "$functions/flows/flow-name.ts";
import PageTitle from "$components/PageTitle.tsx";
import * as api from "$functions/flows/api.ts";
```

Configured in `tsconfig.json`:
```json
{
  "paths": {
    "$functions/*": ["./src/functions/*"],
    "$components/*": ["./src/components/*"]
  }
}
```

### Routes Structure

All account-related routes are grouped under `/account`:

```typescript
// src/routes.ts
...prefix("account", [
  route("login", "./pages/account/login/login.tsx"),
  route("password-reset", "./pages/account/password-reset/password-reset.tsx"),
  route("email-update", "./pages/account/email-update/email-update.tsx"),
  route("delete", "./pages/account/delete/delete.tsx"),
])
```

### Key Implementation Details

**Token Storage:**
- Flow-test: React state (simple, for testing)
- Production: URL parameters (survives refresh, shareable)
- Token format: 49-character string from Faroe

**Session Handling:**
- Get token: `const sessionToken = await api.getSessionToken()`
- Check session: `const { data: session } = useSessionInfo()`
- Invalidate: `await queryClient.invalidateQueries({ queryKey: ["session"] })`

**Error Handling:**
- Always return `{ ok: true }` or `{ ok: false, error: string }`
- Display errors with `✗ ${error}` prefix
- Check for "already verified" error codes and skip those steps

**Styling:**
- Each flow has its own CSS file
- Consistent class naming: `[flow-name]-container`, `[flow-name]-button`, etc.
- Common patterns: `-primary`, `-secondary`, `-danger` button variants

## Registration Flow (Split Between Backend and Frontend)

The registration flow is intentionally split between the backend (admin-initiated) and frontend (user-completed) to allow for admin approval before sending verification emails.

### Phase 1: User Registration Request

1. **User submits registration**:
   ```typescript
   // POST /auth/request_registration
   {
     "email": "user@example.com",
     "firstname": "First",
     "lastname": "Last"
   }
   ```
   Returns: `{ success: true, registration_token: "..." }`

2. **Backend creates newuser entry** with `accepted: false`:
   - Creates entry in `newusers` table
   - Creates entry in `registration_state` table with token

### Phase 2: Admin Approval

1. **Admin views pending registrations** (`/admin` page):
   ```typescript
   // GET /admin/list_newusers/
   // Returns: [{ email, firstname, lastname, accepted }]
   ```

2. **Admin accepts user**:
   ```typescript
   // POST /admin/accept_user/
   { "email": "user@example.com" }
   ```

3. **Backend performs two actions**:
   - Updates `accepted: true` in newusers table
   - Calls Faroe `createSignup(email)` to initiate signup flow
   - Updates registration_state with signup_token
   - **Verification email is sent to user automatically**

### Phase 3: User Completes Registration

User receives email with verification code and completes signup.

**SignupFlow class handles**:
1. **Verify Email** - `verifySignupEmailAddressVerificationCode()`
2. **Set Password** - `setSignupPassword()`
3. **Complete Signup** - `completeSignup()` → returns sessionToken
4. **Set Session Cookie** - `setSession(sessionToken)`

The `SignupFlow` class (in `src/functions/flows/signup.ts`) automatically tracks progress and skips completed steps on retry (useful for weak password errors).

## Login Flow

**Simple login flow**:
1. Create signin - `createSignin(email)` → signinToken
2. Verify password - `verifySigninUserPassword(signinToken, password)`
3. Complete signin - `completeSignin(signinToken)` → sessionToken
4. Set session - `setSession(sessionToken)`

The `login()` function (in `src/functions/flows/login.ts`) handles all these steps and returns `{ ok: true, sessionToken }` or `{ ok: false, error }`.

## Backend API Endpoints

### User Registration
- `POST /auth/request_registration` - Create registration request
  - Body: `{ email, firstname, lastname }`
  - Returns: `{ success, message, registration_token }`
- `POST /auth/registration_status` - Check registration status
  - Body: `{ registration_token }`
  - Returns: `{ email, accepted, signup_token }`

### Admin
- `GET /admin/list_newusers/` - List all registration requests
- `POST /admin/accept_user/` - Accept user and initiate Faroe signup
  - Body: `{ email }`
  - Returns: `{ success, message, signup_token }`
- `POST /admin/add_permission/` - Add permission to user
- `POST /admin/remove_permission/` - Remove permission from user

### Session Management
- `POST /cookies/set_session/` - Set session cookie (requires credentials)
  - Body: `{ session_token }`
- `GET /auth/session_info/` - Get current session info (requires credentials)
  - Returns: `{ user: { user_id, email, firstname, lastname, permissions }, created_at, expires_at }`
- `POST /cookies/clear_session/` - Clear current session (requires credentials)
- `GET /cookies/session_token/` - Get session token from cookie (requires credentials)
  - Returns: `{ session_token }`

### Testing Endpoints
- `POST /test/clear_tables` - Clear all user data
- `POST /test/prepare_user` - Create newuser with accepted=true
  - Body: `{ email, names }`

### Faroe Private Endpoint
- `POST /private/invoke_user_action` - Proxy to Faroe server (private, only accessible by auth server)

## Frontend Code Structure

### Functions Organization

**`src/functions/flows/`** - Core authentication logic (fully reviewed and correct):
- `api.ts` - Backend API calls (clearTables, requestRegistration, acceptUser, session management)
- `faroe.ts` - Faroe client initialization
- `signup.ts` - SignupFlow class with state tracking and retry logic
- `login.ts` - login() function that handles complete login flow
- `password-reset.ts` - requestPasswordReset() and PasswordResetFlow class
- `email-update.ts` - requestEmailUpdate() and EmailUpdateFlow class
- `account-deletion.ts` - requestAccountDeletion() and AccountDeletionFlow class

### Production Pages

**Account Pages (all fully reviewed and correct):**

**`/account/login`** - `src/pages/account/login/login.tsx`
- Clean login form with email and password
- Uses `login()` function from flows
- Redirects to home on success
- Links to password reset
- Session state management with redirect

**`/account/password-reset`** - `src/pages/account/password-reset/password-reset.tsx`
- Two-step process with URL token (`?token=xxx`)
- Step 1: Enter email → sends temp password
- Step 2: Enter temp password + new password
- Uses PasswordResetFlow class for retry support
- Blocks access if already logged in (with logout button)
- Does NOT require existing session

**`/account/email-update`** - `src/pages/account/email-update/email-update.tsx`
- Two-step process with URL token (`?token=xxx`)
- Step 1: Enter new email → sends verification code
- Step 2: Enter code + current password
- Uses EmailUpdateFlow class for retry support
- REQUIRES active session (redirects if not logged in)
- Shows current email from session

**`/account/delete`** - `src/pages/account/delete/delete.tsx`
- Two-step process with URL token (`?token=xxx`)
- Step 1: Confirm deletion intent
- Step 2: Verify with password
- Uses AccountDeletionFlow class
- REQUIRES active session (redirects if not logged in)
- Warning messages about permanent deletion
- Redirects to home after completion

**Other Pages:**

**`/admin`** - `src/pages/admin.tsx`
- View pending registrations
- Accept users (triggers Faroe signup)

**`/profile`** - `src/pages/profile.tsx`
- View account information
- Logout functionality
- Account management features

### Testing Pages

**`/flow-test`** - `src/pages/flow-test/` (fully reviewed and correct)

Main testing interface for authentication flows. Clean, organized structure:

**Files**:
- `flow-test.tsx` - Main component with sidebar and tabs
- `flow-test.css` - Shared styles
- `RegisterFlow.tsx` - Registration flow testing
- `LoginFlow.tsx` - Login flow testing
- `PasswordResetFlow.tsx` - Password reset flow testing
- `EmailUpdateFlow.tsx` - Email update flow testing
- `AccountDeletionFlow.tsx` - Account deletion flow testing
- `constants.ts` - Test data (TEST_EMAIL, TEST_PASSWORD, etc.)

**Features**:
- **Sidebar Actions**:
  - Clear Tables - Clears all database tables
  - Logout - Clears session cookie
- **Sidebar Links**:
  - Admin Page - Navigate to admin interface
  - Test Data Display - Shows test password for easy copying
- **Status Display**: Shows success/error feedback for actions

**Tabs**:
1. **Register** - Full registration flow
   - Request registration (user submits info)
   - Admin accepts user (triggers Faroe signup)
   - Complete signup (verify email code + set password)
   - Uses SignupFlow class with automatic retry support

2. **Login** - Simple login flow
   - Email + password form
   - Uses login() function
   - Establishes session on success

3. **Password Reset** - Password reset flow
   - Request reset (email → temp password)
   - Verify temp password + set new password
   - Uses PasswordResetFlow class

4. **Email Update** - Update email address
   - Enter new email (sends verification code)
   - Verify code + confirm with password
   - Uses EmailUpdateFlow class
   - Requires active session

5. **Delete Account** - Permanently delete account
   - Confirm deletion intent
   - Verify with password
   - Uses AccountDeletionFlow class
   - Requires active session

## Running the Stack

1. **Faroe Server**
   ```bash
   cd ~/files/gitp/tiauth-faroe
   CGO_ENABLED=1 go run . --insecure --no-smtp-init --no-keep-alive --interactive --env-file .env.test
   ```

2. **Backend API**
   ```bash
   cd ~/files/gitp/dodeka/backend
   uv run apiserver
   ```

3. **Frontend**
   ```bash
   cd ~/files/gitp/dodekafrontend
   npm run dev
   ```

## Testing Workflow

1. Navigate to `http://localhost:5173/flow-test`
2. Use "Clear Tables" to reset database
3. Test registration:
   - Fill in user details (or use pre-filled test data)
   - Click "Request Registration"
   - Click "Accept User (Admin)" to trigger Faroe signup
   - Check Faroe console logs for verification code
   - Enter code and password
   - Click "Complete Signup"
4. Test login:
   - Switch to "Login" tab
   - Enter email and password
   - Click "Login"
5. Use "Logout" action to clear session

## Frontend Repository Structure

### React Router 7

Routes defined in `src/routes.ts`:
```typescript
layout("./pages/layout.tsx", [
  route("flow-test", "./pages/flow-test/flow-test.tsx"),
  route("login", "./pages/login/login.tsx"),
  route("admin", "./pages/admin.tsx"),
  route("profile", "./pages/profile.tsx"),
  // ... other routes
])
```

Configuration in `react-router.config.ts`:
- `appDirectory: "src"`
- `ssr: false` (client-side only)

---

## LEGACY/OUTDATED SECTIONS

The following sections describe proof-of-concept implementations that are **no longer up to date** and should not be used as reference:

### ⚠️ Outdated Pages (Proof of Concept)

The following pages were initial implementations but have been superseded by the flow-test infrastructure:

- `/register` - `src/pages/register.tsx` - OLD registration implementation
- `/password-reset` - `src/pages/password-reset.tsx` - OLD password reset
- `/auth-test` - `src/pages/test-register-tabs.tsx` - OLD comprehensive test page

These pages may still exist in the codebase but are not actively maintained and may not work correctly with the current backend API structure.

### ⚠️ Outdated Functions (Proof of Concept)

The following function files were proof of concept and are no longer the correct approach:

- `src/functions/faroe-client.ts` - OLD Faroe wrapper functions
- `src/functions/auth-flow.ts` - OLD high-level auth flow helpers

**Use instead**: Functions in `src/functions/flows/` (api.ts, faroe.ts, signup.ts, login.ts)

### ⚠️ Outdated Documentation

The sections below this point in the original documentation describe the old proof-of-concept implementation and should be considered **historical reference only**:

- Old "Frontend Pages" section describing /register, /login, /profile, /password-reset
- Old "Test Registration Page (Simple)" section describing /test-register
- Old "Auth Testing Page (Full)" section describing /auth-test
- Old "Reusable Functions" sections describing faroe-client.ts and auth-flow.ts

The current, correct implementation is documented in the sections above (Frontend Code Structure, Production Pages, Testing Pages).
