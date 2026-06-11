## Core Features
1. **Smart Ingestion Modal**: Users can paste giant blocks of code or markdown. The app categorizes it (Context, State, Rule, Config) and allows the user to commit it.
2. **Visual Node System**: The left panel lists "Project Nodes". Users can drag a committed snippet from the main timeline into a specific project node to categorize it.
3. **Live File Inspection**: Users can click on committed files or infrastructure files (like `global-rules.md`) to open a responsive, table-based code-viewer modal that never breaks layout, even on massive files.
4. **Instant Context Copying**: Clicking a project node compiles all its commits and copies the entire formatted context block directly to the user's clipboard for LLM pasting.