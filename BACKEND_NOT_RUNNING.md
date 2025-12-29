# Backend Not Running - Quick Fix

## The Problem

You're getting a 404 error on `/admin/posts` which means the backend isn't responding to that route.

## Quick Solution

### Step 1: Check if Backend is Running

Open a terminal and run:

```bash
curl http://localhost:8080/health
```

**If you get an error** (connection refused, etc.), the backend is NOT running.

**If you get** `{"status": "healthy", "service": "blog-api"}`, the backend IS running.

### Step 2: Start the Backend

If backend is not running:

```bash
cd backend
go run main.go
```

You should see output like:
```
🚀 Starting Blog API on port 8080
✅ Blog API running on http://localhost:8080
📖 Endpoints:
   GET  /health
   GET  /posts
   ...
   GET  /admin/posts (API)
```

### Step 3: Verify the Route Works

Once backend is running, test the admin endpoint:

```bash
# Replace with your actual admin credentials
curl -u admin:password http://localhost:8080/admin/posts
```

Should return JSON array of posts.

### Step 4: Refresh Your Browser

After backend is running:
1. Go back to your admin page
2. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. The posts should now load

## Common Issues

### Issue: "go: command not found"

**Solution:** Install Go from https://golang.org/dl/

### Issue: "cannot find package"

**Solution:**
```bash
cd backend
go mod tidy
go run main.go
```

### Issue: "port 8080 already in use"

**Solution:** Kill the process using port 8080:
```bash
# Find the process
lsof -i :8080

# Kill it (replace PID with actual process ID)
kill -9 PID

# Or on Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: "database connection failed"

**Solution:** Check your `backend/.env` file has correct DATABASE_URL:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

## Verification Checklist

Run these commands to verify everything:

```bash
# 1. Check backend health
curl http://localhost:8080/health

# 2. Check public posts endpoint
curl http://localhost:8080/posts?limit=1

# 3. Check admin posts endpoint (with auth)
curl -u admin:password http://localhost:8080/admin/posts

# 4. Check guides endpoint
curl http://localhost:8080/guides?limit=1
```

All should return JSON responses (not 404).

## Still Not Working?

### Check Backend Logs

Look at the terminal where you ran `go run main.go`. Check for:
- ✅ "Blog API running on http://localhost:8080"
- ✅ List of endpoints including "/admin/posts"
- ❌ Any error messages

### Check Environment Variables

```bash
cd backend
cat .env
```

Should have:
```env
DATABASE_URL=postgresql://...
PORT=8080
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
```

### Restart Everything

```bash
# Terminal 1: Backend
cd backend
go run main.go

# Terminal 2: Frontend  
cd frontend
npm run dev
```

## Expected Behavior

When everything works:

1. **Backend terminal shows:**
   ```
   ✅ Blog API running on http://localhost:8080
   ```

2. **Browser console shows:**
   ```
   Using API URL: http://localhost:8080
   Fetching admin posts from: http://localhost:8080/admin/posts
   ```

3. **Admin page shows:**
   - List of posts
   - No 404 errors
   - Ability to create/edit posts

---

**TL;DR:** Run `cd backend && go run main.go` in a terminal, then refresh your browser!
