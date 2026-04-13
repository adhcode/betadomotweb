# Payment Callback URL Fix

## Problem
After payment, Paystack was redirecting to `https://betadomot.blog/payment/callback` (the blog site) instead of the backend API.

## Root Cause
The callback URL was using `WEBSITE_URL` which pointed to the blog, not the backend API.

## Solution
Changed the environment variable from `WEBSITE_URL` to `BACKEND_URL` to clearly indicate it should be the backend API URL.

## Changes Made

### 1. Backend Handler (`backend/handlers/orders_supabase.go`)
```go
// Changed from BaseURL to BackendURL
type OrderHandlerSupabase struct {
    DB              *services.DatabaseService
    PaystackService *services.PaystackService
    BackendURL      string  // Changed from BaseURL
    ShopURL         string
}

// Updated to use BACKEND_URL env var
func NewOrderHandlerSupabase(db *services.DatabaseService) *OrderHandlerSupabase {
    backendURL := os.Getenv("BACKEND_URL")  // Changed from WEBSITE_URL
    if backendURL == "" {
        backendURL = "http://localhost:8080"
    }
    // ...
}

// Updated callback URL generation
callbackURL := fmt.Sprintf("%s/payment/callback", h.BackendURL)
```

### 2. Environment Configuration (`backend/.env`)
```env
# OLD (incorrect)
WEBSITE_URL=https://betadomot.blog

# NEW (correct)
BACKEND_URL=http://localhost:8080
SHOP_URL=http://localhost:3001
```

## Configuration

### Development
```env
BACKEND_URL=http://localhost:8080
SHOP_URL=http://localhost:3001
```

### Production
```env
BACKEND_URL=https://betadomotweb-production.up.railway.app
SHOP_URL=https://shop.betadomot.blog
```

## Payment Flow (Fixed)

1. User completes payment on Paystack
2. Paystack redirects to: `http://localhost:8080/payment/callback?reference=PAY-xxx`
3. Backend verifies payment
4. Backend redirects to: `http://localhost:3001/checkout/success?reference=PAY-xxx`
5. Shop frontend shows success page

## Testing

1. Restart backend: `cd backend && go run main.go`
2. Make a test payment
3. Verify redirect goes to backend first, then to shop

## Next Steps

After restarting the backend, the payment flow should work correctly:
- Callback goes to backend API
- Backend verifies payment
- Backend redirects to shop success page
