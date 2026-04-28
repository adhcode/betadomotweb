# Troubleshooting Shop Admin

## Error: Collections API 404

### Cause
The backend API isn't running or isn't accessible.

### Solution

#### 1. Check if Backend is Running

```bash
curl http://localhost:8080/health
```

**Expected**: `{"status": "healthy", "service": "blog-api"}`  
**If fails**: Backend is not running

#### 2. Start Backend

```bash
cd backend
./blog-api
```

You should see:
```
🚀 Starting Blog API on port 8080
✅ Blog API running on http://localhost:8080
```

#### 3. Test Collections Endpoint

```bash
curl http://localhost:8080/collections
```

**Expected**: `[]` (empty array - this is normal if no collections created yet)

#### 4. Rebuild Backend (if needed)

```bash
cd backend
go build -o blog-api
./blog-api
```

## Admin Login

**URL**: http://localhost:3000/admin/login

**Credentials**: Check `backend/.env`
```env
ADMIN_USERNAME=your_username_here
ADMIN_PASSWORD=your_password_here
```

## Complete Startup Sequence

### Terminal 1 - Backend
```bash
cd backend
./blog-api
# Wait for "✅ Blog API running"
```

### Terminal 2 - Frontend (Admin)
```bash
cd frontend
npm run dev
# Wait for "Ready on http://localhost:3000"
```

### Terminal 3 - Shop
```bash
cd shop
npm run dev
# Wait for "Ready on http://localhost:3001"
```

## Test Everything Works

1. **Backend Health**: http://localhost:8080/health
2. **Admin Login**: http://localhost:3000/admin/login
3. **Shop Homepage**: http://localhost:3001

## Create Your First Collection

1. Login at http://localhost:3000/admin/login
2. Click "Shop" in sidebar
3. Click "Manage Collections"
4. Click "+ New Collection"
5. Fill form and check "Featured on Homepage"
6. Click "Create"
7. Refresh http://localhost:3001 - collection appears!

## Still Having Issues?

### Check Ports
```bash
# Check if ports are in use
lsof -i :8080  # Backend
lsof -i :3000  # Frontend
lsof -i :3001  # Shop
```

### Check Environment Variables
```bash
cd backend
cat .env
# Should have DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD
```

### Check Database Connection
The backend needs valid Supabase credentials in `.env`:
```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_KEY=...
```

---

**Most Common Issue**: Backend not running. Always start backend first!
