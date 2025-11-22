import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

console.log('Connection string (masked):', databaseUrl?.replace(/:[^:@]+@/, ':****@') || 'Not set');
console.log('Full connection string length:', databaseUrl?.length || 0);

async function test() {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('\nAttempting connection...');
    const client = await pool.connect();
    console.log('✅ Connected!');
    
    const result = await client.query('SELECT NOW() as time, version() as version');
    console.log('Database time:', result.rows[0].time);
    console.log('PostgreSQL:', result.rows[0].version.split(',')[0]);
    
    client.release();
    await pool.end();
    console.log('\n✅ Connection test successful!');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Connection failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    
    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      console.error('\n💡 DNS resolution failed. Possible issues:');
      console.error('   - Check your internet connection');
      console.error('   - Verify the hostname is correct');
      console.error('   - Try pinging: db.dhjnqalrtfnbvvjzligz.supabase.co');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Connection timeout. Possible issues:');
      console.error('   - Firewall blocking port 5432');
      console.error('   - Network connectivity issues');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed. Check your password.');
    }
    
    await pool.end();
    process.exit(1);
  }
}

test();

