# Start Your Backend Server

## The Problem

You're seeing 404 errors because the **backend server isn't running**:

```
Failed to load resource: the server responded with a status of 404 (Not Found)
http://localhost:8080/admin/posts
```

## The Solution

Start your Go backend server!

### Step 1: Open a New Terminal

Keep your frontend running in one terminal, and open a **new terminal** for the backend.

### Step 2: Navigate to Backend Directory

```bash
cd backend
```

### Step 3: Start the Server

```bash
go run main.go
```

You should see:
```
🚀 Starting Blog API on port 8080
✅ Blog API running on http://localhost:8080
📖 Endpoints:
   GET  /health
   GET  /posts
   ...
```

### Step 4: Verify It's Running

In another terminal or browser:
```bash
curl http://localhost:8080/health
```

Should return:
```json
{"status": "healthy", "service": "blog-api"}
```

## Common Issues

### Issue: "go: command not found"

**Solution:** Install Go
- Visit: https://go.dev/doc/install
- Download and install Go for your system
- Verify: `go version`

### Issue: "cannot find package"

**Solution:** Install dependencies
```bash
cd backend
go mod download
go mod tidy
```

### Issue: "DATABASE_URL not set"

**Solution:** Create `.env` file in backend directory
```bash
cd backend
touch .env
```

Add your database URL:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

### Issue: Port 8080 already in use

**Solution:** Kill the process or use a different port

Find what's using port 8080:
```bash
# On macOS/Linux
lsof -i :8080

# On Windows
netstat -ano | findstr :8080
```

Kill the process or change the port in `backend/config/config.go`

## Quick Start Script

Create a file `backend/start.sh`:

```bash
#!/bin/bash

echo "🚀 Starting Backend Server..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL is not set"
    echo "Please create a .env file with DATABASE_URL"
    exit 1
fi

# Start the server
echo "✅ Starting server on port 8080..."
go run main.go
```

Make it executable and run:
```bash
chmod +x start.sh
./start.sh
```

## Development Workflow

### Terminal 1: Frontend
```bash
cd frontend
npm run dev
```

### Terminal 2: Backend
```bash
cd backend
go run main.go
```

### Terminal 3: Commands/Testing
```bash
# Test endpoints
curl http://localhost:8080/health
curl http://localhost:8080/posts
```

## Verify Everything is Working

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8080/health
   ```
   Should return: `{"status": "healthy", "service": "blog-api"}`

2. **Frontend:**
   Visit: http://localhost:3000
   Should load without errors

3. **Admin Dashboard:**
   Visit: http://localhost:3000/admin/login
   Should be able to login and see posts

## Production Deployment

For production, you'll want to:

1. **Build the backend:**
   ```bash
   cd backend
   go build -o blog-api main.go
   ```

2. **Run the binary:**
   ```bash
   ./blog-api
   ```

3. **Use a process manager:**
   - systemd (Linux)
   - PM2 (Node.js)
   - Docker
   - Railway/Heroku/etc.

## Environment Variables

Make sure your `backend/.env` has:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Server
PORT=8080

# Admin Credentials (for basic auth)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Email (if using newsletter features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Next Steps

1. ✅ Start backend server
2. ✅ Verify health endpoint
3. ✅ Test admin login
4. ✅ Create your first post/guide
5. ✅ Set featured hero
6. ✅ Enjoy your blog!

---

**TL;DR:** Open a new terminal, run `cd backend && go run main.go` 🚀
