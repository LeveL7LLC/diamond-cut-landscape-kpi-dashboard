# Database Setup Guide

This project supports both local PostgreSQL and cloud-based Neon databases. The system automatically detects which type of connection you're using based on your `DATABASE_URL`.

## Quick Start Options

### Option 1: Local PostgreSQL (Recommended for Development)

#### Windows Installation
1. **Download PostgreSQL**: Visit [postgresql.org](https://www.postgresql.org/download/windows/)
2. **Install**: Run the installer and follow the setup wizard
3. **Set Password**: Remember the password you set for the `postgres` user
4. **Start Service**: PostgreSQL should start automatically

#### Alternative: Using Docker
```bash
# Pull and run PostgreSQL in Docker
docker run --name kpi-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Or using Docker Compose (create docker-compose.yml)
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: dcl-dashboard
      POSTGRES_USER: level7
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Setup Database
1. **Update .env file** with your PostgreSQL credentials:
   ```env
   DATABASE_URL=postgresql://level7:your_password@localhost:5432/dcl-dashboard
   ```

2. **Run setup script**:
   ```bash
   npm run db:setup
   ```

3. **Push schema to database**:
   ```bash
   npm run db:push
   ```

### Option 2: Neon Serverless PostgreSQL (Cloud)

1. **Create Neon Account**: Visit [neon.tech](https://neon.tech)
2. **Create Database**: Follow their setup wizard
3. **Get Connection String**: Copy the connection string from your Neon dashboard
4. **Update .env**:
   ```env
   DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require
   ```

5. **Push schema**:
   ```bash
   npm run db:push
   ```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run db:setup` | Create local database and extensions |
| `npm run db:health` | Check database connection and schema |
| `npm run db:push` | Push schema changes to database |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

## Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DATABASE_URL=postgresql://level7:password@localhost:5432/dcl-dashboard
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dcl-dashboard
DB_USER=level7
DB_PASSWORD=password

# Application Configuration
NODE_ENV=development
PORT=5000

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

## Troubleshooting

### Connection Refused Error
- **Local PostgreSQL**: Make sure PostgreSQL service is running
- **Windows**: Check Services app for "postgresql" service
- **Docker**: Run `docker ps` to see if container is running

### Authentication Failed
- Check username/password in DATABASE_URL
- For local PostgreSQL, default user is usually `postgres`

### Database Does Not Exist
- Run `npm run db:setup` to create the database
- Or manually create: `createdb dcl-dashboard`

### Schema Issues
- Run `npm run db:push` to sync schema
- Check `npm run db:health` for table status

## Database Schema

The project includes tables for:
- **Users**: Authentication and user management
- **Lead Sources**: Marketing channel tracking
- **CSRs**: Customer service representatives
- **Sales Reps**: Sales team members
- **Services**: Available services/products
- **Daily Metrics**: Time-series data for KPIs

## Development Workflow

1. **Start Database**: Ensure PostgreSQL is running
2. **Health Check**: `npm run db:health`
3. **Schema Changes**: Edit `shared/schema.ts`
4. **Push Changes**: `npm run db:push`
5. **Start App**: `npm run dev`

## Production Deployment

For production, consider:
- Using connection pooling (already configured)
- Setting up SSL connections
- Using managed PostgreSQL (Neon, AWS RDS, etc.)
- Proper backup strategies
- Environment-specific configurations