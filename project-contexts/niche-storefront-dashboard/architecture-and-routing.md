# Niche Storefront Dashboard - Architecture & Routing

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
