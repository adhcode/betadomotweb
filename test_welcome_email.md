# Test Welcome Email with Logo

## What We Fixed
1. **Optimized logo size**: Reduced from 4686x923px to 400x78px
2. **Updated email template**: Now uses `beta-logo-email.png`
3. **Added fallback**: Text logo shows if image fails

## Test the Email

### Option 1: Use Newsletter Form
1. Go to your website: https://betadomot.blog
2. Scroll to footer and subscribe with a test email
3. Check your inbox for the welcome email

### Option 2: Direct API Test (if you have curl)
```bash
curl -X POST https://betadomot.blog/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com"}'
```

### Option 3: Admin Dashboard Test
1. Go to your admin dashboard
2. Navigate to newsletter section
3. Send a test email

## What to Check
- ✅ Logo appears in email
- ✅ Logo is properly sized (not too big/small)
- ✅ Email looks good on mobile
- ✅ Fallback text shows if image blocked

## Troubleshooting
If logo still doesn't show:
1. Check browser: https://betadomot.blog/images/blog/beta-logo-email.png
2. Try different email clients (Gmail, Apple Mail, Outlook)
3. Check spam folder
4. Some email clients block images by default - look for "Show Images" button

## Email Client Notes
- **Gmail**: May block images initially, user needs to click "Display images"
- **Apple Mail**: Usually shows images automatically
- **Outlook**: May block external images
- **Mobile clients**: Generally good with images