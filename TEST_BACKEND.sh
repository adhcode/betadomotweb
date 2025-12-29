#!/bin/bash

echo "🔍 Testing Backend Connection"
echo "=============================="
echo ""

# Test 1: Health endpoint
echo "Test 1: Health Check"
echo "Command: curl http://localhost:8080/health"
curl -s http://localhost:8080/health
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Backend is running!"
else
    echo ""
    echo "❌ Backend is NOT running!"
    echo ""
    echo "To start backend:"
    echo "  cd backend"
    echo "  go run main.go"
    exit 1
fi

echo ""
echo ""

# Test 2: Public posts endpoint
echo "Test 2: Public Posts Endpoint"
echo "Command: curl http://localhost:8080/posts?limit=1"
curl -s http://localhost:8080/posts?limit=1 | head -c 200
echo "..."
echo ""

echo ""
echo ""

# Test 3: Admin posts endpoint (will fail without auth, but should return 401 not 404)
echo "Test 3: Admin Posts Endpoint (without auth)"
echo "Command: curl -i http://localhost:8080/admin/posts"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/admin/posts)
echo "HTTP Status Code: $HTTP_CODE"

if [ "$HTTP_CODE" = "404" ]; then
    echo "❌ Route not found (404) - Backend may not have this route"
elif [ "$HTTP_CODE" = "401" ]; then
    echo "✅ Route exists but requires authentication (401) - This is correct!"
elif [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Route works! (200)"
else
    echo "⚠️  Unexpected status code: $HTTP_CODE"
fi

echo ""
echo ""

# Test 4: Admin posts with auth
echo "Test 4: Admin Posts Endpoint (with auth)"
echo "Command: curl -u admin:password http://localhost:8080/admin/posts"
echo "Note: Replace 'admin:password' with your actual credentials"
echo ""
echo "Run this manually:"
echo "  curl -u YOUR_USERNAME:YOUR_PASSWORD http://localhost:8080/admin/posts"

echo ""
echo ""
echo "=============================="
echo "Summary:"
echo "- If Test 1 fails: Backend is not running"
echo "- If Test 3 returns 404: Route doesn't exist in backend"
echo "- If Test 3 returns 401: Route exists, just needs auth (correct!)"
echo ""
