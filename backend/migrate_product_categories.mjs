#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Running product categories migration...\n');

// Define the categories
const categories = [
  { name: 'Home Tech', slug: 'home-tech', description: 'Smart home devices, gadgets, and technology for modern living', display_order: 1 },
  { name: 'Furniture', slug: 'furniture', description: 'Quality furniture pieces for every room in your home', display_order: 2 },
  { name: 'Organization', slug: 'organization', description: 'Storage solutions and organizational tools', display_order: 3 },
  { name: 'Health & Comfort', slug: 'health-comfort', description: 'Products for wellness, comfort, and healthy living', display_order: 4 },
  { name: 'Lighting', slug: 'lighting', description: 'Lamps, fixtures, and lighting solutions', display_order: 5 },
  { name: 'Decor', slug: 'decor', description: 'Decorative items and home accessories', display_order: 6 }
];

async function migrate() {
  try {
    // Check if table exists by trying to query it
    console.log('📋 Checking if product_categories table exists...');
    const { data: existingData, error: checkError } = await supabase
      .from('product_categories')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      console.log('❌ Table does not exist. Please create it first using Supabase SQL Editor.');
      console.log('\nRun this SQL in your Supabase SQL Editor:');
      console.log('\n' + readFileSync('create_product_categories_table.sql', 'utf8'));
      process.exit(1);
    }

    console.log('✅ Table exists!\n');

    // Insert categories one by one
    for (const category of categories) {
      console.log(`📦 Inserting: ${category.name}...`);
      
      // Check if category already exists
      const { data: existing } = await supabase
        .from('product_categories')
        .select('id')
        .eq('slug', category.slug)
        .single();

      if (existing) {
        console.log(`   ⏭️  Already exists, skipping`);
        continue;
      }

      const { error } = await supabase
        .from('product_categories')
        .insert([category]);

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Created successfully`);
      }
    }

    console.log('\n✅ Migration completed!\n');
    console.log('Categories created:');
    categories.forEach((cat, i) => {
      console.log(`  ${i + 1}. ${cat.name}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
