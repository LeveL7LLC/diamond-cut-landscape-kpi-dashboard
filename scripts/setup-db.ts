#!/usr/bin/env tsx

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const {
  DATABASE_URL,
  DB_NAME = 'kpi_dashboard'
} = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in .env file');
}

async function setupDatabase() {
  console.log('🚀 Setting up PostgreSQL database...');

  // Parse the DATABASE_URL to get connection details
  const url = new URL(DATABASE_URL);
  const adminConnectionString = `postgresql://${url.username}:${url.password}@${url.hostname}:${url.port}/postgres`;

  // First, connect to postgres database to create our target database
  const adminPool = new Pool({
    connectionString: adminConnectionString
  });

  try {
    // Check if database exists
    const dbCheckResult = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [DB_NAME]
    );

    if (dbCheckResult.rows.length === 0) {
      console.log(`📦 Creating database: ${DB_NAME}`);
      await adminPool.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log('✅ Database created successfully!');
    } else {
      console.log(`✅ Database ${DB_NAME} already exists.`);
    }

    await adminPool.end();

    // Now connect to our target database to set up extensions
    const targetPool = new Pool({
      connectionString: DATABASE_URL
    });

    console.log('🔧 Setting up database extensions...');
    
    // Enable UUID extension for generating UUIDs
    await targetPool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled.');

    // Enable pgcrypto for additional crypto functions
    await targetPool.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    console.log('✅ pgcrypto extension enabled.');

    await targetPool.end();

    console.log('🎉 Database setup completed successfully!');
    console.log(`📍 Connection string: postgresql://${url.username}:***@${url.hostname}:${url.port}/${DB_NAME}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: npm run db:generate  # Generate migrations');
    console.log('2. Run: npm run db:push     # Push schema to database');
    console.log('3. Run: npm run dev         # Start the development server');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase().catch(console.error);