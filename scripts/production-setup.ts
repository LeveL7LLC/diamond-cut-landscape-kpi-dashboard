#!/usr/bin/env tsx

import { execSync } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { DATABASE_URL, NODE_ENV } = process.env;

console.log('🚀 Starting Production Database Setup...');
console.log(`📍 Environment: ${NODE_ENV || 'development'}`);
console.log(`📍 Database URL: ${DATABASE_URL ? 'Configured ✅' : 'Missing ❌'}`);
console.log('');

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required!');
  console.log('Please set DATABASE_URL in your .env file:');
  console.log('DATABASE_URL=postgresql://level7:your_password@localhost:5432/dcl-dashboard');
  process.exit(1);
}

async function runCommand(command: string, description: string) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully!`);
    console.log('');
  } catch (error) {
    console.error(`❌ ${description} failed:`, error);
    process.exit(1);
  }
}

async function setupProduction() {
  try {
    // Step 1: Set up database and extensions
    await runCommand('npm run db:setup', 'Setting up database and extensions');

    // Step 2: Generate migrations
    await runCommand('npm run db:generate', 'Generating database migrations');

    // Step 3: Push schema to database
    await runCommand('npm run db:push', 'Pushing schema to database');

    // Step 4: Seed database with initial data
    await runCommand('npm run db:seed', 'Seeding database with initial data');

    // Step 5: Health check
    await runCommand('npm run db:health', 'Running database health check');

    console.log('🎉 Production setup completed successfully!');
    console.log('');
    console.log('✅ Your application should now work without 500 errors.');
    console.log('✅ All API endpoints should return data or empty arrays.');
    console.log('✅ The dashboard should display properly with mock data fallbacks.');
    console.log('');
    console.log('🔗 Test your application at: https://dcldash.l-7.io');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Restart your application server');
    console.log('2. Test the API endpoints');
    console.log('3. Use the data input forms to add real business data');

  } catch (error) {
    console.error('❌ Production setup failed:', error);
    process.exit(1);
  }
}

// Run the production setup
setupProduction().catch(console.error);