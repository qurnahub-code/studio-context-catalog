import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ project: string }> }
) {
  const projectParams = await params;
  const project = projectParams.project;
  const filePath = path.join(process.cwd(), `public/context/${project}/context.md`);

  try {
    const rawMarkdown = fs.readFileSync(filePath, 'utf-8');
    return new Response(rawMarkdown, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    return new Response('Requested Context Node Not Found', { status: 404 });
  }
}
