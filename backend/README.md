# Blog Backend API

A clean, modular Go backend for the blog application with posts, comments, and newsletter functionality.

## 🏗️ Architecture

```
backend/
├── main.go              # Application entry point
├── config/
│   └── config.go        # Configuration management
├── handlers/            # HTTP request handlers
│   ├── posts.go         # Post endpoints
│   ├── comments.go      # Comment endpoints
│   └── newsletter.go    # Newsletter endpoints
├── models/
│   └── models.go        # Data structures
├── services/            # Business logic services
│   ├── database.go      # Database operations
│   └── email.go         # Email service
├── middleware/
│   └── cors.go          # CORS middleware
└── env.example          # Environment variables example
```

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   go mod download
   ```

2. **Set up environment:**

   ```bash
   cp env.example .env
   # Edit .env with your credentials
   ```

3. **Run the server:**
   ```bash
   go run .
   ```

The API will be available at `http://localhost:8080`

## 📋 Environment Variables

```bash
# Required
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
RESEND_API_KEY=your_resend_api_key          # For email functionality
PORT=8080                                   # Server port (default: 8080)
FROM_EMAIL=hello@yourdomain.com            # Email sender address
WEBSITE_URL=https://yourdomain.com          # Website URL for email links
```

## 🛠️ API Endpoints

### Health Check

- `GET /health` - Service health status

### Posts

- `GET /posts` - List posts (with pagination: `?limit=10&offset=0`)
- `POST /posts` - Create new post
- `GET /posts/{slug}` - Get single post (increments view count)

### Comments

- `GET /posts/{slug}/comments` - Get comments for a post
- `POST /posts/{slug}/comments` - Add comment to a post

### Newsletter

- `POST /newsletter/subscribe` - Subscribe to newsletter
- `POST /newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /newsletter/stats` - Get subscriber statistics

## 🏛️ Design Principles

### Separation of Concerns

- **Handlers**: HTTP request/response handling
- **Services**: Business logic and external integrations
- **Models**: Data structures and types
- **Config**: Configuration management
- **Middleware**: Cross-cutting concerns (CORS, logging)

### Dependency Injection

- Services are injected into handlers
- Database and email clients are injected into services
- Configuration is passed to service constructors

### Error Handling

- Proper HTTP status codes
- Structured error responses
- Logging for debugging

### Scalability

- Modular structure allows easy feature addition
- Clear interfaces between layers
- Async operations (email sending) don't block requests

## 📦 Key Packages Used

- **Chi Router**: Fast HTTP router with middleware support
- **Supabase Go**: Database operations
- **Resend**: Email sending service
- **GoDotEnv**: Environment variable management

## 🔧 Adding New Features

1. **New Model**: Add to `models/models.go`
2. **New Service**: Create in `services/` directory
3. **New Handler**: Create in `handlers/` directory
4. **New Routes**: Add to `main.go` router configuration

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:8080/health

# Test newsletter subscription
curl -X POST http://localhost:8080/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "source": "website"}'

# Test newsletter stats
curl http://localhost:8080/newsletter/stats
```

## 📊 Database Schema

The application uses Supabase (PostgreSQL) with these main tables:

- `posts` - Blog posts with metadata
- `comments` - Post comments with moderation
- `newsletter_subscribers` - Email subscriptions with status tracking

## 🚀 Deployment

The refactored structure is ready for:

- **Docker**: Add Dockerfile for containerization
- **Cloud Run**: Easy deployment to Google Cloud
- **Railway/Render**: Simple hosting platforms
- **Kubernetes**: Scalable container orchestration

## 🔒 Security Features

- CORS middleware for cross-origin requests
- Input validation on all endpoints
- Supabase Row Level Security (RLS)
- Environment-based configuration
- SQL injection protection via Supabase client
