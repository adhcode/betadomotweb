# 🧪 Shop Testing Guide

## ✅ Shop is Running!

Your shop is now live at: **http://localhost:3001**

## 🎯 What to Test

### 1. Visual Design
- [ ] Check if Gilroy fonts are loading
- [ ] Verify brand colors (teal #236b7c, gold #dca744)
- [ ] Test responsive design (resize browser)
- [ ] Check hover effects on product cards
- [ ] Verify animations are smooth

### 2. Navigation
- [ ] Click header logo (should stay on home)
- [ ] Test mobile menu (resize to mobile)
- [ ] Check all navigation links
- [ ] Test search icon (placeholder)
- [ ] Test wishlist icon (placeholder)
- [ ] Test cart icon (placeholder)

### 3. Product Listing
- [ ] Products display in grid
- [ ] Images load correctly
- [ ] Prices display properly
- [ ] Stock status shows
- [ ] Featured/Sale badges appear
- [ ] Hover effects work

### 4. Product Detail
- [ ] Click on a product card
- [ ] Large image displays
- [ ] Image gallery works (if multiple images)
- [ ] Price and discount calculate correctly
- [ ] Stock indicator animates
- [ ] Add to Cart button works (UI only)
- [ ] Wishlist/Share buttons present
- [ ] Product details table shows
- [ ] Tags are interactive

## 📦 Add Sample Products

### Option 1: Via API (Recommended)

```bash
# Make sure backend is running on port 8080
cd backend
go run main.go
```

Then add a product:

```bash
curl -X POST http://localhost:8080/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:your-password' | base64)" \
  -d '{
    "name": "Modern Office Chair",
    "description": "Ergonomic office chair with lumbar support. Perfect for long work hours. Adjustable height and armrests.",
    "price": 45000,
    "sale_price": 38000,
    "images": [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800"
    ],
    "category": "Furniture",
    "tags": ["office", "ergonomic", "chair"],
    "stock": 15,
    "sku": "CHAIR-001",
    "weight": 12.5,
    "dimensions": "60x60x120cm",
    "featured": true,
    "active": true
  }'
```

### Option 2: Add Multiple Products

```bash
# Luxury Bed Set
curl -X POST http://localhost:8080/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:your-password' | base64)" \
  -d '{
    "name": "Luxury Bed Set",
    "description": "Premium quality bed set with soft cotton sheets. Includes duvet cover, pillowcases, and fitted sheet.",
    "price": 89000,
    "images": ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
    "category": "Bedroom",
    "tags": ["bedroom", "luxury", "bedding"],
    "stock": 8,
    "sku": "BED-001",
    "featured": true,
    "active": true
  }'

# Modern Table Lamp
curl -X POST http://localhost:8080/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:your-password' | base64)" \
  -d '{
    "name": "Modern Table Lamp",
    "description": "Sleek modern table lamp with adjustable brightness. Energy-efficient LED bulb included.",
    "price": 15000,
    "sale_price": 12000,
    "images": ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800"],
    "category": "Lighting",
    "tags": ["lighting", "modern", "led"],
    "stock": 25,
    "sku": "LAMP-001",
    "active": true
  }'

# Decorative Wall Art
curl -X POST http://localhost:8080/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:your-password' | base64)" \
  -d '{
    "name": "Abstract Wall Art",
    "description": "Beautiful abstract canvas wall art. Adds a modern touch to any room. Ready to hang.",
    "price": 25000,
    "images": ["https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800"],
    "category": "Decor",
    "tags": ["art", "decor", "wall"],
    "stock": 12,
    "sku": "ART-001",
    "featured": true,
    "active": true
  }'
```

## 🔍 Testing Checklist

### Homepage (http://localhost:3001)
- [ ] Hero section displays
- [ ] Stats bar shows product count
- [ ] Product grid loads
- [ ] All product cards display correctly
- [ ] Images load (or placeholder shows)
- [ ] Prices format correctly (₦)
- [ ] Featured badges show on featured products
- [ ] Sale badges show on discounted products
- [ ] Stock status displays
- [ ] Hover effects work smoothly

### Product Detail Page
- [ ] Click any product card
- [ ] URL changes to `/products/[slug]`
- [ ] Large product image displays
- [ ] Image gallery shows (if multiple images)
- [ ] Discount badge shows (if on sale)
- [ ] Price displays correctly
- [ ] Savings calculator works
- [ ] Stock indicator shows and animates
- [ ] Add to Cart button is styled correctly
- [ ] Wishlist and Share buttons present
- [ ] Feature icons display (Truck, Shield, RotateCcw)
- [ ] Product details table shows all info
- [ ] Tags display and are interactive
- [ ] Back button works

### Responsive Design
- [ ] Desktop (> 1024px): 4-column grid
- [ ] Tablet (768-1024px): 3-column grid
- [ ] Mobile (< 768px): 1-2 column grid
- [ ] Mobile menu works
- [ ] Touch targets are adequate
- [ ] Text is readable on all sizes

### Performance
- [ ] Page loads quickly (< 2s)
- [ ] Images load progressively
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] No layout shifts

## 🐛 Common Issues & Fixes

### Issue: No products showing
**Fix:** Make sure backend is running and products are added to database

```bash
# Check backend
curl http://localhost:8080/products

# Should return JSON array of products
```

### Issue: Images not loading
**Fix:** Check image URLs are valid and accessible

```bash
# Test image URL
curl -I https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800
```

### Issue: Fonts not loading
**Fix:** Verify fonts are in `shop/public/` directory

```bash
ls -la shop/public/*.ttf
```

### Issue: Styles not applying
**Fix:** Check if globals.css is imported in layout.tsx

```bash
# Should see: import "./globals.css";
grep "globals.css" shop/app/layout.tsx
```

### Issue: Icons not showing
**Fix:** Lucide-react should be installed

```bash
cd shop
npm install lucide-react
```

## 📸 Screenshots to Take

1. Homepage with products
2. Product card hover state
3. Product detail page
4. Mobile view
5. Tablet view
6. Empty state (no products)

## ✅ Success Criteria

Your shop is working perfectly if:
- ✅ Shop loads on http://localhost:3001
- ✅ Design matches blog aesthetic
- ✅ Gilroy fonts are visible
- ✅ Brand colors are correct
- ✅ Products display in grid
- ✅ Product detail page works
- ✅ Responsive on all devices
- ✅ Animations are smooth
- ✅ No console errors

## 🚀 Next Steps

1. **Add Real Products**
   - Use the API to add your actual products
   - Upload real product images
   - Set correct prices and stock

2. **Test on Different Devices**
   - iPhone/Android
   - iPad/Tablet
   - Desktop browsers

3. **Deploy to Production**
   - Follow `SHOP_DEPLOYMENT.md`
   - Deploy to Vercel
   - Configure domain

4. **Add Features**
   - Shopping cart functionality
   - Wishlist functionality
   - Product search
   - Filtering and sorting

## 📞 Need Help?

- Check `SHOP_DESIGN_COMPLETE.md` for design details
- Check `SHOP_SEPARATE_APP_GUIDE.md` for setup
- Check `COMPLETE_SETUP_GUIDE.md` for full guide

---

**Your shop is looking amazing! 🎉**

Visit: http://localhost:3001
