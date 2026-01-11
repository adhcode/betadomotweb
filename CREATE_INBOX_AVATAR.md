# Create Inbox Avatar from Your Logo

## Current Logo
- File: `frontend/public/images/logo.png`
- Size: 1570 x 1569 pixels (perfect square!)
- Already used as favicon in your layout

## Create Gravatar-Ready Versions

Run these commands to create optimized versions for email avatars:

```bash
# Create 512x512 version for Gravatar (recommended size)
sips -Z 512 frontend/public/images/logo.png --out frontend/public/images/logo-gravatar-512.png

# Create 256x256 version (backup size)
sips -Z 256 frontend/public/images/logo.png --out frontend/public/images/logo-gravatar-256.png

# Create favicon.ico (for completeness)
sips -s format ico -Z 32 frontend/public/images/logo.png --out frontend/public/favicon.ico
```

## Setup Gravatar for Inbox Avatar

1. **Go to Gravatar**: https://gravatar.com
2. **Create account** with your email: `hello@betadomot.blog`
3. **Upload logo**: Use the `logo-gravatar-512.png` file you just created
4. **Verify email**: Check your inbox and verify the email address
5. **Wait**: 24-48 hours for propagation across email clients

## What This Will Fix

✅ **Before**: Inbox shows "B" initials  
✅ **After**: Inbox shows your brand logo/icon

## Email Clients That Support Gravatar
- Gmail (web and mobile)
- Apple Mail
- Outlook (some versions)
- Yahoo Mail
- Thunderbird
- Most other email clients

## Test Your Avatar

After setting up Gravatar:
1. Send yourself a test newsletter signup
2. Check the email in different clients
3. Look for your logo next to "BetaDomot" in the inbox

## Alternative: Use Existing Logo Directly

If you prefer to use your current logo without creating new versions:
- Upload `frontend/public/images/logo.png` directly to Gravatar
- Gravatar will automatically resize it

Your logo is already perfect for this since it's square!