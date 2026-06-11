# SLA Breach Calculator - Design System

## Design Philosophy
The UI relies on a premium, dark-mode glassmorphism aesthetic designed to evoke feelings of security, technical precision, and modern SaaS infrastructure. 

## CSS Architecture
- **Methodology**: 100% Vanilla CSS embedded in a global `<style>` block within the `<head>` of HTML files (to reduce HTTP requests). No Tailwind or external preprocessors are used.
- **Tokens**: Extensive use of CSS Variables (`:root`) for colors, spacing, typography, and shadows.

## Color Palette (Navy & Glow)
- **Backgrounds**: Deep Navy (`--navy-950: #060d1b`, `--navy-900: #0a1628`).
- **Surfaces**: Semi-transparent overlays for glassmorphism (`rgba(15,25,61,0.6)`).
- **Accents**: Electric Blues (`--blue-500: #2563EB`, `--blue-400: #3B82F6`) for primary actions.
- **State Colors**: Semantic Red (`--red-500`) for SLA breaches and Green (`--green-600`) for SLA compliance.

## Typography
- **Primary Font**: `Inter` (sans-serif) for body text and general UI readability.
- **Monospace Font**: `IBM Plex Mono` for technical numbers, statistics, calculator inputs, and code blocks to emphasize precision.

## Core Visual Elements
1. **Animated Background**: Uses a fixed CSS grid background overlaid with slow-moving, blurred, radial-gradient "orbs" (`.bg-orb`) to create depth and a high-tech feel.
2. **Glassmorphism Cards**: The main calculator and content containers use `backdrop-filter: blur(24px)` over semi-transparent backgrounds with subtle white borders (`rgba(255,255,255,0.08)`).
3. **Dynamic Meters**: Results are displayed using a dynamic color-changing meter. It glows red (`box-shadow: var(--glow-red)`) when a breach is detected, and green when compliant.
4. **Micro-animations**: Hover states on inputs feature slight Y-axis translations (`transform: translateY(-1px)`) and increased box-shadows to provide immediate tactile feedback. Buttons utilize a gradient sheen animation (`::before` pseudoelement) on hover.
