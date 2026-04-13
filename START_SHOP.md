# 🚀 Start Shop - Quick Guide

## The Issue

The shop is trying to connect to the backend API at `http://localhost:8080`, but the backend isn't running yet.

## ✅ Solution: Start Backend First

### Option 1: Start Backend (Recommended)

```bash
# Terminal 1: Start Backend
cd backend
go run main.go
```

The backend will start on `http://localhost:8080`

### Option 2: View Shop Without Backend

The shop will now show an empty state with a nice message when the backend isn't running. You can still see the design!

## 🎯 Complete Startup Sequence

### Step 1: Start Backend
```bash
# Terminal 1
cd backend
go run main.go
```

Wait for:
```
✅ Blog API running on http://localhost:8080
```

### Step 2: Start Shop
```bash
# Terminal 2
cd shop
npm run dev
```

Visit: `http://localhost:3001`

### Step 3: (Optional) Start Blog
```bash
# Terminal 3
cd frontend
npm run dev
```

Visit: `http://localhost:3000`

## 📦 Add Sample Products

Once backend is running, add products:

```bash
curl -X POST http://localhost:8080/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:your-password' | base64)" \
  -d '{
    "name": "Modern Office Chair",
    "description": "Ergonomic office chair with lumbar support",
    "price": 45000,
    "sale_price": 38000,
    "images": ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800"],
    "category": "Furniture",
    "tags": ["office", "ergonomic"],
    "stock": 15,
    "featured": true,
    "active": true
  }'
```

## 🔍 Verify Backend is Running

```bash
# Check health
curl http://localhost:8080/health

# Check products endpoint
curl http://localhost:8080/products
```

## 🐛 Troubleshooting

### Backend won't start?

```bash
cd backend

# Check if .env file exists
ls -la .env

# Check Go version
go version

# Install dependencies
go mod tidy

# Try running again
go run main.go
```

### Port 8080 already in use?

```bash
# Find what's using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Shop still shows error?

1. Make sure backend is running on port 8080
2. Refresh the shop page
3. Check browser console for errors
4. Check shop terminal for logs

## ✅ Success Checklist

- [ ] Backend running on http://localhost:8080
- [ ] Shop running on http://localhost:3001
- [ ] No errors in shop terminal
- [ ] Shop shows products (or empty state)
- [ ] Can click on products (if any exist)

## 📝 Quick Commands

```bash
# Start everything at once (requires 3 terminals)

# Terminal 1: Backend
cd backend && go run main.go

# Terminal 2: Shop  
cd shop && npm run dev

# Terminal 3: Blog (optional)
cd frontend && npm run dev
```

## 🎉 What You Should See

### With Backend Running:
- Shop loads successfully
- Products display (if added)
- Or "No products yet" message
- No errors in console

### Without Backend:
- Shop loads successfully
- Shows "No products yet" message
- Graceful error handling
- Design still looks great!

---

**Next:** Add products using the API and see them appear in the shop! 🛍️
