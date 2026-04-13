#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file
const sql = readFileSync('create_orders_table.sql', 'utf8');

console.log('🚀 Running orders table migration...\n');

// Try to query the table first to see if it exists
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .limit(1);

if (error && error.code === 'PGRST204') {
  console.log('❌ Orders table does not exist.');
  console.log('\n📋 Please run this SQL in Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/amqfaxpexigofotoandv/sql/new\n');
  console.log(sql);
  console.log('\n💡 Supabase REST API cannot create tables. You must use the SQL Editor.');
} else if (error) {
  console.log('❌ Error checking table:', error.message);
  console.log('\n📋 Please run this SQL in Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/amqfaxpexigofotoandv/sql/new\n');
  console.log(sql);
} else {
  console.log('✅ Orders table already exists!');
  console.log('   You can now use the checkout feature.');
}
