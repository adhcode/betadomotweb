package handlers

import (
	"blog-backend/models"
	"blog-backend/services"
	"encoding/json"
	"net/http"
	"strings"
)

// NewsletterHandler handles newsletter-related HTTP requests
type NewsletterHandler struct {
	db    *services.DatabaseService
	email *services.EmailService
}

// NewNewsletterHandler creates a new newsletter handler
func NewNewsletterHandler(db *services.DatabaseService, email *services.EmailService) *NewsletterHandler {
	return &NewsletterHandler{db: db, email: email}
}

// Subscribe handles POST /newsletter/subscribe
func (h *NewsletterHandler) Subscribe(w http.ResponseWriter, r *http.Request) {
	var req models.NewsletterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Basic email validation
	if req.Email == "" || !strings.Contains(req.Email, "@") {
		http.Error(w, "valid email is required", http.StatusBadRequest)
		return
	}

	if req.Source == "" {
		req.Source = "website"
	}

	client := h.db.GetClient()

	// Check if already subscribed
	_, count, err := client.From("newsletter_subscribers").
		Select("email", "exact", false).
		Eq("email", req.Email).
		Eq("status", "subscribed").
		Execute()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if count > 0 {
		// Already subscribed
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "already_subscribed",
			"message": "You're already subscribed to our newsletter!",
		})
		return
	}

	// Check if previously unsubscribed - reactivate instead of insert
	_, count, err = client.From("newsletter_subscribers").
		Select("*", "exact", false).
		Eq("email", req.Email).
		Execute()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	isNewSubscriber := count == 0

	if count > 0 {
		// Reactivate existing subscriber
		_, _, err := client.From("newsletter_subscribers").
			Update(map[string]any{
				"status":          "subscribed",
				"subscribed_at":   "now()",
				"unsubscribed_at": nil,
				"source":          req.Source,
			}, "minimal", "").
			Eq("email", req.Email).
			Execute()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		// New subscriber
		subscriber := map[string]any{
			"email":  req.Email,
			"source": req.Source,
			"status": "subscribed",
		}

		if _, _, err := client.From("newsletter_subscribers").Insert(subscriber, false, "", "minimal", "").Execute(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Send welcome email for new subscribers only
	if isNewSubscriber {
		go func() {
			if err := h.email.SendWelcomeEmail(req.Email); err != nil {
				// Error is already logged in the email service
			}
		}()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "subscribed",
		"message": "Thank you for subscribing! Check your email for a welcome message.",
	})
}

// Unsubscribe handles POST /newsletter/unsubscribe
func (h *NewsletterHandler) Unsubscribe(w http.ResponseWriter, r *http.Request) {
	var req models.NewsletterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Email == "" {
		http.Error(w, "email is required", http.StatusBadRequest)
		return
	}

	client := h.db.GetClient()
	_, _, err := client.From("newsletter_subscribers").
		Update(map[string]any{
			"status":          "unsubscribed",
			"unsubscribed_at": "now()",
		}, "minimal", "").
		Eq("email", req.Email).
		Execute()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "unsubscribed",
		"message": "You've been unsubscribed successfully.",
	})
}

// GetStats handles GET /newsletter/stats
func (h *NewsletterHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	client := h.db.GetClient()

	// Count total subscribers
	_, totalCount, err := client.From("newsletter_subscribers").
		Select("email", "exact", false).
		Eq("status", "subscribed").
		Execute()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"total_subscribers": totalCount,
		"status":            "success",
	})
}
