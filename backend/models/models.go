package models

// Post represents a blog post
type Post struct {
	ID              string   `json:"id"`
	Slug            string   `json:"slug"`
	Title           string   `json:"title"`
	Excerpt         string   `json:"excerpt"`
	Content         string   `json:"content"`
	PublishedAt     string   `json:"published_at"`
	ReadTime        string   `json:"read_time"`
	FeaturedImage   string   `json:"featured_image"`
	Tags            []string `json:"tags"`
	ImagesJSON      any      `json:"images_json"`
	Views           int      `json:"views"`
	Category        string   `json:"category"`
	Topics          []string `json:"topics"`          // Array of topics under the category
	RelatedProducts []string `json:"related_products"` // Array of product IDs/slugs
	FeaturedHero    bool     `json:"featured_hero"`
}

// CreatePostRequest represents the payload for creating a new post
type CreatePostRequest struct {
	Title                 string   `json:"title"`
	Excerpt               string   `json:"excerpt"`
	Content               string   `json:"content"`
	ReadTime              string   `json:"readTime"`
	FeaturedImage         string   `json:"featuredImage"`
	Tags                  []string `json:"tags"`
	Images                any      `json:"images"`
	Category              string   `json:"category"`
	Topics                []string `json:"topics"`
	Featured              bool     `json:"featured"`
	FeaturedHero          bool     `json:"featured_hero"`
	HomepageSection       string   `json:"homepage_section"`
	HomepageOrder         int      `json:"homepage_order"`
	CalloutPoints         []string `json:"callout_points"`
	CalloutCTA            string   `json:"callout_cta"`
	CalloutSidebarTitle   string   `json:"callout_sidebar_title"`
	CalloutSidebarContent string   `json:"callout_sidebar_content"`
	RelatedProducts       []string `json:"related_products"` // Array of product IDs/slugs
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
	
	// Product Type System
	ProductType        string           `json:"product_type"` // "editorial" or "everyday"
	
	// Editorial-specific fields
	EditorialNote      string           `json:"editorial_note,omitempty"`
	ExternalLink       string           `json:"external_link,omitempty"`
	AvailabilityStatus string           `json:"availability_status,omitempty"` // available, limited, reference, sold_out
	
	// Everyday-specific fields
	Variants           []ProductVariant `json:"variants,omitempty"`
	ShippingInfo       string           `json:"shipping_info,omitempty"`
	ReturnPolicy       string           `json:"return_policy,omitempty"`
	CareInstructions   string           `json:"care_instructions,omitempty"`
}

// ProductVariant represents a product variant (size, color, material, etc.)
type ProductVariant struct {
	ID              string  `json:"id"`
	Name            string  `json:"name"`              // e.g., "Small", "Blue", "Oak"
	Type            string  `json:"type"`              // size, color, material, other
	PriceAdjustment float64 `json:"price_adjustment"`  // +/- from base price
	SKUSuffix       string  `json:"sku_suffix"`        // e.g., "-SM", "-BLU"
	Stock           int     `json:"stock"`
	ImageIndex      *int    `json:"image_index,omitempty"` // Which product image to show
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
	
	// Product Type System
	ProductType        string           `json:"product_type"` // "editorial" or "everyday"
	EditorialNote      string           `json:"editorial_note,omitempty"`
	ExternalLink       string           `json:"external_link,omitempty"`
	AvailabilityStatus string           `json:"availability_status,omitempty"`
	Variants           []ProductVariant `json:"variants,omitempty"`
	ShippingInfo       string           `json:"shipping_info,omitempty"`
	ReturnPolicy       string           `json:"return_policy,omitempty"`
	CareInstructions   string           `json:"care_instructions,omitempty"`
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
	
	// Product Type System
	ProductType        string           `json:"product_type"` // "editorial" or "everyday"
	EditorialNote      string           `json:"editorial_note,omitempty"`
	ExternalLink       string           `json:"external_link,omitempty"`
	AvailabilityStatus string           `json:"availability_status,omitempty"`
	Variants           []ProductVariant `json:"variants,omitempty"`
	ShippingInfo       string           `json:"shipping_info,omitempty"`
	ReturnPolicy       string           `json:"return_policy,omitempty"`
	CareInstructions   string           `json:"care_instructions,omitempty"`
}

// Order represents a customer order
type Order struct {
	ID                string                 `json:"id"`
	OrderNumber       string                 `json:"order_number"`
	CustomerEmail     string                 `json:"customer_email"`
	CustomerPhone     string                 `json:"customer_phone,omitempty"`
	CustomerName      string                 `json:"customer_name"`
	Items             []OrderItem            `json:"items"`
	Subtotal          float64                `json:"subtotal"`
	Tax               float64                `json:"tax"`
	Shipping          float64                `json:"shipping"`
	Total             float64                `json:"total"`
	Status            string                 `json:"status"` // pending, paid, shipped, delivered, cancelled
	PaymentMethod     string                 `json:"payment_method"`
	PaymentStatus     string                 `json:"payment_status"` // pending, processing, success, failed, refunded
	PaymentReference  string                 `json:"payment_reference,omitempty"`
	PaystackReference string                 `json:"paystack_reference,omitempty"`
	ShippingAddress   map[string]interface{} `json:"shipping_address"`
	BillingAddress    Address                `json:"billing_address,omitempty"`
	Notes             string                 `json:"notes"`
	CreatedAt         string                 `json:"created_at"`
	UpdatedAt         string                 `json:"updated_at"`
	PaidAt            *string                `json:"paid_at,omitempty"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	ID          string  `json:"id,omitempty"`
	ProductID   string  `json:"product_id"`
	ProductSlug string  `json:"product_slug"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Quantity    int     `json:"quantity"`
	Subtotal    float64 `json:"subtotal,omitempty"`
	Image       string  `json:"image,omitempty"`
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
	CustomerEmail   string                 `json:"customer_email"`
	CustomerPhone   string                 `json:"customer_phone"`
	CustomerName    string                 `json:"customer_name"`
	Items           []OrderItem            `json:"items"`
	Subtotal        float64                `json:"subtotal"`
	ShippingCost    float64                `json:"shipping_cost"`
	Tax             float64                `json:"tax"`
	Total           float64                `json:"total"`
	PaymentMethod   string                 `json:"payment_method"`
	ShippingAddress map[string]interface{} `json:"shipping_address"`
	BillingAddress  Address                `json:"billing_address,omitempty"`
	Notes           string                 `json:"notes,omitempty"`
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

// BlogCategory represents a simple blog category
type BlogCategory struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	Color       string `json:"color"`
	Icon        string `json:"icon"`
	DisplayOrder int   `json:"display_order"`
	CreatedAt   string `json:"created_at"`
}

// Guide represents a comprehensive guide
type Guide struct {
	ID          string `json:"id"`
	Slug        string `json:"slug"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Content     string `json:"content"`
	Category    string `json:"category"`
	Tags        []string `json:"tags"`
	FeaturedImage string `json:"featured_image"`
	ReadTime    string `json:"read_time"`
	Views       int    `json:"views"`
	Featured    bool   `json:"featured"`
	FeaturedHero bool  `json:"featured_hero"`
	PublishedAt string `json:"published_at"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

// CreateGuideRequest represents the payload for creating a new guide
type CreateGuideRequest struct {
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	Content       string   `json:"content"`
	Category      string   `json:"category"`
	Tags          []string `json:"tags"`
	FeaturedImage string   `json:"featured_image"`
	ReadTime      string   `json:"read_time"`
	Featured      bool     `json:"featured"`
	FeaturedHero  bool     `json:"featured_hero"`
}
