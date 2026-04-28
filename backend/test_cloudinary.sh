#!/bin/bash

# Test Cloudinary Configuration
# This script checks if your Cloudinary credentials are set up correctly

echo "🔍 Testing Cloudinary Configuration..."
echo ""

# Load .env file
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "   Please create backend/.env with your Cloudinary credentials"
    exit 1
fi

# Source the .env file
export $(cat .env | grep -v '^#' | xargs)

# Check if credentials are set
if [ -z "$CLOUDINARY_CLOUD_NAME" ] || [ "$CLOUDINARY_CLOUD_NAME" = "your_cloud_name_here" ]; then
    echo "❌ CLOUDINARY_CLOUD_NAME is not set or still has placeholder value"
    echo "   Please update backend/.env with your actual Cloudinary cloud name"
    exit 1
fi

if [ -z "$CLOUDINARY_API_KEY" ] || [ "$CLOUDINARY_API_KEY" = "your_api_key_here" ]; then
    echo "❌ CLOUDINARY_API_KEY is not set or still has placeholder value"
    echo "   Please update backend/.env with your actual Cloudinary API key"
    exit 1
fi

if [ -z "$CLOUDINARY_API_SECRET" ] || [ "$CLOUDINARY_API_SECRET" = "your_api_secret_here" ]; then
    echo "❌ CLOUDINARY_API_SECRET is not set or still has placeholder value"
    echo "   Please update backend/.env with your actual Cloudinary API secret"
    exit 1
fi

echo "✅ Cloudinary credentials found:"
echo "   Cloud Name: $CLOUDINARY_CLOUD_NAME"
echo "   API Key: ${CLOUDINARY_API_KEY:0:5}...${CLOUDINARY_API_KEY: -3}"
echo "   API Secret: ${CLOUDINARY_API_SECRET:0:5}...${CLOUDINARY_API_SECRET: -3}"
echo ""

# Test Cloudinary API connection
echo "🌐 Testing Cloudinary API connection..."
RESPONSE=$(curl -s -w "\n%{http_code}" "https://api.cloudinary.com/v1_1/$CLOUDINARY_CLOUD_NAME/resources/image" \
    -u "$CLOUDINARY_API_KEY:$CLOUDINARY_API_SECRET")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Successfully connected to Cloudinary API!"
    echo ""
    echo "🎉 Your Cloudinary setup is complete!"
    echo ""
    echo "Next steps:"
    echo "1. Rebuild backend: go build -o blog-api"
    echo "2. Start backend: ./blog-api"
    echo "3. Go to http://localhost:3000/admin/dashboard/products"
    echo "4. Try uploading an image!"
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ Authentication failed (401)"
    echo "   Your credentials are incorrect. Please check:"
    echo "   - Cloud Name"
    echo "   - API Key"
    echo "   - API Secret"
    echo ""
    echo "   Get them from: https://cloudinary.com/console"
elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ Cloud name not found (404)"
    echo "   Your CLOUDINARY_CLOUD_NAME is incorrect"
    echo "   Check your cloud name at: https://cloudinary.com/console"
else
    echo "❌ Unexpected response (HTTP $HTTP_CODE)"
    echo "   Please check your internet connection and try again"
fi

echo ""
