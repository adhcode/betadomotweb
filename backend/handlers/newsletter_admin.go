package handlers

import (
	"blog-backend/models"
	"blog-backend/services"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

// NewsletterAdminHandler handles newsletter administration
type NewsletterAdminHandler struct {
	db    *services.DatabaseService
	email *services.EmailService
}

// NewNewsletterAdminHandler creates a new newsletter admin handler
func NewNewsletterAdminHandler(db *services.DatabaseService, email *services.EmailService) *NewsletterAdminHandler {
	return &NewsletterAdminHandler{db: db, email: email}
}

// SendNewsletter handles POST /admin/newsletter/send
func (h *NewsletterAdminHandler) SendNewsletter(w http.ResponseWriter, r *http.Request) {
	var req models.SendNewsletterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Subject == "" || req.Content == "" {
		http.Error(w, "Subject and content are required", http.StatusBadRequest)
		return
	}

	// If test email is provided, send test email only
	if req.TestEmail != "" {
		err := h.email.SendTestNewsletter(req.TestEmail, req.Subject, req.Content, req.HTMLContent)
		if err != nil {
			log.Printf("Failed to send test newsletter: %v", err)
			http.Error(w, "Failed to send test newsletter: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "test_sent",
			"message":   "Test newsletter sent successfully",
			"recipient": req.TestEmail,
		})
		return
	}

	// Get all active subscribers
	subscribers, err := h.getActiveSubscribers()
	if err != nil {
		log.Printf("Failed to get subscribers: %v", err)
		http.Error(w, "Failed to get subscribers", http.StatusInternalServerError)
		return
	}

	if len(subscribers) == 0 {
		http.Error(w, "No active subscribers found", http.StatusBadRequest)
		return
	}

	// Send newsletter to all subscribers
	err = h.email.SendNewsletter(req.Subject, req.Content, req.HTMLContent, subscribers)
	if err != nil {
		log.Printf("Failed to send newsletter: %v", err)
		http.Error(w, "Failed to send newsletter: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":          "sent",
		"message":         "Newsletter sent successfully",
		"recipient_count": len(subscribers),
	})
}

// GetNewsletterTemplates handles GET /admin/newsletter/templates
func (h *NewsletterAdminHandler) GetNewsletterTemplates(w http.ResponseWriter, r *http.Request) {
	templates := []map[string]interface{}{
		{
			"id":      "welcome",
			"name":    "Welcome Newsletter",
			"subject": "Welcome to Our Newsletter! 🎉",
			"content": "# Welcome to Our Newsletter!\n\nThank you for subscribing to our newsletter. We're excited to share amazing content with you!\n\n## What to Expect\n\n- **Weekly Updates**: Get the latest blog posts delivered to your inbox\n- **Exclusive Content**: Access to subscriber-only content\n- **Tips & Tricks**: Helpful advice and insights\n- **Community**: Join our growing community of readers\n\nWe're thrilled to have you on board!\n\nBest regards,\nThe Team",
		},
		{
			"id":      "weekly",
			"name":    "Weekly Digest",
			"subject": "This Week's Highlights 📖",
			"content": "# This Week's Highlights\n\nHere are the latest posts and updates from our blog:\n\n## Featured Posts\n\n- **New Post**: Transform Your Small Space with These 5 Design Tips\n- **Popular**: The Ultimate Guide to Budget-Friendly Home Decor\n- **Trending**: 10 Ways to Create a Cozy Reading Nook\n\n## Quick Tips\n\n💡 **Tip of the Week**: Use mirrors strategically to make any room feel larger and brighter!\n\n## What's Coming Next\n\nNext week we'll be sharing our guide to choosing the perfect color palette for your home.\n\nThanks for reading!\nThe Team",
		},
		{
			"id":      "announcement",
			"name":    "Important Announcement",
			"subject": "Exciting News from Our Team! 🎊",
			"content": "# Exciting News!\n\nWe have some wonderful news to share with our amazing community!\n\n## What's New\n\nWe're launching our new home design consultation service! Get personalized advice from our expert designers.\n\n## How This Benefits You\n\n- **Free Initial Consultation**: 30-minute video call with our design team\n- **Personalized Recommendations**: Tailored advice for your space\n- **Exclusive Subscriber Discount**: 20% off all design packages\n\n## How to Get Started\n\nSimply reply to this email to schedule your free consultation!\n\nBest regards,\nThe Team",
		},
		{
			"id":      "seasonal",
			"name":    "Seasonal Tips",
			"subject": "Spring Home Refresh Ideas 🌸",
			"content": "# Spring Home Refresh Ideas\n\nSpring is the perfect time to refresh your home! Here are our favorite ideas to bring new life to your space:\n\n## Quick & Easy Updates\n\n- **Add Fresh Flowers**: Nothing says spring like fresh blooms\n- **Switch Textiles**: Swap heavy winter fabrics for lighter materials\n- **Open Windows**: Let in fresh air and natural light\n- **Declutter**: Spring cleaning makes everything feel new\n\n## Bigger Projects to Consider\n\n- **Paint an Accent Wall**: Try a fresh, cheerful color\n- **Rearrange Furniture**: Create better flow and functionality\n- **Update Lighting**: Add table lamps or pendant lights\n\nWhat spring updates are you planning? Reply and let us know!\n\nHappy decorating!\nThe Team",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(templates)
}

// PreviewNewsletter handles POST /admin/newsletter/preview
func (h *NewsletterAdminHandler) PreviewNewsletter(w http.ResponseWriter, r *http.Request) {
	var req models.SendNewsletterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Generate HTML preview using the same template as the email service
	htmlContent := h.generateNewsletterHTML(req.Subject, req.Content)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"html_content": htmlContent,
		"subject":      req.Subject,
		"content":      req.Content,
	})
}

// GetNewsletterStats handles GET /admin/newsletter/stats
func (h *NewsletterAdminHandler) GetNewsletterStats(w http.ResponseWriter, r *http.Request) {
	// Get subscriber count
	subscribers, err := h.getActiveSubscribers()
	if err != nil {
		log.Printf("Failed to get subscribers: %v", err)
		http.Error(w, "Failed to get subscriber stats", http.StatusInternalServerError)
		return
	}

	stats := map[string]interface{}{
		"total_subscribers":  len(subscribers),
		"active_subscribers": len(subscribers),
		"last_sent":          nil,   // Could be implemented with a newsletters table
		"total_sent":         0,     // Could be implemented with a newsletters table
		"open_rate":          "N/A", // Requires email tracking
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// getActiveSubscribers retrieves all active newsletter subscribers
func (h *NewsletterAdminHandler) getActiveSubscribers() ([]string, error) {
	client := h.db.GetClient()

	bytes, _, err := client.From("newsletter_subscribers").
		Select("email", "exact", false).
		Eq("status", "subscribed").
		Execute()
	if err != nil {
		return nil, err
	}

	var subscribers []map[string]interface{}
	if err := json.Unmarshal(bytes, &subscribers); err != nil {
		return nil, err
	}

	emails := make([]string, len(subscribers))
	for i, sub := range subscribers {
		emails[i] = sub["email"].(string)
	}

	return emails, nil
}

// generateNewsletterHTML generates HTML content for the newsletter preview
func (h *NewsletterAdminHandler) generateNewsletterHTML(subject, content string) string {
	// Convert basic markdown to HTML
	htmlContent := h.formatContentForHTML(content)

	return fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>%s</title>
		<style>
			body { 
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
				line-height: 1.6; 
				color: #333; 
				max-width: 600px; 
				margin: 0 auto; 
				padding: 0; 
				background-color: #f5f6fa;
			}
			.container { 
				background: white; 
				margin: 20px auto; 
				border-radius: 10px; 
				overflow: hidden;
				box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			}
			.header { 
				background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); 
				padding: 40px 30px; 
				text-align: center; 
				color: white; 
			}
			.header h1 { 
				margin: 0; 
				font-size: 28px; 
				font-weight: 700; 
			}
			.header p { 
				margin: 10px 0 0 0; 
				opacity: 0.9; 
				font-size: 16px; 
			}
			.content { 
				padding: 40px 30px; 
			}
			.content h1, .content h2, .content h3 { 
				color: #2d5a87; 
				margin-top: 30px; 
				margin-bottom: 15px; 
			}
			.content h1 { font-size: 24px; margin-top: 0; }
			.content h2 { font-size: 20px; }
			.content h3 { font-size: 18px; }
			.content p { 
				margin-bottom: 15px; 
				line-height: 1.7; 
			}
			.content ul, .content ol { 
				margin-bottom: 15px; 
				padding-left: 30px; 
			}
			.content li { 
				margin-bottom: 8px; 
			}
			.content strong { 
				color: #2d5a87; 
			}
			.tip-box { 
				background: #f8f9fa; 
				padding: 20px; 
				border-radius: 8px; 
				border-left: 4px solid #667eea; 
				margin: 20px 0; 
			}
			.footer { 
				background: #f8f9fa; 
				padding: 30px; 
				text-align: center; 
				color: #666; 
				font-size: 14px; 
				border-top: 1px solid #eee; 
			}
			.cta-button { 
				display: inline-block; 
				background: #667eea; 
				color: white; 
				padding: 15px 30px; 
				text-decoration: none; 
				border-radius: 25px; 
				font-weight: 600; 
				margin: 20px 0; 
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<h1>📧 Newsletter</h1>
				<p>Latest updates from our blog</p>
			</div>
			<div class="content">
				<h1>%s</h1>
				%s
				<div class="tip-box">
					<p style="margin: 0;"><strong>💡 Tip:</strong> Forward this newsletter to friends who might be interested!</p>
				</div>
				<div style="text-align: center;">
					<a href="#" class="cta-button">Visit Our Blog</a>
				</div>
			</div>
			<div class="footer">
				<p>Thanks for reading! We hope you found this newsletter helpful.</p>
				<p>You're receiving this because you subscribed to our newsletter.</p>
				<p><a href="#" style="color: #667eea;">Unsubscribe</a> | <a href="#" style="color: #667eea;">View in Browser</a></p>
			</div>
		</div>
	</body>
	</html>`, subject, subject, htmlContent)
}

// formatContentForHTML converts markdown-like content to HTML
func (h *NewsletterAdminHandler) formatContentForHTML(content string) string {
	html := content

	// Convert headings
	html = strings.ReplaceAll(html, "# ", "<h1>")
	html = strings.ReplaceAll(html, "## ", "<h2>")
	html = strings.ReplaceAll(html, "### ", "<h3>")

	// Convert bold and italic
	html = strings.ReplaceAll(html, "**", "<strong>")
	html = strings.ReplaceAll(html, "*", "<em>")

	// Convert bullet points to list items
	lines := strings.Split(html, "\n")
	var result []string
	inList := false

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "- ") {
			if !inList {
				result = append(result, "<ul>")
				inList = true
			}
			result = append(result, "<li>"+strings.TrimPrefix(line, "- ")+"</li>")
		} else {
			if inList {
				result = append(result, "</ul>")
				inList = false
			}
			if line != "" {
				result = append(result, "<p>"+line+"</p>")
			}
		}
	}

	if inList {
		result = append(result, "</ul>")
	}

	return strings.Join(result, "\n")
}
