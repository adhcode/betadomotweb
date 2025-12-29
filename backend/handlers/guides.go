package handlers

import (
	"blog-backend/models"
	"blog-backend/services"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/gosimple/slug"
	"github.com/supabase-community/postgrest-go"
)

// GuideHandler handles guide-related HTTP requests
type GuideHandler struct {
	db *services.DatabaseService
}

// NewGuideHandler creates a new guide handler
func NewGuideHandler(db *services.DatabaseService) *GuideHandler {
	return &GuideHandler{db: db}
}

// GetGuides handles GET /guides
func (h *GuideHandler) GetGuides(w http.ResponseWriter, r *http.Request) {
	// Basic pagination via query params ?limit=?,?offset=
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")
	category := r.URL.Query().Get("category")
	featuredStr := r.URL.Query().Get("featured")
	featuredHeroStr := r.URL.Query().Get("featured_hero")
	sort := r.URL.Query().Get("sort") // "views" or default published_at

	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)
	if limit == 0 {
		limit = 10
	}

	client := h.db.GetClient()

	q := client.From("guides").Select("*", "exact", false)
	if category != "" {
		q = q.Eq("category", category)
	}
	if featuredStr == "true" || featuredStr == "1" {
		q = q.Eq("featured", "true")
	}
	// Only filter by featured_hero if the column exists (after migration)
	if featuredHeroStr == "true" || featuredHeroStr == "1" {
		q = q.Eq("featured_hero", "true")
	}

	// Order
	if sort == "views" {
		q = q.Order("views", &postgrest.OrderOpts{Ascending: false})
	} else {
		q = q.Order("published_at", &postgrest.OrderOpts{Ascending: false})
	}

	jsonStr, _, err := q.Range(offset, offset+limit-1, "").ExecuteString()
	if err != nil {
		// If error is about missing column and we're querying featured_hero, return empty array
		// This handles the case before migration is run
		errMsg := err.Error()
		if featuredHeroStr == "true" || featuredHeroStr == "1" {
			// Check if error is about missing column
			if strings.Contains(errMsg, "featured_hero") || strings.Contains(errMsg, "column") || strings.Contains(errMsg, "does not exist") {
				w.Header().Set("Content-Type", "application/json")
				w.Write([]byte("[]"))
				return
			}
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

// CreateGuide handles POST /guides
func (h *GuideHandler) CreateGuide(w http.ResponseWriter, r *http.Request) {
	var req models.CreateGuideRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()

	// Generate unique slug
	baseSlug := slug.Make(req.Title)
	uniqueSlug := baseSlug
	i := 1
	for {
		_, count, err := client.From("guides").Select("slug", "exact", false).Eq("slug", uniqueSlug).Execute()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if count == 0 {
			break
		}
		uniqueSlug = baseSlug + "-" + strconv.Itoa(i)
		i++
	}

	// If setting as featured hero, unset any existing featured hero (posts and guides)
	if req.FeaturedHero {
		_, _, _ = client.From("guides").Update(map[string]any{"featured_hero": false}, "minimal", "").Eq("featured_hero", "true").Execute()
		_, _, _ = client.From("posts").Update(map[string]any{"featured_hero": false}, "minimal", "").Eq("featured_hero", "true").Execute()
	}

	row := map[string]any{
		"slug":           uniqueSlug,
		"title":          req.Title,
		"description":    req.Description,
		"content":        req.Content,
		"category":       req.Category,
		"tags":           req.Tags,
		"featured_image": req.FeaturedImage,
		"read_time":      req.ReadTime,
		"featured":       req.Featured,
		"featured_hero":  req.FeaturedHero,
		"views":          0,
	}

	if _, _, err := client.From("guides").Insert(row, false, "", "minimal", "").Execute(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"slug": uniqueSlug})
}

// GetGuide handles GET /guides/{slug}
func (h *GuideHandler) GetGuide(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	bytes, _, err := client.From("guides").Select("*", "exact", false).Eq("slug", slug).Single().Execute()
	if err != nil {
		http.Error(w, "guide not found", http.StatusNotFound)
		return
	}

	var guide map[string]any
	if err := json.Unmarshal(bytes, &guide); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Increment view count asynchronously
	if v, ok := guide["views"].(float64); ok {
		newVal := int(v) + 1
		go func() {
			_, _, _ = client.From("guides").Update(map[string]any{"views": newVal}, "minimal", "").Eq("slug", slug).Execute()
		}()
		guide["views"] = newVal
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(guide)
}

// GetGuidesByCategory handles GET /guides/category/{category}
func (h *GuideHandler) GetGuidesByCategory(w http.ResponseWriter, r *http.Request) {
	category := chi.URLParam(r, "category")
	
	limitStr := r.URL.Query().Get("limit")
	limit, _ := strconv.Atoi(limitStr)
	if limit == 0 {
		limit = 4 // Default to 4 for category pages
	}

	client := h.db.GetClient()

	jsonStr, _, err := client.From("guides").
		Select("*", "exact", false).
		Eq("category", category).
		Order("featured", &postgrest.OrderOpts{Ascending: false}).
		Order("published_at", &postgrest.OrderOpts{Ascending: false}).
		Limit(limit, "").
		ExecuteString()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

// SetFeaturedHero handles POST /guides/{slug}/featured-hero - sets a guide as the featured hero
func (h *GuideHandler) SetFeaturedHero(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	// First, unset any existing featured hero (both posts and guides)
	_, _, _ = client.From("guides").Update(map[string]any{"featured_hero": false}, "minimal", "").Eq("featured_hero", "true").Execute()
	_, _, _ = client.From("posts").Update(map[string]any{"featured_hero": false}, "minimal", "").Eq("featured_hero", "true").Execute()

	// Set this guide as featured hero
	if _, _, err := client.From("guides").Update(map[string]any{"featured_hero": true}, "minimal", "").Eq("slug", slug).Execute(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"success": true, "message": "Guide set as featured hero"})
}

// UnsetFeaturedHero handles DELETE /guides/{slug}/featured-hero - removes featured hero status
func (h *GuideHandler) UnsetFeaturedHero(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	if _, _, err := client.From("guides").Update(map[string]any{"featured_hero": false}, "minimal", "").Eq("slug", slug).Execute(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"success": true, "message": "Featured hero status removed"})
}