# Implementation TODO - Auth + Profile Features

## Step 1: Add New Types to src/types/index.ts
- [x] Add PasswordResetRequestPayload
- [x] Add PasswordResetVerifyPayload
- [x] Add PasswordResetCompletePayload
- [x] Add SetPinPayload
- [x] Add UploadPicturePayload

## Step 2: Update Constants (src/constants/index.ts)
- [x] Add REQUEST_PASSWORD_OTP endpoint
- [x] Add VERIFY_PASSWORD_OTP endpoint
- [x] Add RESET_PASSWORD endpoint
- [x] Add UPLOAD_PROFILE_PICTURE endpoint
- [x] Add SET_PIN endpoint

## Step 3: Create Password Reset Schemas
- [x] Create forgotPasswordSchema.ts
- [x] Create resetPasswordSchema.ts

## Step 4: Update Auth API (src/features/auth/api/authApi.ts)
- [x] Add requestPasswordOtp method
- [x] Add verifyPasswordOtp method
- [x] Add resetPassword method
- [x] Add uploadProfilePicture method
- [x] Add setPin method

## Step 5: Update Auth Hooks (src/features/auth/hooks/useAuth.ts)
- [x] Add useRequestPasswordOtp hook
- [x] Add useVerifyPasswordOtp hook
- [x] Add useResetPassword hook
- [x] Add useUploadProfilePicture hook
- [x] Add useSetPin hook
