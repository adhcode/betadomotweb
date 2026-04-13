# Shop Module - Quick Start

## 🚀 Get Started in 3 Steps

### 1. Run Database Migration (if needed)
```bash
cd backend
./run_products_migration.sh
```

### 2. Start Backend
```bash
cd backend
go run main.go
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

## 📍 URLs

- **Shop Listing:** http://localhost:3000/shop
- **Product Detail:** http://localhost:3000/shop/[slug]
- **API Endpoint:** http://localhost:8080/products

## 🧪 Test with Sample Product

```bash
curl -X POST http://localhost:8080/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)" \
  -d '{
    "name": "Test Product",
    "description": "A sample product",
    "price": 10000,
    "images": ["https://via.placeholder.com/400"],
    "category": "Test",
    "stock": 5,
    "active": true
  }'
```

## ✅ What's Working

- ✅ Product listing page
- ✅ Product detail page
- ✅ Shop link in header
- ✅ Backend API endpoints
- ✅ Blog unchanged and stable

## 📦 What's Prepared (Not Active)

- Blog-product linking table
- Blog-product linking handlers
- Ready for future integration

## 🔍 Quick Checks

```bash
# Check products endpoint
curl http://localhost:8080/products

# Check health
curl http://localhost:8080/health

# Check blog still works
curl http://localhost:8080/posts
```

## 📚 Full Documentation

See `SHOP_SETUP_GUIDE.md` for complete details.
