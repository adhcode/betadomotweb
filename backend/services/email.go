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
		<title>Welcome to BetaDomot!</title>
		<style>
			@media only screen and (max-width: 600px) {
				.container { width: 100% !important; padding: 10px !important; }
				.content { padding: 20px !important; }
				.button { padding: 12px 20px !important; font-size: 16px !important; }
			}
		</style>
	</head>
	<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f6fa;">
		<div class="container" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
			
			<!-- Header -->
			<div style="background: linear-gradient(135deg, #236b7c 0%, #dca744 100%); padding: 40px 30px; text-align: center;">
				<h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">🏠 Welcome to BetaDomot!</h1>
				<p style="color: rgba(255,255,255,0.95); margin: 15px 0 0 0; font-size: 18px; font-weight: 300;">Your Home, Your Story</p>
			</div>
			
			<!-- Content -->
			<div class="content" style="padding: 40px 30px;">
				<div style="text-align: center; margin-bottom: 35px;">
					<h2 style="color: #236b7c; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Thanks for joining our community! 🎉</h2>
					<p style="font-size: 18px; color: #666; margin: 0; line-height: 1.5;">You're now part of a growing community of home design enthusiasts who believe every space has a story to tell.</p>
				</div>
				
				<div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 30px; border-radius: 15px; margin-bottom: 30px; border-left: 5px solid #dca744;">
					<h3 style="color: #236b7c; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Here's what you can expect:</h3>
					<ul style="padding-left: 0; list-style: none; margin: 0;">
						<li style="margin-bottom: 12px; padding-left: 30px; position: relative;">
							<span style="position: absolute; left: 0; color: #dca744; font-size: 18px;">📖</span>
							<strong>Weekly design insights</strong> and practical living wisdom
						</li>
						<li style="margin-bottom: 12px; padding-left: 30px; position: relative;">
							<span style="position: absolute; left: 0; color: #dca744; font-size: 18px;">🛍️</span>
							<strong>First access to cool new finds</strong> for your home before anyone else
						</li>
						<li style="margin-bottom: 12px; padding-left: 30px; position: relative;">
							<span style="position: absolute; left: 0; color: #dca744; font-size: 18px;">💡</span>
							<strong>Budget-friendly tips</strong> to transform your space
						</li>
						<li style="margin-bottom: 12px; padding-left: 30px; position: relative;">
							<span style="position: absolute; left: 0; color: #dca744; font-size: 18px;">✨</span>
							<strong>Exclusive content</strong> and behind-the-scenes stories
						</li>
						<li style="margin-bottom: 0; padding-left: 30px; position: relative;">
							<span style="position: absolute; left: 0; color: #dca744; font-size: 18px;">🏠</span>
							<strong>Small space solutions</strong> that actually work
						</li>
					</ul>
				</div>
				
				<div style="background: #236b7c; color: white; padding: 25px; border-radius: 15px; margin-bottom: 30px; text-align: center;">
					<h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">🎁 Special Welcome Gift</h3>
					<p style="margin: 0; font-size: 16px; opacity: 0.95;">As a new subscriber, you'll be the first to know about our curated home finds and exclusive deals. Keep an eye on your inbox!</p>
				</div>
				
				<div style="text-align: center; margin: 35px 0;">
					<a href="` + e.websiteURL + `/blog" class="button" style="background: linear-gradient(135deg, #dca744 0%, #236b7c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 18px; display: inline-block; box-shadow: 0 4px 15px rgba(220, 167, 68, 0.3); transition: all 0.3s ease;">Start Reading Our Stories</a>
				</div>
				
				<div style="text-align: center; padding: 25px 0; border-top: 1px solid #eee;">
					<p style="margin: 0 0 15px 0; color: #666; font-size: 16px;">Have questions or ideas? We'd love to hear from you!</p>
					<p style="margin: 0; color: #888; font-size: 14px;">Just reply to this email - we read every message 💌</p>
				</div>
			</div>
			
			<!-- Footer -->
			<div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #eee;">
				<p style="margin: 0 0 10px 0; color: #666; font-size: 14px; font-weight: 500;">
					Welcome to the BetaDomot family! 🏡
				</p>
				<p style="margin: 0; color: #999; font-size: 12px;">
					<a href="` + e.websiteURL + `" style="color: #236b7c; text-decoration: none;">Visit BetaDomot</a> | 
					<a href="` + e.websiteURL + `/blog" style="color: #236b7c; text-decoration: none;">Read Our Blog</a>
				</p>
			</div>
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
