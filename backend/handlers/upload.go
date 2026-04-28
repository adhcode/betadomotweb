package handlers

import (
	"blog-backend/services"
	"encoding/json"
	"io"
	"net/http"
)

type UploadHandler struct {
	cloudinary *services.CloudinaryService
}

func NewUploadHandler(cloudinary *services.CloudinaryService) *UploadHandler {
	return &UploadHandler{cloudinary: cloudinary}
}

type UploadResponse struct {
	URL      string `json:"url"`
	PublicID string `json:"public_id"`
}

func (h *UploadHandler) UploadImage(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form (max 20MB)
	err := r.ParseMultipartForm(20 << 20)
	if err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	// Get file from form
	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to get image from form", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read file data
	fileData, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Failed to read file", http.StatusInternalServerError)
		return
	}

	// Upload to Cloudinary
	result, err := h.cloudinary.UploadImage(fileData, header.Filename)
	if err != nil {
		// Log the full error for debugging
		println("Cloudinary upload error:", err.Error())
		http.Error(w, "Failed to upload to Cloudinary: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return response
	response := UploadResponse{
		URL:      result.SecureURL,
		PublicID: result.PublicID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
