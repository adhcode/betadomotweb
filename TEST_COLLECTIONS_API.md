# Test Collections API

## Check if Backend is Running

```bash
curl http://localhost:8080/health
```

Should return: `{"status": "healthy", "service": "blog-api"}`

## Test Collections Endpoint

```bash
# Get all collections
curl http://localhost:8080/collections

# Should return: [] (empty array if no collections yet)
# Or a 404 if backend not running
```

## If Backend Not Running

```bash
cd backend
./blog-api
```

## If You Get Empty Array

That's normal! You need to create collections through the admin:

1. **Login**: http://localhost:3000/admin/login
2. **Go to Shop Admin**: http://localhost:3000/admin/dashboard/shop
3. **Click**: "Manage Collections"
4. **Create** your first collection

## Admin Login Credentials

Check `backend/.env` for:
```
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
```

## Quick Test

```bash
# Create a test collection (replace admin:password with your credentials)
curl -X POST http://localhost:8080/admin/collections \
  -u admin:password \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Collection",
    "slug": "test-collection",
    "description": "A test collection",
    "is_featured": true,
    "display_order": 1
  }'
```

Then refresh the shop homepage!
