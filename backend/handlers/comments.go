package handlers

import (
	"blog-backend/models"
	"blog-backend/services"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/supabase-community/postgrest-go"
)

// CommentHandler handles comment-related HTTP requests
type CommentHandler struct {
	db *services.DatabaseService
}

// NewCommentHandler creates a new comment handler
func NewCommentHandler(db *services.DatabaseService) *CommentHandler {
	return &CommentHandler{db: db}
}

// GetComments handles GET /posts/{slug}/comments
func (h *CommentHandler) GetComments(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	jsonStr, _, err := client.From("comments").
		Select("*", "exact", false).
		Eq("post_slug", slug).
		Order("created_at", &postgrest.OrderOpts{Ascending: true}).
		ExecuteString()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

// CreateComment handles POST /posts/{slug}/comments
func (h *CommentHandler) CreateComment(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	client := h.db.GetClient()

	var req models.CreateCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Basic validation
	if req.AuthorName == "" || req.Body == "" {
		http.Error(w, "author_name and body are required", http.StatusBadRequest)
		return
	}

	// Verify post exists
	_, _, err := client.From("posts").
		Select("slug", "exact", false).
		Eq("slug", slug).
		Single().
		Execute()
	if err != nil {
		http.Error(w, "post not found", http.StatusNotFound)
		return
	}

	comment := map[string]any{
		"post_slug":    slug,
		"author_name":  req.AuthorName,
		"author_email": req.AuthorEmail,
		"body":         req.Body,
	}

	if _, _, err := client.From("comments").Insert(comment, false, "", "minimal", "").Execute(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "created"})
}
