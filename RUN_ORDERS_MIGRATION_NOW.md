# Run Orders Table Migration

## CRITICAL: Run this migration in Supabase SQL Editor

The orders table doesn't exist yet. You need to create it:

### Steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `amqfaxpexigofotoandv`
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the entire contents of `backend/create_orders_table.sql`
6. Paste into the SQL Editor
7. Click "Run" or press Cmd+Enter

### What this creates:

- `orders` table with all required fields
- Indexes for performance
- Automatic timestamp updates
- Proper constraints and checks

### After migration:

1. Restart the backend:
   ```bash
   cd backend
   go run main.go
   ```

2. Test the payment flow from the shop frontend

### Verify it worked:

In Supabase SQL Editor, run:
```sql
SELECT * FROM orders LIMIT 1;
```

You should see the table structure (even if empty).
