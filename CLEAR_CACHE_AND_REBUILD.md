# Clear Cache and Rebuild

The Comments component has been updated but you're seeing the old version due to Next.js caching.

## Quick Fix - Run these commands:

```bash
cd frontend
rm -rf .next
npm run dev
```

## What this does:
1. Removes the `.next` build cache folder
2. Restarts the dev server with a fresh build

## Alternative (if above doesn't work):

```bash
cd frontend
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

## After running the commands:
1. Hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Clear browser cache if needed
3. The new Comments component should now appear

## What changed in Comments:
- ✅ Single textarea first (progressive disclosure)
- ✅ Name field appears after typing
- ✅ localStorage saves your name for future comments
- ✅ Personalized placeholder if name is saved
- ✅ Gold button matching hero/footer
- ✅ Better styling and UX
