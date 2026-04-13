# Paystack Integration - Quick Start Guide

## Step 1: Create Orders Table in Supabase

1. Go to your Supabase project
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the contents of `backend/create_orders_table.sql`
5. Click "Run" to execute the migration
6. Verify the table was created in the "Table Editor"

## Step 2: Get Paystack API Keys

1. Go to https://dashboard.paystack.com
2. Sign up or log in
3. Navigate to **Settings → API Keys & Webhooks**
4. Copy your **Test Secret Key** (starts with `sk_test_`)
5. Copy your **Test Public Key** (starts with `pk_test_`)

## Step 3: Configure Backend

Add to `backend/.env`:

```env
# Paystack Test Keys (for development)
PAYSTACK_SECRET_KEY=sk_test_your_actual_test_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_actual_test_key_here
```

## Step 4: Restart Backend

```bash
cd backend
go run main.go
```

You should see:
```
✅ Blog API running on http://localhost:8080
```

## Step 5: Test Payment Flow

### A. Test Initialize Payment

```bash
curl -X POST http://localhost:8080/orders/initialize-payment \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "test@example.com",
    "customer_phone": "+2348012345678",
    "customer_name": "Test User",
    "shipping_address": {
      "firstName": "Test",
      "lastName": "User",
      "address": "123 Test St",
      "city": "Lagos",
      "state": "Lagos",
      "zipCode": "100001"
    },
    "items": [
      {
        "product_id": "test-id",
        "product_slug": "test-product",
        "name": "Test Product",
        "price": 50000,
        "quantity": 1
      }
    ],
    "subtotal": 50000,
    "shipping_cost": 2500,
    "tax": 3750,
    "total": 56250,
    "payment_method": "card"
  }'
```

Expected response:
```json
{
  "order_id": "uuid",
  "order_number": "BD-1234567890",
  "payment_reference": "PAY-1234567890",
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "abc123"
}
```

### B. Test with Frontend

1. Start the shop:
```bash
cd shop
npm run dev
```

2. Visit http://localhost:3001
3. Add a product to cart
4. Go to checkout
5. Fill in the form
6. Click "Complete order"
7. You'll be redirected to Paystack

### C. Use Test Card

On Paystack checkout page, use:
- **Card Number**: `4084084084084081`
- **CVV**: `408`
- **Expiry**: Any future date (e.g., 12/25)
- **PIN**: `0000`
- **OTP**: `123456`

## Step 6: Verify Order Was Created

Check Supabase:
1. Go to Table Editor
2. Select `orders` table
3. You should see your test order with `payment_status = 'success'`

## Step 7: Setup Webhook (Optional for Development)

### Using ngrok:

1. Install ngrok: https://ngrok.com/download

2. Start ngrok:
```bash
ngrok http 8080
```

3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

4. Go to Paystack Dashboard → Settings → API Keys & Webhooks

5. Add webhook URL:
```
https://abc123.ngrok.io/payment/webhook
```

6. Enable events:
   - `charge.success`
   - `charge.failed`

7. Make a test payment and check backend logs for webhook events

## Troubleshooting

### Error: "PAYSTACK_SECRET_KEY not set"
- Check `backend/.env` file exists
- Verify the key is correct
- Restart the backend

### Error: "Failed to initialize payment"
- Check backend logs for details
- Verify Paystack keys are correct
- Check internet connection

### Error: "Order not found"
- Check orders table in Supabase
- Verify payment_reference matches

### Payment succeeds but order not marked as paid
- Check webhook is configured
- Check backend logs for webhook events
- Manually verify: `GET /orders/verify-payment?reference=PAY-xxx`

## Production Checklist

Before going live:

- [ ] Get live Paystack keys from dashboard
- [ ] Update `PAYSTACK_SECRET_KEY` with live key
- [ ] Update `PAYSTACK_PUBLIC_KEY` with live key
- [ ] Set webhook URL to production backend
- [ ] Test with real (small amount) transaction
- [ ] Monitor logs for any errors
- [ ] Set up email notifications for orders

## Next Steps

1. **Add Email Notifications**: Send order confirmation emails
2. **Admin Dashboard**: Build UI to manage orders
3. **Order Tracking**: Add shipping status updates
4. **Refunds**: Implement refund functionality
5. **Analytics**: Track payment metrics

---

**Need Help?**
- Paystack Docs: https://paystack.com/docs/
- Paystack Support: support@paystack.com
