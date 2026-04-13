# Shop Admin Dashboard - Implementation Plan

## Overview

Build an admin dashboard for the Betadomot Shop to manage products, orders, and settings. We'll adapt the existing frontend admin structure for the shop.

## Current Status

✅ **Cart badge fixed** - Number now visible with proper positioning
✅ **Editorial design complete** - All customer-facing pages done
✅ **Backend API ready** - Product endpoints working
✅ **Frontend admin exists** - Can adapt for shop

## Admin Dashboard Structure

```
shop/app/admin/
├── login/
│   └── page.tsx (Authentication)
├── dashboard/
│   ├── layout.tsx (Shared layout with sidebar)
│   ├── page.tsx (Overview/Analytics)
│   ├── products/
│   │   └── page.tsx (Product CRUD)
│   ├── orders/
│   │   └── page.tsx (Order management)
│   ├── categories/
│   │   └── page.tsx (Lifestyle categories)
│   └── settings/
│       └── page.tsx (Shop settings)
```

## Phase 1: Admin Authentication & Layout

### 1.1 Login Page
- Simple username/password form
- Store credentials in localStorage/sessionStorage
- Redirect to dashboard on success
- Use existing backend auth

### 1.2 Dashboard Layout
- Sidebar navigation
- Header with logout button
- Responsive design
- Editorial aesthetic (minimal, clean)

## Phase 2: Product Management

### 2.1 Products List
- Display all products in table/grid
- Search and filter
- Quick actions (edit, delete, toggle active)
- Pagination

### 2.2 Create/Edit Product
- Form with all product fields
- Cloudinary image upload
- Tag management
- Category selection
- Featured/Active toggles
- Preview before save

### 2.3 Product Features
- Bulk actions (delete, activate, deactivate)
- Duplicate product
- Quick edit (inline editing)
- Image gallery management

## Phase 3: Order Management

### 3.1 Orders Database
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_name TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_reference TEXT,
  order_status TEXT DEFAULT 'processing',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

### 3.2 Orders List
- Display all orders
- Filter by status, date, customer
- Search by order number, email
- Quick status updates
- Export to CSV

### 3.3 Order Details
- Full order information
- Customer details
- Items ordered
- Payment status
- Shipping status
- Order timeline
- Add notes
- Update status
- Print invoice

### 3.4 Order Statuses
- Pending
- Processing
- Shipped
- Delivered
- Cancelled
- Refunded

## Phase 4: Payment Integration (Paystack)

### 4.1 Setup
```bash
npm install @paystack/inline-js
```

### 4.2 Environment Variables
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
```

### 4.3 Checkout Integration
- Initialize Paystack on checkout
- Handle payment success
- Handle payment failure
- Create order on success
- Send confirmation email

### 4.4 Backend Endpoints
```
POST /orders - Create new order
GET /orders - List all orders (admin)
GET /orders/:id - Get order details
PUT /orders/:id - Update order
POST /orders/:id/status - Update order status
```

## Phase 5: Analytics Dashboard

### 5.1 Overview Stats
- Total revenue (today, week, month)
- Orders count
- Products sold
- Average order value
- Top products
- Recent orders

### 5.2 Charts
- Revenue over time
- Orders by status
- Products by category
- Sales by product

## Phase 6: Lifestyle Categories Management

### 6.1 Categories List
- Display all lifestyle categories
- Reorder categories
- Toggle active/inactive
- Preview products in category

### 6.2 Create/Edit Category
- Title and description
- Filter configuration
- Order/priority
- View all link
- Preview

## Design Specifications

### Admin Aesthetic
- Clean and minimal (not as editorial as customer-facing)
- Functional and efficient
- Light gray backgrounds
- Clear typography
- Subtle shadows and borders
- Blue accent color for actions

### Components
- Tables with hover states
- Modal forms for create/edit
- Toast notifications for success/error
- Loading states
- Empty states
- Confirmation dialogs

## Implementation Order

### Week 1: Core Admin
1. ✅ Fix cart badge
2. 🔲 Admin login page
3. 🔲 Dashboard layout with sidebar
4. 🔲 Products management (adapt from frontend admin)
5. 🔲 Image upload with Cloudinary

### Week 2: Orders & Payment
1. 🔲 Orders database table
2. 🔲 Orders backend endpoints
3. 🔲 Paystack integration
4. 🔲 Order creation on checkout
5. 🔲 Orders management UI
6. 🔲 Order details page

### Week 3: Polish & Features
1. 🔲 Analytics dashboard
2. 🔲 Lifestyle categories management
3. 🔲 Settings page
4. 🔲 Email notifications
5. 🔲 Export functionality
6. 🔲 Mobile optimization

## Quick Wins (Do First)

1. **Admin Login** - Simple auth page
2. **Products List** - Adapt existing frontend admin
3. **Create Product** - Form with Cloudinary upload
4. **Orders Table** - Create database and basic list
5. **Paystack Integration** - Get payments working

## Files to Create

### Admin Structure
- `shop/app/admin/login/page.tsx`
- `shop/app/admin/dashboard/layout.tsx`
- `shop/app/admin/dashboard/page.tsx`
- `shop/app/admin/dashboard/products/page.tsx`
- `shop/app/admin/dashboard/orders/page.tsx`

### API Helpers
- `shop/lib/admin-api.ts` (API client for admin)
- `shop/lib/paystack.ts` (Paystack integration)

### Backend
- `backend/handlers/orders.go` (Order endpoints)
- `backend/create_orders_table.sql` (Database schema)

### Components
- `shop/components/admin/Sidebar.tsx`
- `shop/components/admin/OrderCard.tsx`
- `shop/components/admin/StatsCard.tsx`

## Testing Checklist

- [ ] Admin login works
- [ ] Products CRUD works
- [ ] Image upload works
- [ ] Orders are created
- [ ] Payment processing works
- [ ] Order status updates
- [ ] Email notifications sent
- [ ] Mobile responsive
- [ ] Error handling
- [ ] Loading states

---

**Next Step**: Start with admin login and products management, then move to payment integration.
