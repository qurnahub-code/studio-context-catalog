# Niche Storefront Dashboard - Design

## CSS Architecture
- **Framework**: Tailwind CSS v4 (`@tailwindcss/vite`).
- **Utility Management**: Uses `tailwind-merge` and `clsx` for intelligent, conflict-free class string merging, particularly within reusable components.
- **Animations**: Integrated with `tw-animate-css` for declarative utility-class animations (fades, slides, pulses).

## Component Library (shadcn/ui style)
The dashboard relies heavily on unstyled, accessible primitives from **Radix UI**, which are then wrapped and styled via Tailwind CSS.
- **Primitives Used**: Accordion, Dialog, Dropdown Menu, Hover Card, Popover, Select, Tabs, Tooltip, Navigation Menu.
- **Design Philosophy**: Adheres to a clean, enterprise-grade aesthetic. Focuses on high information density, clear typography, and subtle micro-interactions to improve UX without being distracting.

## Typography & Visuals
- **Icons**: Comprehensive usage of `lucide-react` for consistent, lightweight, and scalable SVG iconography across the dashboard.
- **Data Visualization**: Uses `recharts` to render SVG-based, responsive charts that inherit theme variables (colors, fonts) to match the overall dashboard styling perfectly.
