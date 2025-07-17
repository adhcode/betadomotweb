package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	SupabaseURL   string
	SupabaseKey   string
	ResendAPIKey  string
	AdminUsername string
	AdminPassword string
	Port          string
	FromEmail     string
	WebsiteURL    string
}

// Load reads configuration from environment variables
func Load() *Config {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	config := &Config{
		SupabaseURL:   getEnv("SUPABASE_URL", ""),
		SupabaseKey:   getEnv("SUPABASE_ANON_KEY", ""),
		ResendAPIKey:  getEnv("RESEND_API_KEY", ""),
		AdminUsername: getEnv("ADMIN_USERNAME", "admin"),
		AdminPassword: getEnv("ADMIN_PASSWORD", "password"),
		Port:          getEnv("PORT", "8080"),
		FromEmail:     getEnv("FROM_EMAIL", "hello@yourdomain.com"),
		WebsiteURL:    getEnv("WEBSITE_URL", "https://yourdomain.com"),
	}

	// Validate required configs
	if config.SupabaseURL == "" || config.SupabaseKey == "" {
		log.Fatal("SUPABASE_URL and SUPABASE_ANON_KEY are required")
	}

	if config.ResendAPIKey == "" {
		log.Println("Warning: RESEND_API_KEY not set, email sending will be disabled")
	}

	return config
}

// getEnv gets an environment variable with a fallback value
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
