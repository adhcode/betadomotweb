#!/usr/bin/env node

import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const sql = readFileSync('add_missing_orders_columns.sql', 'utf8');

console.log('🔧 Fix Orders Table - Add Missing Columns\n');
console.log('📋 Copy and paste this SQL into Supabase SQL Editor:');
console.log('   https://supabase.com/dashboard/project/amqfaxpexigofotoandv/sql/new\n');
console.log('─'.repeat(80));
console.log(sql);
console.log('─'.repeat(80));
console.log('\n✨ After running the SQL, restart your backend with: go run main.go');
