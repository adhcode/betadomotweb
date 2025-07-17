package services

import (
	"blog-backend/config"
	"fmt"
	"log"
	"strings"
	"time"

	resend "github.com/resend/resend-go/v2"
)

// EmailService handles all email operations
type EmailService struct {
	client     *resend.Client
	fromEmail  string
	fromName   string
	websiteURL string
}

// NewEmailService creates a new email service
func NewEmailService(cfg *config.Config) *EmailService {
	var client *resend.Client
	if cfg.ResendAPIKey != "" {
		client = resend.NewClient(cfg.ResendAPIKey)
		log.Println("✅ Email service initialized with Resend")
	} else {
		log.Println("⚠️  Email service disabled - no RESEND_API_KEY provided")
	}

	return &EmailService{
		client:     client,
		fromEmail:  cfg.FromEmail,
		fromName:   "Blog Newsletter",
		websiteURL: cfg.WebsiteURL,
	}
}

// SendWelcomeEmail sends a welcome email to new newsletter subscribers
func (e *EmailService) SendWelcomeEmail(email string) error {
	if e.client == nil {
		log.Printf("Skipping welcome email for %s - email service not configured", email)
		return nil
	}

	emailRequest := &resend.SendEmailRequest{
		From:    e.fromEmail,
		To:      []string{email},
		Subject: "Welcome to Our Home Design Newsletter! 🏠",
		Html:    e.getWelcomeEmailHTML(),
	}

	_, err := e.client.Emails.Send(emailRequest)
	if err != nil {
		log.Printf("Failed to send welcome email to %s: %v", email, err)
		return err
	}

	log.Printf("✅ Welcome email sent to %s", email)
	return nil
}

// SendNewsletter sends a newsletter to all active subscribers
func (e *EmailService) SendNewsletter(subject, content, htmlContent string, recipients []string) error {
	if e.client == nil {
		return fmt.Errorf("email service not configured")
	}

	if len(recipients) == 0 {
		return fmt.Errorf("no recipients provided")
	}

	// Use HTML content if provided, otherwise convert markdown to HTML
	finalHTMLContent := htmlContent
	if finalHTMLContent == "" {
		finalHTMLContent = e.getNewsletterHTML(subject, content)
	}

	log.Printf("📧 Sending newsletter '%s' to %d recipients", subject, len(recipients))

	// Send to all recipients in batches (Resend has rate limits)
	var errors []string
	successCount := 0
	batchSize := 10 // Send in batches of 10 to avoid rate limits

	for i := 0; i < len(recipients); i += batchSize {
		end := i + batchSize
		if end > len(recipients) {
			end = len(recipients)
		}

		batch := recipients[i:end]

		for _, recipient := range batch {
			emailRequest := &resend.SendEmailRequest{
				From:    e.fromEmail,
				To:      []string{recipient},
				Subject: subject,
				Html:    finalHTMLContent,
			}

			_, err := e.client.Emails.Send(emailRequest)
			if err != nil {
				errors = append(errors, fmt.Sprintf("%s: %v", recipient, err))
				log.Printf("❌ Failed to send to %s: %v", recipient, err)
			} else {
				successCount++
				log.Printf("✅ Newsletter sent to %s", recipient)
			}

			// Small delay to respect rate limits
			time.Sleep(100 * time.Millisecond)
		}

		// Longer delay between batches
		if end < len(recipients) {
			time.Sleep(1 * time.Second)
		}
	}

	log.Printf("📊 Newsletter sending complete: %d successful, %d failed", successCount, len(errors))

	if len(errors) > 0 && successCount == 0 {
		return fmt.Errorf("failed to send to all recipients: %s", strings.Join(errors, "; "))
	}

	return nil
}

// SendTestNewsletter sends a test newsletter to a single email
func (e *EmailService) SendTestNewsletter(testEmail, subject, content, htmlContent string) error {
	if e.client == nil {
		return fmt.Errorf("email service not configured")
	}

	finalHTMLContent := htmlContent
	if finalHTMLContent == "" {
		finalHTMLContent = e.getNewsletterHTML(subject, content)
	}

	// Add test prefix to subject
	testSubject := "[TEST] " + subject

	emailRequest := &resend.SendEmailRequest{
		From:    e.fromEmail,
		To:      []string{testEmail},
		Subject: testSubject,
		Html:    finalHTMLContent,
	}

	_, err := e.client.Emails.Send(emailRequest)
	if err != nil {
		log.Printf("Failed to send test newsletter to %s: %v", testEmail, err)
		return err
	}

	log.Printf("✅ Test newsletter sent to %s", testEmail)
	return nil
}

// getWelcomeEmailHTML returns the HTML template for welcome emails
func (e *EmailService) getWelcomeEmailHTML() string {
	return `
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Welcome!</title>
	</head>
	<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
		<div style="text-align: center; margin-bottom: 30px;">
			<h1 style="color: #2d5a87; margin-bottom: 10px;">🎉 Welcome to Our Newsletter!</h1>
			<p style="font-size: 18px; color: #666;">Thanks for joining our community of home design enthusiasts!</p>
		</div>
		
		<div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
			<h2 style="color: #2d5a87; margin-top: 0;">What to expect:</h2>
			<ul style="padding-left: 20px;">
				<li>📖 Weekly home design tips and inspiration</li>
				<li>🛋️ Budget-friendly decorating ideas</li>
				<li>🏠 Small space solutions</li>
				<li>✨ Before & after transformations</li>
				<li>🛍️ Product recommendations and deals</li>
			</ul>
		</div>
		
		<div style="text-align: center; margin: 30px 0;">
			<a href="` + e.websiteURL + `/blog" style="background: #ff6b35; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold;">Browse Our Latest Posts</a>
		</div>
		
		<div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #888; font-size: 14px;">
			<p>Have questions? Just reply to this email - we'd love to hear from you!</p>
			<p>Follow us: <a href="#" style="color: #ff6b35;">Instagram</a> | <a href="#" style="color: #ff6b35;">Pinterest</a></p>
		</div>
	</body>
	</html>`
}

// getNewsletterHTML returns a professional HTML template for newsletters
func (e *EmailService) getNewsletterHTML(subject, content string) string {
	currentDate := time.Now().Format("January 2, 2006")

	return fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>%s</title>
		<style>
			@media only screen and (max-width: 600px) {
				.container { width: 100%% !important; }
				.content { padding: 15px !important; }
			}
		</style>
	</head>
	<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f6fa;">
		<div class="container" style="max-width: 600px; margin: 0 auto; background: white;">
			<!-- Header -->
			<div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 40px 30px; text-align: center;">
				<h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">📧 Newsletter</h1>
				<p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">%s</p>
			</div>
			
			<!-- Content -->
			<div class="content" style="padding: 40px 30px;">
				<h2 style="color: #2d5a87; margin: 0 0 20px 0; font-size: 24px;">%s</h2>
				
				<div style="color: #444; line-height: 1.8; font-size: 16px;">
					%s
				</div>
				
				<div style="margin: 40px 0; padding: 25px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #667eea;">
					<p style="margin: 0; color: #666; font-style: italic;">
						💡 <strong>Tip:</strong> Forward this newsletter to friends who might be interested in home design!
					</p>
				</div>
				
				<div style="text-align: center; margin: 30px 0;">
					<a href="%s/blog" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">Visit Our Blog</a>
				</div>
			</div>
			
			<!-- Footer -->
			<div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
				<p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
					Thanks for reading! We hope you found this newsletter helpful.
				</p>
				<p style="margin: 0 0 15px 0; color: #888; font-size: 12px;">
					You're receiving this because you subscribed to our newsletter.
				</p>
				<p style="margin: 0; color: #999; font-size: 12px;">
					<a href="%s/newsletter/unsubscribe" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
					<a href="%s" style="color: #667eea; text-decoration: none;">Visit Website</a>
				</p>
			</div>
		</div>
	</body>
	</html>`, subject, currentDate, subject, e.formatContentForHTML(content), e.websiteURL, e.websiteURL, e.websiteURL)
}

// formatContentForHTML converts markdown-like content to HTML
func (e *EmailService) formatContentForHTML(content string) string {
	// Simple markdown to HTML conversion
	html := content

	// Convert headings
	html = strings.ReplaceAll(html, "# ", "<h1>")
	html = strings.ReplaceAll(html, "## ", "<h2>")
	html = strings.ReplaceAll(html, "### ", "<h3>")

	// Convert bold and italic
	html = strings.ReplaceAll(html, "**", "<strong>")
	html = strings.ReplaceAll(html, "*", "<em>")

	// Convert line breaks
	html = strings.ReplaceAll(html, "\n\n", "</p><p>")
	html = strings.ReplaceAll(html, "\n", "<br>")

	// Convert bullet points
	html = strings.ReplaceAll(html, "- ", "<li>")

	// Wrap in paragraph tags if not already wrapped
	if !strings.HasPrefix(html, "<") {
		html = "<p>" + html + "</p>"
	}

	return html
}
