# Clerk Google-Only Authentication Setup Guide

## Dashboard Configuration Steps

### 1. Access Clerk Dashboard
- Go to [clerk.com](https://clerk.com) and sign in
- Select your project (the one with the keys in your .env file)

### 2. Configure Social Connections
1. Navigate to **User & Authentication** → **Social Connections**
2. **Enable Google OAuth:**
   - Click on Google
   - Toggle it ON
   - Add your Google OAuth credentials (Client ID & Secret)
   
### 3. Disable Other Authentication Methods
1. Go to **User & Authentication** → **Email, Phone, Username**
2. **Disable Email/Password:**
   - Turn OFF "Email address"
   - Turn OFF "Password"
3. **Disable Phone:**
   - Turn OFF "Phone number"

### 4. Disable Other Social Providers
1. In **Social Connections**, ensure all other providers are OFF:
   - Facebook: OFF
   - GitHub: OFF
   - Discord: OFF
   - Twitter: OFF
   - LinkedIn: OFF
   - Microsoft: OFF
   - Apple: OFF

### 5. Google OAuth Setup
If you don't have Google OAuth credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `https://your-domain.clerk.accounts.dev/v1/oauth_callback`
   - For development: `https://clerk.accounts.dev/v1/oauth_callback`

### 6. Test Configuration
1. Save all settings in Clerk Dashboard
2. Run your Next.js app: `pnpm dev`
3. Try signing in - should only show Google option
4. Verify sign-up flow works correctly

## Environment Variables Check
Ensure these are set in your `.env`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Troubleshooting
- If auth doesn't work, check browser console for errors
- Verify Clerk keys are correct and not expired
- Ensure Google OAuth redirect URIs match exactly
- Check that your domain is added to Clerk's allowed origins