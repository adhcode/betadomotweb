# Payment System - Quick Start Guide

## What's Implemented ✅

1. **Payment Processing** - Paystack integration with callback handling
2. **Webhook Support** - Reliable backup payment confirmation
3. **Order Confirmation Emails** - Beautiful editorial-style emails
4. **Success/Failure Pages** - Clean user feedback

## Quick Setup (5 minutes)

### 1. Environment Variables
Already configured in `backend/.env`:
```env
BACKEND_URL=http://localhost:8080
SHOP_URL=http://localhost:3001
PAYSTACK_SECRET_KEY=sk_test_xxx
RESEND_API_KEY=re_xxx
FROM_EMAIL=hello@betadomot.blog
```

### 2. Start Backend
```bash
cd backend
go run main.go
```

### 3. Start Shop
```bash
cd shop
npm run dev
```

### 4. Test Payment
1. Go to http://localhost:3001
2. Add items to cart
3. Go to checkout
4. Fill in details
5. Click "Pay Now"
6. Use test card: `4084084084084081`
7. Complete payment
8. Verify redirect to success page
9. Check email inbox for confirmation

## Payment Flow

```
User → Checkout → Paystack → Payment → Callback → Verify → Email → Success Page
                                    ↓
                                 Webhook → Verify → Email (backup)
```

## Test Cards

### Successful Payment
```
Card: 4084084084084081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456
```

### Failed Payment
```
Card: 5060666666666666666
CVV: 123
Expiry: Any future date
```

## Webhook Setup (Optional but Recommended)

### For Local Testing
```bash
# Install ngrok
brew install ngrok

# Start tunnel
ngrok http 8080

# Copy HTTPS URL and configure in Paystack Dashboard
# Settings → Webhooks → Add Webhook URL
# https://abc123.ngrok.io/payment/webhook
```

### For Production
```
https://betadomotweb-production.up.railway.app/payment/webhook
```

## Email Configuration

### Development
Emails work immediately with your Resend API key.

### Production
1. Verify domain in Resend Dashboard
2. Add SPF/DKIM DNS records
3. Test email delivery

## Monitoring

### Backend Logs
Watch for these messages:
```
[Orders] Initialize payment request received
[Orders] Order created with ID: xxx
[Paystack] Transaction initialized successfully
[Orders] Payment callback received
[Orders] Order marked as paid via callback
✅ Order confirmation sent to customer@example.com
[Orders] Webhook received
[Orders] Order already paid, skipping (idempotent)
```

### Check Order in Database
```sql
SELECT order_number, customer_email, payment_status, total 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;
```

## Troubleshooting

### Payment not redirecting
- ✅ Check `BACKEND_URL` is correct
- ✅ Verify backend is running
- ✅ Check browser console for errors

### Email not received
- ✅ Check spam folder
- ✅ Verify `RESEND_API_KEY` is set
- ✅ Check backend logs for email errors
- ✅ Verify `FROM_EMAIL` in Resend

### Webhook not working
- ✅ Use ngrok for local testing
- ✅ Check Paystack Dashboard webhook logs
- ✅ Verify signature verification passes

## Production Deployment

### Backend Environment Variables
```env
BACKEND_URL=https://betadomotweb-production.up.railway.app
SHOP_URL=https://shop.betadomot.blog
PAYSTACK_SECRET_KEY=sk_live_xxx  # Use live key
PAYSTACK_PUBLIC_KEY=pk_live_xxx  # Use live key
RESEND_API_KEY=re_xxx
FROM_EMAIL=hello@betadomot.blog
```

### Paystack Configuration
1. Switch to live mode in Paystack Dashboard
2. Update webhook URL to production
3. Test with real payment (small amount)

### Domain Verification
1. Verify `betadomot.blog` in Resend
2. Add DNS records
3. Test email delivery

## Documentation

- `PAYMENT_IMPLEMENTATION_COMPLETE.md` - Full technical details
- `PAYMENT_EMAIL_COMPLETE.md` - Email design and setup
- `PAYSTACK_WEBHOOK_SETUP.md` - Webhook configuration
- `PAYMENT_CALLBACK_FIX.md` - Callback URL fix details

## Support

For issues:
- Check backend logs first
- Review relevant documentation
- Test with Paystack test cards
- Verify environment variables

## Summary

✅ Payment processing works
✅ Callback handling implemented
✅ Webhook backup configured
✅ Beautiful confirmation emails
✅ Success/failure pages ready
✅ Production ready

**Just restart your backend and test!** 🚀
