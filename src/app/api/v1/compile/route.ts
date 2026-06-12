import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { files, targetModel } = await req.json();

    let compiled = '';
    
    if (targetModel === 'cursor') {
      compiled += `# ContextFlow Generated Context for Cursor\n`;
      compiled += `# Target File: .cursorrules\n\n`;
      compiled += `## Global Rules\n- You are an expert developer.\n- Always output clean, maintainable code.\n- Refer to the context below for project-specific constraints.\n\n`;
    } else if (targetModel === 'claude') {
      compiled += `# ContextFlow Generated Context for Claude Code\n`;
      compiled += `# Target File: CLAUDE.md\n\n`;
      compiled += `## Build & Test Commands\n\`\`\`bash\nnpm run dev\nnpm run build\nnpm run test\n\`\`\`\n\n`;
      compiled += `## Project Guidelines\n- Follow strict typings.\n- Use modern React patterns.\n\n`;
    } else {
      compiled += `# ContextFlow Generated Context for GitHub Copilot\n`;
      compiled += `# Target File: .github/copilot-instructions.md\n\n`;
      compiled += `## High-level Overview\n- This repository relies on ContextFlow for architecture mapping.\n\n`;
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
