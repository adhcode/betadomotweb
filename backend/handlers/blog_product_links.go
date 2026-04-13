package handlers

import (
	"blog-backend/services"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

// BlogProductLinkHandler handles blog-product linking operations
type BlogProductLinkHandler struct {
	db *services.DatabaseService
}

// NewBlogProductLinkHandler creates a new handler
func NewBlogProductLinkHandler(db *services.DatabaseService) *BlogProductLinkHandler {
	return &BlogProductLinkHandler{db: db}
}

// GetProductsForPost returns products linked to a specific blog post
func (h *BlogProductLinkHandler) GetProductsForPost(w http.ResponseWriter, r *http.Request) {
	postSlug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	// Get product slugs linked to this post
	linksBytes, _, err := client.From("blog_product_links").
		Select("product_slug", "exact", false).
		Eq("post_slug", postSlug).
		Order("display_order", nil).
		Execute()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var links []map[string]interface{}
	if err := json.Unmarshal(linksBytes, &links); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// If no links, return empty array
	if len(links) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("[]"))
		return
	}

	// Get product details for each linked product
	productSlugs := make([]string, len(links))
	for i, link := range links {
		productSlugs[i] = link["product_slug"].(string)
	}

	// Fetch products
	productsBytes, _, err := client.From("products").
		Select("*", "exact", false).
		In("slug", productSlugs).
		Eq("active", "true").
		Execute()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(productsBytes)
}

// LinkProductToPost creates a link between a blog post and product
func (h *BlogProductLinkHandler) LinkProductToPost(w http.ResponseWriter, r *http.Request) {
	var req struct {
		PostSlug     string `json:"post_slug"`
		ProductSlug  string `json:"product_slug"`
		LinkType     string `json:"link_type"`
		DisplayOrder int    `json:"display_order"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.PostSlug == "" || req.ProductSlug == "" {
		http.Error(w, "post_slug and product_slug are required", http.StatusBadRequest)
		return
	}

	if req.LinkType == "" {
		req.LinkType = "related"
	}

	client := h.db.GetClient()
	linkData := map[string]interface{}{
		"post_slug":     req.PostSlug,
		"product_slug":  req.ProductSlug,
		"link_type":     req.LinkType,
		"display_order": req.DisplayOrder,
	}

	_, _, err := client.From("blog_product_links").
		Insert(linkData, false, "", "", "").
		Execute()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "linked"})
}

// UnlinkProductFromPost removes a link between a blog post and product
func (h *BlogProductLinkHandler) UnlinkProductFromPost(w http.ResponseWriter, r *http.Request) {
	postSlug := r.URL.Query().Get("post_slug")
	productSlug := r.URL.Query().Get("product_slug")

	if postSlug == "" || productSlug == "" {
		http.Error(w, "post_slug and product_slug are required", http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()
	_, _, err := client.From("blog_product_links").
		Delete("", "").
		Eq("post_slug", postSlug).
		Eq("product_slug", productSlug).
		Execute()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "unlinked"})
}
