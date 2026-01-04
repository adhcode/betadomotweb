# Admin Login Production Fix

## Problem
Admin login was hardcoded to use `localhost:8080`, so it only worked locally and failed in production.

## Solution
Updated the login page to use environment-aware API URL:
- **Development**: `http://localhost:8080`
- **Production**: `https://betadomotweb-production.up.railway.app`

## Change Made

### frontend/app/admin/login/page.tsx

**Before:**
```typescript
const response = await fetch('http://localhost:8080/admin/dashboard', {
    headers: { 'Authorization': authHeader }
});
```

**After:**
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://betadomotweb-production.up.railway.app'
    : 'http://localhost:8080';

const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: { 'Authorization': authHeader }
});
```

## Testing

### Local:
1. Go to: `http://localhost:3000/admin/login`
2. Enter credentials
3. Should login successfully

### Production (after deployment):
1. Go to: `https://betadomot.blog/admin/login`
2. Enter credentials
3. Should now login successfully ✅

## Related Files

This is consistent with how other API calls work in:
- `frontend/lib/api-client.ts` - Uses same pattern
- All dashboard pages - Use same API_BASE_URL logic

## Deploy

Include this fix in your next deployment:
```bash
git add frontend/app/admin/login/page.tsx
git commit -m "Fix: Admin login now works in production"
git push origin main
```

---

**Status**: Admin login will now work in both development and production! 🔐
