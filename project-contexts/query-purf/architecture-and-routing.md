# Query Purf - Architecture & Routing

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
