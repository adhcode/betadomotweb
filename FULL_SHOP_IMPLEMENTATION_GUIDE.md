# Full-Scale Shop Implementation Guide

## Overview

This guide walks through implementing a complete e-commerce shop with categories, filters, search, reviews, and collections while maintaining Betadomot's editorial identity.

## Phase 1: Database & Backend (Foundation)

### Step 1: Run Database Migration

```bash
cd backend
chmod +x run_full_shop_migration.sh
./run_full_shop_migration.sh
```

Or via Supabase Dashboard SQL Editor - copy/paste `create_full_shop_schema.sql`

**What this creates:**
- ✅ `product_categories` - Hierarchical categories (Furniture > Seating > Chairs)
- ✅ `product_collections` - Curated collections for merchandising
- ✅ `product_reviews` - Customer reviews and ratings
- ✅ Enhanced `products` table with category_id, brand, ratings, search
- ✅ 15+ default categories (Furniture, Lighting, Decor, etc.)
- ✅ 6 default collections (Scandinavian Living, Bestsellers, etc.)
- ✅ Full-text search infrastructure
- ✅ Auto-update triggers for counts and ratings

### Step 2: Update Backend Models

**File**: `backend/models/models.go`

Add new models:
```go
// ProductCategory represents a product category
type ProductCategory struct {
    ID              string  `json:"id"`
    Slug            string  `json:"slug"`
    Name            string  `json:"name"`
    Description     string  `json:"description"`
    ParentID        *string `json:"parent_id,omitempty"`
    ImageURL        string  `json:"image_url"`
    DisplayOrder    int     `json:"display_order"`
    IsFeatured      bool    `json:"is_featured"`
    ProductCount    int     `json:"product_count"`
    MetaTitle       string  `json:"meta_title"`
    MetaDescription string  `json:"meta_description"`
    CreatedAt       string  `json:"created_at"`
    UpdatedAt       string  `json:"updated_at"`
}

// ProductCollection represents a curated collection
type ProductCollection struct {
    ID           string `json:"id"`
    Slug         string `json:"slug"`
    Name         string `json:"name"`
    Description  string `json:"description"`
    ImageURL     string `json:"image_url"`
    IsFeatured   bool   `json:"is_featured"`
    DisplayOrder int    `json:"display_order"`
    ProductCount int    `json:"product_count"`
    CreatedAt    string `json:"created_at"`
    UpdatedAt    string `json:"updated_at"`
}

// ProductReview represents a customer review
type ProductReview struct {
    ID               string `json:"id"`
    ProductID        string `json:"product_id"`
    CustomerName     string `json:"customer_name"`
    CustomerEmail    string `json:"customer_email"`
    Rating           int    `json:"rating"`
    Title            string `json:"title"`
    Comment          string `json:"comment"`
    VerifiedPurchase bool   `json:"verified_purchase"`
    IsApproved       bool   `json:"is_approved"`
    HelpfulCount     int    `json:"helpful_count"`
    CreatedAt        string `json:"created_at"`
    UpdatedAt        string `json:"updated_at"`
}

// Update Product model with new fields
type Product struct {
    // ... existing fields ...
    
    // New fields for full shop
    CategoryID      *string  `json:"category_id,omitempty"`
    Brand           string   `json:"brand"`
    Material        string   `json:"material"`
    Color           string   `json:"color"`
    RatingAverage   float64  `json:"rating_average"`
    RatingCount     int      `json:"rating_count"`
    ReviewCount     int      `json:"review_count"`
    ViewCount       int      `json:"view_count"`
    SalesCount      int      `json:"sales_count"`
    IsBestseller    bool     `json:"is_bestseller"`
    IsNewArrival    bool     `json:"is_new_arrival"`
    IsOnSale        bool     `json:"is_on_sale"`
    MetaTitle       string   `json:"meta_title"`
    MetaDescription string   `json:"meta_description"`
}
```

### Step 3: Create Category Handler

**File**: `backend/handlers/categories.go` (new)

```go
package handlers

import (
    "blog-backend/models"
    "blog-backend/services"
    "encoding/json"
    "net/http"
    
    "github.com/go-chi/chi/v5"
)

type CategoryHandler struct {
    db *services.DatabaseService
}

func NewCategoryHandler(db *services.DatabaseService) *CategoryHandler {
    return &CategoryHandler{db: db}
}

// GetCategories handles GET /categories
func (h *CategoryHandler) GetCategories(w http.ResponseWriter, r *http.Request) {
    client := h.db.GetClient()
    
    // Get query parameters
    featured := r.URL.Query().Get("featured")
    parentID := r.URL.Query().Get("parent_id")
    
    query := client.From("product_categories").Select("*", "exact", false)
    
    if featured == "true" {
        query = query.Eq("is_featured", "true")
    }
    
    if parentID != "" {
        if parentID == "null" {
            query = query.Is("parent_id", "null")
        } else {
            query = query.Eq("parent_id", parentID)
        }
    }
    
    jsonStr, _, err := query.Order("display_order", nil).ExecuteString()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(jsonStr))
}

// GetCategory handles GET /categories/{slug}
func (h *CategoryHandler) GetCategory(w http.ResponseWriter, r *http.Request) {
    slug := chi.URLParam(r, "slug")
    
    client := h.db.GetClient()
    jsonStr, _, err := client.From("product_categories").
        Select("*", "exact", false).
        Eq("slug", slug).
        ExecuteString()
    
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(jsonStr))
}

// GetCategoryProducts handles GET /categories/{slug}/products
func (h *CategoryHandler) GetCategoryProducts(w http.ResponseWriter, r *http.Request) {
    slug := chi.URLParam(r, "slug")
    
    // First get category ID
    client := h.db.GetClient()
    categoryStr, _, err := client.From("product_categories").
        Select("id", "exact", false).
        Eq("slug", slug).
        ExecuteString()
    
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    var categories []map[string]interface{}
    if err := json.Unmarshal([]byte(categoryStr), &categories); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    if len(categories) == 0 {
        http.Error(w, "Category not found", http.StatusNotFound)
        return
    }
    
    categoryID := categories[0]["id"].(string)
    
    // Get products in this category
    productsStr, _, err := client.From("products").
        Select("*", "exact", false).
        Eq("category_id", categoryID).
        Eq("active", "true").
        Order("created_at", &map[string]interface{}{"ascending": false}).
        ExecuteString()
    
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(productsStr))
}
```

### Step 4: Update Product Handler with Filters

**File**: `backend/handlers/products.go` (update)

Add advanced filtering:
```go
// GetProducts handles GET /products with advanced filters
func (h *ProductHandler) GetProducts(w http.ResponseWriter, r *http.Request) {
    client := h.db.GetClient()
    
    // Get query parameters
    category := r.URL.Query().Get("category")
    brand := r.URL.Query().Get("brand")
    material := r.URL.Query().Get("material")
    color := r.URL.Query().Get("color")
    priceMin := r.URL.Query().Get("price_min")
    priceMax := r.URL.Query().Get("price_max")
    sort := r.URL.Query().Get("sort")
    search := r.URL.Query().Get("q")
    featured := r.URL.Query().Get("featured")
    bestseller := r.URL.Query().Get("bestseller")
    newArrival := r.URL.Query().Get("new_arrival")
    onSale := r.URL.Query().Get("on_sale")
    limit := r.URL.Query().Get("limit")
    offset := r.URL.Query().Get("offset")
    
    query := client.From("products").Select("*", "exact", false).Eq("active", "true")
    
    // Apply filters
    if category != "" {
        query = query.Eq("category_id", category)
    }
    
    if brand != "" {
        query = query.Eq("brand", brand)
    }
    
    if material != "" {
        query = query.Eq("material", material)
    }
    
    if color != "" {
        query = query.Eq("color", color)
    }
    
    if priceMin != "" {
        query = query.Gte("price", priceMin)
    }
    
    if priceMax != "" {
        query = query.Lte("price", priceMax)
    }
    
    if featured == "true" {
        query = query.Eq("featured", "true")
    }
    
    if bestseller == "true" {
        query = query.Eq("is_bestseller", "true")
    }
    
    if newArrival == "true" {
        query = query.Eq("is_new_arrival", "true")
    }
    
    if onSale == "true" {
        query = query.Eq("is_on_sale", "true")
    }
    
    // Search
    if search != "" {
        // Use full-text search
        query = query.TextSearch("search_vector", search, &map[string]interface{}{
            "type": "websearch",
        })
    }
    
    // Sorting
    switch sort {
    case "price_asc":
        query = query.Order("price", &map[string]interface{}{"ascending": true})
    case "price_desc":
        query = query.Order("price", &map[string]interface{}{"ascending": false})
    case "newest":
        query = query.Order("created_at", &map[string]interface{}{"ascending": false})
    case "popular":
        query = query.Order("sales_count", &map[string]interface{}{"ascending": false})
    case "rating":
        query = query.Order("rating_average", &map[string]interface{}{"ascending": false})
    default:
        query = query.Order("created_at", &map[string]interface{}{"ascending": false})
    }
    
    // Pagination
    if limit != "" {
        limitInt, _ := strconv.Atoi(limit)
        if limitInt > 0 {
            query = query.Limit(limitInt, "")
        }
    }
    
    if offset != "" {
        offsetInt, _ := strconv.Atoi(offset)
        if offsetInt > 0 {
            query = query.Range(offsetInt, offsetInt+24, "")
        }
    }
    
    jsonStr, _, err := query.ExecuteString()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(jsonStr))
}
```

### Step 5: Update Main Router

**File**: `backend/main.go` (update)

Add new routes:
```go
// Category routes
categoryHandler := handlers.NewCategoryHandler(db)
r.Get("/categories", categoryHandler.GetCategories)
r.Get("/categories/{slug}", categoryHandler.GetCategory)
r.Get("/categories/{slug}/products", categoryHandler.GetCategoryProducts)

// Collection routes
collectionHandler := handlers.NewCollectionHandler(db)
r.Get("/collections", collectionHandler.GetCollections)
r.Get("/collections/{slug}", collectionHandler.GetCollection)
r.Get("/collections/{slug}/products", collectionHandler.GetCollectionProducts)

// Review routes
reviewHandler := handlers.NewReviewHandler(db)
r.Get("/products/{slug}/reviews", reviewHandler.GetProductReviews)
r.Post("/products/{slug}/reviews", reviewHandler.CreateReview)

// Search route
r.Get("/search", productHandler.SearchProducts)

// Filter options
r.Get("/filters/brands", productHandler.GetBrands)
r.Get("/filters/materials", productHandler.GetMaterials)
r.Get("/filters/colors", productHandler.GetColors)
```

## Phase 2: Frontend Components (Core Shop UI)

### Components to Create

Due to length constraints, I'll create the most critical components. Here's the priority list:

**Priority 1 (Essential)**:
1. ✅ Shop landing page (`/shop/page.tsx`)
2. ✅ Category page with filters (`/shop/[category]/page.tsx`)
3. ✅ Product filters sidebar (`ProductFilters.tsx`)
4. ✅ Enhanced product grid (`ProductGrid.tsx` - update)
5. ✅ Search bar (`SearchBar.tsx`)

**Priority 2 (Important)**:
6. Category grid (`CategoryGrid.tsx`)
7. Breadcrumb navigation (`Breadcrumb.tsx`)
8. Product sort dropdown (`ProductSort.tsx`)
9. Filter tags (`FilterTag.tsx`)
10. Pagination (`Pagination.tsx`)

**Priority 3 (Nice to have)**:
11. Product reviews (`ProductReviews.tsx`)
12. Related products (`RelatedProducts.tsx`)
13. Collection showcase (`CollectionShowcase.tsx`)

Would you like me to:
1. **Continue with Priority 1 components** (shop pages and filters)
2. **Create a working prototype** with basic filtering first
3. **Focus on specific features** you want most

This is a large implementation. I recommend we build it incrementally, testing each phase before moving to the next.

What would you like me to focus on next?
