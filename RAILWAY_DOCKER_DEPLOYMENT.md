# 🐳 Railway Docker Deployment Guide

## Issue Resolution

**Problem**: Nixpacks build failed on Railway
**Solution**: Switched to Docker build for more reliable deployment

## Updated Configuration

### 1. Railway Configuration (`backend/railway.toml`)
```toml
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"

[env]
PORT = "8080"
```

### 2. Optimized Dockerfile (`backend/Dockerfile`)
- **Multi-stage build** for smaller final image
- **Go 1.23** with Alpine Linux
- **Security**: Non-root user execution
- **Optimization**: CGO disabled, static binary
- **Production-ready**: Includes ca-certificates and timezone data

## Railway Deployment Steps

### 1. Create New Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `adhcode/betadomotweb`

### 2. Configure Project Settings
1. **Root Directory**: Set to `backend`
2. **Build Method**: Railway will automatically detect Dockerfile
3. **Port**: Railway will use PORT environment variable (8080)

### 3. Set Environment Variables
Add these in Railway dashboard → Variables:

```env
# Required
PORT=8080
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key

# Admin Credentials (CHANGE THESE!)
ADMIN_USERNAME=your_secure_admin_username
ADMIN_PASSWORD=your_very_secure_password

# Optional
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=hello@yourdomain.com
WEBSITE_URL=https://yourdomain.com
```

### 4. Deploy
1. Railway will automatically build using Docker
2. The build process will:
   - Use Go 1.23 to compile the application
   - Create an optimized, secure container
   - Run health checks on `/health` endpoint

## Advantages of Docker Build

✅ **More Reliable**: Docker builds are consistent across environments
✅ **Better Control**: Explicit build steps and dependencies
✅ **Security**: Non-root user execution
✅ **Performance**: Multi-stage build creates smaller images
✅ **Production-Ready**: Includes all necessary system dependencies

## Verification

Once deployed, test your Railway backend:

```bash
# Health check
curl https://your-app-name.railway.app/health

# Admin dashboard
curl -u admin:password https://your-app-name.railway.app/admin/dashboard

# Posts API
curl https://your-app-name.railway.app/posts
```

## Next Steps

1. **Deploy Backend**: Use the steps above
2. **Get Railway URL**: Copy your Railway app URL
3. **Deploy Frontend**: Update Vercel with Railway backend URL
4. **Test Integration**: Ensure frontend can communicate with backend

Your BetaDomot backend is now ready for reliable Railway deployment! 🚀