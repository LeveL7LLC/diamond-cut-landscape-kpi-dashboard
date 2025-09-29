#!/usr/bin/env tsx

import { db } from '../server/db';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkDatabaseHealth() {
  console.log('🔍 Checking database health...');
  
  try {
    // Test basic connection
    console.log('📡 Testing database connection...');
    const result = await db.execute(sql`SELECT NOW() as current_time, version() as pg_version`);
    
    if (result.rows.length > 0) {
      const row = result.rows[0] as any;
      console.log('✅ Database connection successful!');
      console.log(`⏰ Current time: ${row.current_time}`);
      console.log(`🐘 PostgreSQL version: ${row.pg_version.split(' ')[0]}`);
    }

    // Check if tables exist
    console.log('\n📋 Checking database schema...');
    const tablesResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      console.log('✅ Found tables:');
      tablesResult.rows.forEach((row: any) => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found. You may need to run migrations.');
      console.log('   Run: npm run db:push');
    }

    // Check extensions
    console.log('\n🔧 Checking database extensions...');
    const extensionsResult = await db.execute(sql`
      SELECT extname 
      FROM pg_extension 
      WHERE extname IN ('uuid-ossp', 'pgcrypto')
      ORDER BY extname
    `);

    if (extensionsResult.rows.length > 0) {
      console.log('✅ Found extensions:');
      extensionsResult.rows.forEach((row: any) => {
        console.log(`   - ${row.extname}`);
      });
    } else {
      console.log('⚠️  Required extensions not found.');
      console.log('   Run: npm run db:setup');
    }

    console.log('\n🎉 Database health check completed!');

  } catch (error) {
    console.error('❌ Database health check failed:', error);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your DATABASE_URL in .env file');
    console.log('3. Run: npm run db:setup');
    process.exit(1);
  }
}

// Run the health check
checkDatabaseHealth().catch(console.error);