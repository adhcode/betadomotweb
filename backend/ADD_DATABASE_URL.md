# Add DATABASE_URL to .env

To run database migrations, you need to add your Supabase database connection string to `backend/.env`.

## Steps:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection String** section
4. Copy the **Connection string** (URI format)
5. Replace `[YOUR-PASSWORD]` with your actual database password

## Add to backend/.env:

```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.amqfaxpexigofotoandv.supabase.co:5432/postgres
```

Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

## Then run the migration:

```bash
cd backend
./run_product_categories_migration.sh
```

## Categories that will be created:

1. Home Tech
2. Furniture
3. Organization
4. Health & Comfort
5. Lighting
6. Decor
