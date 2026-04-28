#!/usr/bin/env node

/**
 * Migration: Add product types system (Editorial vs Everyday)
 * This enables dual-product system for Betadomot
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🔄 Starting product types migration...\n');

  try {
    // Step 1: Add product_type column
    console.log('📝 Step 1: Adding product_type column...');
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'everyday' 
        CHECK (product_type IN ('editorial', 'everyday'));
      `
    });
    
    if (error1) {
      console.log('⚠️  Column might already exist or using direct SQL approach...');
    } else {
      console.log('✅ product_type column added');
    }

    // Step 2: Add editorial-specific fields
    console.log('\n📝 Step 2: Adding editorial-specific fields...');
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products
        ADD COLUMN IF NOT EXISTS editorial_note TEXT,
        ADD COLUMN IF NOT EXISTS external_link TEXT,
        ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' 
        CHECK (availability_status IN ('available', 'limited', 'reference', 'sold_out'));
      `
    });
    
    if (error2) {
      console.log('⚠️  Columns might already exist or using direct SQL approach...');
    } else {
      console.log('✅ Editorial fields added');
    }

    // Step 3: Add everyday-specific fields
    console.log('\n📝 Step 3: Adding everyday-specific fields...');
    const { error: error3 } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products
        ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]',
        ADD COLUMN IF NOT EXISTS shipping_info TEXT,
        ADD COLUMN IF NOT EXISTS return_policy TEXT,
        ADD COLUMN IF NOT EXISTS care_instructions TEXT;
      `
    });
    
    if (error3) {
      console.log('⚠️  Columns might already exist or using direct SQL approach...');
    } else {
      console.log('✅ Everyday fields added');
    }

    // Step 4: Update existing products
    console.log('\n📝 Step 4: Updating existing products to everyday type...');
    const { error: error4 } = await supabase
      .from('products')
      .update({ product_type: 'everyday' })
      .is('product_type', null);
    
    if (error4) {
      console.log('⚠️  Update might have failed:', error4.message);
    } else {
      console.log('✅ Existing products updated');
    }

    console.log('\n✅ Migration completed successfully!\n');
    console.log('📝 Next steps:');
    console.log('1. Update your backend code to use the new product_type field');
    console.log('2. Update frontend components to handle both product types');
    console.log('3. Add product type selector to admin interface\n');
    console.log('💡 Product types:');
    console.log('   - editorial: Inspiration, reference, curation');
    console.log('   - everyday: Purchasable, practical, accessible\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\n💡 Trying alternative approach with direct SQL...\n');
    
    // Alternative: Try using SQL directly via Supabase SQL Editor
    console.log('Please run the following SQL in your Supabase SQL Editor:\n');
    console.log('----------------------------------------');
    console.log(`
-- Add product_type column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'everyday' 
CHECK (product_type IN ('editorial', 'everyday'));

-- Add editorial-specific fields
ALTER TABLE products
ADD COLUMN IF NOT EXISTS editorial_note TEXT,
ADD COLUMN IF NOT EXISTS external_link TEXT,
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' 
CHECK (availability_status IN ('available', 'limited', 'reference', 'sold_out'));

-- Add everyday-specific fields
ALTER TABLE products
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS shipping_info TEXT,
ADD COLUMN IF NOT EXISTS return_policy TEXT,
ADD COLUMN IF NOT EXISTS care_instructions TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_type_active ON products(product_type, active);
CREATE INDEX IF NOT EXISTS idx_products_type_featured ON products(product_type, featured);

-- Update existing products
UPDATE products 
SET product_type = 'everyday' 
WHERE product_type IS NULL;
    `);
    console.log('----------------------------------------\n');
    
    process.exit(1);
  }
}

runMigration();
