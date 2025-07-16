# 🚂 Railway CLI Deployment (Ultimate Solution)

## The Problem
Railway web interface keeps defaulting to Nixpacks despite our Docker configuration.

## Solution: Use Railway CLI

### Step 1: Install Railway CLI
```bash
# macOS
brew install railway

# Or using npm
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Deploy from CLI
```bash
# Navigate to backend directory
cd backend

# Initialize Railway project
railway init

# Set environment variables
railway variables set PORT=8080
railway variables set SUPABASE_URL=your_supabase_url
railway variables set SUPABASE_KEY=your_supabase_key
railway variables set ADMIN_USERNAME=your_admin_username
railway variables set ADMIN_PASSWORD=your_admin_password

# Deploy using Docker (this forces Docker build)
railway up --dockerfile Dockerfile
```

### Step 4: Verify Deployment
```bash
# Get the deployment URL
railway status

# Test the health endpoint
curl https://your-app.railway.app/health
```

## Why This Works
- CLI deployment bypasses web interface build detection
- `--dockerfile` flag explicitly forces Docker usage
- No Nixpacks interference
- Direct control over build process

## Alternative: Manual Docker Build
If CLI doesn't work, you can build locally and push:

```bash
# Build Docker image locally
docker build -t betadomot-backend .

# Tag for Railway registry
docker tag betadomot-backend registry.railway.app/your-project-id

# Push to Railway
docker push registry.railway.app/your-project-id
```

This approach completely bypasses Railway's build detection! 🚀