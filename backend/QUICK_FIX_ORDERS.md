# Quick Fix: Create Orders Table

## The Problem
Your code is trying to insert into an `orders` table that doesn't exist yet in your Supabase database.

## The Solution (2 minutes)

### Step 1: Open Supabase SQL Editor
Click this link: https://supabase.com/dashboard/project/amqfaxpexigofotoandv/sql/new

### Step 2: Copy & Paste
Copy the entire SQL from `backend/create_orders_table.sql` and paste it into the SQL editor.

### Step 3: Run
Click the "Run" button (or press Cmd+Enter)

### Step 4: Done!
Restart your backend:
```bash
cd backend
go run main.go
```

## What This Creates
- Orders table with all necessary columns (shipping, tax, total, etc.)
- Indexes for fast queries
- Automatic timestamp updates
- Payment tracking fields

## Verification
After running, test your checkout again. The error should be gone!
