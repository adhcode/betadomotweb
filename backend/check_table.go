package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	supa "github.com/nedpals/supabase-go"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_ANON_KEY")

	client := supa.CreateClient(supabaseURL, supabaseKey)

	// Try to query the orders table
	var results []map[string]interface{}
	err := client.DB.From("orders").Select("*").Limit(1).Execute(&results)
	
	if err != nil {
		fmt.Printf("❌ Error querying orders table: %v\n", err)
		fmt.Println("\n📝 The orders table likely doesn't exist or has different columns.")
		fmt.Println("   You need to run the migration in Supabase SQL Editor.")
		return
	}

	if len(results) == 0 {
		fmt.Println("✅ Orders table exists but is empty")
	} else {
		fmt.Println("✅ Orders table exists with data:")
		fmt.Printf("%+v\n", results[0])
	}
}
