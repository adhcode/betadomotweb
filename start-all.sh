#!/bin/bash

echo "🚀 Starting BetaDomot - Blog + Shop"
echo "===================================="
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found"
    exit 1
fi

# Check if shop directory exists
if [ ! -d "shop" ]; then
    echo "❌ Error: shop directory not found"
    exit 1
fi

echo "📋 This will start:"
echo "  1. Backend API (port 8080)"
echo "  2. Shop (port 3001)"
echo ""
echo "⚠️  You'll need to open these in separate terminals:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && go run main.go"
echo ""
echo "Terminal 2 - Shop:"
echo "  cd shop && npm run dev"
echo ""
echo "Terminal 3 - Blog (optional):"
echo "  cd frontend && npm run dev"
echo ""
echo "🌐 URLs:"
echo "  Backend: http://localhost:8080"
echo "  Shop:    http://localhost:3001"
echo "  Blog:    http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "  - START_SHOP.md - How to start everything"
echo "  - SHOP_TESTING_GUIDE.md - How to test"
echo "  - SHOP_DESIGN_COMPLETE.md - Design details"
echo ""
