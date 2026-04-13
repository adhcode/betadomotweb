package services

import (
	"blog-backend/config"
	"database/sql"
	"log"

	_ "github.com/lib/pq"
	"github.com/supabase-community/supabase-go"
)

// DatabaseService handles all database operations
type DatabaseService struct {
	client *supabase.Client
	sqlDB  *sql.DB
}

// NewDatabaseService creates a new database service
func NewDatabaseService(cfg *config.Config) *DatabaseService {
	client, err := supabase.NewClient(cfg.SupabaseURL, cfg.SupabaseKey, &supabase.ClientOptions{})
	if err != nil {
		log.Fatal("Failed to create Supabase client:", err)
	}

	// Also create a raw SQL connection for complex queries
	var sqlDB *sql.DB
	if cfg.DatabaseURL != "" {
		sqlDB, err = sql.Open("postgres", cfg.DatabaseURL)
		if err != nil {
			log.Printf("Warning: Failed to create SQL connection: %v", err)
		} else {
			// Test the connection
			if err := sqlDB.Ping(); err != nil {
				log.Printf("Warning: Failed to ping SQL database: %v", err)
			} else {
				log.Println("✅ Connected to PostgreSQL database")
			}
		}
	}

	log.Println("✅ Connected to Supabase")
	return &DatabaseService{
		client: client,
		sqlDB:  sqlDB,
	}
}

// GetClient returns the Supabase client for direct access if needed
func (db *DatabaseService) GetClient() *supabase.Client {
	return db.client
}

// GetSQLDB returns the raw SQL database connection for complex queries
func (db *DatabaseService) GetSQLDB() *sql.DB {
	return db.sqlDB
}
