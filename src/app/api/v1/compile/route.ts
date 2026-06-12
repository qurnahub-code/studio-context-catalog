import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { files, targetModel } = await req.json();

    let systemPrompt = '';
    
    // Switch styling conventions depending on what the AI reads best
    if (targetModel === 'cursor') {
      systemPrompt = `You are an expert .cursorrules builder. Turn this context into clean rules:\n`;
    } else if (targetModel === 'claude') {
      systemPrompt = `Format this strictly as a CLAUDE.md guide emphasizing operations and project constraints:\n`;
    } else {
      systemPrompt = `Generate a high-level system overview context document:\n`;
    }

    // Process files into the formatted layout
    const formattedContext = files.map((f: any) => `### Content: ${f.file_path}\n${f.content}`).join('\n\n');
    const finalFileString = `${systemPrompt}\n${formattedContext}`;

    return NextResponse.json({ success: true, fileContent: finalFileString });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
