package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
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

	// Read SQL file
	sqlBytes, err := os.ReadFile("create_orders_table.sql")
	if err != nil {
		log.Fatal("Failed to read SQL file:", err)
	}

	// Try to use Supabase REST API with RPC
	// Note: This requires a custom function in Supabase
	payload := map[string]interface{}{
		"query": string(sqlBytes),
	}

	jsonData, _ := json.Marshal(payload)

	// Try using the REST API
	url := fmt.Sprintf("%s/rest/v1/rpc/exec_sql", supabaseURL)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Fatal("Failed to create request:", err)
	}

	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("❌ Cannot execute SQL via REST API")
		fmt.Println("\n📋 Please run this SQL in Supabase SQL Editor:")
		fmt.Println("   https://supabase.com/dashboard/project/amqfaxpexigofotoandv/sql/new")
		fmt.Println("\n" + string(sqlBytes))
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		fmt.Println("✅ Migration completed successfully!")
	} else {
		fmt.Printf("❌ Migration failed with status %d: %s\n", resp.StatusCode, string(body))
		fmt.Println("\n📋 Please run this SQL manually in Supabase SQL Editor:")
		fmt.Println("   https://supabase.com/dashboard/project/amqfaxpexigofotoandv/sql/new")
		fmt.Println("\n" + string(sqlBytes))
	}
}
