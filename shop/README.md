# BetaDomot Shop

A separate Next.js application for the BetaDomot e-commerce shop.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Opens on http://localhost:3001

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Structure

```
shop/
├── app/
│   ├── page.tsx                    # Product listing (home)
│   └── products/[slug]/page.tsx    # Product detail
├── lib/
│   └── api-client.ts               # API functions
└── .env.local                      # Environment variables
```

## 🌐 Deployment

This app is deployed separately from the blog:

- **Blog:** `blog.betadomot.com` (from `/frontend`)
- **Shop:** `shop.betadomot.com` (from `/shop`)
- **API:** `api.betadomot.com` (from `/backend`)

### Deploy to Vercel

```bash
vercel --prod
```

Set custom domain to `shop.betadomot.com` in Vercel dashboard.

## 🔧 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For production:

```env
NEXT_PUBLIC_API_URL=https://api.betadomot.com
```

## 📚 Documentation

See parent directory for complete documentation:
- `../SHOP_SEPARATE_APP_GUIDE.md` - Complete setup guide
- `../SHOP_FINAL_SUMMARY.md` - Implementation summary
- `../SHOP_SETUP_GUIDE.md` - Backend API documentation

## 🧪 Testing

```bash
# Test API connection
curl http://localhost:8080/products

# Test build
npm run build

# Test production mode
npm start
```

## 🔗 Links

- Blog: https://blog.betadomot.com
- Shop: https://shop.betadomot.com
- API: https://api.betadomot.com

---

**This is a separate Next.js app, independent from the blog.**
