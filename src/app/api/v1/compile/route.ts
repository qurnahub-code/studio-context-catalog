import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { files, targetModel } = await req.json();

    let compiled = '';
    
    switch (targetModel) {
      case 'cursor':
        compiled += `# ContextFlow Generated Context for Cursor\n# Target File: .cursorrules\n\n## Global Rules\n- You are an expert developer.\n- Always output clean, maintainable code.\n- Refer to the context below for project-specific constraints.\n\n`;
        break;
      case 'claude':
        compiled += `# ContextFlow Generated Context for Claude Code\n# Target File: CLAUDE.md\n\n## Build & Test Commands\n\`\`\`bash\nnpm run dev\nnpm run build\nnpm run test\n\`\`\`\n\n## Project Guidelines\n- Follow strict typings.\n- Use modern React patterns.\n\n`;
        break;
      case 'copilot':
        compiled += `# ContextFlow Generated Context for GitHub Copilot\n# Target File: .github/copilot-instructions.md\n\n## High-level Overview\n- This repository relies on ContextFlow for architecture mapping.\n\n`;
        break;
      case 'windsurf':
        compiled += `# ContextFlow Generated Context for Windsurf\n# Target File: .windsurfrules\n\n## Workspace Awareness\n- Analyze all context before making changes.\n- Strictly adhere to the architectural constraints listed below.\n\n`;
        break;
      case 'cline':
        compiled += `# ContextFlow Generated Context for Cline\n# Target File: .clinerules\n\n## Autonomous Agent Directives\n- Proceed with operations step-by-step.\n- Use the provided context files to inform your tool execution.\n\n`;
        break;
      case 'roo':
        compiled += `# ContextFlow Generated Context for Roo Code\n# Target File: .roomodes\n\n## Role Definitions\n- You are operating within the constraints of the project architecture.\n- Respect the UI and System tokens provided.\n\n`;
        break;
      case 'generic':
      default:
        compiled += `# ContextFlow Generated System Prompt\n# Target File: SYSTEM_PROMPT.md\n\n## Core Instructions\n- Act as a senior engineer.\n- Digest the following organizational memory and context before responding.\n\n`;
        break;
    }

    compiled += `## Project System Context\n`;
    files.forEach((f: any) => {
      compiled += `\n### File: ${f.file_path}\n${f.content}\n`;
    });

    return NextResponse.json({ success: true, fileContent: compiled });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
