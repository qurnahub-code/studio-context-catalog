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