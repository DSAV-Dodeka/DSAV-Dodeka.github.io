# TODO List

## Profile Page Issues

### 1. Layout becomes narrow when "Change Email" is pressed
**Issue**: When clicking "Change Email" button on the profile page, the entire view gets very narrow.

**Cause**: Likely CSS issue with form width or container constraints.

**Fix needed**: Ensure the email change form has proper width constraints and doesn't shrink the container.

---

### 2. Button vertical size too large
**Issue**: The "Send Verification Code" button is too large vertically, probably because the text doesn't fit horizontally.

**Cause**: Not enough horizontal space for button text, causing it to wrap or expand vertically.

**Fix needed**:
- Ensure buttons have enough horizontal space
- Consider shorter button text or wider container
- Current min-height of 44px might need adjustment

---

### 3. CORS error on `/auth/get_session_token/` endpoint
**Issue**: Getting CORS error when trying to fetch session token from backend:
```
Response body is not available to scripts (Reason: CORS Missing Allow Origin)
```

**Location**: Profile page email change flow (lines 49-58 in profile.tsx)

**Current implementation**:
```typescript
const tokenResponse = await fetch("http://localhost:8000/auth/get_session_token/", {
  method: "GET",
  credentials: "include",
});
```

**Backend**: Endpoint exists in `/home/tipcl-pop/files/gitp/dodeka/backend/src/apiserver/app.py` (lines 612-628)

**Fix needed**:
- Check if CORS headers are properly set in backend response
- Verify OPTIONS preflight request is handled correctly
- Ensure `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials` headers are present

---

### 4. Email change feature doesn't exist in auth-test
**Issue**: Profile page was supposed to follow the auth-test flow for email changes, but email change functionality doesn't actually exist in auth-test.

**Current state**:
- `test-register-tabs.tsx` has no email change implementation
- Profile page has email change but it's broken (due to CORS issue above)

**Decision needed**:
- Should we add email change to auth-test first as a reference implementation?
- Or fix the profile page implementation directly?

---

## Implementation Notes

### Email Change Flow (when CORS is fixed)
The profile page currently implements:
1. User enters new email
2. Fetch session token from backend via `/auth/get_session_token/`
3. Call `faroeClient.createUserEmailAddressUpdate(sessionToken, newEmail)`
4. Send verification code via `faroeClient.sendUserEmailAddressUpdateEmailAddressVerificationCode()`
5. User enters verification code
6. Verify and complete email change

This flow should work once CORS is fixed.

---

## Backend Endpoints Status

✅ **Working**:
- `POST /auth/set_session/` - Set session cookie
- `GET /auth/session_info/` - Get current session info
- `POST /auth/clear_session/` - Clear current session
- `POST /auth/delete_account/` - Delete user account

❓ **Needs CORS fix**:
- `GET /auth/get_session_token/` - Get session token from cookie
  - Handler exists and returns JSON correctly
  - CORS headers might not be properly applied

---

## Priority

**High Priority**:
1. Fix CORS on `/auth/get_session_token/` endpoint
2. Fix profile page layout narrowing

**Medium Priority**:
3. Fix button sizing issues
4. Decide on email change implementation strategy (auth-test vs direct fix)

**Low Priority**:
- Add email change to auth-test for consistency
