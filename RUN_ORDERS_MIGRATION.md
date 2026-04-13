# Run Orders Table Migration

## Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: `amqfaxpexigofotoandv`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

## Step 2: Run the Migration

Copy and paste the contents of `backend/create_orders_table.sql` into the SQL editor and click "Run".

The migration will create the `orders` table with all necessary fields for payment processing.

## Step 3: Verify Table Creation

Run this query to verify:

```sql
SELECT * FROM orders LIMIT 1;
```

You should see the table structure (even if empty).

## Step 4: Restart Backend

After running the migration, restart your backend:

```bash
cd backend
go run main.go
```

## What the Migration Creates

- `orders` table with fields:
  - id (UUID, primary key)
  - order_number (unique order identifier)
  - customer details (email, phone, name)
  - items (JSONB array of order items)
  - pricing (subtotal, shipping, tax, total)
  - payment tracking (payment_method, payment_status, payment_reference, paystack_reference)
  - order status
  - shipping_address (JSONB)
  - timestamps (created_at, updated_at, paid_at)

## Troubleshooting

If you get an error that the table already exists, you can drop it first:

```sql
DROP TABLE IF EXISTS orders CASCADE;
```

Then run the migration again.
