package handlers

import (
	"blog-backend/models"
	"blog-backend/services"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/gosimple/slug"
	"github.com/supabase-community/postgrest-go"
)

// PostHandler handles post-related HTTP requests
type PostHandler struct {
	db *services.DatabaseService
}

// NewPostHandler creates a new post handler
func NewPostHandler(db *services.DatabaseService) *PostHandler {
	return &PostHandler{db: db}
}

// GetPosts handles GET /posts
func (h *PostHandler) GetPosts(w http.ResponseWriter, r *http.Request) {
	// Basic pagination via query params ?limit=?,?offset=
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")
	category := r.URL.Query().Get("category")
	featuredStr := r.URL.Query().Get("featured")
	featuredHeroStr := r.URL.Query().Get("featured_hero")
	sort := r.URL.Query().Get("sort") // "views", "homepage_order" or default published_at
	homepageSection := r.URL.Query().Get("homepage_section")

	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)
	if limit == 0 {
		limit = 10
	}

	client := h.db.GetClient()

	q := client.From("posts").Select("*", "exact", false)
	if category != "" {
		q = q.Eq("category", category)
	}
	if featuredStr == "true" || featuredStr == "1" {
		q = q.Eq("featured", "true")
	}
	if featuredHeroStr == "true" || featuredHeroStr == "1" {
		q = q.Eq("featured_hero", "true")
	}
	if homepageSection != "" {
		q = q.Eq("homepage_section", homepageSection)
	}

	// Order
	if sort == "views" {
		q = q.Order("views", &postgrest.OrderOpts{Ascending: false})
	} else if sort == "homepage_order" {
		q = q.Order("homepage_order", &postgrest.OrderOpts{Ascending: true})
	} else {
		q = q.Order("published_at", &postgrest.OrderOpts{Ascending: false})
	}

	jsonStr, _, err := q.Range(offset, offset+limit-1, "").ExecuteString()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

// CreatePost handles POST /posts
func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	var req models.CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		println("❌ Error decoding request:", err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	println("📝 Creating post:", req.Title)

	client := h.db.GetClient()

	// Generate unique slug
	baseSlug := slug.Make(req.Title)
	uniqueSlug := baseSlug
	i := 1
	for {
		_, count, err := client.From("posts").Select("slug", "exact", false).Eq("slug", uniqueSlug).Execute()
		if err != nil {
			println("❌ Error checking slug:", err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if count == 0 {
			break
		}
		uniqueSlug = baseSlug + "-" + strconv.Itoa(i)
		i++
	}

	println("✅ Generated slug:", uniqueSlug)

	// If setting as featured hero, unset any existing featured hero
	if req.FeaturedHero {
		_, _, _ = client.From("posts").Update(map[string]any{"featured_hero": false}, "minimal", "").Eq("featured_hero", "true").Execute()
	}

	row := map[string]any{
		"slug":           uniqueSlug,
		"title":          req.Title,
		"excerpt":        req.Excerpt,
		"content":        req.Content,
		"read_time":      req.ReadTime,
		"featured_image": req.FeaturedImage,
		"tags":           req.Tags,
		"images_json":    req.Images,
		"views":          0,
		"category":       req.Category,
		"featured":       req.Featured,
		"featured_hero":  req.FeaturedHero,
	}

	// Only add optional fields if they have values
	if req.HomepageSection != "" {
		row["homepage_section"] = req.HomepageSection
	}
	if req.HomepageOrder > 0 {
		row["homepage_order"] = req.HomepageOrder
	}
	if len(req.CalloutPoints) > 0 {
		row["callout_points"] = req.CalloutPoints
	}
	if req.CalloutCTA != "" {
		row["callout_cta"] = req.CalloutCTA
	}
	if req.CalloutSidebarTitle != "" {
		row["callout_sidebar_title"] = req.CalloutSidebarTitle
	}
	if req.CalloutSidebarContent != "" {
		row["callout_sidebar_content"] = req.CalloutSidebarContent
	}

	println("📤 Inserting post into database...")
	if _, _, err := client.From("posts").Insert(row, false, "", "minimal", "").Execute(); err != nil {
		println("❌ Error inserting post:", err.Error())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	println("✅ Post created successfully:", uniqueSlug)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"slug": uniqueSlug})
}

// GetPost handles GET /posts/{slug}
func (h *PostHandler) GetPost(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	bytes, _, err := client.From("posts").Select("*", "exact", false).Eq("slug", slug).Single().Execute()
	if err != nil {
		http.Error(w, "post not found", http.StatusNotFound)
		return
	}

	var post map[string]any
	if err := json.Unmarshal(bytes, &post); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Increment view count asynchronously
	if v, ok := post["views"].(float64); ok {
		newVal := int(v) + 1
		go func() {
			_, _, _ = client.From("posts").Update(map[string]any{"views": newVal}, "minimal", "").Eq("slug", slug).Execute()
		}()
		post["views"] = newVal
	}

	// Ensure claps field exists in response
	if _, ok := post["claps"]; !ok {
		post["claps"] = 0
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

// ClapPost handles POST /posts/{slug}/clap - increments the claps counter
func (h *PostHandler) ClapPost(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	// Read current claps
	bytes, _, err := client.From("posts").Select("claps", "exact", false).Eq("slug", slug).Single().Execute()
	if err != nil {
		http.Error(w, "post not found", http.StatusNotFound)
		return
	}

	var row map[string]any
	if err := json.Unmarshal(bytes, &row); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var current int
	switch v := row["claps"].(type) {
	case float64:
		current = int(v)
	case int:
		current = v
	default:
		current = 0
	}

	newVal := current + 1

	if _, _, err := client.From("posts").Update(map[string]any{"claps": newVal}, "minimal", "").Eq("slug", slug).Execute(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"claps": newVal})
}

// GetClaps handles GET /posts/{slug}/claps - returns current claps count
func (h *PostHandler) GetClaps(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	bytes, _, err := client.From("posts").Select("claps", "exact", false).Eq("slug", slug).Single().Execute()
	if err != nil {
		http.Error(w, "post not found", http.StatusNotFound)
		return
	}

	var row map[string]any
	if err := json.Unmarshal(bytes, &row); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var claps int
	switch v := row["claps"].(type) {
	case float64:
		claps = int(v)
	case int:
		claps = v
	default:
		claps = 0
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"claps": claps})
}

// SetFeaturedHero handles POST /posts/{slug}/featured-hero - sets a post as the featured hero
func (h *PostHandler) SetFeaturedHero(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	// First, unset any existing featured hero
	_, _, _ = client.From("posts").Update(map[string]any{"featured_hero": false}, "minimal", "").Eq("featured_hero", "true").Execute()

	// Set this post as featured hero
	if _, _, err := client.From("posts").Update(map[string]any{"featured_hero": true}, "minimal", "").Eq("slug", slug).Execute(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"success": true, "message": "Post set as featured hero"})
}

// UnsetFeaturedHero handles DELETE /posts/{slug}/featured-hero - removes featured hero status
func (h *PostHandler) UnsetFeaturedHero(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	if _, _, err := client.From("posts").Update(map[string]any{"featured_hero": false}, "minimal", "").Eq("slug", slug).Execute(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"success": true, "message": "Featured hero status removed"})
}
