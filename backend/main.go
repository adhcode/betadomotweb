package main

import (
	"blog-backend/config"
	"blog-backend/handlers"
	"blog-backend/middleware"
	"blog-backend/services"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
)

func main() {
	// Load configuration
	cfg := config.Load()
	log.Printf("🚀 Starting Blog API on port %s", cfg.Port)

	// Initialize services
	db := services.NewDatabaseService(cfg)
	email := services.NewEmailService(cfg)

	// Initialize handlers
	postHandler := handlers.NewPostHandler(db)
	commentHandler := handlers.NewCommentHandler(db)
	guideHandler := handlers.NewGuideHandler(db)
	newsletterHandler := handlers.NewNewsletterHandler(db, email)
	adminHandler := handlers.NewAdminHandler(db, email)
	newsletterAdminHandler := handlers.NewNewsletterAdminHandler(db, email)
	productHandler := handlers.NewProductHandler(db)

	// Initialize router
	r := chi.NewRouter()

	// Middleware
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(middleware.CORS())

	// Health check endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status": "healthy", "service": "blog-api"}`))
	})

	// Product routes (public)
	r.Route("/products", func(r chi.Router) {
		r.Get("/", productHandler.GetProducts)
		r.Get("/{slug}", productHandler.GetProduct)
	})

	// Post routes
	r.Route("/posts", func(r chi.Router) {
		r.Get("/", postHandler.GetPosts)
		r.Post("/", postHandler.CreatePost)
		r.Get("/{slug}", postHandler.GetPost)

		// Clap routes
		r.Post("/{slug}/clap", postHandler.ClapPost)
		r.Get("/{slug}/claps", postHandler.GetClaps)

		// Comment routes
		r.Route("/{slug}/comments", func(r chi.Router) {
			r.Get("/", commentHandler.GetComments)
			r.Post("/", commentHandler.CreateComment)
		})
	})



	// Guide routes
	r.Route("/guides", func(r chi.Router) {
		r.Get("/", guideHandler.GetGuides)
		r.Post("/", guideHandler.CreateGuide)
		r.Get("/{slug}", guideHandler.GetGuide)
		r.Get("/category/{category}", guideHandler.GetGuidesByCategory)
	})

	// Admin guide routes (protected)
	r.Route("/admin/guides", func(r chi.Router) {
		r.Use(middleware.BasicAuth(cfg.AdminUsername, cfg.AdminPassword))
		r.Post("/{slug}/featured-hero", guideHandler.SetFeaturedHero)
		r.Delete("/{slug}/featured-hero", guideHandler.UnsetFeaturedHero)
	})

	// Newsletter routes
	r.Route("/newsletter", func(r chi.Router) {
		r.Post("/subscribe", newsletterHandler.Subscribe)
		r.Post("/unsubscribe", newsletterHandler.Unsubscribe)
		r.Get("/stats", newsletterHandler.GetStats)
	})

	// Admin routes (protected with basic auth)
	r.Route("/admin", func(r chi.Router) {
		r.Use(middleware.BasicAuth(cfg.AdminUsername, cfg.AdminPassword))

		r.Get("/dashboard", adminHandler.GetDashboard)

		// Post management
		r.Get("/posts", adminHandler.GetAllPosts)
		r.Put("/posts/{slug}", adminHandler.UpdatePost)
		r.Delete("/posts/{slug}", adminHandler.DeletePost)
		r.Post("/posts/{slug}/featured-hero", postHandler.SetFeaturedHero)
		r.Delete("/posts/{slug}/featured-hero", postHandler.UnsetFeaturedHero)

		// Comment management
		r.Get("/comments", adminHandler.GetAllComments)
		r.Delete("/comments/{id}", adminHandler.DeleteComment)

		// Newsletter management
		r.Get("/subscribers", adminHandler.GetAllSubscribers)
		r.Get("/subscribers/export", adminHandler.ExportSubscribers)

		// Newsletter sending
		r.Post("/newsletter/send", newsletterAdminHandler.SendNewsletter)
		r.Get("/newsletter/templates", newsletterAdminHandler.GetNewsletterTemplates)
		r.Post("/newsletter/preview", newsletterAdminHandler.PreviewNewsletter)
		r.Get("/newsletter/stats", newsletterAdminHandler.GetNewsletterStats)

		// Product management
		r.Get("/products", productHandler.GetAdminProducts)
		r.Post("/products", productHandler.CreateProduct)
		r.Put("/products/{slug}", productHandler.UpdateProduct)
		r.Delete("/products/{slug}", productHandler.DeleteProduct)

		// Product Categories Management
		r.Get("/product-categories", handlers.GetProductCategories)
		r.Post("/product-categories", handlers.CreateProductCategory)
		r.Put("/product-categories/{id}", handlers.UpdateProductCategory)
		r.Delete("/product-categories/{id}", handlers.DeleteProductCategory)

		// Lifestyle Collections Management
		r.Get("/lifestyle-collections", handlers.GetLifestyleCollections)
		r.Post("/lifestyle-collections", handlers.CreateLifestyleCollection)
		r.Put("/lifestyle-collections/{id}", handlers.UpdateLifestyleCollection)
		r.Delete("/lifestyle-collections/{id}", handlers.DeleteLifestyleCollection)

		// Blog-to-Product Collections Management
		r.Get("/blog-to-product-collections", handlers.GetBlogToProductCollections)
		r.Post("/blog-to-product-collections", handlers.CreateBlogToProductCollection)
		r.Put("/blog-to-product-collections/{id}", handlers.UpdateBlogToProductCollection)
		r.Delete("/blog-to-product-collections/{id}", handlers.DeleteBlogToProductCollection)

		// Product Assignment Management
		r.Post("/assign-products", handlers.AssignProducts)
		r.Get("/collection-products/{type}/{id}", handlers.GetCollectionProducts)
	})

	// Serve admin UI (public routes)
	r.Get("/admin-login", adminHandler.ServeAdminLogin)
	r.Get("/admin-dashboard", middleware.BasicAuth(cfg.AdminUsername, cfg.AdminPassword)(http.HandlerFunc(adminHandler.ServeAdminDashboard)).ServeHTTP)

	// Legacy admin UI route (redirect to new login)
	r.Get("/admin-ui", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/admin-login", http.StatusPermanentRedirect)
	})

	// Start server
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("✅ Blog API running on http://localhost%s", addr)
	log.Printf("📖 Endpoints:")
	log.Printf("   GET  /health")
	log.Printf("   GET  /posts")
	log.Printf("   POST /posts")
	log.Printf("   GET  /posts/{slug}")
	log.Printf("   GET  /posts/{slug}/comments")
	log.Printf("   POST /posts/{slug}/comments")
	log.Printf("   GET  /guides")
	log.Printf("   POST /guides")
	log.Printf("   GET  /guides/{slug}")
	log.Printf("   GET  /guides/category/{category}")
	log.Printf("   POST /newsletter/subscribe")
	log.Printf("   POST /newsletter/unsubscribe")
	log.Printf("   GET  /newsletter/stats")
	log.Printf("🔐 Admin:")
	log.Printf("   GET  /admin-login (Admin Login)")
	log.Printf("   GET  /admin-dashboard (Admin Dashboard)")
	log.Printf("   GET  /admin/dashboard (API)")
	log.Printf("   GET  /admin/posts (API)")
	log.Printf("   GET  /admin/comments (API)")
	log.Printf("   GET  /admin/subscribers (API)")

	log.Fatal(http.ListenAndServe(addr, r))
}
