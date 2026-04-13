# Paystack Payment Integration - Complete Guide

## Overview

This document describes the complete Paystack payment integration for Betadomot Shop, including backend API, frontend integration, security measures, and testing procedures.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend  │────────▶│  Go Backend  │────────▶│   Paystack   │
│  (Next.js)  │◀────────│   (API)      │◀────────│     API      │
└─────────────┘         └──────────────┘         └──────────────┘
       │                        │                        │
       │                        │                        │
       ▼                        ▼                        ▼
  User clicks           Creates order            Processes
  "Complete order"      Initializes payment      payment
       │                        │                        │
       │                        │                        │
       ▼                        ▼                        ▼
  Redirects to          Returns auth URL         Redirects back
  Paystack              Stores order             Sends webhook
```

## Database Schema

### Orders Table

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_name TEXT,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    payment_reference TEXT UNIQUE,
    paystack_reference TEXT UNIQUE,
    order_status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP
);
```

## Backend Implementation

### 1. Environment Variables

Add to `backend/.env`:

```env
# Paystack Configuration
# Test keys (for development)
PAYSTACK_SECRET_KEY=sk_test_your_test_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_test_public_key_here

# Production keys (for production)
# PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key_here
# PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key_here
```

### 2. API Endpoints

#### Initialize Payment
```
POST /orders/initialize-payment
```

**Request Body:**
```json
{
  "customer_email": "customer@example.com",
  "customer_phone": "+2348012345678",
  "customer_name": "John Doe",
  "shipping_address": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "zipCode": "100001"
  },
  "items": [
    {
      "product_id": "uuid",
      "product_slug": "product-slug",
      "name": "Product Name",
      "price": 50000,
      "quantity": 1,
      "image": "https://..."
    }
  ],
  "subtotal": 50000,
  "shipping_cost": 2500,
  "tax": 3750,
  "total": 56250,
  "payment_method": "card"
}
```

**Response:**
```json
{
  "order_id": "uuid",
  "order_number": "BD-1234567890",
  "payment_reference": "PAY-1234567890",
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "abc123"
}
```

#### Verify Payment
```
GET /orders/verify-payment?reference=PAY-1234567890
```

**Response:**
```json
{
  "status": "success",
  "order_id": "uuid",
  "order_number": "BD-1234567890",
  "amount": 56250
}
```

#### Payment Callback
```
GET /payment/callback?reference=PAY-1234567890
```

Redirects to:
- Success: `/checkout/success?reference=PAY-1234567890`
- Failed: `/checkout/failed?reference=PAY-1234567890`

#### Webhook Handler
```
POST /payment/webhook
```

**Headers:**
- `x-paystack-signature`: HMAC SHA-512 signature

**Body:**
```json
{
  "event": "charge.success",
  "data": {
    "reference": "PAY-1234567890",
    "amount": 5625000,
    "status": "success",
    ...
  }
}
```

### 3. Security Features

#### Webhook Signature Verification
```go
func (ps *PaystackService) VerifyWebhookSignature(payload []byte, signature string) bool {
    mac := hmac.New(sha512.New, []byte(ps.SecretKey))
    mac.Write(payload)
    expectedSignature := hex.EncodeToString(mac.Sum(nil))
    return hmac.Equal([]byte(expectedSignature), []byte(signature))
}
```

#### Transaction Verification
- Always verify transaction with Paystack API before fulfilling order
- Check amount matches expected amount
- Check status is "success"
- Idempotent webhook handling (prevent duplicate processing)

#### Amount Validation
```go
expectedAmount := services.ConvertToKobo(order.Total)
if verifyResp.Data.Amount != expectedAmount {
    return errors.New("amount mismatch")
}
```

## Frontend Implementation

### 1. Environment Variables

Add to `shop/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
# Production: https://betadomotweb-production.up.railway.app
```

### 2. Payment Flow

```typescript
// 1. Initialize payment
const paymentResponse = await initializePayment(orderData);

// 2. Store order info
sessionStorage.setItem('pending_order', JSON.stringify({
  order_id: paymentResponse.order_id,
  order_number: paymentResponse.order_number,
  payment_reference: paymentResponse.payment_reference,
}));

// 3. Clear cart
clearCart();

// 4. Redirect to Paystack
window.location.href = paymentResponse.authorization_url;
```

### 3. Success Page

The success page should:
1. Get reference from URL query parameter
2. Verify payment with backend
3. Display order confirmation
4. Clear pending order from sessionStorage

## Testing

### 1. Test Cards (Paystack Test Mode)

**Successful Payment:**
- Card: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Failed Payment:**
- Card: `5060666666666666666`
- CVV: Any 3 digits
- Expiry: Any future date

### 2. Test Webhook Locally

Use ngrok to expose local server:

```bash
ngrok http 8080
```

Update Paystack webhook URL in dashboard:
```
https://your-ngrok-url.ngrok.io/payment/webhook
```

### 3. Test Flow

1. **Initialize Payment**
```bash
curl -X POST http://localhost:8080/orders/initialize-payment \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "test@example.com",
    "customer_phone": "+2348012345678",
    "customer_name": "Test User",
    "shipping_address": {...},
    "items": [...],
    "subtotal": 50000,
    "shipping_cost": 2500,
    "tax": 3750,
    "total": 56250,
    "payment_method": "card"
  }'
```

2. **Verify Payment**
```bash
curl http://localhost:8080/orders/verify-payment?reference=PAY-123456
```

3. **Test Webhook**
```bash
curl -X POST http://localhost:8080/payment/webhook \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: computed_signature" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "PAY-123456",
      "amount": 5625000,
      "status": "success"
    }
  }'
```

## Deployment

### 1. Database Migration

Run in Supabase SQL Editor:

```sql
-- Copy contents of backend/create_orders_table.sql
```

### 2. Environment Variables

**Backend (Railway):**
- `PAYSTACK_SECRET_KEY`: Your live secret key
- `PAYSTACK_PUBLIC_KEY`: Your live public key

**Frontend (Vercel):**
- `NEXT_PUBLIC_API_URL`: Your backend URL

### 3. Paystack Dashboard Setup

1. Go to https://dashboard.paystack.com
2. Navigate to Settings → API Keys & Webhooks
3. Copy your live keys
4. Set webhook URL: `https://your-backend.com/payment/webhook`
5. Enable events: `charge.success`, `charge.failed`

### 4. Test in Production

1. Use test keys first
2. Make a test purchase
3. Verify order is created
4. Verify webhook is received
5. Switch to live keys

## Error Handling

### Common Errors

**1. Invalid Signature**
```
Status: 401 Unauthorized
Message: "Invalid signature"
```
Solution: Check PAYSTACK_SECRET_KEY is correct

**2. Amount Mismatch**
```
Status: 400 Bad Request
Message: "Amount mismatch"
```
Solution: Verify amount calculation matches

**3. Order Not Found**
```
Status: 404 Not Found
Message: "Order not found"
```
Solution: Check payment_reference or paystack_reference

**4. Payment Already Processed**
```
Status: 200 OK
Message: "Order already paid, skipping"
```
This is normal - idempotency working correctly

## Monitoring

### Logs to Monitor

**Backend:**
```
[Paystack] Initializing transaction for email@example.com, amount: 5625000 kobo
[Paystack] Transaction initialized successfully: PAY-123456
[Paystack] Verifying transaction: PAY-123456
[Paystack] Transaction verified: PAY-123456, status: success, amount: 5625000
[Paystack] Webhook signature verified successfully
[Orders] Order BD-123456 marked as paid via webhook
```

**Frontend:**
```
[Payment] Initializing payment: {...}
[Payment] Initialization successful: {...}
[Checkout] Payment initialized: {...}
```

### Metrics to Track

- Payment success rate
- Average payment time
- Failed payments (by reason)
- Webhook delivery success rate
- Order fulfillment time

## Security Checklist

- [x] Secret key stored in environment variables
- [x] Webhook signature verification
- [x] Transaction amount verification
- [x] Idempotent webhook handling
- [x] HTTPS only in production
- [x] No secret key in frontend code
- [x] Order verification before fulfillment
- [x] Proper error handling and logging

## Support

### Paystack Documentation
- API Reference: https://paystack.com/docs/api/
- Test Cards: https://paystack.com/docs/payments/test-payments/
- Webhooks: https://paystack.com/docs/payments/webhooks/

### Contact
- Paystack Support: support@paystack.com
- Developer Docs: https://paystack.com/docs/

---

**Status**: Payment integration complete and production-ready.
**Last Updated**: 2024
