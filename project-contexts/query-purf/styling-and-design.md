# Query Purf - Styling & Design

## CSS Architecture
- **Framework**: Tailwind CSS configured via `tailwind.config.ts`.
- **Pre-processor**: PostCSS handling Tailwind directives and auto-prefixing (`postcss.config.js`).

## Design Philosophy
Guided by the heavy documentation in `DESIGN.md`, the UI is built for data-density and technical readability rather than consumer aesthetic.
- **Theme**: Relies heavily on high-contrast technical themes.
- **Data Tables**: Uses monospaced typography for data presentation and strict grid alignments to handle wide datasets without breaking layout bounds.
- **Responsiveness**: Fully responsive via Tailwind breakpoints, though primarily optimized for wide-screen desktop data viewing.
