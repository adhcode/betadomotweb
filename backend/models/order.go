package models

// PaystackInitializeRequest represents the request to initialize payment
type PaystackInitializeRequest struct {
	Email     string `json:"email"`
	Amount    int64  `json:"amount"` // Amount in kobo (minor currency unit)
	Reference string `json:"reference"`
	CallbackURL string `json:"callback_url,omitempty"`
	Metadata  map[string]interface{} `json:"metadata,omitempty"`
}

// PaystackInitializeResponse represents Paystack's initialize response
type PaystackInitializeResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		AuthorizationURL string `json:"authorization_url"`
		AccessCode       string `json:"access_code"`
		Reference        string `json:"reference"`
	} `json:"data"`
}

// PaystackVerifyResponse represents Paystack's verify response
type PaystackVerifyResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    struct {
		ID              int64                  `json:"id"`
		Domain          string                 `json:"domain"`
		Status          string                 `json:"status"`
		Reference       string                 `json:"reference"`
		Amount          int64                  `json:"amount"`
		Message         string                 `json:"message"`
		GatewayResponse string                 `json:"gateway_response"`
		PaidAt          string                 `json:"paid_at"`
		CreatedAt       string                 `json:"created_at"`
		Channel         string                 `json:"channel"`
		Currency        string                 `json:"currency"`
		IPAddress       string                 `json:"ip_address"`
		Metadata        map[string]interface{} `json:"metadata"`
		Customer        struct {
			ID           int64  `json:"id"`
			Email        string `json:"email"`
			CustomerCode string `json:"customer_code"`
		} `json:"customer"`
	} `json:"data"`
}

// PaystackWebhookEvent represents a Paystack webhook event
type PaystackWebhookEvent struct {
	Event string                 `json:"event"`
	Data  map[string]interface{} `json:"data"`
}
