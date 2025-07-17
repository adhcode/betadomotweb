package handlers

import (
	"blog-backend/models"
	"blog-backend/services"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

// ProductHandler handles product-related HTTP requests
type ProductHandler struct {
	db *services.DatabaseService
}

// NewProductHandler creates a new product handler
func NewProductHandler(db *services.DatabaseService) *ProductHandler {
	return &ProductHandler{db: db}
}

// GetProducts handles GET /products
func (h *ProductHandler) GetProducts(w http.ResponseWriter, r *http.Request) {
	client := h.db.GetClient()

	// Get query parameters
	category := r.URL.Query().Get("category")
	featured := r.URL.Query().Get("featured")
	limit := r.URL.Query().Get("limit")

	query := client.From("products").Select("*", "exact", false).Eq("active", "true")

	if category != "" {
		query = query.Eq("category", category)
	}

	if featured == "true" {
		query = query.Eq("featured", "true")
	}

	if limit != "" {
		limitInt, _ := strconv.Atoi(limit)
		if limitInt > 0 {
			query = query.Limit(limitInt, "")
		}
	}

	jsonStr, _, err := query.Order("created_at", nil).ExecuteString()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

// GetProduct handles GET /products/{slug}
func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	client := h.db.GetClient()
	jsonStr, _, err := client.From("products").Select("*", "exact", false).Eq("slug", slug).Eq("active", "true").ExecuteString()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

// CreateProduct handles POST /admin/products
func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var req models.CreateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Name == "" || req.Price <= 0 {
		http.Error(w, "Name and price are required", http.StatusBadRequest)
		return
	}

	// Generate slug from name
	slug := generateSlug(req.Name)

	// Generate SKU if not provided
	if req.SKU == "" {
		req.SKU = generateSKU()
	}

	now := time.Now().Format(time.RFC3339)

	product := map[string]interface{}{
		"id":          uuid.New().String(),
		"slug":        slug,
		"name":        req.Name,
		"description": req.Description,
		"price":       req.Price,
		"sale_price":  req.SalePrice,
		"images":      req.Images,
		"category":    req.Category,
		"tags":        req.Tags,
		"stock":       req.Stock,
		"sku":         req.SKU,
		"weight":      req.Weight,
		"dimensions":  req.Dimensions,
		"featured":    req.Featured,
		"active":      req.Active,
		"created_at":  now,
		"updated_at":  now,
	}

	client := h.db.GetClient()
	_, _, err := client.From("products").Insert(product, false, "", "", "").Execute()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "created", "slug": slug})
}

// UpdateProduct handles PUT /admin/products/{slug}
func (h *ProductHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	var req models.UpdateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Name == "" || req.Price <= 0 {
		http.Error(w, "Name and price are required", http.StatusBadRequest)
		return
	}

	now := time.Now().Format(time.RFC3339)

	updateData := map[string]interface{}{
		"name":        req.Name,
		"description": req.Description,
		"price":       req.Price,
		"sale_price":  req.SalePrice,
		"images":      req.Images,
		"category":    req.Category,
		"tags":        req.Tags,
		"stock":       req.Stock,
		"sku":         req.SKU,
		"weight":      req.Weight,
		"dimensions":  req.Dimensions,
		"featured":    req.Featured,
		"active":      req.Active,
		"updated_at":  now,
	}

	client := h.db.GetClient()
	_, _, err := client.From("products").Update(updateData, "minimal", "").Eq("slug", slug).Execute()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

// DeleteProduct handles DELETE /admin/products/{slug}
func (h *ProductHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	client := h.db.GetClient()
	_, _, err := client.From("products").Delete("", "").Eq("slug", slug).Execute()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}

// GetAdminProducts handles GET /admin/products
func (h *ProductHandler) GetAdminProducts(w http.ResponseWriter, r *http.Request) {
	client := h.db.GetClient()
	jsonStr, _, err := client.From("products").Select("*", "exact", false).Order("created_at", nil).ExecuteString()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

// Helper functions
func generateSlug(name string) string {
	slug := strings.ToLower(name)
	slug = strings.ReplaceAll(slug, " ", "-")
	slug = strings.ReplaceAll(slug, "'", "")
	slug = strings.ReplaceAll(slug, "\"", "")
	slug = strings.ReplaceAll(slug, "&", "and")
	slug = strings.ReplaceAll(slug, "/", "-")
	slug = strings.ReplaceAll(slug, "\\", "-")
	slug = strings.ReplaceAll(slug, "(", "")
	slug = strings.ReplaceAll(slug, ")", "")
	slug = strings.ReplaceAll(slug, "[", "")
	slug = strings.ReplaceAll(slug, "]", "")
	slug = strings.ReplaceAll(slug, "{", "")
	slug = strings.ReplaceAll(slug, "}", "")
	slug = strings.ReplaceAll(slug, "!", "")
	slug = strings.ReplaceAll(slug, "?", "")
	slug = strings.ReplaceAll(slug, ".", "")
	slug = strings.ReplaceAll(slug, ",", "")
	slug = strings.ReplaceAll(slug, ":", "")
	slug = strings.ReplaceAll(slug, ";", "")
	slug = strings.ReplaceAll(slug, "=", "")
	slug = strings.ReplaceAll(slug, "+", "")
	slug = strings.ReplaceAll(slug, "*", "")
	slug = strings.ReplaceAll(slug, "#", "")
	slug = strings.ReplaceAll(slug, "@", "")
	slug = strings.ReplaceAll(slug, "$", "")
	slug = strings.ReplaceAll(slug, "%", "")
	slug = strings.ReplaceAll(slug, "^", "")
	slug = strings.ReplaceAll(slug, "|", "")
	slug = strings.ReplaceAll(slug, "~", "")
	slug = strings.ReplaceAll(slug, "`", "")
	slug = strings.ReplaceAll(slug, "---", "-")
	slug = strings.ReplaceAll(slug, "--", "-")
	slug = strings.Trim(slug, "-")
	return slug
}

func generateSKU() string {
	return fmt.Sprintf("SKU-%s", strings.ToUpper(uuid.New().String()[:8]))
}
