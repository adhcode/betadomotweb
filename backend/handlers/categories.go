package handlers

import (
	"blog-backend/services"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

// CategoryHandler handles category-related HTTP requests
type CategoryHandler struct {
	db *services.DatabaseService
}

// NewCategoryHandler creates a new category handler
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
		Order("created_at", nil).
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(productsStr))
}
