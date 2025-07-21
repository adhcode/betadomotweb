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
		fromName:   "BetaDomot",
		websiteURL: cfg.WebsiteURL,
	}
}

// SendWelcomeEmail sends a welcome email to new newsletter subscribers
func (e *EmailService) SendWelcomeEmail(email string) error {
	if e.client == nil {
		log.Printf("Skipping welcome email for %s - email service not configured", email)
		return nil
	}

	// Format the from field properly
	fromField := e.fromEmail
	if e.fromName != "" {
		fromField = fmt.Sprintf("%s <%s>", e.fromName, e.fromEmail)
	}

	emailRequest := &resend.SendEmailRequest{
		From:    fromField,
		To:      []string{email},
		Subject: "Welcome to Betadomot",
		Html:    e.getWelcomeEmailHTML(),
		Text:    e.getWelcomeEmailText(), // Add plain text version
		Headers: map[string]string{
			"List-Unsubscribe":       fmt.Sprintf("<%s/newsletter/unsubscribe>", e.websiteURL),
			"List-Unsubscribe-Post":  "List-Unsubscribe=One-Click",
			"X-Entity-Ref-ID":        "welcome-email",
			"X-Priority":             "3",
			"X-MSMail-Priority":      "Normal",
			"Importance":             "Normal",
			"X-Mailer":               "Betadomot Newsletter System",
			"Reply-To":               e.fromEmail,
			"Return-Path":            e.fromEmail,
		},
	}

	response, err := e.client.Emails.Send(emailRequest)
	if err != nil {
		log.Printf("Failed to send welcome email to %s: %v", email, err)
		log.Printf("Email request details: From=%s, To=%s, Subject=%s", emailRequest.From, emailRequest.To, emailRequest.Subject)
		return err
	}
	
	log.Printf("✅ Welcome email sent to %s (ID: %s)", email, response.Id)
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
		<title>From our home to yours, welcome 🤎</title>
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
		<style>
			@media only screen and (max-width: 600px) {
				.container { width: 100% !important; margin: 0 !important; }
				.content { padding: 30px 20px !important; }
				.header { padding: 50px 20px 30px 20px !important; }
				.logo { height: 35px !important; }
				.greeting { font-size: 18px !important; }
				.main-text { font-size: 16px !important; }
				.signature { font-size: 15px !important; }
			}
		</style>
	</head>
	<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #ffffff; color: #000000; line-height: 1.7; -webkit-font-smoothing: antialiased;">
		
		<div class="container" style="max-width: 580px; margin: 0 auto; background: #ffffff;">
			
			<!-- Header with Logo -->
			<div class="header" style="padding: 60px 40px 40px 40px; text-align: center; background: #ffffff;">
				<div style="margin-bottom: 0;">
					<img src="` + e.websiteURL + `/images/blog/beta-logo2.png" alt="BetaDomot" class="logo" style="height: 40px; width: auto;" />
				</div>
			</div>
			
			<!-- Main Content -->
			<div class="content" style="padding: 0 40px 50px 40px;">
				
				<!-- Greeting -->
				<div style="margin-bottom: 40px;">
					<p class="greeting" style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 20px; color: #000000; margin: 0; line-height: 1.6;">
						Hey there,
					</p>
				</div>
				
				<!-- Main Message -->
				<div style="margin-bottom: 40px;">
					<p class="main-text" style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 17px; color: #000000; margin: 0 0 24px 0; line-height: 1.7;">
						Welcome to Betadomot! We're truly glad you're here.
					</p>
					
					<p class="main-text" style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 17px; color: #000000; margin: 0 0 24px 0; line-height: 1.7;">
						This isn't just a home platform. It's a growing space created to help people like you live more intentionally, comfortably, and beautifully , one day at a time.
					</p>
					
					<p class="main-text" style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 17px; color: #000000; margin: 0 0 24px 0; line-height: 1.7;">
						Over the coming days, we'll be sharing tips, tools, and simple ideas to help make daily life at home a little easier, calmer, and smarter.
					</p>
					
					<p class="main-text" style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 17px; color: #000000; margin: 0 0 24px 0; line-height: 1.7;">
						No pressure. No clutter. Just good things for good living.
					</p>
					
					<p class="main-text" style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 17px; color: #000000; margin: 0; line-height: 1.7;">
						We're always here if you have any questions or thoughts, just reply to this email, and you'll reach a real human.
					</p>
				</div>
				
				<!-- Signature -->
				<div style="margin-bottom: 50px;">
					<p class="signature" style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 17px; color: #000000; margin: 0 0 8px 0; line-height: 1.7;">
						With warmth,
					</p>
					<p class="signature" style="font-family: 'Inter', sans-serif; font-weight: 500; font-size: 17px; color: #000000; margin: 0; line-height: 1.7;">
						The Betadomot Team
					</p>
				</div>
				
				<!-- Subtle Footer -->
				<div style="text-align: center; padding-top: 40px; border-top: 1px solid #f5f5f5;">
					<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 14px; color: #888888; margin: 0; line-height: 1.6;">
						<a href="` + e.websiteURL + `" style="color: #000000; text-decoration: none;">betadomot.blog</a>
					</p>
				</div>
				
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

// getWelcomeEmailText returns the plain text version of the welcome email
func (e *EmailService) getWelcomeEmailText() string {
	return fmt.Sprintf(`Hey there,

Welcome to Betadomot — we're truly glad you're here.

This isn't just a home platform. It's a growing space created to help people like you live more intentionally, comfortably, and beautifully — one day at a time.

Over the coming days, we'll be sharing tips, tools, and simple ideas to help make daily life at home a little easier, calmer, and smarter.

No pressure. No clutter. Just good things for good living.

We're always here if you have any questions or thoughts — just reply to this email, and you'll reach a real human.

With warmth,
The Betadomot Team

---
%s`, e.websiteURL)
}
