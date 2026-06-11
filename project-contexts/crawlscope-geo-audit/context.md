# CrawlScope GEO Audit Dashboard - Context

## Core Purpose
CrawlScope is a high-fidelity Generative Engine Optimization (GEO) and technical SEO auditing dashboard. It is designed to help developers and SEO specialists analyze how AI web crawlers (Googlebot, GPTBot, ClaudeBot, Perplexity) read, understand, and cite websites in generative search engines.

## Tech Stack & Architecture
- **Framework**: Pure Vanilla HTML, CSS, and JavaScript. 
- **Architecture**: A single-file architecture (`index.html`). All structure, styles, and logic are bundled into a standalone HTML file.
- **Data Flow**: 100% client-side execution. It utilizes lightweight Vanilla JavaScript for data generation, state management, search filters, and file generation. It includes an interactive scan simulator that generates mock data to demonstrate crawl behaviors without requiring a backend crawling server.

## Core Features
1. **Interactive Scan Simulator**: An animated CLI-style terminal log that demonstrates DNS resolution, `robots.txt` parsing, and crawling routines when a user inputs a domain.
2. **GEO Score & Health Analytics**: Evaluates web performance across categories like GEO citations, crawl coverage, and JSON-LD schema gaps.
3. **Interactive Crawl Signal Map**: A real-time visual grid of crawled URLs with path-based searching and health filters (`OK`, `Warn`, `Fail`).
4. **Diagnostic Drawers**: Clicking on any URL or structural vector opens a detailed inspection drawer offering recommendations and ready-to-copy code configurations.
5. **Built-in Configuration Generators**: Provides copyable templates for `robots.txt`, `llms.txt`, Next.js 15 App Router dynamic sitemaps (`sitemap.ts`), and canonical tags.
6. **Export capabilities**: Generates and downloads the full audit report as a structured JSON payload, and supports optimized print CSS for PDF generation.