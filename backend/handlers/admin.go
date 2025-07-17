package handlers

import (
	"blog-backend/models"
	"blog-backend/services"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// AdminHandler handles admin-related HTTP requests
type AdminHandler struct {
	db    *services.DatabaseService
	email *services.EmailService
}

// NewAdminHandler creates a new admin handler
func NewAdminHandler(db *services.DatabaseService, email *services.EmailService) *AdminHandler {
	return &AdminHandler{db: db, email: email}
}

// AdminPostStats represents post statistics for admin dashboard
type AdminPostStats struct {
	TotalPosts    int `json:"total_posts"`
	TotalViews    int `json:"total_views"`
	TotalComments int `json:"total_comments"`
}

// AdminDashboard handles GET /admin/dashboard
func (h *AdminHandler) GetDashboard(w http.ResponseWriter, r *http.Request) {
	client := h.db.GetClient()

	// Get total posts
	_, totalPosts, err := client.From("posts").Select("id", "exact", false).Execute()
	if err != nil {
		http.Error(w, "Failed to get posts count", http.StatusInternalServerError)
		return
	}

	// Get total views
	bytes, _, err := client.From("posts").Select("views", "exact", false).Execute()
	if err != nil {
		http.Error(w, "Failed to get views", http.StatusInternalServerError)
		return
	}

	var posts []map[string]interface{}
	json.Unmarshal(bytes, &posts)

	totalViews := 0
	for _, post := range posts {
		if views, ok := post["views"].(float64); ok {
			totalViews += int(views)
		}
	}

	// Get total comments
	_, totalComments, err := client.From("comments").Select("id", "exact", false).Execute()
	if err != nil {
		http.Error(w, "Failed to get comments count", http.StatusInternalServerError)
		return
	}

	// Get newsletter subscribers
	_, totalSubscribers, err := client.From("newsletter_subscribers").
		Select("email", "exact", false).
		Eq("status", "subscribed").
		Execute()
	if err != nil {
		http.Error(w, "Failed to get subscribers count", http.StatusInternalServerError)
		return
	}

	stats := map[string]interface{}{
		"total_posts":       totalPosts,
		"total_views":       totalViews,
		"total_comments":    totalComments,
		"total_subscribers": totalSubscribers,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// GetAllPosts handles GET /admin/posts
func (h *AdminHandler) GetAllPosts(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")
	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)
	if limit == 0 {
		limit = 20
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

// UpdatePost handles PUT /admin/posts/{slug}
func (h *AdminHandler) UpdatePost(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	var req models.CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()
	updateData := map[string]any{
		"title":          req.Title,
		"excerpt":        req.Excerpt,
		"content":        req.Content,
		"read_time":      req.ReadTime,
		"featured_image": req.FeaturedImage,
		"tags":           req.Tags,
		"images_json":    req.Images,
	}

	_, _, err := client.From("posts").
		Update(updateData, "minimal", "").
		Eq("slug", slug).
		Execute()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}

// DeletePost handles DELETE /admin/posts/{slug}
func (h *AdminHandler) DeletePost(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")

	client := h.db.GetClient()

	// Delete associated comments first
	_, _, err := client.From("comments").Delete("", "").Eq("post_slug", slug).Execute()
	if err != nil {
		http.Error(w, "Failed to delete comments", http.StatusInternalServerError)
		return
	}

	// Delete the post
	_, _, err = client.From("posts").Delete("", "").Eq("slug", slug).Execute()
	if err != nil {
		http.Error(w, "Failed to delete post", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}

// GetAllComments handles GET /admin/comments
func (h *AdminHandler) GetAllComments(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")
	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)
	if limit == 0 {
		limit = 50
	}

	client := h.db.GetClient()
	jsonStr, _, err := client.From("comments").Select("*", "exact", false).
		Range(offset, offset+limit-1, "").
		Order("created_at", nil).ExecuteString()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

// DeleteComment handles DELETE /admin/comments/{id}
func (h *AdminHandler) DeleteComment(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	client := h.db.GetClient()
	_, _, err := client.From("comments").Delete("", "").Eq("id", id).Execute()
	if err != nil {
		http.Error(w, "Failed to delete comment", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "deleted"})
}

// GetAllSubscribers handles GET /admin/subscribers
func (h *AdminHandler) GetAllSubscribers(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")
	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)
	if limit == 0 {
		limit = 100
	}

	client := h.db.GetClient()
	jsonStr, _, err := client.From("newsletter_subscribers").Select("*", "exact", false).
		Range(offset, offset+limit-1, "").
		Order("subscribed_at", nil).ExecuteString()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

// ExportSubscribers handles GET /admin/subscribers/export
func (h *AdminHandler) ExportSubscribers(w http.ResponseWriter, r *http.Request) {
	client := h.db.GetClient()
	bytes, _, err := client.From("newsletter_subscribers").
		Select("email,subscribed_at,source", "exact", false).
		Eq("status", "subscribed").
		Order("subscribed_at", nil).
		Execute()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var subscribers []map[string]interface{}
	json.Unmarshal(bytes, &subscribers)

	// Generate CSV
	w.Header().Set("Content-Type", "text/csv")
	w.Header().Set("Content-Disposition", "attachment; filename=newsletter_subscribers.csv")

	w.Write([]byte("email,subscribed_at,source\n"))
	for _, sub := range subscribers {
		email := sub["email"].(string)
		subscribedAt := sub["subscribed_at"].(string)
		source := sub["source"].(string)
		w.Write([]byte(email + "," + subscribedAt + "," + source + "\n"))
	}
}

// ServeAdminLogin serves the admin login page
func (h *AdminHandler) ServeAdminLogin(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "admin/login.html")
}

// ServeAdminDashboard serves the admin dashboard
func (h *AdminHandler) ServeAdminDashboard(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "admin/dashboard.html")
}
