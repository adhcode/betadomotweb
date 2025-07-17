#!/bin/bash

echo "🚀 Testing Admin UI System"
echo "=========================="

# Set admin credentials
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=admin123

# Start server in background
echo "Starting server..."
go run . &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo ""
echo "🔐 Testing Authentication"
echo "========================"

# Test unauthenticated access
echo "1. Testing unauthenticated access to dashboard:"
curl -s -w "Status: %{http_code}\n" http://localhost:8080/admin-dashboard | head -1

echo ""
echo "2. Testing authenticated access to dashboard:"
curl -s -u admin:admin123 -w "Status: %{http_code}\n" http://localhost:8080/admin-dashboard | head -1

echo ""
echo "📊 Testing API Endpoints"
echo "========================"

echo "3. Testing dashboard API:"
curl -s -u admin:admin123 http://localhost:8080/admin/dashboard

echo ""
echo "4. Testing posts API:"
curl -s -u admin:admin123 http://localhost:8080/admin/posts | head -100

echo ""
echo "🌐 Testing UI Pages"
echo "=================="

echo "5. Testing login page:"
curl -s -w "Status: %{http_code}\n" http://localhost:8080/admin-login | head -1

echo ""
echo "6. Testing redirect from old admin-ui:"
curl -s -L -w "Final URL: %{url_effective}\n" http://localhost:8080/admin-ui | head -1

echo ""
echo "✅ All tests completed!"
echo ""
echo "🌐 Access the admin system at:"
echo "   Login: http://localhost:8080/admin-login"
echo "   Dashboard: http://localhost:8080/admin-dashboard"
echo "   Credentials: admin / admin123"

# Keep server running
echo ""
echo "Server is running... Press Ctrl+C to stop"
wait $SERVER_PID 