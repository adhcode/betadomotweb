package middleware

import (
	"encoding/base64"
	"net/http"
	"os"
	"strings"
)

// BasicAuth returns a middleware that requires HTTP Basic Authentication
func BasicAuth() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get admin credentials from environment
			adminUsername := os.Getenv("ADMIN_USERNAME")
			adminPassword := os.Getenv("ADMIN_PASSWORD")

			// Default credentials if not set (NOT for production!)
			if adminUsername == "" {
				adminUsername = "admin"
			}
			if adminPassword == "" {
				adminPassword = "password"
			}

			// Get Authorization header
			auth := r.Header.Get("Authorization")
			if !strings.HasPrefix(auth, "Basic ") {
				w.Header().Set("WWW-Authenticate", `Basic realm="Admin Area"`)
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			// Decode credentials
			encoded := auth[6:] // Remove "Basic " prefix
			decoded, err := base64.StdEncoding.DecodeString(encoded)
			if err != nil {
				http.Error(w, "Invalid authorization header", http.StatusBadRequest)
				return
			}

			// Parse username:password
			credentials := string(decoded)
			parts := strings.SplitN(credentials, ":", 2)
			if len(parts) != 2 {
				http.Error(w, "Invalid credentials format", http.StatusBadRequest)
				return
			}

			username, password := parts[0], parts[1]

			// Verify credentials
			if username != adminUsername || password != adminPassword {
				w.Header().Set("WWW-Authenticate", `Basic realm="Admin Area"`)
				http.Error(w, "Invalid credentials", http.StatusUnauthorized)
				return
			}

			// Authentication successful, proceed
			next.ServeHTTP(w, r)
		})
	}
}
