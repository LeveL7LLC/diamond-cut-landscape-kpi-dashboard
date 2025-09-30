# 🚀 Production Deployment Guide

## Current Status
✅ **Application Deployed**: https://dcldash.l-7.io  
❌ **Database Setup**: Needs to be configured

## 🔧 Database Setup on Opalstack

### Step 1: Create PostgreSQL Database
1. Log into your Opalstack control panel
2. Go to **Databases** → **PostgreSQL**
3. Create a new database:
   - **Database Name**: `dcl-dashboard`
   - **Username**: `level7`
   - **Password**: Your secure password

### Step 2: Configure Environment Variables
Create a `.env` file on your server with:

```bash
# Database Configuration
DATABASE_URL=postgresql://level7:your_password@localhost:5432/dcl-dashboard
DB_NAME=dcl-dashboard

# Application Configuration
NODE_ENV=production
PORT=5000
```

**Replace `your_password` with your actual PostgreSQL password for the level7 user.**
**Replace the PORT value with the port number your application is running on (default is 5000).**

### Step 3: Run Database Setup Commands

SSH into your Opalstack server and run these commands in your project directory:

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Set up database and extensions
npm run db:setup

# 3. Generate and push database schema
npm run db:generate
npm run db:push

# 4. Seed the database with initial data
npm run db:seed

# 5. Check database health
npm run db:health
```

### Step 4: Restart Your Application
After database setup, restart your Node.js application on Opalstack.

## 🔍 Troubleshooting

### Current 500 Errors
The API endpoints are failing because:
- Database tables don't exist yet
- No initial data has been seeded

### Expected Behavior After Setup
- ✅ All API endpoints return data or empty arrays
- ✅ Dashboard displays mock data initially
- ✅ Data input forms work correctly
- ✅ Database integration switches from mock to real data

### Verify Setup
Test these endpoints after setup:
- `https://dcldash.l-7.io/api/lead-sources` → Should return `[]` or seeded data
- `https://dcldash.l-7.io/api/csrs` → Should return `[]` or seeded data
- `https://dcldash.l-7.io/api/monthly-finance` → Should return `[]` initially

## 📋 Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run db:setup` | Create database and extensions |
| `npm run db:generate` | Generate migration files |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Add sample data |
| `npm run db:health` | Check database connection |
| `npm run db:studio` | Open Drizzle Studio (local only) |

## 🎯 Next Steps After Database Setup

1. **Test the application** - All 500 errors should be resolved
2. **Add initial data** - Use the data input forms to add real business data
3. **Monitor performance** - Check server logs for any issues
4. **Set up backups** - Configure regular database backups on Opalstack

## 🆘 Need Help?

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify database connection with `npm run db:health`
3. Ensure all environment variables are set correctly
4. Contact Opalstack support for database-specific issues