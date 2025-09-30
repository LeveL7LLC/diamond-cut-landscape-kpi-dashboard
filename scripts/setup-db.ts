#!/usr/bin/env tsx

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const {
  DATABASE_URL,
  DB_NAME = 'dcl-dashboard'
} = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in .env file');
}

async function setupDatabase() {
  console.log('🚀 Setting up PostgreSQL database...');
  console.log(`📍 Connecting to database: ${DB_NAME}`);

  try {
    // Connect directly to the target database (assumes it already exists)
    const targetPool = new Pool({
      connectionString: DATABASE_URL
    });

    // Test connection
    await targetPool.query('SELECT 1');
    console.log(`✅ Successfully connected to database: ${DB_NAME}`);

    console.log('🔧 Setting up database extensions...');
    
    // Enable UUID extension for generating UUIDs
    await targetPool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled.');

    // Enable pgcrypto for additional crypto functions
    await targetPool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    console.log('✅ pgcrypto extension enabled.');

    await targetPool.end();

    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: npm run db:generate  # Generate migrations');
    console.log('2. Run: npm run db:push     # Push schema to database');
    console.log('3. Run: npm run db:seed     # Add sample data');
    console.log('4. Run: npm run dev         # Start the development server');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('');
    console.log('🔧 Make sure:');
    console.log(`1. Database "${DB_NAME}" exists in your Opalstack control panel`);
    console.log('2. Your DATABASE_URL is correct');
    console.log('3. The level7 user has access to the dcl-dashboard database');
    process.exit(1);
  }
}

// Run the setup
setupDatabase().catch(console.error);