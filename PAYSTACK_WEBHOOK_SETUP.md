# Paystack Webhook Setup Guide

## Overview
Webhooks allow Paystack to notify your backend when payment events occur, providing a reliable backup to the callback URL.

## Webhook Endpoint
Your webhook endpoint is already implemented at:
```
POST /payment/webhook
```

## Setup Steps

### 1. Get Your Webhook URL

**Development:**
```
http://localhost:8080/payment/webhook
```

**Production:**
```
https://betadomotweb-production.up.railway.app/payment/webhook
```

### 2. Configure in Paystack Dashboard

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Navigate to **Settings** → **Webhooks**
3. Click **Add Webhook URL**
4. Enter your webhook URL
5. Click **Save**

### 3. Test the Webhook

Paystack provides a webhook testing tool:
1. In the Webhooks settings page
2. Click **Test Webhook**
3. Select `charge.success` event
4. Click **Send Test**
5. Check your backend logs for verification

## Webhook Events Handled

### charge.success
Triggered when a payment is successful.

**Handler:** `handleChargeSuccess()`
**Actions:**
- Verifies payment wasn't already processed (idempotent)
- Marks order as paid
- Sends order confirmation email
- Updates order status to "processing"

### charge.failed
Triggered when a payment fails.

**Handler:** `handleChargeFailed()`
**Actions:**
- Logs the failure
- Updates order status if needed

## Security

### Signature Verification
Every webhook request is verified using HMAC SHA-512:

```go
func (ps *PaystackService) VerifyWebhookSignature(payload []byte, signature string) bool {
    mac := hmac.New(sha512.New, []byte(ps.SecretKey))
    mac.Write(payload)
    expectedSignature := hex.EncodeToString(mac.Sum(nil))
    return hmac.Equal([]byte(expectedSignature), []byte(signature))
}
```

**Header:** `x-paystack-signature`

Invalid signatures are rejected with `401 Unauthorized`.

## Idempotency

The webhook handler is idempotent - it can safely receive the same event multiple times:

```go
if order.PaymentStatus != "success" {
    // Only update if not already paid
    h.markOrderAsPaid(order.ID, reference)
} else {
    log.Printf("[Orders] Order %s already paid, skipping", order.OrderNumber)
}
```

## Testing Locally with ngrok

To test webhooks in development:

### 1. Install ngrok
```bash
brew install ngrok  # macOS
# or download from https://ngrok.com/
```

### 2. Start your backend
```bash
cd backend
go run main.go
```

### 3. Create tunnel
```bash
ngrok http 8080
```

### 4. Copy the HTTPS URL
```
https://abc123.ngrok.io
```

### 5. Configure in Paystack
Use the ngrok URL + webhook path:
```
https://abc123.ngrok.io/payment/webhook
```

### 6. Make a test payment
Watch the ngrok terminal and your backend logs to see the webhook arrive.

## Monitoring

### Backend Logs
All webhook events are logged:
```
[Orders] Webhook received
[Orders] Webhook event: charge.success
[Orders] Processing charge.success for: PAY-xxx
[Orders] Order BD-12345678 marked as paid via webhook
```

### Paystack Dashboard
View webhook delivery status:
1. Go to **Settings** → **Webhooks**
2. Click on your webhook URL
3. View **Recent Deliveries**
4. Check status codes and response times

## Troubleshooting

### Webhook not receiving events
- ✅ Check URL is correct and accessible
- ✅ Verify backend is running
- ✅ Check firewall/security groups allow incoming requests
- ✅ Use ngrok for local testing

### Signature verification failing
- ✅ Verify `PAYSTACK_SECRET_KEY` is correct
- ✅ Check you're using the secret key, not public key
- ✅ Ensure no whitespace in the key

### Duplicate processing
- ✅ The handler is idempotent by design
- ✅ Check logs to confirm duplicate detection works
- ✅ Verify database updates use `Eq("payment_status", "pending")`

### Email not sending
- ✅ Check `RESEND_API_KEY` is set
- ✅ Verify email service is initialized
- ✅ Check backend logs for email errors
- ✅ Confirm `FROM_EMAIL` is verified in Resend

## Production Checklist

- [ ] Webhook URL configured in Paystack Dashboard
- [ ] Using production Paystack secret key
- [ ] HTTPS endpoint (required by Paystack)
- [ ] Signature verification enabled
- [ ] Monitoring/logging in place
- [ ] Test webhook with Paystack's test tool
- [ ] Email service configured and tested

## Webhook vs Callback

Both mechanisms work together:

**Callback URL:**
- User-facing redirect after payment
- Provides immediate feedback
- Can fail if user closes browser

**Webhook:**
- Server-to-server notification
- More reliable
- Asynchronous
- Backup mechanism

**Best Practice:** Implement both for maximum reliability.

## Example Webhook Payload

```json
{
  "event": "charge.success",
  "data": {
    "id": 123456789,
    "domain": "test",
    "status": "success",
    "reference": "PAY-1775995183478248000",
    "amount": 39775000,
    "message": null,
    "gateway_response": "Successful",
    "paid_at": "2026-04-12T11:19:37.000Z",
    "created_at": "2026-04-12T11:19:36.000Z",
    "channel": "card",
    "currency": "NGN",
    "ip_address": "102.89.xxx.xxx",
    "metadata": {
      "order_id": "d965b9d3-1e5b-4389-a5f8-88359b807e96",
      "order_number": "BD-1775989176",
      "customer_name": "John Doe"
    },
    "customer": {
      "id": 12345,
      "email": "customer@example.com",
      "customer_code": "CUS_xxx"
    }
  }
}
```

## Support

For webhook issues:
- Check Paystack documentation: https://paystack.com/docs/payments/webhooks/
- Review backend logs for detailed error messages
- Test with Paystack's webhook testing tool
- Contact Paystack support if needed
