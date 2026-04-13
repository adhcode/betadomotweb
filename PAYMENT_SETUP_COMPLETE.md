# Payment Integration Setup - Complete ✅

## What Was Fixed

### 1. Backend Compilation Errors ✅
- Fixed field name mismatches (`Shipping` vs `ShippingCost`, `Status` vs `OrderStatus`)
- Added SQL database connection support to DatabaseService
- Updated all order handlers to use raw SQL queries
- Added `database/sql` import and PostgreSQL driver

### 2. Database Connection ✅
- Added `DatabaseURL` to config
- URL-encoded password special characters
- Added SSL mode for secure connection
- Backend compiles and runs successfully

### 3. Code Structure ✅
- `backend/config/config.go` - Added DatabaseURL field
- `backend/services/database.go` - Added SQL connection pool with GetSQLDB() method
- `backend/handlers/orders.go` - All functions use SQL queries
- `backend/models/models.go` - Order struct with correct field names

## Current Status

✅ Backend compiles successfully  
✅ Database connection configured  
✅ Payment endpoints implemented  
⚠️ Orders table migration PENDING  

## Next Steps

### STEP 1: Run Orders Table Migration (REQUIRED)

The orders table doesn't exist yet. You MUST run the migration:

1. Open Supabase SQL Editor: https://supabase.com/dashboard
2. Select project: `amqfaxpexigofotoandv`
3. Click "SQL Editor" → "New Query"
4. Copy contents of `backend/create_orders_table.sql`
5. Paste and click "Run"

See `RUN_ORDERS_MIGRATION.md` for detailed instructions.

### STEP 2: Start Backend

```bash
cd backend
go run main.go
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Connected to Supabase
✅ Blog API running on http://localhost:8080
```

### STEP 3: Test Payment Flow

1. Go to shop frontend: http://localhost:3001
2. Add products to cart
3. Go to checkout
4. Fill in customer details
5. Click "Complete Order"
6. Should redirect to Paystack checkout

### STEP 4: Test with Paystack Test Card

Use these test credentials:
- Card: `4084084084084081`
- CVV: `408`
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

## Payment Endpoints

All endpoints are implemented and ready:

- `POST /orders/initialize-payment` - Initialize payment
- `GET /orders/verify-payment?reference=xxx` - Verify payment
- `GET /payment/callback?reference=xxx` - Handle redirect
- `POST /payment/webhook` - Process Paystack webhooks
- `GET /orders/{id}` - Get order details
- `GET /admin/orders` - List all orders (admin)

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:%5BGoodGod11%40%40%5D@db.amqfaxpexigofotoandv.supabase.co:5432/postgres?sslmode=require
PAYSTACK_SECRET_KEY=sk_test_a93918e0e019cebf24921260756c1b66ea611fe9
PAYSTACK_PUBLIC_KEY=pk_test_af10f9f208f5e8752b57c359f808c915afed8d03
```

### Shop Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_af10f9f208f5e8752b57c359f808c915afed8d03
```

## Troubleshooting

### "Failed to create order"
→ Run the orders table migration (see STEP 1 above)

### "no route to host" or IPv6 error
→ DATABASE_URL now includes `?sslmode=require` which should fix this

### "Port 8080 already in use"
```bash
lsof -ti:8080 | xargs kill -9
```

### Test payment initialization
```bash
curl -X POST http://localhost:8080/orders/initialize-payment \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "test@example.com",
    "customer_name": "Test User",
    "customer_phone": "08012345678",
    "items": [{"product_id": "1", "product_slug": "test", "name": "Test", "price": 5000, "quantity": 1}],
    "subtotal": 5000,
    "shipping_cost": 1000,
    "tax": 0,
    "total": 6000,
    "payment_method": "paystack",
    "shipping_address": {"address": "123 Test St", "city": "Lagos"}
  }'
```

## Files Modified

- `backend/config/config.go`
- `backend/services/database.go`
- `backend/handlers/orders.go`
- `backend/.env`
- `backend/go.mod` (added github.com/lib/pq)

## Documentation

- `PAYSTACK_INTEGRATION_GUIDE.md` - Complete integration guide
- `PAYSTACK_SETUP_QUICK_START.md` - Quick setup
- `PAYMENT_INTEGRATION_COMPLETE.md` - Implementation details
- `RUN_ORDERS_MIGRATION.md` - Migration instructions
