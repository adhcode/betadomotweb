package services

import (
	"bytes"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net"
	"net/http"
	"strconv"
	"time"
)

type CloudinaryService struct {
	CloudName string
	APIKey    string
	APISecret string
}

type CloudinaryUploadResponse struct {
	SecureURL string `json:"secure_url"`
	PublicID  string `json:"public_id"`
	Format    string `json:"format"`
	Width     int    `json:"width"`
	Height    int    `json:"height"`
}

func NewCloudinaryService(cloudName, apiKey, apiSecret string) *CloudinaryService {
	return &CloudinaryService{
		CloudName: cloudName,
		APIKey:    apiKey,
		APISecret: apiSecret,
	}
}

func (s *CloudinaryService) generateSignature(params map[string]string) string {
	// Sort parameters and create signature string
	var signatureString string
	for key, value := range params {
		if key != "file" && key != "api_key" {
			signatureString += fmt.Sprintf("%s=%s&", key, value)
		}
	}
	// Remove trailing &
	if len(signatureString) > 0 {
		signatureString = signatureString[:len(signatureString)-1]
	}
	signatureString += s.APISecret

	// Generate SHA1 hash
	hash := sha1.New()
	hash.Write([]byte(signatureString))
	return hex.EncodeToString(hash.Sum(nil))
}

func (s *CloudinaryService) UploadImage(fileData []byte, filename string) (*CloudinaryUploadResponse, error) {
	maxRetries := 3
	var lastErr error

	for attempt := 0; attempt < maxRetries; attempt++ {
		if attempt > 0 {
			// Exponential backoff: 1s, 2s, 4s
			backoff := time.Duration(1<<uint(attempt-1)) * time.Second
			fmt.Printf("Retry attempt %d after %v\n", attempt+1, backoff)
			time.Sleep(backoff)
		}

		result, err := s.uploadImageAttempt(fileData, filename)
		if err == nil {
			return result, nil
		}

		lastErr = err
		fmt.Printf("Upload attempt %d failed: %v\n", attempt+1, err)
	}

	return nil, fmt.Errorf("failed after %d attempts: %w", maxRetries, lastErr)
}

func (s *CloudinaryService) uploadImageAttempt(fileData []byte, filename string) (*CloudinaryUploadResponse, error) {
	// Create upload parameters
	timestamp := strconv.FormatInt(time.Now().Unix(), 10)
	params := map[string]string{
		"timestamp": timestamp,
		"folder":    "products",
	}

	// Generate signature
	signature := s.generateSignature(params)

	// Create multipart form
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add file
	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		return nil, err
	}
	_, err = part.Write(fileData)
	if err != nil {
		return nil, err
	}

	// Add other fields
	writer.WriteField("timestamp", timestamp)
	writer.WriteField("folder", "products")
	writer.WriteField("api_key", s.APIKey)
	writer.WriteField("signature", signature)

	err = writer.Close()
	if err != nil {
		return nil, err
	}

	// Make request to Cloudinary with increased timeout
	url := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/upload", s.CloudName)
	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Increased timeout to 60s per attempt (was 30s)
	client := &http.Client{
		Timeout: 60 * time.Second,
		Transport: &http.Transport{
			DialContext: (&net.Dialer{
				Timeout:   10 * time.Second,
				KeepAlive: 30 * time.Second,
			}).DialContext,
			TLSHandshakeTimeout:   10 * time.Second,
			ResponseHeaderTimeout: 30 * time.Second,
			ExpectContinueTimeout: 1 * time.Second,
		},
	}
	
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("cloudinary upload failed: %s - %s", resp.Status, string(bodyBytes))
	}

	// Parse response
	var uploadResp CloudinaryUploadResponse
	if err := json.Unmarshal(bodyBytes, &uploadResp); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &uploadResp, nil
}
