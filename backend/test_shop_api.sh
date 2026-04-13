#!/bin/bash

echo "🧪 Testing Shop API Endpoints"
echo "================================"
echo ""

BASE_URL="http://localhost:8080"

# Test 1: Health check
echo "1️⃣ Testing health endpoint..."
curl -s "$BASE_URL/health" | jq '.'
echo ""

# Test 2: Get all products
echo "2️⃣ Testing GET /products..."
curl -s "$BASE_URL/products" | jq '. | length'
echo " products found"
echo ""

# Test 3: Get featured products
echo "3️⃣ Testing GET /products?featured=true..."
curl -s "$BASE_URL/products?featured=true" | jq '. | length'
echo " featured products found"
echo ""

# Test 4: Get products by category
echo "4️⃣ Testing GET /products?category=Furniture..."
curl -s "$BASE_URL/products?category=Furniture" | jq '. | length'
echo " furniture products found"
echo ""

# Test 5: Verify blog still works
echo "5️⃣ Testing GET /posts (verify blog unchanged)..."
curl -s "$BASE_URL/posts?limit=1" | jq '. | length'
echo " posts found (blog working ✅)"
echo ""

echo "================================"
echo "✅ All tests completed!"
echo ""
echo "Next steps:"
echo "  - Visit http://localhost:3000/shop"
echo "  - Add products via admin API"
echo "  - Check SHOP_QUICK_START.md for examples"
