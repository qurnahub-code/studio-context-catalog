# MCP Playground - Design System

## Design Philosophy
The MCP Playground embraces a "Cyberpunk / Synthwave Hacker" aesthetic. It heavily utilizes neon accents against ultra-dark backgrounds to create an immersive, futuristic developer environment that stands out from standard SaaS tools.

## CSS Architecture
- **Methodology**: Embedded Vanilla CSS (`<style>` tag) with no external frameworks.
- **Responsiveness**: Utilizes CSS Grid (`grid-template-columns: 360px 1fr 400px`) for a complex three-pane desktop layout, gracefully degrading to stacked single-column layouts on mobile using media queries.

## Color Palette (Neon Synthwave)
- **Backgrounds**: Deep space blacks (`--bg: #09080f`) with subtle, fixed scanline overlays (`repeating-linear-gradient`) and radial gradient blooms.
- **Surfaces**: Dark indigos (`--surface: #100e1b`, `--surface2: #161427`).
- **Accents**: 
  - Neon Violet (`--accent: #8b5cf6`)
  - Neon Cyan (`--accent2: #06b6d4`)
  - Neon Pink (`--accent3: #ec4899`)
- **Semantic Colors**: Danger (`#ef4444`), Warning (`#f59e0b`), Success (`#10b981`).

## Typography
- **Primary Font**: `IBM Plex Mono` (monospace) dominates the interface, used for inputs, terminal logs, and body text, enforcing a coding environment feel.
- **Display Font**: `Syne` (sans-serif) is used sparingly for headers, logos, and critical UI components to provide a stylized contrast.

## Core Visual Elements
1. **Scanlines**: A global `::before` pseudo-element casts an imperceptible scanline grid over the entire application, mimicking CRT monitors.
2. **Neon Glows**: Heavy reliance on CSS `box-shadow` to create blooming neon effects (e.g., `box-shadow: 0 0 10px var(--accent-glow)`) on buttons and visual nodes.
3. **Animated SVG Connections**: The central graph draws SVG paths to connect nodes dynamically as users add tools, creating a living diagram.
4. **Interactive Terminal**: Custom-styled console with semantic color mapping for `cmd`, `success`, `warn`, and `thought` states, creating a readable log stream.
