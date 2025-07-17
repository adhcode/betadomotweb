package services

import (
	"blog-backend/config"
	"log"

	"github.com/supabase-community/supabase-go"
)

// DatabaseService handles all database operations
type DatabaseService struct {
	client *supabase.Client
}

// NewDatabaseService creates a new database service
func NewDatabaseService(cfg *config.Config) *DatabaseService {
	client, err := supabase.NewClient(cfg.SupabaseURL, cfg.SupabaseKey, &supabase.ClientOptions{})
	if err != nil {
		log.Fatal("Failed to create Supabase client:", err)
	}

	log.Println("✅ Connected to Supabase")
	return &DatabaseService{client: client}
}

// GetClient returns the Supabase client for direct access if needed
func (db *DatabaseService) GetClient() *supabase.Client {
	return db.client
}
