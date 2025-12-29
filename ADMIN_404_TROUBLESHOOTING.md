# Admin 404 Error - Troubleshooting Guide

## The Error

```
GET http://localhost:8080/admin/posts 404 (Not Found)
```

## Possible Causes & Solutions

### 1. Backend Not Running

**Check if backend is running:**
```bash
# In a terminal, check if port 8080 is in use
lsof -i :8080

# Or try to access the health endpoint
curl http://localhost:8080/health
```

**Expected response:**
```json
{"status": "healthy", "service": "blog-api"}
```

**If backend is not running:**
```bash
cd backend
go run main.go
```

### 2. Route Not Registered

**Verify the route exists:**
```bash
# Check backend logs when it starts
# Should see:
#    GET  /admin/posts (API)
```

**The route is defined in `backend/main.go`:**
```go
r.Route("/admin", func(r chi.Router) {
    r.Use(middleware.BasicAuth())
    r.Get("/posts", adminHandler.GetAllPosts)
    // ...
})
```

### 3. Authentication Issue

**Check if you're logged in:**
- Go to http://localhost:3000/admin/login
- Login with your credentials
- Credentials are stored in localStorage/sessionStorage

**Test authentication manually:**
```bash
# Replace with your actual credentials
curl -u admin:password http://localhost:8080/admin/posts
```

### 4. CORS Issue

**Check browser console for CORS errors**

If you see CORS errors, verify `backend/middleware/cors.go` allows:
- Origin: http://localhost:3000
- Methods: GET, POST, PUT, DELETE
- Headers: Authorization, Content-Type

### 5. Database Connection Issue

**Check if database is accessible:**
```bash
cd backend
echo $DATABASE_URL

# Test connection
psql "$DATABASE_URL" -c "SELECT 1;"
```

## Quick Fixes

### Fix 1: Restart Backend

```bash
# Stop backend (Ctrl+C)
cd backend
go run main.go
```

### Fix 2: Clear Browser Cache

```
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
```

### Fix 3: Re-login to Admin

```
1. Go to http://localhost:3000/admin/login
2. Logout if logged in
3. Login again
4. Try accessing admin pages
```

### Fix 4: Check Environment Variables

**Backend `.env` file should have:**
```env
DATABASE_URL=postgresql://...
PORT=8080
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
```

**Frontend `.env.local` should have:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Verify Everything is Working

### 1. Test Health Endpoint
```bash
curl http://localhost:8080/health
```

Expected: `{"status": "healthy", "service": "blog-api"}`

### 2. Test Public Posts Endpoint
```bash
curl http://localhost:8080/posts?limit=1
```

Expected: JSON array of posts

### 3. Test Admin Endpoint (with auth)
```bash
curl -u admin:password http://localhost:8080/admin/dashboard
```

Expected: JSON with dashboard stats

### 4. Test in Browser
1. Go to http://localhost:3000/admin/login
2. Login
3. Go to http://localhost:3000/admin/dashboard
4. Should see dashboard with stats

## Common Issues

### Issue: "Failed to fetch"
**Cause:** Backend not running or wrong URL
**Fix:** Start backend, check URL in api-client.ts

### Issue: "401 Unauthorized"
**Cause:** Not logged in or wrong credentials
**Fix:** Re-login with correct credentials

### Issue: "404 Not Found"
**Cause:** Route doesn't exist or backend not running
**Fix:** Check backend logs, verify routes

### Issue: "500 Internal Server Error"
**Cause:** Database issue or backend error
**Fix:** Check backend logs, verify database connection

## Debug Mode

### Enable Verbose Logging

**In `frontend/lib/api-client.ts`:**
```typescript
console.log('Request URL:', url);
console.log('Request headers:', headers);
console.log('Response status:', response.status);
```

**In backend, check logs:**
```bash
cd backend
go run main.go 2>&1 | tee backend.log
```

## Still Not Working?

1. **Check all services are running:**
   - Backend: http://localhost:8080/health
   - Frontend: http://localhost:3000
   - Database: Accessible via DATABASE_URL

2. **Check firewall/antivirus:**
   - Allow connections to port 8080
   - Allow connections to port 3000

3. **Try different browser:**
   - Clear cache
   - Try incognito mode
   - Try different browser

4. **Check network tab in DevTools:**
   - See actual request URL
   - See response status and body
   - Check request headers

## Success Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Database accessible
- [ ] Health endpoint returns 200
- [ ] Can login to admin
- [ ] Can see dashboard
- [ ] Can see posts list
- [ ] Can see guides list

---

**If all else fails:** Restart everything!

```bash
# Stop all services
# Then:

# Terminal 1: Start backend
cd backend
go run main.go

# Terminal 2: Start frontend
cd frontend
npm run dev

# Terminal 3: Check database
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM posts;"
```
