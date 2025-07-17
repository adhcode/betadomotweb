package models

// Post represents a blog post
type Post struct {
	ID            string   `json:"id"`
	Slug          string   `json:"slug"`
	Title         string   `json:"title"`
	Excerpt       string   `json:"excerpt"`
	Content       string   `json:"content"`
	PublishedAt   string   `json:"published_at"`
	ReadTime      string   `json:"read_time"`
	FeaturedImage string   `json:"featured_image"`
	Tags          []string `json:"tags"`
	ImagesJSON    any      `json:"images_json"`
	Views         int      `json:"views"`
}

// CreatePostRequest represents the payload for creating a new post
type CreatePostRequest struct {
	Title         string   `json:"title"`
	Excerpt       string   `json:"excerpt"`
	Content       string   `json:"content"`
	ReadTime      string   `json:"readTime"`
	FeaturedImage string   `json:"featuredImage"`
	Tags          []string `json:"tags"`
	Images        any      `json:"images"`
}

// Comment represents a blog comment
type Comment struct {
	ID          string `json:"id"`
	PostSlug    string `json:"post_slug"`
	AuthorName  string `json:"author_name"`
	AuthorEmail string `json:"author_email"`
	Body        string `json:"body"`
	CreatedAt   string `json:"created_at"`
}

// CreateCommentRequest represents the payload for creating a new comment
type CreateCommentRequest struct {
	AuthorName  string `json:"author_name"`
	AuthorEmail string `json:"author_email"`
	Body        string `json:"body"`
}

// NewsletterSubscriber represents a newsletter subscriber
type NewsletterSubscriber struct {
	ID             string  `json:"id"`
	Email          string  `json:"email"`
	Status         string  `json:"status"`
	SubscribedAt   string  `json:"subscribed_at"`
	UnsubscribedAt *string `json:"unsubscribed_at"`
	Source         string  `json:"source"`
}

// NewsletterRequest represents the payload for newsletter operations
type NewsletterRequest struct {
	Email  string `json:"email"`
	Source string `json:"source"`
}

// Newsletter represents a newsletter campaign
type Newsletter struct {
	ID             string  `json:"id"`
	Subject        string  `json:"subject"`
	Content        string  `json:"content"`
	HTMLContent    string  `json:"html_content"`
	Status         string  `json:"status"` // draft, scheduled, sent
	CreatedAt      string  `json:"created_at"`
	SentAt         *string `json:"sent_at"`
	RecipientCount int     `json:"recipient_count"`
	OpenCount      int     `json:"open_count"`
	ClickCount     int     `json:"click_count"`
}

// CreateNewsletterRequest represents the payload for creating a newsletter
type CreateNewsletterRequest struct {
	Subject      string  `json:"subject"`
	Content      string  `json:"content"`
	HTMLContent  string  `json:"html_content"`
	ScheduledFor *string `json:"scheduled_for"`
}

// SendNewsletterRequest represents the payload for sending a newsletter
type SendNewsletterRequest struct {
	Subject     string `json:"subject"`
	Content     string `json:"content"`
	HTMLContent string `json:"html_content"`
	TestEmail   string `json:"test_email,omitempty"`
}

// Product represents an e-commerce product
type Product struct {
	ID          string   `json:"id"`
	Slug        string   `json:"slug"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	SalePrice   *float64 `json:"sale_price,omitempty"`
	Images      []string `json:"images"`
	Category    string   `json:"category"`
	Tags        []string `json:"tags"`
	Stock       int      `json:"stock"`
	SKU         string   `json:"sku"`
	Weight      float64  `json:"weight"`
	Dimensions  string   `json:"dimensions"`
	Featured    bool     `json:"featured"`
	Active      bool     `json:"active"`
	CreatedAt   string   `json:"created_at"`
	UpdatedAt   string   `json:"updated_at"`
}

// CreateProductRequest represents the payload for creating a new product
type CreateProductRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	SalePrice   *float64 `json:"sale_price,omitempty"`
	Images      []string `json:"images"`
	Category    string   `json:"category"`
	Tags        []string `json:"tags"`
	Stock       int      `json:"stock"`
	SKU         string   `json:"sku"`
	Weight      float64  `json:"weight"`
	Dimensions  string   `json:"dimensions"`
	Featured    bool     `json:"featured"`
	Active      bool     `json:"active"`
}

// UpdateProductRequest represents the payload for updating a product
type UpdateProductRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	SalePrice   *float64 `json:"sale_price,omitempty"`
	Images      []string `json:"images"`
	Category    string   `json:"category"`
	Tags        []string `json:"tags"`
	Stock       int      `json:"stock"`
	SKU         string   `json:"sku"`
	Weight      float64  `json:"weight"`
	Dimensions  string   `json:"dimensions"`
	Featured    bool     `json:"featured"`
	Active      bool     `json:"active"`
}

// Order represents a customer order
type Order struct {
	ID              string      `json:"id"`
	CustomerEmail   string      `json:"customer_email"`
	CustomerName    string      `json:"customer_name"`
	Items           []OrderItem `json:"items"`
	Subtotal        float64     `json:"subtotal"`
	Tax             float64     `json:"tax"`
	Shipping        float64     `json:"shipping"`
	Total           float64     `json:"total"`
	Status          string      `json:"status"` // pending, paid, shipped, delivered, cancelled
	PaymentMethod   string      `json:"payment_method"`
	ShippingAddress Address     `json:"shipping_address"`
	BillingAddress  Address     `json:"billing_address"`
	Notes           string      `json:"notes"`
	CreatedAt       string      `json:"created_at"`
	UpdatedAt       string      `json:"updated_at"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	ID          string  `json:"id"`
	ProductID   string  `json:"product_id"`
	ProductSlug string  `json:"product_slug"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Quantity    int     `json:"quantity"`
	Subtotal    float64 `json:"subtotal"`
}

// Address represents a shipping or billing address
type Address struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Company   string `json:"company"`
	Address1  string `json:"address1"`
	Address2  string `json:"address2"`
	City      string `json:"city"`
	State     string `json:"state"`
	Postcode  string `json:"postcode"`
	Country   string `json:"country"`
	Phone     string `json:"phone"`
}

// CreateOrderRequest represents the payload for creating a new order
type CreateOrderRequest struct {
	CustomerEmail   string      `json:"customer_email"`
	CustomerName    string      `json:"customer_name"`
	Items           []OrderItem `json:"items"`
	PaymentMethod   string      `json:"payment_method"`
	ShippingAddress Address     `json:"shipping_address"`
	BillingAddress  Address     `json:"billing_address"`
	Notes           string      `json:"notes"`
}

// CartItem represents an item in the shopping cart
type CartItem struct {
	ProductID   string  `json:"product_id"`
	ProductSlug string  `json:"product_slug"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Image       string  `json:"image"`
	Quantity    int     `json:"quantity"`
}

// Cart represents a shopping cart
type Cart struct {
	ID    string     `json:"id"`
	Items []CartItem `json:"items"`
	Total float64    `json:"total"`
}
