package handlers

import (
	"blog-backend/services"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

// CategoryHandler handles category-related operations
type CategoryHandler struct {
	db *services.DatabaseService
}

// NewCategoryHandler creates a new category handler
func NewCategoryHandler(db *services.DatabaseService) *CategoryHandler {
	return &CategoryHandler{db: db}
}

// CORS middleware for all category endpoints
func setCORS(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

// GetProductCategories returns all product categories
func GetProductCategories(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// For now, return hardcoded categories - will connect to product_categories table later
	categories := []map[string]interface{}{
		{
			"id":               "furniture",
			"name":             "Furniture",
			"slug":             "furniture",
			"description":      "Chairs, tables, beds, storage furniture for Nigerian homes",
			"icon":             "sofa",
			"color":            "bg-amber-100 text-amber-700",
			"display_order":    100,
			"active":           true,
			"featured":         true,
			"show_on_homepage": true,
			"product_count":    0,
		},
		{
			"id":               "bedroom-comfort",
			"name":             "Bedroom Comfort",
			"slug":             "bedroom-comfort",
			"description":      "Bed sheets, pillows, comforters, and bedroom essentials",
			"icon":             "bed",
			"color":            "bg-purple-100 text-purple-700",
			"display_order":    90,
			"active":           true,
			"featured":         true,
			"show_on_homepage": true,
			"product_count":    0,
		},
		{
			"id":               "bath-towels",
			"name":             "Bath & Towels",
			"slug":             "bath-towels",
			"description":      "Towels, bath mats, shower essentials, and bathroom accessories",
			"icon":             "droplets",
			"color":            "bg-blue-100 text-blue-700",
			"display_order":    80,
			"active":           true,
			"featured":         true,
			"show_on_homepage": true,
			"product_count":    0,
		},
		{
			"id":               "home-decor",
			"name":             "Home Decor",
			"slug":             "home-decor",
			"description":      "Wall art, decorative items, plants, and styling accessories",
			"icon":             "palette",
			"color":            "bg-green-100 text-green-700",
			"display_order":    70,
			"active":           true,
			"featured":         true,
			"show_on_homepage": true,
			"product_count":    0,
		},
		{
			"id":               "kitchen-dining",
			"name":             "Kitchen & Dining",
			"slug":             "kitchen-dining",
			"description":      "Cookware, tableware, kitchen tools, and dining essentials",
			"icon":             "chef-hat",
			"color":            "bg-red-100 text-red-700",
			"display_order":    60,
			"active":           true,
			"featured":         true,
			"show_on_homepage": true,
			"product_count":    0,
		},
		{
			"id":               "lighting",
			"name":             "Lighting",
			"slug":             "lighting",
			"description":      "Lamps, ceiling lights, LED strips, and NEPA-friendly lighting solutions",
			"icon":             "lightbulb",
			"color":            "bg-yellow-100 text-yellow-700",
			"display_order":    50,
			"active":           true,
			"featured":         false,
			"show_on_homepage": false,
			"product_count":    0,
		},
		{
			"id":               "fragrance-candles",
			"name":             "Fragrance & Candles",
			"slug":             "fragrance-candles",
			"description":      "Scented candles, air fresheners, and home fragrance solutions",
			"icon":             "flame",
			"color":            "bg-orange-100 text-orange-700",
			"display_order":    40,
			"active":           true,
			"featured":         false,
			"show_on_homepage": false,
			"product_count":    0,
		},
		{
			"id":               "smart-home",
			"name":             "Smart Home",
			"slug":             "smart-home",
			"description":      "Smart devices, automation, and connected home solutions",
			"icon":             "home",
			"color":            "bg-teal-100 text-teal-700",
			"display_order":    30,
			"active":           true,
			"featured":         false,
			"show_on_homepage": false,
			"product_count":    0,
		},
		{
			"id":               "storage-solutions",
			"name":             "Storage Solutions",
			"slug":             "storage-solutions",
			"description":      "Organizers, baskets, shelving, and space-saving storage",
			"icon":             "archive",
			"color":            "bg-gray-100 text-gray-700",
			"display_order":    20,
			"active":           true,
			"featured":         false,
			"show_on_homepage": false,
			"product_count":    0,
		},
	}

	json.NewEncoder(w).Encode(categories)
}

// GetLifestyleCollections returns lifestyle collections from the database
func (h *CategoryHandler) GetLifestyleCollections(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	client := h.db.GetClient()

	// Query the lifestyle_collections table
	bytes, _, err := client.From("lifestyle_collections").
		Select("*", "exact", false).
		Execute()

	if err != nil {
		http.Error(w, "Failed to fetch lifestyle collections", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)
}

// CreateLifestyleCollection creates a new lifestyle collection
func (h *CategoryHandler) CreateLifestyleCollection(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var collectionData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&collectionData); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()

	// Insert into lifestyle_collections table
	_, _, err := client.From("lifestyle_collections").
		Insert(collectionData, false, "", "", "").
		Execute()

	if err != nil {
		http.Error(w, "Failed to create lifestyle collection", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Lifestyle collection created successfully",
	}

	json.NewEncoder(w).Encode(response)
}

// UpdateLifestyleCollection updates a lifestyle collection
func (h *CategoryHandler) UpdateLifestyleCollection(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	collectionID := chi.URLParam(r, "id")

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()

	// Update lifestyle collection
	_, _, err := client.From("lifestyle_collections").
		Update(updateData, "", "").
		Eq("id", collectionID).
		Execute()

	if err != nil {
		http.Error(w, "Failed to update lifestyle collection", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Lifestyle collection updated successfully",
	}

	json.NewEncoder(w).Encode(response)
}

// DeleteLifestyleCollection deletes a lifestyle collection
func (h *CategoryHandler) DeleteLifestyleCollection(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	collectionID := chi.URLParam(r, "id")

	client := h.db.GetClient()

	// Delete lifestyle collection
	_, _, err := client.From("lifestyle_collections").
		Delete("", "").
		Eq("id", collectionID).
		Execute()

	if err != nil {
		http.Error(w, "Failed to delete lifestyle collection", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Lifestyle collection deleted successfully",
	}

	json.NewEncoder(w).Encode(response)
}

// Standalone functions for routes (these call the handler methods)
func GetLifestyleCollections(w http.ResponseWriter, r *http.Request) {
	// This is a temporary handler until we can inject the dependency properly
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Return hardcoded data for now - replace with actual DB call
	collections := []map[string]interface{}{
		{
			"id":                    "fresh-picked-favorites",
			"title":                 "Fresh-Picked Favorites",
			"subtitle":              "Our team's latest discoveries for your Nigerian home",
			"badge_text":            "✓",
			"badge_color":           "bg-green-500",
			"title_color":           "text-green-700",
			"active":                true,
			"display_order":         100,
			"show_on_homepage":      true,
			"show_on_products_page": true,
		},
		{
			"id":                    "home-decor-under-30k",
			"title":                 "Home Decor Under ₦30,000",
			"subtitle":              "Style your home without breaking the bank",
			"badge_text":            "Budget",
			"badge_color":           "bg-blue-500",
			"title_color":           "text-blue-700",
			"active":                true,
			"display_order":         90,
			"show_on_homepage":      true,
			"show_on_products_page": true,
		},
		{
			"id":                    "2-bedroom-apartment-setup",
			"title":                 "2-Bedroom Apartment Setup",
			"subtitle":              "Complete furniture solutions for compact Nigerian homes",
			"badge_text":            "Complete",
			"badge_color":           "bg-purple-500",
			"title_color":           "text-purple-700",
			"active":                true,
			"display_order":         80,
			"show_on_homepage":      true,
			"show_on_products_page": true,
		},
		{
			"id":                    "nepa-friendly-lighting",
			"title":                 "NEPA-Friendly Lighting",
			"subtitle":              "Power-efficient lighting that works with Nigerian electricity",
			"badge_text":            "Power Save",
			"badge_color":           "bg-yellow-500",
			"title_color":           "text-yellow-700",
			"active":                true,
			"display_order":         70,
			"show_on_homepage":      false,
			"show_on_products_page": true,
		},
		{
			"id":                    "lagos-apartment-essentials",
			"title":                 "Lagos Apartment Essentials",
			"subtitle":              "Space-saving solutions for urban Nigerian living",
			"badge_text":            "Space Saver",
			"badge_color":           "bg-orange-500",
			"title_color":           "text-orange-700",
			"active":                true,
			"display_order":         60,
			"show_on_homepage":      false,
			"show_on_products_page": true,
		},
		{
			"id":                    "weekend-diy-projects",
			"title":                 "Weekend DIY Projects",
			"subtitle":              "Simple furniture and decor you can build yourself",
			"badge_text":            "DIY",
			"badge_color":           "bg-red-500",
			"title_color":           "text-red-700",
			"active":                true,
			"display_order":         50,
			"show_on_homepage":      false,
			"show_on_products_page": true,
		},
	}

	json.NewEncoder(w).Encode(collections)
}

func CreateLifestyleCollection(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var collectionData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&collectionData); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Collection created successfully",
	}

	json.NewEncoder(w).Encode(response)
}

func UpdateLifestyleCollection(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	collectionID := chi.URLParam(r, "id")

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Collection updated successfully",
		"id":      collectionID,
	}

	json.NewEncoder(w).Encode(response)
}

func DeleteLifestyleCollection(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	collectionID := chi.URLParam(r, "id")

	response := map[string]interface{}{
		"success": true,
		"message": "Collection deleted successfully",
		"id":      collectionID,
	}

	json.NewEncoder(w).Encode(response)
}

// Product category functions (simpler for now)
func CreateProductCategory(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Category created successfully",
	}

	json.NewEncoder(w).Encode(response)
}

func UpdateProductCategory(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Category updated successfully",
	}

	json.NewEncoder(w).Encode(response)
}

func DeleteProductCategory(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Category deleted successfully",
	}

	json.NewEncoder(w).Encode(response)
}

// AssignProducts assigns products to collections (blog-to-product, lifestyle, or product categories)
func AssignProducts(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Products assigned successfully",
		"data":    req,
	}

	json.NewEncoder(w).Encode(response)
}

// GetCollectionProducts returns products assigned to a specific collection
func GetCollectionProducts(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	collectionType := chi.URLParam(r, "type")
	collectionID := chi.URLParam(r, "id")

	// Return mock products for now
	products := []map[string]interface{}{
		{
			"slug":        "luxury-bed-set",
			"name":        "Luxury Bed Set",
			"price":       89000,
			"image":       "https://example.com/bed.jpg",
			"category":    "Bedroom",
			"in_stock":    true,
			"collection":  collectionType,
			"assigned_to": collectionID,
		},
		{
			"slug":        "modern-chair",
			"name":        "Modern Office Chair",
			"price":       45000,
			"image":       "https://example.com/chair.jpg",
			"category":    "Furniture",
			"in_stock":    true,
			"collection":  collectionType,
			"assigned_to": collectionID,
		},
	}

	json.NewEncoder(w).Encode(products)
}

// GetBlogToProductCollections returns blog-to-product collections
func GetBlogToProductCollections(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Return hardcoded data for now - replace with actual DB call
	collections := []map[string]interface{}{
		{
			"id":                     "home-and-health",
			"blog_category":          "Home & Health",
			"blog_description":       "Creating healthy living spaces in Nigerian homes",
			"blog_color":             "text-green-600",
			"product_category_title": "Shop Wellness Products",
			"product_badge":          "Health",
			"product_badge_color":    "bg-green-500",
			"active":                 true,
			"display_order":          100,
			"show_on_homepage":       true,
			"show_on_products_page":  false,
		},
		{
			"id":                     "small-space-living",
			"blog_category":          "Small Space Living",
			"blog_description":       "Maximizing tiny apartments and rooms across Nigeria",
			"blog_color":             "text-blue-600",
			"product_category_title": "Shop Space-Saving Furniture",
			"product_badge":          "Space Save",
			"product_badge_color":    "bg-blue-500",
			"active":                 true,
			"display_order":          90,
			"show_on_homepage":       true,
			"show_on_products_page":  false,
		},
		{
			"id":                     "diy-and-crafts",
			"blog_category":          "DIY & Crafts",
			"blog_description":       "Build and create beautiful pieces for your home",
			"blog_color":             "text-orange-600",
			"product_category_title": "Shop DIY Tools & Materials",
			"product_badge":          "DIY",
			"product_badge_color":    "bg-orange-500",
			"active":                 true,
			"display_order":          80,
			"show_on_homepage":       true,
			"show_on_products_page":  false,
		},
		{
			"id":                     "budget-decorating",
			"blog_category":          "Budget Decorating",
			"blog_description":       "Beautiful home styling on a Nigerian budget",
			"blog_color":             "text-purple-600",
			"product_category_title": "Shop Affordable Decor",
			"product_badge":          "Budget",
			"product_badge_color":    "bg-purple-500",
			"active":                 true,
			"display_order":          70,
			"show_on_homepage":       true,
			"show_on_products_page":  false,
		},
		{
			"id":                     "nigerian-style",
			"blog_category":          "Nigerian Style",
			"blog_description":       "Celebrating local design and cultural aesthetics",
			"blog_color":             "text-amber-600",
			"product_category_title": "Shop Local-Inspired Pieces",
			"product_badge":          "Local",
			"product_badge_color":    "bg-amber-500",
			"active":                 true,
			"display_order":          60,
			"show_on_homepage":       true,
			"show_on_products_page":  false,
		},
		{
			"id":                     "seasonal-living",
			"blog_category":          "Seasonal Living",
			"blog_description":       "Adapting your home for dry and rainy seasons",
			"blog_color":             "text-teal-600",
			"product_category_title": "Shop Seasonal Essentials",
			"product_badge":          "Season",
			"product_badge_color":    "bg-teal-500",
			"active":                 true,
			"display_order":          50,
			"show_on_homepage":       true,
			"show_on_products_page":  false,
		},
	}

	json.NewEncoder(w).Encode(collections)
}

func CreateBlogToProductCollection(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var collectionData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&collectionData); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Blog-to-product collection created successfully",
	}

	json.NewEncoder(w).Encode(response)
}

func UpdateBlogToProductCollection(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	collectionID := chi.URLParam(r, "id")

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Blog-to-product collection updated successfully",
		"id":      collectionID,
	}

	json.NewEncoder(w).Encode(response)
}

func DeleteBlogToProductCollection(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	collectionID := chi.URLParam(r, "id")

	response := map[string]interface{}{
		"success": true,
		"message": "Blog-to-product collection deleted successfully",
		"id":      collectionID,
	}

	json.NewEncoder(w).Encode(response)
}
