# Email Verification Setup Guide

This guide explains how to set up a seamless, custom email verification flow using Firebase and a custom action handler in your React application. This method prevents any default Firebase UI from being shown to the user.

### Firebase Configuration

To make this flow work, you must configure your Firebase project correctly.

**1. Set the Action URL in the Email Template:**

This is the most important step. You need to tell Firebase where to send users after they click the verification link.

1.  Go to your [Firebase Console](https://console.firebase.google.com/).
2.  Navigate to **Authentication** → **Templates**.
3.  Select the **Email address verification** template and click the pencil icon (✎) to edit it.
4.  Click the link inside to **Customize action URL**.
5.  Set the URL to point to your new action handler page. For example:
    *   **For Production:** `https://www.your-domain.com/auth/action`
    *   **For Local Testing:** `http://localhost:5173/auth/action` (assuming Vite's default port)
6.  Click **Save**.

**2. Authorize Your Domain:**

Ensure your application's domain is authorized by Firebase.

1.  Go to **Authentication** → **Settings** → **Authorized domains**.
2.  Click **Add domain** and enter your domain (e.g., `your-domain.com`).

### How the Custom Flow Works

1.  **User Signup:** A user signs up. A verification email containing a special link is automatically sent to them.
2.  **User Clicks Link:** The user clicks the verification link in their email.
3.  **Redirect to Your App:** Firebase immediately directs the user to your custom action URL (`/auth/action`). The URL includes the necessary verification `mode` and `oobCode`.
4.  **Silent Verification:** Your `EmailActionHandler` component:
    *   Parses the `oobCode` from the URL.
    *   Uses the Firebase SDK's `applyActionCode` function to verify the user's email behind the scenes.
    *   Shows a loading indicator while this happens.
5.  **Redirect on Success:** Once the email is verified, the handler redirects the user to the login page (`/login?verified=true`).
6.  **Login with Success Message:** The login page detects the `verified=true` parameter and displays a success message, prompting the user to log in.

This entire process happens within your application's UI, providing a professional and seamless user experience.

## Testing the Flow

### Local Development
For local testing, you can use:
- `http://localhost:5173/verify-success` (Vite default)
- Or your actual local domain

### Production
For production, use your actual domain:
- `https://yourdomain.com/verify-success`

## Troubleshooting

### Common Issues

1. **Verification link not working**
   - Check Firebase Action URL configuration
   - Ensure domain is added to authorized domains

2. **Users stuck on verification page**
   - Verify the `/verify-success` route is accessible
   - Check that the route is not protected by authentication

3. **Email not received**
   - Check spam folder
   - Verify email address is correct
   - Check Firebase email sending limits

### Firebase Auth Error Codes

- `auth/invalid-action-code`: Invalid verification link
- `auth/expired-action-code`: Verification link expired
- `auth/user-disabled`: User account is disabled

## Security Notes

- Verification links expire after 1 hour by default
- Users can request new verification emails
- Unverified users cannot access protected routes
- Email verification is required for all email/password accounts 