import dotenv from 'dotenv';
import { pool } from './src/config/supabase.js';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📝 Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'Not set');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ Connection successful!');
    console.log('⏰ Database time:', result.rows[0].current_time);
    console.log('📊 PostgreSQL version:', result.rows[0].pg_version.split(',')[0]);
    
    // Test if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('items', 'subscriptions')
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tables found:');
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No tables found. You may need to run the schema.sql file.');
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`   ✓ ${row.table_name}`);
      });
    }
    
    // Test a simple query on items table if it exists
    if (tablesResult.rows.some((r) => r.table_name === 'items')) {
      const countResult = await pool.query('SELECT COUNT(*) as count FROM items');
      console.log(`\n📦 Items in database: ${countResult.rows[0].count}`);
    }
    
    await pool.end();
    console.log('\n✅ All tests passed! Database connection is working correctly.');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.error('\n💡 Tip: Check your database password in the .env file');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('\n💡 Tip: Check your database host/URL in the .env file');
    } else if (error.message.includes('DATABASE_URL')) {
      console.error('\n💡 Tip: Make sure DATABASE_URL is set in your .env file');
    }
    
    await pool.end();
    process.exit(1);
  }
}

testConnection();

