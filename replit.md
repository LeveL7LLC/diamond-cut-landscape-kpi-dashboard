# Corporate KPI Dashboard

## Overview

This is a corporate KPI (Key Performance Indicator) dashboard application built for Diamond Cut Landscape. The system provides real-time business metrics and performance tracking, specifically designed for continuous TV display in corporate environments. The dashboard visualizes critical business data including leads, bookings, sales performance, financial metrics, and operational capacity across various time periods.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management with optimistic updates
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Material Design-inspired enterprise customizations optimized for dark mode and large display viewing

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with comprehensive CRUD operations for all business entities
- **Validation**: Zod schemas for request/response validation and type safety
- **Development**: Hot-reload development server with Vite integration

### Data Storage Solutions
- **Primary Database**: Neon PostgreSQL serverless database
- **ORM**: Drizzle ORM with migration support for schema management
- **Database Schema**: Comprehensive business entity modeling including:
  - Core entities (Lead Sources, CSRs, Sales Representatives, Services)
  - Time-series data (Daily metrics for leads, bookings, closes, contracts)
  - Financial tracking (Monthly finance, AR aging, margin variance)
  - Operational metrics (Capacity planning, pipeline snapshots, revenue tracking)

### Authentication and Authorization
- Session-based authentication with secure cookie management
- User management system with username/password authentication
- Session storage using connect-pg-simple for PostgreSQL session store

### Design and Display Optimization
- **Dark Mode Priority**: Optimized color palette for 24/7 TV display and reduced eye strain
- **Typography**: Inter font system with carefully sized text for distance viewing (10+ feet readability)
- **Component Architecture**: Modular KPI tiles, thermometer gauges, segmented progress indicators, and interactive charts
- **Responsive Grid**: CSS Grid system optimized for large displays (1920x1080+)
- **Data Visualization**: Recharts integration for charts, graphs, and business intelligence displays

## External Dependencies

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **WebSocket Support**: Real-time data updates via WebSocket connections

### UI and Visualization Libraries
- **Radix UI**: Accessible component primitives for dropdowns, dialogs, and form controls
- **Recharts**: Data visualization library for business charts and graphs
- **Lucide React**: Icon library for consistent iconography
- **TanStack Query**: Advanced server state management with caching and synchronization

### Development and Build Tools
- **Vite**: Fast development server and build tool with HMR support
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **PostCSS**: CSS processing with autoprefixer support

### Form Management and Validation
- **React Hook Form**: Form state management with minimal re-renders
- **Zod**: Schema validation for API contracts and form validation
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

### Business Logic Integration
- **Date-fns**: Date manipulation and formatting for time-series data
- **Class Variance Authority**: Type-safe CSS class composition
- **CMDK**: Command palette interface for dashboard interactions