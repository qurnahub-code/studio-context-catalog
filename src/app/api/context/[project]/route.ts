import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ project: string }> }
) {
  const projectParams = await params;
  const project = projectParams.project;
  
  const { data, error } = await supabase
    .from('commits')
    .select('*')
    .eq('project_id', project)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return new Response('Requested Context Node Not Found', { status: 404 });
  }

  // Aggregate the most recent commit for each category (context, design, history)
  const categories = new Set<string>();
  let combinedMarkdown = `# ${project.toUpperCase()} STUDIO CONTEXT\n\n`;

  for (const commit of data) {
    if (!categories.has(commit.category)) {
      categories.add(commit.category);
      combinedMarkdown += `\n\n<!-- CATEGORY: ${commit.category.toUpperCase()} -->\n\n${commit.content}`;
    }
  }

  return new Response(combinedMarkdown.trim(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
