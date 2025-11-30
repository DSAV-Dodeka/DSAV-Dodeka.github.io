# Testing Documentation

## Browser Test Scenarios

This document contains test scenarios that should be covered by automated browser tests.

### Registration Flow Tests

#### Test 1: Successful Registration Flow
**Description**: User completes registration successfully on first attempt.

**Steps**:
1. Navigate to `/register`
2. Submit registration request with email, firstname, lastname
3. Admin accepts user via `/admin`
4. Navigate to registration link with token
5. Enter verification code from email
6. Enter valid password (meets length requirements)
7. Submit form

**Expected Result**:
- User account is created
- User is logged in automatically
- Session is established
- Login indicator shows logged-in state

---

#### Test 2: Registration Retry After Password Validation Failure
**Description**: User enters invalid password on first attempt, then successfully completes registration on retry.

**Context**: This test ensures that the registration flow gracefully handles the "email_address_already_verified" error when retrying after a failed password validation.

**Steps**:
1. Navigate to `/register`
2. Submit registration request with email, firstname, lastname
3. Admin accepts user via `/admin`
4. Navigate to registration link with token
5. Enter verification code from email
6. Enter invalid password (e.g., too short - less than 8 characters)
7. Submit form
8. Observe error: `invalid_password_length` or similar
9. Enter valid password (meets all requirements)
10. Submit form again

**Expected Result**:
- First submission fails with password validation error
- Email verification is already completed from first attempt
- Second submission succeeds despite "email_address_already_verified" error being silently handled
- User account is created
- User is logged in automatically
- Session is established
- Login indicator shows logged-in state

**Implementation Detail**: The code in `register.tsx:handleCompleteSignup()` checks if the error code is `"email_address_already_verified"` and continues the flow instead of stopping, allowing users to retry password submission without re-entering the verification code.

---

#### Test 3: Registration Status Check with Token
**Description**: User checks registration status using token in URL.

**Steps**:
1. Submit registration request
2. Save the registration token
3. Navigate to `/register?token={registration_token}`

**Expected Result**:
- If not yet accepted: Shows "pending" state with refresh button
- If accepted: Shows "complete-signup" form with verification code and password fields
- No flash of wrong content during status check

---

### Login Flow Tests

#### Test 4: Successful Login
**Steps**:
1. Navigate to `/login`
2. Enter valid email and password
3. Submit form

**Expected Result**:
- User is logged in
- Session is established
- Redirected to home page
- Login indicator shows logged-in state

---

#### Test 5: Failed Login
**Steps**:
1. Navigate to `/login`
2. Enter invalid email or password
3. Submit form

**Expected Result**:
- Error message displayed
- User remains on login page
- Login indicator shows logged-out state

---

### Profile Management Tests

#### Test 6: Email Change Flow
**Steps**:
1. Log in as existing user
2. Navigate to `/profile`
3. Click "Change Email"
4. Enter new email address
5. Submit to send verification code
6. Enter verification code from new email
7. Submit to complete email change

**Expected Result**:
- Verification code sent to new email
- Email change completed successfully
- Session info updated with new email
- User remains logged in

---

#### Test 7: Account Deletion
**Steps**:
1. Log in as existing user
2. Navigate to `/profile`
3. Click "Delete Account"
4. Confirm deletion

**Expected Result**:
- Confirmation dialog appears
- Account is deleted from database
- Session is cleared
- User redirected to home page
- Login indicator shows logged-out state

---

### Session Management Tests

#### Test 8: Session Persistence
**Steps**:
1. Log in as user
2. Refresh the page

**Expected Result**:
- User remains logged in
- Session info loads correctly
- Login indicator shows logged-in state

---

#### Test 9: Logout
**Steps**:
1. Log in as user
2. Click logout from profile page or dropdown

**Expected Result**:
- Session is cleared
- User redirected to home page
- Login indicator shows logged-out state

---

## Test Environment Setup

### Prerequisites
1. Faroe server running on `http://localhost:3777`
2. Backend API running on `http://localhost:8000`
3. Frontend dev server running on `http://localhost:5173`
4. Test SMTP server or email capture mechanism for verification codes

### Test Data Cleanup
Before each test:
```bash
# Clear all test data
curl -X POST http://localhost:8000/auth/clear_tables
```

### Getting Verification Codes
- Check Faroe server console logs for verification codes and temporary passwords
- Or configure test SMTP server to capture emails

---

## Notes for Test Implementation

### Password Requirements
- Minimum length: 8 characters (based on Faroe validation)
- Test with both valid and invalid passwords

### React Query Caching
- Tests should account for React Query cache invalidation
- Session queries refresh every 60 seconds
- Stale time is 30 seconds

### Error Handling
- All error states should display user-friendly messages
- Network errors should be handled gracefully
- Form validation should prevent submission of invalid data

### Mobile Considerations
- Login indicator appears in both desktop (`#navPc`) and mobile (`#navMobile`) navigation bars
- Dropdown menus should work on both desktop and mobile
