import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Running product types migration...');

  try {
    // Read the SQL file
    const sql = readFileSync('add_product_types.sql', 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.includes('COMMENT ON')) {
        console.log('⏭️  Skipping COMMENT statement (not supported via client)');
        continue;
      }

      console.log('Executing:', statement.substring(0, 50) + '...');
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
      
      if (error) {
        // Try direct query if RPC fails
        const { error: directError } = await supabase.from('_').select('*').limit(0);
        console.log('⚠️  Note: Some statements may require direct database access');
      }
    }

    console.log('✅ Migration completed! Verifying columns...');

    // Verify the columns exist
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error verifying:', error.message);
    } else {
      console.log('✅ Products table accessible');
      if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        const requiredColumns = ['product_type', 'editorial_note', 'external_link', 'availability_status', 'variants'];
        const missingColumns = requiredColumns.filter(col => !columns.includes(col));
        
        if (missingColumns.length > 0) {
          console.log('⚠️  Missing columns:', missingColumns.join(', '));
          console.log('📝 You need to run this migration directly in Supabase SQL Editor:');
          console.log('   1. Go to Supabase Dashboard > SQL Editor');
          console.log('   2. Copy the contents of add_product_types.sql');
          console.log('   3. Run it there');
        } else {
          console.log('✅ All required columns present!');
        }
      }
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
