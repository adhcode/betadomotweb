package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/google/uuid"
	"blog-backend/models"
	"blog-backend/services"
)

// OrderHandlerSupabase handles order-related requests using Supabase client
type OrderHandlerSupabase struct {
	DB              *services.DatabaseService
	PaystackService *services.PaystackService
	EmailService    *services.EmailService
	BackendURL      string
	ShopURL         string
}

// NewOrderHandlerSupabase creates a new order handler
func NewOrderHandlerSupabase(db *services.DatabaseService, emailService *services.EmailService) *OrderHandlerSupabase {
	backendURL := os.Getenv("BACKEND_URL")
	if backendURL == "" {
		backendURL = "http://localhost:8080"
	}
	shopURL := os.Getenv("SHOP_URL")
	if shopURL == "" {
		shopURL = "http://localhost:3001"
	}
	return &OrderHandlerSupabase{
		DB:              db,
		PaystackService: services.NewPaystackService(),
		EmailService:    emailService,
		BackendURL:      backendURL,
		ShopURL:         shopURL,
	}
}

// InitializePayment initializes a Paystack payment
func (h *OrderHandlerSupabase) InitializePayment(w http.ResponseWriter, r *http.Request) {
	log.Println("[Orders] Initialize payment request received")

	var req models.CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[Orders] Error decoding request: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.CustomerEmail == "" || req.Total <= 0 || len(req.Items) == 0 {
		log.Println("[Orders] Invalid request: missing required fields")
		http.Error(w, "Email, total, and items are required", http.StatusBadRequest)
		return
	}

	orderNumber := fmt.Sprintf("BD-%d", time.Now().Unix())
	paymentReference := fmt.Sprintf("PAY-%d", time.Now().UnixNano())

	log.Printf("[Orders] Creating order: %s for %s", orderNumber, req.CustomerEmail)

	orderID, err := h.createOrder(req, orderNumber, paymentReference)
	if err != nil {
		log.Printf("[Orders] Error creating order: %v", err)
		http.Error(w, "Failed to create order", http.StatusInternalServerError)
		return
	}

	log.Printf("[Orders] Order created with ID: %s", orderID)

	callbackURL := fmt.Sprintf("%s/payment/callback", h.BackendURL)
	paystackReq := models.PaystackInitializeRequest{
		Email:       req.CustomerEmail,
		Amount:      services.ConvertToKobo(req.Total),
		Reference:   paymentReference,
		CallbackURL: callbackURL,
		Metadata: map[string]interface{}{
			"order_id":      orderID,
			"order_number":  orderNumber,
			"customer_name": req.CustomerName,
		},
	}

	paystackResp, err := h.PaystackService.InitializeTransaction(paystackReq)
	if err != nil {
		log.Printf("[Orders] Error initializing Paystack transaction: %v", err)
		http.Error(w, "Failed to initialize payment", http.StatusInternalServerError)
		return
	}

	if err := h.updatePaystackReference(orderID, paystackResp.Data.Reference); err != nil {
		log.Printf("[Orders] Error updating Paystack reference: %v", err)
	}

	response := map[string]interface{}{
		"order_id":          orderID,
		"order_number":      orderNumber,
		"payment_reference": paymentReference,
		"authorization_url": paystackResp.Data.AuthorizationURL,
		"access_code":       paystackResp.Data.AccessCode,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// VerifyPayment verifies a payment transaction
func (h *OrderHandlerSupabase) VerifyPayment(w http.ResponseWriter, r *http.Request) {
	reference := r.URL.Query().Get("reference")
	if reference == "" {
		http.Error(w, "Reference is required", http.StatusBadRequest)
		return
	}

	log.Printf("[Orders] Verifying payment: %s", reference)

	verifyResp, err := h.PaystackService.VerifyTransaction(reference)
	if err != nil {
		log.Printf("[Orders] Error verifying transaction: %v", err)
		http.Error(w, "Failed to verify payment", http.StatusInternalServerError)
		return
	}

	if verifyResp.Data.Status != "success" {
		log.Printf("[Orders] Payment not successful: %s", verifyResp.Data.Status)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  "failed",
			"message": "Payment was not successful",
		})
		return
	}

	order, err := h.getOrderByPaymentReference(reference)
	if err != nil {
		log.Printf("[Orders] Error getting order: %v", err)
		http.Error(w, "Order not found", http.StatusNotFound)
		return
	}

	expectedAmount := services.ConvertToKobo(order.Total)
	if verifyResp.Data.Amount != expectedAmount {
		log.Printf("[Orders] Amount mismatch: expected %d, got %d", expectedAmount, verifyResp.Data.Amount)
		http.Error(w, "Amount mismatch", http.StatusBadRequest)
		return
	}

	if err := h.markOrderAsPaid(order.ID, reference); err != nil {
		log.Printf("[Orders] Error marking order as paid: %v", err)
		http.Error(w, "Failed to update order", http.StatusInternalServerError)
		return
	}

	log.Printf("[Orders] Payment verified successfully for order: %s", order.OrderNumber)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":       "success",
		"order_id":     order.ID,
		"order_number": order.OrderNumber,
		"amount":       order.Total,
	})
}

// PaymentCallback handles the redirect after payment
func (h *OrderHandlerSupabase) PaymentCallback(w http.ResponseWriter, r *http.Request) {
	reference := r.URL.Query().Get("reference")
	if reference == "" {
		http.Error(w, "Reference is required", http.StatusBadRequest)
		return
	}

	log.Printf("[Orders] Payment callback received: %s", reference)

	verifyResp, err := h.PaystackService.VerifyTransaction(reference)
	if err != nil {
		log.Printf("[Orders] Error verifying transaction in callback: %v", err)
		failedURL := fmt.Sprintf("%s/checkout/failed?reference=%s", h.ShopURL, reference)
		http.Redirect(w, r, failedURL, http.StatusSeeOther)
		return
	}

	if verifyResp.Data.Status == "success" {
		order, err := h.getOrderByPaystackReference(reference)
		if err == nil {
			h.markOrderAsPaid(order.ID, reference)
		}
		successURL := fmt.Sprintf("%s/checkout/success?reference=%s", h.ShopURL, reference)
		http.Redirect(w, r, successURL, http.StatusSeeOther)
	} else {
		failedURL := fmt.Sprintf("%s/checkout/failed?reference=%s", h.ShopURL, reference)
		http.Redirect(w, r, failedURL, http.StatusSeeOther)
	}
}

// WebhookHandler handles Paystack webhook events
func (h *OrderHandlerSupabase) WebhookHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("[Orders] Webhook received")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("[Orders] Error reading webhook body: %v", err)
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	signature := r.Header.Get("x-paystack-signature")
	if !h.PaystackService.VerifyWebhookSignature(body, signature) {
		log.Println("[Orders] Invalid webhook signature")
		http.Error(w, "Invalid signature", http.StatusUnauthorized)
		return
	}

	var event models.PaystackWebhookEvent
	if err := json.Unmarshal(body, &event); err != nil {
		log.Printf("[Orders] Error parsing webhook event: %v", err)
		http.Error(w, "Invalid event data", http.StatusBadRequest)
		return
	}

	log.Printf("[Orders] Webhook event: %s", event.Event)

	switch event.Event {
	case "charge.success":
		h.handleChargeSuccess(event.Data)
	case "charge.failed":
		h.handleChargeFailed(event.Data)
	default:
		log.Printf("[Orders] Unhandled webhook event: %s", event.Event)
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

// GetOrder retrieves an order by ID
func (h *OrderHandlerSupabase) GetOrder(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderID := vars["id"]

	log.Printf("[Orders] Getting order: %s", orderID)

	order, err := h.getOrderByID(orderID)
	if err != nil {
		http.Error(w, "Order not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}

// ListOrders retrieves all orders (admin only)
func (h *OrderHandlerSupabase) ListOrders(w http.ResponseWriter, r *http.Request) {
	log.Println("[Orders] Listing all orders")

	client := h.DB.GetClient()
	jsonStr, _, err := client.From("orders").
		Select("*", "exact", false).
		Order("created_at", nil).
		Limit(100, "").
		ExecuteString()

	if err != nil {
		log.Printf("[Orders] Error querying orders: %v", err)
		http.Error(w, "Failed to get orders", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(jsonStr))
}

// Helper functions

func (h *OrderHandlerSupabase) createOrder(req models.CreateOrderRequest, orderNumber, paymentReference string) (string, error) {
	orderID := uuid.New().String()
	now := time.Now().Format(time.RFC3339)

	order := map[string]interface{}{
		"id":                orderID,
		"order_number":      orderNumber,
		"customer_email":    req.CustomerEmail,
		"customer_phone":    req.CustomerPhone,
		"customer_name":     req.CustomerName,
		"shipping_address":  req.ShippingAddress,
		"items":             req.Items,
		"subtotal":          req.Subtotal,
		"shipping":          req.ShippingCost,
		"tax":               req.Tax,
		"total":             req.Total,
		"payment_method":    req.PaymentMethod,
		"payment_status":    "pending",
		"payment_reference": paymentReference,
		"status":            "pending",
		"notes":             req.Notes,
		"created_at":        now,
		"updated_at":        now,
	}

	client := h.DB.GetClient()
	_, _, err := client.From("orders").Insert(order, false, "", "", "").Execute()
	if err != nil {
		return "", err
	}

	return orderID, nil
}

func (h *OrderHandlerSupabase) updatePaystackReference(orderID, paystackReference string) error {
	client := h.DB.GetClient()
	updateData := map[string]interface{}{
		"paystack_reference": paystackReference,
	}
	_, _, err := client.From("orders").Update(updateData, "", "").Eq("id", orderID).Execute()
	return err
}

func (h *OrderHandlerSupabase) getOrderByPaymentReference(reference string) (*models.Order, error) {
	client := h.DB.GetClient()

	data, _, err := client.From("orders").
		Select("*", "", false).
		Or(fmt.Sprintf("payment_reference.eq.%s,paystack_reference.eq.%s", reference, reference), "").
		Single().
		Execute()

	if err != nil {
		return nil, err
	}

	var order models.Order
	if err := json.Unmarshal(data, &order); err != nil {
		return nil, err
	}

	return &order, nil
}

func (h *OrderHandlerSupabase) getOrderByPaystackReference(reference string) (*models.Order, error) {
	return h.getOrderByPaymentReference(reference)
}

func (h *OrderHandlerSupabase) getOrderByID(orderID string) (*models.Order, error) {
	client := h.DB.GetClient()
	data, _, err := client.From("orders").
		Select("*", "", false).
		Eq("id", orderID).
		Single().
		Execute()

	if err != nil {
		return nil, err
	}

	var order models.Order
	if err := json.Unmarshal(data, &order); err != nil {
		return nil, err
	}

	return &order, nil
}

func (h *OrderHandlerSupabase) markOrderAsPaid(orderID, paystackReference string) error {
	now := time.Now().Format(time.RFC3339)
	
	// Get order details before updating
	order, err := h.getOrderByID(orderID)
	if err != nil {
		log.Printf("[Orders] Error getting order for email: %v", err)
	}
	
	// Check if already paid to prevent duplicate emails
	if order != nil && order.PaymentStatus == "success" {
		log.Printf("[Orders] Order %s already marked as paid, skipping", order.OrderNumber)
		return nil
	}
	
	client := h.DB.GetClient()

	updateData := map[string]interface{}{
		"payment_status":     "success",
		"status":             "processing",
		"paystack_reference": paystackReference,
		"paid_at":            now,
	}

	_, _, err = client.From("orders").
		Update(updateData, "", "").
		Eq("id", orderID).
		Eq("payment_status", "pending").
		Execute()

	if err != nil {
		return err
	}

	// Send order confirmation email ONLY if update was successful
	if order != nil {
		if h.EmailService == nil {
			log.Printf("[Orders] ⚠️  EmailService is nil, cannot send confirmation email")
		} else {
			log.Printf("[Orders] 📧 Preparing to send confirmation email to %s", order.CustomerEmail)
			go func() {
				emailData := services.OrderConfirmationData{
					OrderNumber:     order.OrderNumber,
					CustomerName:    order.CustomerName,
					CustomerEmail:   order.CustomerEmail,
					Items:           convertToEmailItems(order.Items),
					Subtotal:        order.Subtotal,
					Shipping:        order.Shipping,
					Tax:             order.Tax,
					Total:           order.Total,
					ShippingAddress: order.ShippingAddress,
					OrderDate:       order.CreatedAt,
				}
				
				log.Printf("[Orders] 📧 Sending confirmation email to %s for order %s", order.CustomerEmail, order.OrderNumber)
				if err := h.EmailService.SendOrderConfirmation(emailData); err != nil {
					log.Printf("[Orders] ❌ Failed to send confirmation email: %v", err)
				} else {
					log.Printf("[Orders] ✅ Confirmation email sent successfully to %s", order.CustomerEmail)
				}
			}()
		}
	} else {
		log.Printf("[Orders] ⚠️  Order is nil, cannot send confirmation email")
	}

	return nil
}

// convertToEmailItems converts order items to email service format
func convertToEmailItems(items []models.OrderItem) []services.OrderItem {
	emailItems := make([]services.OrderItem, len(items))
	for i, item := range items {
		emailItems[i] = services.OrderItem{
			Name:     item.Name,
			Quantity: item.Quantity,
			Price:    item.Price,
			Image:    item.Image,
		}
	}
	return emailItems
}

func (h *OrderHandlerSupabase) handleChargeSuccess(data map[string]interface{}) {
	reference, ok := data["reference"].(string)
	if !ok {
		log.Println("[Orders] No reference in charge.success event")
		return
	}

	log.Printf("[Orders] Processing charge.success for: %s", reference)

	order, err := h.getOrderByPaystackReference(reference)
	if err != nil {
		log.Printf("[Orders] Error getting order in webhook: %v", err)
		return
	}

	if order.PaymentStatus != "success" {
		if err := h.markOrderAsPaid(order.ID, reference); err != nil {
			log.Printf("[Orders] Error marking order as paid in webhook: %v", err)
			return
		}
		log.Printf("[Orders] Order %s marked as paid via webhook", order.OrderNumber)
	} else {
		log.Printf("[Orders] Order %s already paid, skipping", order.OrderNumber)
	}
}

func (h *OrderHandlerSupabase) handleChargeFailed(data map[string]interface{}) {
	reference, ok := data["reference"].(string)
	if !ok {
		log.Println("[Orders] No reference in charge.failed event")
		return
	}

	log.Printf("[Orders] Processing charge.failed for: %s", reference)

	client := h.DB.GetClient()
	updateData := map[string]interface{}{
		"payment_status": "failed",
	}
	_, _, err := client.From("orders").Update(updateData, "", "").Eq("paystack_reference", reference).Execute()
	if err != nil {
		log.Printf("[Orders] Error updating failed payment: %v", err)
	}
}
