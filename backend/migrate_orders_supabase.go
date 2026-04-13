package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	supa "github.com/nedpals/supabase-go"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_ANON_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("SUPABASE_URL and SUPABASE_ANON_KEY must be set")
	}

	client := supa.CreateClient(supabaseURL, supabaseKey)

	// Read SQL file
	sqlBytes, err := os.ReadFile("create_orders_table.sql")
	if err != nil {
		log.Fatal("Failed to read SQL file:", err)
	}

	// Execute using Supabase RPC or direct SQL
	// Note: Supabase REST API doesn't support raw SQL execution
	// You need to run this in Supabase SQL Editor

	fmt.Println("⚠️  Supabase REST API doesn't support raw SQL execution.")
	fmt.Println("📋 Please copy the following SQL and run it in Supabase SQL Editor:")
	fmt.Println("   https://supabase.com/dashboard/project/amqfaxpexigofotoandv/sql")
	fmt.Println("")
	fmt.Println(string(sqlBytes))
	
	_ = client // avoid unused variable error
}
