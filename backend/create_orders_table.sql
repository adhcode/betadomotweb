-- Orders table for storing customer orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    
    -- Customer information
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_name TEXT,
    
    -- Shipping address (stored as JSONB)
    shipping_address JSONB NOT NULL,
    
    -- Order items (stored as JSONB array)
    items JSONB NOT NULL,
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Payment information
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'success', 'failed', 'refunded')),
    payment_reference TEXT UNIQUE,
    paystack_reference TEXT UNIQUE,
    
    -- Order status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    
    -- Additional information
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_ref ON orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_paystack_ref ON orders(paystack_reference);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

-- Comments for documentation
COMMENT ON TABLE orders IS 'Stores customer orders and payment information';
COMMENT ON COLUMN orders.order_number IS 'Human-readable order number (e.g., BD-12345678)';
COMMENT ON COLUMN orders.payment_reference IS 'Internal payment reference';
COMMENT ON COLUMN orders.paystack_reference IS 'Paystack transaction reference';
COMMENT ON COLUMN orders.shipping_address IS 'JSON object with address fields';
COMMENT ON COLUMN orders.items IS 'JSON array of ordered items with product details';
