package services

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"blog-backend/models"
)

const (
	PaystackBaseURL = "https://api.paystack.co"
)

// PaystackService handles Paystack payment operations
type PaystackService struct {
	SecretKey string
	Client    *http.Client
}

// NewPaystackService creates a new Paystack service
func NewPaystackService() *PaystackService {
	secretKey := os.Getenv("PAYSTACK_SECRET_KEY")
	if secretKey == "" {
		log.Println("WARNING: PAYSTACK_SECRET_KEY not set")
	}

	return &PaystackService{
		SecretKey: secretKey,
		Client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// InitializeTransaction initializes a payment transaction with Paystack
func (ps *PaystackService) InitializeTransaction(req models.PaystackInitializeRequest) (*models.PaystackInitializeResponse, error) {
	log.Printf("[Paystack] Initializing transaction for %s, amount: %d kobo", req.Email, req.Amount)

	// Prepare request body
	body, err := json.Marshal(req)
	if err != nil {
		log.Printf("[Paystack] Error marshaling request: %v", err)
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	httpReq, err := http.NewRequest("POST", PaystackBaseURL+"/transaction/initialize", bytes.NewBuffer(body))
	if err != nil {
		log.Printf("[Paystack] Error creating request: %v", err)
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	httpReq.Header.Set("Authorization", "Bearer "+ps.SecretKey)
	httpReq.Header.Set("Content-Type", "application/json")

	// Send request
	resp, err := ps.Client.Do(httpReq)
	if err != nil {
		log.Printf("[Paystack] Error sending request: %v", err)
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Read response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("[Paystack] Error reading response: %v", err)
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	log.Printf("[Paystack] Initialize response status: %d, body: %s", resp.StatusCode, string(respBody))

	// Check status code
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("paystack returned status %d: %s", resp.StatusCode, string(respBody))
	}

	// Parse response
	var paystackResp models.PaystackInitializeResponse
	if err := json.Unmarshal(respBody, &paystackResp); err != nil {
		log.Printf("[Paystack] Error unmarshaling response: %v", err)
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if !paystackResp.Status {
		return nil, fmt.Errorf("paystack initialization failed: %s", paystackResp.Message)
	}

	log.Printf("[Paystack] Transaction initialized successfully: %s", paystackResp.Data.Reference)
	return &paystackResp, nil
}

// VerifyTransaction verifies a payment transaction with Paystack
func (ps *PaystackService) VerifyTransaction(reference string) (*models.PaystackVerifyResponse, error) {
	log.Printf("[Paystack] Verifying transaction: %s", reference)

	// Create HTTP request
	url := fmt.Sprintf("%s/transaction/verify/%s", PaystackBaseURL, reference)
	httpReq, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("[Paystack] Error creating verify request: %v", err)
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	httpReq.Header.Set("Authorization", "Bearer "+ps.SecretKey)

	// Send request
	resp, err := ps.Client.Do(httpReq)
	if err != nil {
		log.Printf("[Paystack] Error sending verify request: %v", err)
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Read response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("[Paystack] Error reading verify response: %v", err)
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	log.Printf("[Paystack] Verify response status: %d, body: %s", resp.StatusCode, string(respBody))

	// Check status code
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("paystack returned status %d: %s", resp.StatusCode, string(respBody))
	}

	// Parse response
	var verifyResp models.PaystackVerifyResponse
	if err := json.Unmarshal(respBody, &verifyResp); err != nil {
		log.Printf("[Paystack] Error unmarshaling verify response: %v", err)
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if !verifyResp.Status {
		return nil, fmt.Errorf("paystack verification failed: %s", verifyResp.Message)
	}

	log.Printf("[Paystack] Transaction verified: %s, status: %s, amount: %d", 
		reference, verifyResp.Data.Status, verifyResp.Data.Amount)

	return &verifyResp, nil
}

// VerifyWebhookSignature verifies the signature of a Paystack webhook
func (ps *PaystackService) VerifyWebhookSignature(payload []byte, signature string) bool {
	log.Printf("[Paystack] Verifying webhook signature")

	// Compute HMAC SHA-512
	mac := hmac.New(sha512.New, []byte(ps.SecretKey))
	mac.Write(payload)
	expectedSignature := hex.EncodeToString(mac.Sum(nil))

	// Compare signatures
	isValid := hmac.Equal([]byte(expectedSignature), []byte(signature))
	
	if isValid {
		log.Printf("[Paystack] Webhook signature verified successfully")
	} else {
		log.Printf("[Paystack] Webhook signature verification failed")
	}

	return isValid
}

// ConvertToKobo converts Naira amount to kobo (minor currency unit)
// 1 Naira = 100 kobo
func ConvertToKobo(naira float64) int64 {
	return int64(naira * 100)
}

// ConvertToNaira converts kobo to Naira
func ConvertToNaira(kobo int64) float64 {
	return float64(kobo) / 100
}
