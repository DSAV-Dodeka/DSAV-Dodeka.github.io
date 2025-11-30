# Authentication Flow Documentation

> **⚠️ IMPORTANT**: See [TODO.md](TODO.md) for known issues and pending fixes!

## Overview

This project implements a registration and login flow using:
- **Faroe** (Go auth server) - Handles authentication primitives
- **Backend API** (Python) - Manages user data and newuser pre-registration
- **Frontend** (React with React Router 7) - User interface

## Architecture

### Components

1. **tiauth-faroe** (Port 3777)
   - Go-based Faroe server distribution
   - Handles signup, signin, password reset, etc.
   - Uses external user store (our Python backend)
   - Sends verification emails via SMTP

2. **dodeka/backend** (Port 8000)
   - Python API server using hfree
   - Implements Faroe user store protocol
   - Manages newusers pre-registration flow
   - Provides session management endpoints

3. **dodekafrontend** (this repo)
   - React application with React Router 7
   - Consumes both Faroe and backend APIs

## Registration Flow (Split Between Backend and Frontend)

The registration flow is intentionally split between the backend (admin-initiated) and frontend (user-completed) to allow for admin approval before sending verification emails.

### Phase 1: User Registration Request

1. **User submits registration** (`/register` page):
   ```typescript
   // POST /auth/register_user
   {
     "email": "user@example.com",
     "firstname": "First",
     "lastname": "Last"
   }
   ```

2. **Backend creates newuser entry** with `accepted: false`:
   ```python
   add_new_user(store, email, firstname, lastname)
   # Creates entry in newusers table with accepted=False
   ```

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
   - **Verification email is sent to user automatically**

### Phase 3: User Completes Registration

User receives email with verification code and completes signup in one step (`/register` page).

**User provides in single form**:
- Signup token (provided by admin or from email)
- Verification code (from email)
- Password

**Frontend executes**:

1. **Verify Email**
   ```typescript
   await client.verifySignupEmailAddressVerificationCode(signupToken, verificationCode)
   ```

2. **Set Password**
   ```typescript
   await client.setSignupPassword(signupToken, password)
   ```

3. **Complete Signup**
   ```typescript
   const result = await client.completeSignup(signupToken)
   const sessionToken = result.sessionToken
   ```

4. **Set Session Cookie**
   ```typescript
   await setSession(sessionToken)
   // Calls POST /auth/set_session/ to set httpOnly cookie
   ```

### Session Establishment

After signup/signin, session must be set in browser:

```typescript
// POST /auth/set_session/
{
  "session_token": sessionToken
}
```

This sets an httpOnly cookie that's used for subsequent requests.

## Backend User Store Implementation

Located in `dodeka/backend/src/apiserver/data/auth.py`

### Key Logic in `create_user`

When Faroe tries to create a user:

1. Check if email already exists in users table → error
2. Check if user exists in newusers table → error if not found
3. Check if `accepted: true` → error if false
4. Create user with incremental ID + name-based ID
5. Store user data across multiple keys:
   - `{user_id}:profile` - firstname, lastname
   - `{user_id}:email` - email address
   - `{user_id}:password` - password hash data
   - `{user_id}:disabled` - account status
   - `{user_id}:sessions_counter` - session counter
   - `{user_id}:permissions` - permissions
6. Create index: `users_by_email[email] = user_id`
7. Remove from newusers table

## API Endpoints

### Production Endpoints

**User Registration**:
- `POST /auth/register_user` - Create registration request (accepted=false)
  - Body: `{ email, firstname, lastname }`

**Admin**:
- `GET /admin/list_newusers/` - List all registration requests
  - Returns: `[{ email, firstname, lastname, accepted }]`
- `POST /admin/accept_user/` - Accept user and initiate Faroe signup
  - Body: `{ email }`
  - Returns: `{ success, message, signup_token }`
- `POST /admin/add_permission/` - Add permission to user

**Session Management**:
- `POST /auth/set_session/` - Set session cookie (requires credentials)
  - Body: `{ session_token }`
- `GET /auth/session_info/` - Get current session info (requires credentials)
- `POST /auth/clear_session/` - Clear current session (requires credentials)
- `GET /auth/get_session_token/` - Get session token from cookie (requires credentials)
  - Returns: `{ session_token }`
- `POST /auth/delete_account/` - Delete current user's account (requires credentials)
  - Deletes user from database and clears session cookie

**Faroe Actions**:
- `POST /auth/invoke_user_action` - Proxy to Faroe server

### Testing Endpoints

For development and conformance testing:

- `POST /auth/clear_tables` - Clear all user data
- `POST /test/prepare_user` - Create newuser with accepted=true (for Faroe tests)
  - Body: `{ email, names }`

## Frontend Pages

### Production Pages

1. **`/register`** - User registration flow
   - Step 1: User submits registration request
   - Step 2: User completes signup after admin approval (code + password)

2. **`/login`** - User login page
   - Email and password authentication
   - Redirects to home after successful login
   - Link to password reset

3. **`/profile`** - User profile and account management
   - View account information
   - Change email (multi-step: enter new email → verify code)
   - Reset password (redirects to password reset page)
   - Logout
   - Delete account (with confirmation)

4. **`/password-reset`** - Password reset flow
   - Request reset (sends temp password to email)
   - Enter temp password and new password

5. **`/admin`** - Admin dashboard
   - View all registration requests
   - Accept users (triggers Faroe signup and sends verification email)

### Testing Pages

3. **`/auth-test`** - Complete auth flow testing
   - Tabs: Register, Sign In, Password Reset, Session
   - Uses `/test/prepare_user` for full Faroe conformance testing

## Frontend Implementation Notes

### Using Faroe Client

The frontend should use `@faroe/client`:

```typescript
import { Client, EndpointClient } from "@faroe/client"

class FaroeEndpointClient implements ActionInvocationEndpointClient {
  async sendActionInvocationEndpointRequest(body: string) {
    const response = await fetch("http://localhost:3777/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body
    })
    return response.text()
  }
}

const client = new Client(new FaroeEndpointClient())
```

### Session Management

After successful signup/signin:
1. Receive sessionToken from Faroe
2. Send to backend `/auth/set_session/` to set cookie
3. Use `/auth/session_info/` to check session status

## Test Flow Example

From `testapp/tests/flows.test.ts`:

```typescript
// 1. Prepare user (backend)
await userClient.prepareUser(email, ["First", "Last"])

// 2. Create signup (Faroe)
const r = await client.createSignup(email)

// 3. Get verification code from email
const code = await fetchMailData(email, "signup")

// 4. Verify email
await client.verifySignupEmailAddressVerificationCode(r.signupToken, code)

// 5. Set password
await client.setSignupPassword(r.signupToken, password)

// 6. Complete signup
const result = await client.completeSignup(r.signupToken)
// result.sessionToken can now be used
```

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

## Frontend Repository Structure

### React Router 7 Setup

This repository is in transition from React Router v6 to React Router 7:

**New System (React Router 7)**:
- Routes defined in `src/routes.ts`
- Uses new API: `layout()`, `route()`, `prefix()`, `index()`
- Configuration in `react-router.config.ts`:
  - `appDirectory: "src"`
  - `ssr: false` (client-side only)
  - Prerender routes for static generation

**Current Route Structure**:
```typescript
// src/routes.ts
layout("./pages/layout.tsx", [
  ...prefix("registreer", [
    index("./pages/registreer/registreer.tsx"),      // /registreer
    route("registered", "./pages/registreer/registered.tsx"),  // /registreer/registered
  ]),
]),
route("*?", "catchall.tsx"),  // Catches all other routes
```

**Backward Compatibility**:
- `catchall.tsx` renders old `App.tsx` for routes not migrated yet
- Old routes in `App.tsx` use React Router v6 API (`<Routes>`, `<Route>`)
- Only `/registreer` routes use new system currently

### Key Files

- `src/routes.ts` - New route definitions (React Router 7)
- `src/App.tsx` - Old app with v6 routes (still active via catchall)
- `src/pages/layout.tsx` - Layout wrapper with NavigationBar and ContactBar
- `src/catchall.tsx` - Renders App.tsx for unmigrated routes
- `react-router.config.ts` - React Router 7 configuration

### Adding New Routes

To add a new route using React Router 7:

1. Create page component in `src/pages/`
2. Add route to `src/routes.ts`:
   ```typescript
   route("mypage", "./pages/mypage.tsx")
   ```
3. Optionally add to prerender list in `react-router.config.ts`

### Dependencies

- `react-router: 7.9.1` - Core routing
- `@react-router/dev: 7.9.1` - Dev tools
- `@react-router/node: 7.9.1` - Node adapter
- `@faroe/client: 0.1.0` - Faroe authentication client (devDependency)

### Existing Registration Page

Located at `src/pages/registreer/registreer.tsx`:
- Complex form with many fields (name, address, IBAN, etc.)
- Uses external API for registration (Volta system)
- Not suitable for testing auth flow
- Will be replaced/supplemented with simpler test registration

### Test Registration Page (Simple)

**Location**: `src/pages/test-register.tsx`
**Route**: `/test-register`

Simple single-flow registration page for basic testing.

**Features**:
- Pre-filled test data (email, firstname, lastname, password)
- Step-by-step guided flow
- Clear visual feedback for each step
- Reset functionality (clears all tables)

**Flow**:
1. **Pre-register**: Creates user in newusers table with accepted=true
2. **Create Signup**: Starts Faroe signup flow, sends verification email
3. **Verify Email**: Enter verification code from email/SMTP logs
4. **Set Password**: Sets password and completes registration
5. **Complete**: Session is established and cookie is set
6. **Get Session Info** (optional): Retrieves and displays current session details

### Auth Testing Page (Full - RECOMMENDED)

**Location**: `src/pages/test-register-tabs.tsx`
**Route**: `/auth-test`

Comprehensive tabbed interface for testing all authentication flows.

**Features**:
- Tabbed interface for different auth flows
- Pre-filled test data
- Session management
- All Faroe flows implemented

**Tabs**:

1. **Register Tab**
   - Pre-registration (newusers table)
   - Email verification
   - Password setup
   - Session creation

2. **Sign In Tab**
   - Email entry
   - Password verification
   - Session creation

3. **Password Reset Tab**
   - Request reset (sends temp password)
   - Verify temp password
   - Set new password

4. **Session Tab**
   - View current session info
   - Clear current session (from cookie)
   - Delete specific session (by token)
   - Delete all sessions (by token)

**Reusable Functions**:

`src/functions/faroe-client.ts` - Low-level API calls:
- `faroeClient` - Faroe client instance
- `prepareUser(email, names)` - Pre-register user via backend
- `clearTables()` - Clear all database tables
- `setSession(sessionToken)` - Set session cookie via backend
- `getSessionInfo()` - Get current session information from cookie
- `clearCurrentSession()` - Clear the current session (deletes cookie)
- `createEmailChange(newEmail)` - Initiate email change flow, returns emailUpdateToken
- `sendEmailVerificationCode(emailUpdateToken)` - Send verification code to new email
- `verifyEmailChange(emailUpdateToken, code)` - Verify email with code
- `completeEmailChange(emailUpdateToken)` - Complete email change
- `deleteAccount()` - Delete current user's account
- Types: `SessionInfo`, `SessionUser`, `SessionResponse`, `NewUser`, `AcceptUserResponse`

`src/functions/auth-flow.ts` - High-level authentication flow logic:
- `preregisterUser(email, firstname, lastname)` - Pre-register with error handling
- `createSignup(email)` - Create Faroe signup
- `verifyEmail(signupToken, code)` - Verify email with code
- `setPasswordAndComplete(signupToken, password)` - Set password and complete signup
- `completeRegistration(signupToken, password)` - Alias for setPasswordAndComplete
- `createSignin(email)` - Create signin flow
- `verifySigninPassword(signinToken, password)` - Verify password and complete signin
- `createPasswordReset(email)` - Create password reset flow
- `completePasswordReset(resetToken, tempPassword, newPassword)` - Complete password reset
- Types: `RegistrationStep`, `RegistrationState`, `StepResult`

**Styles**: `src/pages/test-register.css`
- Uses CSS classes instead of inline styles
- Consistent with existing pages like `registreer.css`

**Usage**:
1. Start all three servers (Faroe, Backend, Frontend)
2. Navigate to `http://localhost:5173/auth-test` (or `/test-register` for simple version)
3. Select the desired tab (Register, Sign In, Password Reset, Session)
4. Follow the step-by-step flow for each operation
5. Check SMTP server logs for verification codes and temporary passwords

**Example verification code location**:
If running with test SMTP server on port 3525, verification codes and temporary passwords appear in the Faroe Go server console logs.
