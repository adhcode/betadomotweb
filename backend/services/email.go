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
					<!-- Email-optimized logo -->
					<img src="` + e.websiteURL + `/images/blog/beta-logo-email.png" alt="BetaDomot" class="logo" style="height: 40px; width: auto; display: block; margin: 0 auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
					
					<!-- Fallback text logo (hidden by default) -->
					<div style="display: none; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 24px; color: #000000; letter-spacing: -0.5px;">
						BetaDomot
					</div>
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

// OrderConfirmationData holds data for order confirmation emails
type OrderConfirmationData struct {
	OrderNumber     string
	CustomerName    string
	CustomerEmail   string
	Items           []OrderItem
	Subtotal        float64
	Shipping        float64
	Tax             float64
	Total           float64
	ShippingAddress map[string]interface{}
	OrderDate       string
}

// OrderItem represents an item in the order
type OrderItem struct {
	Name     string  `json:"name"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
	Image    string  `json:"image"`
}

// SendOrderConfirmation sends an order confirmation email
func (e *EmailService) SendOrderConfirmation(data OrderConfirmationData) error {
	log.Printf("[Email] SendOrderConfirmation called for %s", data.CustomerEmail)
	
	if e.client == nil {
		log.Printf("[Email] ⚠️  Skipping order confirmation for %s - email service not configured (client is nil)", data.CustomerEmail)
		return fmt.Errorf("email service not configured")
	}

	log.Printf("[Email] Email client is configured, preparing email for %s", data.CustomerEmail)

	fromField := e.fromEmail
	if e.fromName != "" {
		fromField = fmt.Sprintf("%s <%s>", e.fromName, e.fromEmail)
	}

	log.Printf("[Email] From field: %s", fromField)
	log.Printf("[Email] Order details: %s, Total: %.2f, Items: %d", data.OrderNumber, data.Total, len(data.Items))

	emailRequest := &resend.SendEmailRequest{
		From:    fromField,
		To:      []string{data.CustomerEmail},
		Subject: fmt.Sprintf("Order confirmed — %s", data.OrderNumber),
		Html:    e.getOrderConfirmationHTML(data),
		Text:    e.getOrderConfirmationText(data),
		Headers: map[string]string{
			"X-Entity-Ref-ID":   fmt.Sprintf("order-%s", data.OrderNumber),
			"Reply-To":          e.fromEmail,
			"X-Priority":        "3",
			"X-MSMail-Priority": "Normal",
			"Importance":        "Normal",
			"Message-ID":        fmt.Sprintf("<%s@betadomot.blog>", data.OrderNumber),
			"X-Mailer":          "Betadomot Shop",
		},
	}

	log.Printf("[Email] Sending email via Resend API...")
	response, err := e.client.Emails.Send(emailRequest)
	if err != nil {
		log.Printf("[Email] ❌ Failed to send order confirmation to %s: %v", data.CustomerEmail, err)
		return err
	}

	log.Printf("[Email] ✅ Order confirmation sent to %s (ID: %s)", data.CustomerEmail, response.Id)
	return nil
}

// getOrderConfirmationHTML returns the HTML template for order confirmation
func (e *EmailService) getOrderConfirmationHTML(data OrderConfirmationData) string {
	// Build items HTML
	itemsHTML := ""
	for _, item := range data.Items {
		itemTotal := item.Price * float64(item.Quantity)
		itemsHTML += fmt.Sprintf(`
		<tr>
			<td style="padding: 20px 0; border-bottom: 1px solid #f5f5f5;">
				<table cellpadding="0" cellspacing="0" border="0" width="100%%">
					<tr>
						<td width="80" style="padding-right: 20px;">
							<img src="%s" alt="%s" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; display: block;" />
						</td>
						<td style="vertical-align: top;">
							<p style="font-family: 'Inter', sans-serif; font-weight: 500; font-size: 16px; color: #000000; margin: 0 0 8px 0;">%s</p>
							<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 14px; color: #666666; margin: 0;">Quantity: %d</p>
						</td>
						<td style="text-align: right; vertical-align: top; white-space: nowrap;">
							<p style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 16px; color: #000000; margin: 0;">₦%.2f</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>`, item.Image, item.Name, item.Name, item.Quantity, itemTotal)
	}

	// Build shipping address
	addressHTML := ""
	if addr, ok := data.ShippingAddress["address"].(string); ok {
		addressHTML += addr + "<br>"
	}
	if city, ok := data.ShippingAddress["city"].(string); ok {
		addressHTML += city
	}
	if state, ok := data.ShippingAddress["state"].(string); ok {
		addressHTML += ", " + state
	}

	return fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Order Confirmed</title>
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
		<style>
			@media only screen and (max-width: 600px) {
				.container { width: 100%% !important; margin: 0 !important; }
				.content { padding: 30px 20px !important; }
				.header { padding: 50px 20px 30px 20px !important; }
			}
		</style>
	</head>
	<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #fafafa; color: #000000; -webkit-font-smoothing: antialiased;">
		
		<div class="container" style="max-width: 600px; margin: 40px auto; background: #ffffff;">
			
			<!-- Header -->
			<div class="header" style="padding: 60px 40px 40px 40px; text-align: center; background: #ffffff; border-bottom: 1px solid #f5f5f5;">
				<div style="margin-bottom: 30px;">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
						<path d="M20 6L9 17L4 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
				<h1 style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 28px; color: #000000; margin: 0 0 12px 0; letter-spacing: -0.5px;">
					Order confirmed
				</h1>
				<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 16px; color: #666666; margin: 0;">
					Thank you for your order, %s
				</p>
			</div>
			
			<!-- Content -->
			<div class="content" style="padding: 40px;">
				
				<!-- Order Number -->
				<div style="text-align: center; padding: 30px 0; margin-bottom: 40px; border-bottom: 1px solid #f5f5f5;">
					<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 12px; color: #999999; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
						Order number
					</p>
					<p style="font-family: 'Inter', sans-serif; font-weight: 500; font-size: 20px; color: #000000; margin: 0;">
						%s
					</p>
				</div>
				
				<!-- Order Items -->
				<div style="margin-bottom: 40px;">
					<table cellpadding="0" cellspacing="0" border="0" width="100%%">
						%s
					</table>
				</div>
				
				<!-- Order Summary -->
				<div style="margin-bottom: 40px; padding: 30px; background: #fafafa; border-radius: 8px;">
					<table cellpadding="0" cellspacing="0" border="0" width="100%%">
						<tr>
							<td style="padding: 8px 0;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 15px; color: #666666; margin: 0;">Subtotal</p>
							</td>
							<td style="text-align: right; padding: 8px 0;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 15px; color: #000000; margin: 0;">₦%.2f</p>
							</td>
						</tr>
						<tr>
							<td style="padding: 8px 0;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 15px; color: #666666; margin: 0;">Shipping</p>
							</td>
							<td style="text-align: right; padding: 8px 0;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 15px; color: #000000; margin: 0;">₦%.2f</p>
							</td>
						</tr>
						<tr>
							<td style="padding: 8px 0;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 15px; color: #666666; margin: 0;">Tax</p>
							</td>
							<td style="text-align: right; padding: 8px 0;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 15px; color: #000000; margin: 0;">₦%.2f</p>
							</td>
						</tr>
						<tr style="border-top: 1px solid #e0e0e0;">
							<td style="padding: 16px 0 0 0;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 500; font-size: 17px; color: #000000; margin: 0;">Total</p>
							</td>
							<td style="text-align: right; padding: 16px 0 0 0;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 600; font-size: 17px; color: #000000; margin: 0;">₦%.2f</p>
							</td>
						</tr>
					</table>
				</div>
				
				<!-- Shipping Address -->
				<div style="margin-bottom: 40px;">
					<p style="font-family: 'Inter', sans-serif; font-weight: 500; font-size: 14px; color: #000000; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
						Shipping address
					</p>
					<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 15px; color: #666666; margin: 0; line-height: 1.6;">
						%s
					</p>
				</div>
				
				<!-- Timeline -->
				<div style="margin-bottom: 40px; padding: 30px; background: #fafafa; border-radius: 8px;">
					<p style="font-family: 'Inter', sans-serif; font-weight: 500; font-size: 16px; color: #000000; margin: 0 0 20px 0;">
						What happens next
					</p>
					<table cellpadding="0" cellspacing="0" border="0" width="100%%">
						<tr>
							<td width="32" style="padding-right: 16px; padding-bottom: 20px;">
								<!--[if mso]>
								<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:32px;width:32px;v-text-anchor:middle;" arcsize="50%%" fillcolor="#000000">
								<w:anchorlock/>
								<center style="color:#ffffff;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;">1</center>
								</v:roundrect>
								<![endif]-->
								<!--[if !mso]><!-->
								<table cellpadding="0" cellspacing="0" border="0" width="32" height="32" style="background: #000000; border-radius: 50%%; mso-hide: all;">
									<tr>
										<td align="center" valign="middle" height="32" style="color: #ffffff; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; line-height: 32px; mso-line-height-rule: exactly;">
											1
										</td>
									</tr>
								</table>
								<!--<![endif]-->
							</td>
							<td style="padding-bottom: 20px; vertical-align: middle;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 15px; color: #000000; margin: 0 0 4px 0;">Processing</p>
								<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 14px; color: #666666; margin: 0;">We're preparing your order</p>
							</td>
						</tr>
						<tr>
							<td width="32" style="padding-right: 16px; padding-bottom: 20px;">
								<!--[if mso]>
								<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:32px;width:32px;v-text-anchor:middle;" arcsize="50%%" fillcolor="#e0e0e0">
								<w:anchorlock/>
								<center style="color:#666666;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;">2</center>
								</v:roundrect>
								<![endif]-->
								<!--[if !mso]><!-->
								<table cellpadding="0" cellspacing="0" border="0" width="32" height="32" style="background: #e0e0e0; border-radius: 50%%; mso-hide: all;">
									<tr>
										<td align="center" valign="middle" height="32" style="color: #666666; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; line-height: 32px; mso-line-height-rule: exactly;">
											2
										</td>
									</tr>
								</table>
								<!--<![endif]-->
							</td>
							<td style="padding-bottom: 20px; vertical-align: middle;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 15px; color: #000000; margin: 0 0 4px 0;">Shipping</p>
								<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 14px; color: #666666; margin: 0;">3–5 business days</p>
							</td>
						</tr>
						<tr>
							<td width="32" style="padding-right: 16px;">
								<!--[if mso]>
								<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:32px;width:32px;v-text-anchor:middle;" arcsize="50%%" fillcolor="#e0e0e0">
								<w:anchorlock/>
								<center style="color:#666666;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;">3</center>
								</v:roundrect>
								<![endif]-->
								<!--[if !mso]><!-->
								<table cellpadding="0" cellspacing="0" border="0" width="32" height="32" style="background: #e0e0e0; border-radius: 50%%; mso-hide: all;">
									<tr>
										<td align="center" valign="middle" height="32" style="color: #666666; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; line-height: 32px; mso-line-height-rule: exactly;">
											3
										</td>
									</tr>
								</table>
								<!--<![endif]-->
							</td>
							<td style="vertical-align: middle;">
								<p style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 15px; color: #000000; margin: 0 0 4px 0;">Delivered</p>
								<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 14px; color: #666666; margin: 0;">Tracking updates via email</p>
							</td>
						</tr>
					</table>
				</div>
				
				<!-- Message -->
				<div style="text-align: center; margin-bottom: 40px;">
					<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 15px; color: #666666; margin: 0; line-height: 1.7;">
						We'll send you shipping updates as your order makes its way to you.
					</p>
				</div>
				
			</div>
			
			<!-- Footer -->
			<div style="padding: 40px; text-align: center; border-top: 1px solid #f5f5f5; background: #fafafa;">
				<p style="font-family: 'Inter', sans-serif; font-weight: 300; font-size: 14px; color: #666666; margin: 0 0 12px 0;">
					Questions about your order?
				</p>
				<p style="font-family: 'Inter', sans-serif; font-weight: 400; font-size: 14px; margin: 0;">
					<a href="mailto:hello@betadomot.blog" style="color: #000000; text-decoration: none; border-bottom: 1px solid #000000;">hello@betadomot.blog</a>
				</p>
			</div>
			
		</div>
		
	</body>
	</html>`, data.CustomerName, data.OrderNumber, itemsHTML, data.Subtotal, data.Shipping, data.Tax, data.Total, addressHTML)
}

// getOrderConfirmationText returns plain text version of order confirmation
func (e *EmailService) getOrderConfirmationText(data OrderConfirmationData) string {
	itemsList := ""
	for _, item := range data.Items {
		itemTotal := item.Price * float64(item.Quantity)
		itemsList += fmt.Sprintf("- %s (x%d): ₦%.2f\n", item.Name, item.Quantity, itemTotal)
	}

	return fmt.Sprintf(`Order Confirmed

Thank you for your order, %s!

Order Number: %s
Order Date: %s

Items:
%s

Order Summary:
Subtotal: ₦%.2f
Shipping: ₦%.2f
Tax: ₦%.2f
Total: ₦%.2f

We're preparing your order and will send you shipping updates via email.

Expected delivery: 3-5 business days

Questions? Reply to this email or contact us at hello@betadomot.blog

---
Betadomot`, data.CustomerName, data.OrderNumber, data.OrderDate, itemsList, data.Subtotal, data.Shipping, data.Tax, data.Total)
}
