package handlers

import (
	"blog-backend/models"
	"blog-backend/services"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/gosimple/slug"
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
	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)
	if limit == 0 {
		limit = 10
	}

	client := h.db.GetClient()
	jsonStr, _, err := client.From("posts").Select("*", "exact", false).
		Range(offset, offset+limit-1, "").
		Order("published_at", nil).ExecuteString()
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
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()

	// Generate unique slug
	baseSlug := slug.Make(req.Title)
	uniqueSlug := baseSlug
	i := 1
	for {
		_, count, err := client.From("posts").Select("slug", "exact", false).Eq("slug", uniqueSlug).Execute()
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
	}

	if _, _, err := client.From("posts").Insert(row, false, "", "minimal", "").Execute(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}
