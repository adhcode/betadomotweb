# Shop Testing Guide - With Your 2 Products

## ✅ Current Status

**Backend**: Running on http://localhost:8080
**Shop**: Running on http://localhost:3001

**Products in Database**: 2
1. **FOLM Casa Chair** - ₦370,000 (Furniture, 7 images)
2. **Porsche 911 Miniature Model** - ₦200,000 (Decor, 5 images)

Both products are marked as `featured: true` so they will appear on the homepage.

## 🧪 Test the Complete Flow

### 1. Homepage Test
Visit: http://localhost:3001

**Expected to see:**
- Hero section with "Better Homes" text
- "Editor's Selection" section with your 2 products
- Product cards showing:
  - Large product images from Cloudinary
  - Category labels (FURNITURE, DECOR)
  - Product names
  - Short descriptions
  - "View Story →" on hover

### 2. Product Page Test

**FOLM Casa Chair:**
http://localhost:3001/products/folm-casa-chair

**Porsche 911 Model:**
http://localhost:3001/products/porsche-911-miniature-model

**Expected to see:**
- Opening spread with hero image
- Product name and tagline
- Editorial description
- Multiple detail images (7 for chair, 5 for model)
- Price display
- "Add to cart" button
- Smooth scrolling sections

### 3. Cart Test

1. Click "Add to cart" on any product
2. Cart icon should appear in header (top right)
3. Click cart icon to open drawer
4. Should see:
   - Product image and name
   - Price
   - Quantity controls (+/-)
   - Remove button
   - Subtotal
   - "Checkout" button

### 4. Checkout Test

1. Click "Checkout" from cart
2. Fill out the form:
   - Contact info
   - Shipping address
   - Payment method (placeholder)
3. Click "Place Order"
4. Should redirect to success page

### 5. Navigation Test

**Menu Icon (top right):**
- Click to open full-screen menu
- Test all sections:
  - Explore by Space (Living Room, Bedroom, Kitchen, Work)
  - Explore by Purpose (Power, Comfort, Light, Storage)
  - Read (links to blog)
  - Studio (How We Choose, Coming Soon)

## 🐛 Common Issues & Fixes

### Products Not Showing
```bash
# Check backend is running
curl http://localhost:8080/products

# Should return JSON with 2 products
```

### Images Not Loading
- Check Cloudinary URLs are accessible
- Open browser console for errors
- Verify images array in product data

### Cart Not Working
- Check browser console for errors
- Verify localStorage is enabled
- Try clearing localStorage: `localStorage.clear()`

### Styling Issues
```bash
# Rebuild shop
cd shop
npm run build
npm run dev
```

## 📊 Product Data Summary

### FOLM Casa Chair
- **Slug**: `folm-casa-chair`
- **Price**: ₦370,000
- **Category**: Furniture
- **Stock**: 20 units
- **Images**: 7 high-quality photos
- **Description**: "Mid-century inspired and handcrafted for lasting comfort..."

### Porsche 911 Miniature Model
- **Slug**: `porsche-911-miniature-model`
- **Price**: ₦200,000
- **Category**: Decor
- **Stock**: 4 units
- **Images**: 5 high-quality photos
- **Description**: "A timeless icon, distilled for the modern shelf."

## 🎨 Design Features to Notice

### Editorial Style
- ✅ Generous white space
- ✅ Light typography (font-weight: 300-400)
- ✅ Calm gray color palette
- ✅ No urgency tactics or badges
- ✅ Magazine-style layout

### Apple Influence
- ✅ Minimal interface
- ✅ Smooth scrolling
- ✅ Product-focused photography
- ✅ Clean, understated CTAs
- ✅ Subtle animations

### Interactions
- ✅ "View Story →" hover on product cards
- ✅ Cart drawer slides in from right
- ✅ Full-screen menu overlay
- ✅ Smooth transitions throughout

## 🚀 Next Steps After Testing

### If Everything Works:
1. ✅ Shop is production-ready for these 2 products
2. Add more products to expand collection
3. Set up payment integration (Paystack)
4. Deploy to production

### If Issues Found:
1. Check browser console for errors
2. Verify backend is returning correct data
3. Test in different browsers
4. Check mobile responsiveness

## 📱 Mobile Testing

Test on mobile devices or browser dev tools:
- Responsive layout
- Touch-friendly buttons
- Swipeable cart drawer
- Mobile menu

## 🔗 Quick Links

- **Shop Homepage**: http://localhost:3001
- **Backend API**: http://localhost:8080/products
- **Blog (Read section)**: https://betadomot.blog

---

**Status**: Shop is live with 2 products. Ready for testing and feedback.
