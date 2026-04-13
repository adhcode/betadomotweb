#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Checking orders table structure...\n');

// Try to insert a test record to see what columns are expected
const testOrder = {
  order_number: 'TEST-' + Date.now(),
  customer_email: 'test@test.com',
  customer_name: 'Test User',
  shipping_address: { street: 'Test St' },
  items: [{ id: '1', name: 'Test', price: 100, quantity: 1 }],
  subtotal: 100,
  shipping: 0,
  tax: 0,
  total: 100,
  payment_method: 'paystack',
  payment_status: 'pending',
  payment_reference: 'TEST-REF-' + Date.now(),
  status: 'pending'
};

const { data, error } = await supabase
  .from('orders')
  .insert(testOrder)
  .select();

if (error) {
  console.log('❌ Error:', error.message);
  console.log('   Code:', error.code);
  console.log('   Details:', error.details);
  console.log('   Hint:', error.hint);
  
  if (error.message.includes('shipping')) {
    console.log('\n💡 The "shipping" column is missing from your orders table.');
    console.log('   Run this SQL to add it:');
    console.log('\n   ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping DECIMAL(10,2) NOT NULL DEFAULT 0;');
  }
} else {
  console.log('✅ Test insert successful!');
  console.log('   Order created:', data);
  
  // Clean up test order
  await supabase.from('orders').delete().eq('order_number', testOrder.order_number);
  console.log('   Test order cleaned up.');
}
