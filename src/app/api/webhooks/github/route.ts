import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to interact with OpenAI
async function evaluateDriftWithOpenAI(diff: string, contextRules: string): Promise<{ driftDetected: boolean, comments: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set');
    return { driftDetected: false, comments: '' };
  }

  const prompt = `
You are a strict Context Drift Inspector.
Compare the following Git Diff against the established ContextFlow architectural rules.

If the diff violates any of the rules, respond with a JSON object:
{ "driftDetected": true, "comments": "A detailed explanation of the violation." }

If the diff is perfectly aligned with the rules, respond with:
{ "driftDetected": false, "comments": "All good." }

RULES:
${contextRules}

GIT DIFF:
${diff}
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        response_format: { type: "json_object" },
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1
      })
    });

    const result = await response.json();
    const content = JSON.parse(result.choices[0].message.content);
    return {
      driftDetected: content.driftDetected,
      comments: content.comments
    };
  } catch (e) {
    console.error('Failed to evaluate drift with OpenAI:', e);
    return { driftDetected: false, comments: '' };
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Only care about pull requests being opened or synchronized (new commits pushed)
    if (!payload.pull_request || !['opened', 'synchronize'].includes(payload.action)) {
      return NextResponse.json({ message: 'Ignored: Not a PR open or sync event' });
    }

    const pr = payload.pull_request;
    const repoFullName = payload.repository.full_name; // e.g. "qurnahub-code/studio-context-catalog"
    const repoName = payload.repository.name; // e.g. "studio-context-catalog"
    const prNumber = pr.number;
    const diffUrl = pr.diff_url;
    
    // Fetch the specific rules for this repository from ContextFlow
    // We assume the project_id matches either the repo name or full name.
    const { data: commits, error } = await supabase
      .from('commits')
      .select('category, content')
      .or(`project_id.eq.${repoName},project_id.eq.${repoFullName}`)
      .order('created_at', { ascending: false });

    if (error || !commits || commits.length === 0) {
      console.log(`No ContextFlow rules found for repo: ${repoName}`);
      return NextResponse.json({ message: 'No rules found for this repository, skipping drift check.' });
    }

    // Deduplicate to get the latest rules
    const latestCommits = new Map<string, string>();
    for (const commit of commits) {
      if (!latestCommits.has(commit.category)) {
        latestCommits.set(commit.category, commit.content);
      }
    }

    let compiledRules = '';
    for (const [category, content] of latestCommits.entries()) {
      if (content !== '[DELETED]') {
        compiledRules += `## [${category.toUpperCase()}]\n${content}\n\n`;
      }
    }

    if (!compiledRules.trim()) {
      return NextResponse.json({ message: 'Rules are empty or deleted, skipping.' });
    }

    // Fetch the PR diff
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });
    }

    const diffResponse = await fetch(diffUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3.diff'
      }
    });

    if (!diffResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch PR diff' }, { status: 500 });
    }

    const diffText = await diffResponse.text();

    // Evaluate Drift
    const evaluation = await evaluateDriftWithOpenAI(diffText, compiledRules);

    // If drift is detected, post a comment on the PR
    if (evaluation.driftDetected) {
      const commentBody = `### 🚨 ContextFlow Drift Detected\n\nYour Pull Request violates the established architectural rules for this project:\n\n${evaluation.comments}\n\n*Please fix these issues to align with the ContextFlow architecture.*`;
      
      const commentUrl = `https://api.github.com/repos/${repoFullName}/issues/${prNumber}/comments`;
      await fetch(commentUrl, {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: commentBody })
      });

      return NextResponse.json({ message: 'Drift detected and comment posted.' });
    }

    return NextResponse.json({ message: 'Diff evaluated successfully. No drift detected.' });

  } catch (err: any) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
