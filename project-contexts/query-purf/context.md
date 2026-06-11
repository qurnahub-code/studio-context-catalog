# Query Purf - Context

## Core Purpose
Query Purf is a high-performance frontend dashboard or tool built around complex data querying and presentation. It provides an interface to execute, visualize, and analyze deep system queries or analytics data efficiently.


## Tech Stack
- **Framework**: Next.js (App Router).
- **Language**: TypeScript.
- **Styling**: Tailwind CSS via `tailwind.config.ts`.
- **Package Manager**: npm.

## Directory Structure
- `src/`: Standard Next.js `src` directory containing the application logic.
- `src/app/`: App Router definitions containing `page.tsx`, `layout.tsx`, and Next.js server components.
- `scripts/`: Local utility scripts for automation or build processes.
- `.github/workflows/` (via `action.yml`): Configured for CI/CD, likely deploying to Vercel or a similar edge network given the `.next` output and `Next.js` environment.


## Main Capabilities
1. **High-Performance Querying**: Built to handle complex data structures efficiently, passing data from Server Components directly to highly optimized Client Components.
2. **Dashboard Visualizations**: Translates raw JSON or query data into readable charts, tables, or graph visualizations to assist with performance debugging or system auditing.
3. **Automated Workflows**: Implements custom GitHub actions (`action.yml`) to run automated checks or deployments directly from the repository.