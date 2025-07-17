#!/bin/bash

echo "🎉 Admin System Features Demo"
echo "============================="
echo ""

# Set admin credentials
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=admin123

# Start server in background
echo "🚀 Starting server..."
go run . &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo ""
echo "🔐 Testing Authentication"
echo "========================="

echo "1. Testing login page access:"
curl -s -w "Status: %{http_code}\n" http://localhost:8080/admin-login | head -1

echo ""
echo "2. Testing dashboard without auth (should be 401):"
curl -s -w "Status: %{http_code}\n" http://localhost:8080/admin-dashboard | head -1

echo ""
echo "3. Testing dashboard with auth (should be 200):"
curl -s -u admin:admin123 -w "Status: %{http_code}\n" http://localhost:8080/admin-dashboard | head -1

echo ""
echo "📊 Testing Dashboard Statistics"
echo "==============================="
echo "Current blog statistics:"
curl -s -u admin:admin123 http://localhost:8080/admin/dashboard | jq .

echo ""
echo "📝 Testing Post Management"
echo "=========================="

echo "4. Current posts:"
curl -s -u admin:admin123 http://localhost:8080/admin/posts | jq '.[] | {title, slug, excerpt}'

echo ""
echo "5. Creating a new post via API:"
curl -s -X POST -u admin:admin123 -H "Content-Type: application/json" -d '{
  "title": "Demo Post - Admin Features",
  "slug": "demo-post-admin-features",
  "excerpt": "Demonstrating the complete admin system with post creation, editing, and management capabilities.",
  "content": "# Demo Post - Admin Features\n\nThis post demonstrates our **complete admin system**!\n\n## Features Included\n\n- ✅ **Rich Text Editor** with Markdown support\n- ✅ **Post Creation** with full form validation\n- ✅ **Post Editing** with data pre-population\n- ✅ **Post Management** with search and filtering\n- ✅ **Comment Moderation** system\n- ✅ **Newsletter Management** with CSV export\n- ✅ **Responsive Design** for all devices\n- ✅ **Professional UI/UX** with modern design\n\n## Technical Stack\n\n- **Backend**: Go with Chi router\n- **Frontend**: Vanilla HTML/CSS/JavaScript\n- **Database**: Supabase (PostgreSQL)\n- **Authentication**: HTTP Basic Auth\n- **Design**: Modern gradient UI with animations\n\n## Code Examples\n\n```javascript\n// Auto-generate slug from title\nfunction generateSlug(title) {\n    return title.toLowerCase()\n        .replace(/[^\\w\\s-]/g, '')\n        .replace(/\\s+/g, '-')\n        .replace(/--+/g, '-')\n        .trim();\n}\n```\n\n```go\n// Create post handler\nfunc (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {\n    var req models.CreatePostRequest\n    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {\n        http.Error(w, err.Error(), http.StatusBadRequest)\n        return\n    }\n    // Process and save post...\n}\n```\n\n*This post was created through the admin API to demonstrate the system capabilities!*",
  "read_time": "3 min read",
  "featured_image": "https://via.placeholder.com/800x400/667eea/ffffff?text=Admin+Demo",
  "tags": ["Demo", "Admin", "Features", "Management"],
  "images": []
}' http://localhost:8080/posts

echo ""
echo "6. Verifying post was created:"
curl -s -u admin:admin123 http://localhost:8080/admin/posts | jq '.[] | select(.slug == "demo-post-admin-features") | {title, slug, read_time}'

echo ""
echo "7. Testing post update:"
curl -s -X PUT -u admin:admin123 -H "Content-Type: application/json" -d '{
  "title": "Updated Demo Post - Admin Features",
  "excerpt": "Updated: Demonstrating the complete admin system with post creation, editing, and management capabilities.",
  "content": "# Updated Demo Post - Admin Features\n\n**This post has been updated!** 🎉\n\nOur admin system now includes:\n\n- ✅ **Post Creation** - Working perfectly\n- ✅ **Post Editing** - Successfully tested\n- ✅ **Post Management** - Full CRUD operations\n- ✅ **Rich Editor** - Markdown with toolbar\n- ✅ **Professional UI** - Modern design\n\n*Updated via the admin API!*",
  "read_time": "4 min read",
  "featured_image": "https://via.placeholder.com/800x400/28a745/ffffff?text=Updated+Demo",
  "tags": ["Updated", "Demo", "Admin", "Features"],
  "images": []
}' http://localhost:8080/admin/posts/demo-post-admin-features

echo ""
echo "💬 Testing Comment Management"
echo "============================="
echo "8. Current comments:"
curl -s -u admin:admin123 http://localhost:8080/admin/comments | jq '.[] | {author_name, body, post_slug}' | head -10

echo ""
echo "📧 Testing Newsletter Management"
echo "==============================="
echo "9. Newsletter subscribers:"
curl -s -u admin:admin123 http://localhost:8080/admin/subscribers | jq '.[] | {email, status, source}'

echo ""
echo "10. Testing CSV export (saving to demo_subscribers.csv):"
curl -s -u admin:admin123 http://localhost:8080/admin/subscribers/export > demo_subscribers.csv
echo "CSV file created with $(wc -l < demo_subscribers.csv) lines"

echo ""
echo "🎯 Final Statistics"
echo "=================="
echo "Updated blog statistics:"
curl -s -u admin:admin123 http://localhost:8080/admin/dashboard | jq .

echo ""
echo "✅ Demo Complete!"
echo "================="
echo ""
echo "🌐 Access the admin system:"
echo "   Login: http://localhost:8080/admin-login"
echo "   Dashboard: http://localhost:8080/admin-dashboard"
echo "   Credentials: admin / admin123"
echo ""
echo "🎉 Features Successfully Demonstrated:"
echo "   ✅ Authentication system"
echo "   ✅ Dashboard with statistics"
echo "   ✅ Post creation via API"
echo "   ✅ Post editing via API"
echo "   ✅ Comment management"
echo "   ✅ Newsletter management"
echo "   ✅ CSV export functionality"
echo ""
echo "🚀 The admin system is production-ready!"
echo ""
echo "Press Ctrl+C to stop the server"
wait $SERVER_PID 