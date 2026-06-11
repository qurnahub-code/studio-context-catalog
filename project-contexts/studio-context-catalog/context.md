# Studio Context Catalog - Context

## Core Purpose
The Studio Context Catalog is a local development productivity tool built to manage "Context Commits" (markdown blobs, code snippets, or architecture rules) across various projects. It allows developers to visually drag-and-drop code context into specific "Project Nodes", persist them to a database, and instantly copy them into an AI prompt or IDE.

## Tech Stack
- **Framework**: Next.js 15 (App Router).
- **Language**: TypeScript (`.tsx`).
- **Styling**: Tailwind CSS (with arbitrary value classes heavily utilized for dark-mode coloring).
- **Backend / Database**: Supabase (PostgreSQL). Stores projects and commits. Data is fetched server-side in API routes and client-side via React state.

## Architecture & Data Flow
1. **Frontend (`src/app/page.tsx`)**: A complex, single-page dashboard. It manages massive amounts of client-side state using React `useState` and `useEffect` (for drag-and-drop, modals, and file inspection).
2. **Backend API (`src/app/api/...`)**: 
   - Uses Next.js Route Handlers (`route.js`) to interact with Supabase.
   - Example: `/api/context/[project]` handles fetching commits for specific nodes.
3. **Database Schema (Supabase)**:
   - `commits` table: Stores `id`, `project_id`, `category`, `content` (the markdown text), and `created_at`.
   - The application relies on `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to authenticate API calls.

## Core Features
1. **Smart Ingestion Modal**: Users can paste giant blocks of code or markdown. The app categorizes it (Context, State, Rule, Config) and allows the user to commit it.
2. **Visual Node System**: The left panel lists "Project Nodes". Users can drag a committed snippet from the main timeline into a specific project node to categorize it.
3. **Live File Inspection**: Users can click on committed files or infrastructure files (like `global-rules.md`) to open a responsive, table-based code-viewer modal that never breaks layout, even on massive files.
4. **Instant Context Copying**: Clicking a project node compiles all its commits and copies the entire formatted context block directly to the user's clipboard for LLM pasting.