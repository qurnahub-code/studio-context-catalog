# Niche Storefront Dashboard - Context

## Core Purpose
The Niche Storefront Dashboard is a full-stack, administrative e-commerce dashboard. It is designed to manage store inventory, track customer orders, visualize sales analytics, and manage overall storefront configuration for niche e-commerce operations.


## Tech Stack
- **Framework**: TanStack Start (React 19, Vite).
- **Language**: TypeScript.
- **Routing**: TanStack Router (File-based routing with deep type safety).
- **State & Data Fetching**: TanStack Query (React Query) for asynchronous state, caching, and server state management.
- **Database ORM**: Prisma ORM with `@prisma/adapter-pg`.
- **Database**: PostgreSQL (via Supabase).

## Directory & Data Flow
- `src/routes/`: Contains the TanStack router definitions and page components. Provides strict type-safety for search params and path parameters.
- `src/components/`: Reusable UI components (primarily built on Radix UI primitives).
- `prisma/`: Contains `schema.prisma` which defines the database models (e.g., Products, Orders, Customers) and handles migrations.
- **Data Flow**: The application uses React Query to fetch data from backend endpoints (or directly via TanStack Start server functions), passing data down to interactive UI components like Recharts for analytics or complex data tables.


## Main Capabilities
1. **Analytics & Reporting**: Interactive, dynamic charts (powered by Recharts) showing sales trends, active visitors, and revenue metrics.
2. **Product Management**: Interface to create, update, and categorize inventory with browser-based image compression (`browser-image-compression`).
3. **Order Processing**: Data tables (TanStack Table style) for viewing customer orders, tracking shipment statuses, and managing fulfillment.
4. **Custom Forms & Validation**: Complex data entry forms using `react-hook-form` integrated with `zod` schema validation to ensure clean database writes.
5. **Interactive UI**: Rich component interactions including sortable tables, sliding panels (`react-resizable-panels`), advanced date pickers (`react-day-picker`), and toast notifications (`sonner`).