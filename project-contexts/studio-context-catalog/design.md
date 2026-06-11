# Studio Context Catalog - Design System

## Design Philosophy
The UI is strictly engineered for "developer aesthetics". It heavily mirrors IDE environments (like VS Code or Cursor) and terminal interfaces, avoiding any unnecessary consumer-facing polish in favor of high-density information displays.

## CSS Architecture
- **Methodology**: Tailwind CSS via `className`.
- **Framework Configuration**: `tailwind.config.ts` extends standard Tailwind with a specific color palette mapped to terminal concepts (`console-bg`, `console-border`, `console-text-muted`).

## Color Palette (IDE Dark Theme)
- **Backgrounds**: Ultra-dark, low-contrast backgrounds (`bg-[#020617]`, `bg-[#0B1121]`) to mimic a terminal.
- **Borders**: Subtle, low-opacity borders (`border-console-border`) to separate panes without creating visual noise.
- **Accents**: 
  - Git Add Green (`#22c55e` / `text-console-git-add`) for new commits and diff `+` signs.
  - Accent Blue for active states and primary buttons (`bg-console-accent`).

## Typography
- **Primary Font**: A stark, generic Monospace font (via Tailwind's `font-mono`) is used almost exclusively across the entire application to reinforce the IDE aesthetic.
- **Data Density**: Font sizes are kept small (`text-sm`, `text-xs`) to allow maximum context to fit on a single screen without scrolling.

## Core Visual Elements
1. **Three-Pane Layout**: Mimics standard developer tools with a Left Panel (Project Nodes / File Tree), Center Panel (Commit Timeline), and Right Panel (Stats / Global Context).
2. **Terminal Modals**: Overlays and modals (like the "System Processing Sequence") are styled like terminal popups, complete with bracketed headers `[ CONFIRM COMMIT ]`.
3. **Table-Based Code Viewers**: Code and diffs are rendered using strict HTML `<table>` layouts. This ensures that the gutter (containing line numbers or `+` symbols) stays perfectly vertically aligned with the code text, even when lines wrap uncontrollably.
