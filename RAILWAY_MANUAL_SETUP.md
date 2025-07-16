# 🛤️ Railway Manual Setup Guide

## Issue: Railway Still Using Nixpacks

Even with `railway.toml` configured for Docker, Railway might still try to use Nixpacks due to caching or detection issues.

## Manual Configuration Solution

### Step 1: Create New Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: `adhcode/betadomotweb`

### Step 2: Configure Build Settings Manually
1. **In Railway Dashboard**:
   - Go to your project
   - Click on "Settings" tab
   - Go to "Build" section

2. **Force Docker Build**:
   - **Build Command**: Leave empty (Docker will handle)
   - **Start Command**: Leave empty (Docker CMD will handle)
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `Dockerfile` (relative to root directory)

3. **Build Method**:
   - If there's an option to choose build method, select "Dockerfile"
   - If Railway auto-detects Nixpacks, look for "Override" or "Custom" build options

### Step 3: Environment Variables
Add these in Railway Dashboard → Variables:

```env
PORT=8080
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
RESEND_API_KEY=your_resend_api_key
```

### Step 4: Force Redeploy
1. Go to "Deployments" tab
2. Click "Deploy" or "Redeploy"
3. Railway should now use Docker instead of Nixpacks

## Alternative: Delete and Recreate Project

If Railway is still stuck on Nixpacks:

1. **Delete the current Railway project**
2. **Create a new project** from scratch
3. **Ensure root directory is set to `backend`**
4. **Railway should detect Dockerfile automatically**

## Verification

Once deployed successfully, test:

```bash
# Health check
curl https://your-app-name.railway.app/health

# Should return: {"status": "healthy", "service": "blog-api"}
```

## Why This Happens

Railway sometimes caches build detection. When switching from Nixpacks to Docker:
- Old build cache might persist
- Detection algorithms might conflict
- Manual override ensures Docker is used

## Success Indicators

✅ Build logs show Docker commands (FROM, RUN, COPY)
✅ No "Nixpacks build failed" errors
✅ Application starts successfully
✅ Health endpoint responds

Your BetaDomot backend will deploy successfully with Docker! 🐳