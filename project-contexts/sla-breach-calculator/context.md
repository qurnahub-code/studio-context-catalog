# SLA Breach Calculator - Context

## Core Purpose
The SLA Breach Calculator is a privacy-first, client-side web application designed for IT managers, procurement teams, and operations professionals. It calculates complex Service Level Agreement (SLA) breach penalties, uptime shortfalls, and service credits instantly without requiring a server backend or data storage.

## Tech Stack & Architecture
- **Framework**: Pure Vanilla HTML, CSS, and JavaScript. No build frameworks (like Next.js or React) are used.
- **Routing**: Static file routing with "Clean URLs" generated via folders (e.g., `/about/index.html` serves as `/about/`).
- **Data Flow**: 100% client-side execution. User inputs are processed in the browser via JavaScript event listeners attached to the DOM. No data is sent to a backend.
- **Analytics**: Google Tag Manager (`G-XH2TL69XJG`) injected across all pages.

## File Structure
- `/index.html`: The main calculator application.
- `/[route]/index.html`: Static pages serving clean URLs (e.g., `/about/`, `/contact/`, `/privacy/`).
- `/blog/`: The SEO blog hub and deeply-researched article pages.
- `update-nav.js` & `update-header.js`: Node.js utility scripts used statically during development to sync the global navbar and header across all HTML files.
- `build.js`: Utility script to manage static site generation and sitemap linkage.
- `sitemap.xml`: Hardcoded XML for search engine crawling.

## Core Features
1. **Uptime / Availability Calculation**: Computes excess downtime hours vs. contracted percentage. Supports flat, percentage, or tiered penalty structures, and enforces credit caps.
2. **Response Time Calculation**: Calculates penalties across multiple breached incidents with per-incident rates and maximum caps.
3. **Delivery / Milestone Calculation**: Calculates late penalties by day, week, flat fee, or contract percentage with grace period support.
4. **Instant Result Generation**: Dynamic DOM updates show users a "breach state" or "ok state" visual meter based on their mathematical inputs.

## SEO Strategy (GEO)
- **Deep Search Protocol**: Content strictly follows the 8-phase workflow defined in `SKILL.md`.
- **Generative Engine Optimization (GEO)**: Blog posts include specific 40-word answer boxes following H2s to target AI overviews.
- **Structured Data**: Injects `application/ld+json` (WebApplication, Article, FAQPage) extensively to capture rich snippets.