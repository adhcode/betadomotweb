# 🚀 BetaDomot Deployment Guide

## Overview

This guide will help you deploy BetaDomot with:
- **Backend**: Railway (Go API)
- **Frontend**: Vercel (Next.js)

## Prerequisites

1. **Railway Account**: [railway.app](https://railway.app)
2. **Vercel Account**: [vercel.com](https://vercel.com)
3. **Supabase Project**: [supabase.com](https://supabase.com)
4. **Resend Account**: [resend.com](https://resend.com) (for emails)
5. **Cloudinary Account**: [cloudinary.com](https://cloudinary.com) (for images)

---

## 🛤️ Backend Deployment (Railway)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy to Railway

1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder as the root directory

2. **Configure Environment Variables**:
   In Railway dashboard, go to Variables tab and add:

   ```env
   # Server Configuration
   PORT=8080
   
   # Database (Supabase)
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_service_role_key
   
   # Email Service (Resend)
   RESEND_API_KEY=your_resend_api_key
   
   # Admin Credentials (CHANGE THESE!)
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_secure_admin_password
   ```

3. **Deploy**:
   - Railway will automatically build and deploy
   - Your API will be available at: `https://your-app-name.railway.app`

### Step 3: Verify Backend Deployment

Test your deployed API:

```bash
# Health check
curl https://your-app-name.railway.app/health

# Test admin login
curl -u your_admin_username:your_admin_password https://your-app-name.railway.app/admin/dashboard
```

---

## ▲ Frontend Deployment (Vercel)

### Step 1: Update Next.js Configuration

The `next.config.ts` needs to be updated with your Railway backend URL:

```typescript
// Add your Railway backend URL to remotePatterns
{
  protocol: 'https',
  hostname: 'your-app-name.railway.app',
}
```

### Step 2: Deploy to Vercel

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`

2. **Configure Environment Variables**:
   In Vercel dashboard, go to Settings → Environment Variables:

   ```env
   # Backend API URL
   NEXT_PUBLIC_API_URL=https://your-app-name.railway.app
   
   # Cloudinary Configuration
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

3. **Deploy**:
   - Vercel will automatically build and deploy
   - Your site will be available at: `https://your-project-name.vercel.app`

### Step 3: Update CORS Configuration

Update your backend to allow your Vercel domain. In your Go backend, update the CORS middleware to include your Vercel URL.

---

## 🔧 Post-Deployment Configuration

### 1. Update Frontend API Calls

Create an environment-based API configuration:

```typescript
// lib/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
```

### 2. Test Full Integration

1. **Frontend → Backend Communication**:
   - Visit your Vercel site
   - Test newsletter signup
   - Test blog post loading
   - Test product catalog

2. **Admin Panel**:
   - Go to `https://your-vercel-site.vercel.app/admin`
   - Login with your admin credentials
   - Test creating/editing posts

### 3. Configure Custom Domains (Optional)

**Railway Custom Domain**:
- In Railway dashboard: Settings → Domains
- Add your custom domain (e.g., `api.betadomot.com`)

**Vercel Custom Domain**:
- In Vercel dashboard: Settings → Domains
- Add your custom domain (e.g., `betadomot.com`)

---

## 🔒 Security Checklist

### Backend Security

- [ ] Change default admin credentials
- [ ] Use strong passwords
- [ ] Enable HTTPS only
- [ ] Configure proper CORS origins
- [ ] Use environment variables for all secrets

### Frontend Security

- [ ] Configure CSP headers
- [ ] Use HTTPS for all API calls
- [ ] Validate all user inputs
- [ ] Secure image upload settings

---

## 📊 Monitoring & Maintenance

### Railway Monitoring

- **Logs**: Railway dashboard → Deployments → View Logs
- **Metrics**: Monitor CPU, memory, and request metrics
- **Health Checks**: Automatic via `/health` endpoint

### Vercel Monitoring

- **Analytics**: Built-in Vercel Analytics
- **Performance**: Core Web Vitals monitoring
- **Error Tracking**: Function logs and errors

---

## 🚨 Troubleshooting

### Common Issues

**1. CORS Errors**
```
Error: Access to fetch at 'railway-url' from origin 'vercel-url' has been blocked by CORS policy
```
**Solution**: Update CORS middleware in backend to include Vercel domain

**2. Environment Variables Not Loading**
```
Error: Cannot read properties of undefined
```
**Solution**: Ensure all environment variables are set in both Railway and Vercel

**3. Database Connection Issues**
```
Error: Failed to connect to Supabase
```
**Solution**: Verify Supabase URL and service role key

**4. Image Upload Issues**
```
Error: Cloudinary upload failed
```
**Solution**: Check Cloudinary credentials and upload preset configuration

### Debug Commands

```bash
# Check Railway deployment logs
railway logs

# Test API endpoints
curl -X GET https://your-app.railway.app/health
curl -X GET https://your-app.railway.app/posts

# Check Vercel build logs
vercel logs your-deployment-url
```

---

## 🎉 Success!

Your BetaDomot application is now live:

- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-app.railway.app`
- **Admin Panel**: `https://your-project.vercel.app/admin`

### Next Steps

1. **Content Creation**: Start adding blog posts and products
2. **SEO Optimization**: Configure meta tags and sitemaps
3. **Analytics**: Set up Google Analytics or similar
4. **Backup Strategy**: Regular database backups
5. **Performance Monitoring**: Set up alerts and monitoring

---

## 📞 Support Resources

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

Happy deploying! 🚀