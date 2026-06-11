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