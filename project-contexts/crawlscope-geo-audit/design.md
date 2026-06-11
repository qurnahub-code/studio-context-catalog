# CrawlScope GEO Audit Dashboard - Design System

## Design Philosophy
CrawlScope employs a modern, data-dense dark-mode palette designed to feel like a premium, specialized SEO/Developer tool. It relies heavily on rich animations and glassmorphic filters to make complex data look accessible and high-tech.

## CSS Architecture
- **Methodology**: Single-file embedded Vanilla CSS.
- **Layout**: Extensive use of CSS Flexbox and CSS Grid to manage complex dashboard layouts, interactive maps, and terminal interfaces.
- **Responsiveness**: Utilizes media queries and responsive grid systems to adapt the dense dashboard UI to various screen sizes.

## Color Palette & Visuals
- **Theme**: A cohesive dark mode, utilizing CSS variables to define background depths, borders, and accent colors.
- **Status Colors**: Strict semantic mapping for health indicators:
  - `OK` (Green)
  - `Warn` (Yellow/Amber)
  - `Fail` (Red)
- **Glassmorphism**: Uses `backdrop-filter: blur(...)` alongside semi-transparent backgrounds to create depth, particularly on overlapping elements like diagnostic drawers.

## Typography
- **Primary Font**: `Syne` - Used for headings and branding elements to give a modern, distinct aesthetic.
- **Monospace Font**: `IBM Plex Mono` - Used extensively for the CLI terminal simulator, URL paths, and code templates to reinforce the technical, developer-centric nature of the tool.

## Core Visual Elements
1. **CLI Terminal**: A simulated terminal window that visually streams logs during a "scan", complete with monospace fonts and status-colored text.
2. **Signal Map Grid**: A dense, grid-based visual representation of URLs, color-coded by health status.
3. **Slide-out Drawers**: Interactive panels that slide in from the side to display detailed URL diagnostics without navigating away from the main dashboard.
4. **Print Optimization**: Specific `@media print` CSS rules transform the dark-mode interactive UI into a clean, professional, light-mode PDF audit report for clients.
