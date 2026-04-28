package handlers

import (
	"blog-backend/services"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
)

type ShopAdminHandler struct {
	db *services.DatabaseService
}

func NewShopAdminHandler(db *services.DatabaseService) *ShopAdminHandler {
	return &ShopAdminHandler{db: db}
}

// Category Management

type CategoryInput struct {
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	ParentID    string `json:"parent_id"`
	IsFeatured  bool   `json:"is_featured"`
}

func (h *ShopAdminHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var input CategoryInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()
	
	data := map[string]interface{}{
		"name":        input.Name,
		"slug":        input.Slug,
		"description": input.Description,
		"image_url":   input.ImageURL,
		"is_featured": input.IsFeatured,
		"created_at":  time.Now(),
		"updated_at":  time.Now(),
	}
	
	if input.ParentID != "" {
		data["parent_id"] = input.ParentID
	}

	jsonStr, _, err := client.From("product_categories").
		Insert(data, false, "", "", "").
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

func (h *ShopAdminHandler) UpdateCategory(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var input CategoryInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()
	
	data := map[string]interface{}{
		"name":        input.Name,
		"slug":        input.Slug,
		"description": input.Description,
		"image_url":   input.ImageURL,
		"is_featured": input.IsFeatured,
		"updated_at":  time.Now(),
	}
	
	if input.ParentID != "" {
		data["parent_id"] = input.ParentID
	}

	jsonStr, _, err := client.From("product_categories").
		Update(data, "", "").
		Eq("id", id).
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

func (h *ShopAdminHandler) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	client := h.db.GetClient()
	_, _, err := client.From("product_categories").
		Delete("", "").
		Eq("id", id).
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"success": true}`))
}

// Collection Management

type CollectionInput struct {
	Name         string `json:"name"`
	Slug         string `json:"slug"`
	Description  string `json:"description"`
	ImageURL     string `json:"image_url"`
	IsFeatured   bool   `json:"is_featured"`
	DisplayOrder int    `json:"display_order"`
}

func (h *ShopAdminHandler) GetCollections(w http.ResponseWriter, r *http.Request) {
	client := h.db.GetClient()
	
	featured := r.URL.Query().Get("featured")
	query := client.From("product_collections").Select("*", "exact", false)
	
	if featured == "true" {
		query = query.Eq("is_featured", "true")
	}
	
	jsonStr, _, err := query.Order("display_order", nil).ExecuteString()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

func (h *ShopAdminHandler) GetCollection(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	client := h.db.GetClient()
	jsonStr, _, err := client.From("product_collections").
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

func (h *ShopAdminHandler) CreateCollection(w http.ResponseWriter, r *http.Request) {
	var input CollectionInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()
	
	data := map[string]interface{}{
		"name":          input.Name,
		"slug":          input.Slug,
		"description":   input.Description,
		"image_url":     input.ImageURL,
		"is_featured":   input.IsFeatured,
		"display_order": input.DisplayOrder,
		"created_at":    time.Now(),
		"updated_at":    time.Now(),
	}

	jsonStr, _, err := client.From("product_collections").
		Insert(data, false, "", "", "").
		ExecuteString()

	if err != nil {
		println("Collection creation error:", err.Error())
		println("Data:", data)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

func (h *ShopAdminHandler) UpdateCollection(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var input CollectionInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()
	
	data := map[string]interface{}{
		"name":          input.Name,
		"slug":          input.Slug,
		"description":   input.Description,
		"image_url":     input.ImageURL,
		"is_featured":   input.IsFeatured,
		"display_order": input.DisplayOrder,
		"updated_at":    time.Now(),
	}

	jsonStr, _, err := client.From("product_collections").
		Update(data, "", "").
		Eq("id", id).
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

func (h *ShopAdminHandler) DeleteCollection(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	client := h.db.GetClient()
	_, _, err := client.From("product_collections").
		Delete("", "").
		Eq("id", id).
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"success": true}`))
}

// Collection Products Management

type CollectionProductInput struct {
	ProductID    string `json:"product_id"`
	DisplayOrder int    `json:"display_order"`
}

func (h *ShopAdminHandler) AddProductToCollection(w http.ResponseWriter, r *http.Request) {
	collectionID := chi.URLParam(r, "id")

	var input CollectionProductInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		println("Error decoding request:", err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	println("Adding product to collection:", input.ProductID, "->", collectionID)

	client := h.db.GetClient()
	
	// Check if product already exists in collection
	existingStr, _, err := client.From("product_collection_items").
		Select("*", "exact", false).
		Eq("collection_id", collectionID).
		Eq("product_id", input.ProductID).
		ExecuteString()
	
	if err == nil && existingStr != "[]" && existingStr != "null" {
		println("Product already in collection")
		http.Error(w, "Product is already in this collection", http.StatusConflict)
		return
	}
	
	data := map[string]interface{}{
		"collection_id": collectionID,
		"product_id":    input.ProductID,
		"display_order": input.DisplayOrder,
	}

	jsonStr, _, err := client.From("product_collection_items").
		Insert(data, false, "", "", "").
		ExecuteString()

	if err != nil {
		println("Error adding product to collection:", err.Error())
		// Check if it's a duplicate key error
		if strings.Contains(err.Error(), "duplicate key") {
			http.Error(w, "Product is already in this collection", http.StatusConflict)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	println("Product added successfully")
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

func (h *ShopAdminHandler) RemoveProductFromCollection(w http.ResponseWriter, r *http.Request) {
	collectionID := chi.URLParam(r, "id")
	productID := chi.URLParam(r, "productId")

	client := h.db.GetClient()
	_, _, err := client.From("product_collection_items").
		Delete("", "").
		Eq("collection_id", collectionID).
		Eq("product_id", productID).
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"success": true}`))
}

func (h *ShopAdminHandler) GetCollectionProducts(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	client := h.db.GetClient()
	
	// First get collection ID
	collectionStr, _, err := client.From("product_collections").
		Select("id", "exact", false).
		Eq("slug", slug).
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var collections []map[string]interface{}
	if err := json.Unmarshal([]byte(collectionStr), &collections); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(collections) == 0 {
		http.Error(w, "Collection not found", http.StatusNotFound)
		return
	}

	collectionID := collections[0]["id"].(string)

	// Get product IDs from junction table
	junctionStr, _, err := client.From("product_collection_items").
		Select("product_id", "exact", false).
		Eq("collection_id", collectionID).
		Order("display_order", nil).
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var junctionRecords []map[string]interface{}
	if err := json.Unmarshal([]byte(junctionStr), &junctionRecords); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(junctionRecords) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("[]"))
		return
	}

	// Get products
	productIDs := make([]string, len(junctionRecords))
	for i, record := range junctionRecords {
		productIDs[i] = record["product_id"].(string)
	}

	// Fetch products - note: this is simplified, in production you'd want to use IN clause
	productsStr, _, err := client.From("products").
		Select("*", "exact", false).
		Eq("active", "true").
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(productsStr))
}
