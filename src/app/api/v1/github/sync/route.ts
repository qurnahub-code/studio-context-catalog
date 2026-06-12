import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { repo, path, content, token, commitMessage } = await req.json();

    if (!repo || !path || !content || !token) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
    
    // 1. Check if file exists to get its SHA
    let sha: string | undefined;
    const getRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ContextFlow-App'
      }
    });

    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    } else if (getRes.status !== 404) {
      const err = await getRes.json();
      return NextResponse.json({ success: false, error: err.message || 'Failed to check existing file' }, { status: getRes.status });
    }

    // 2. Create or Update the file
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'ContextFlow-App'
      },
      body: JSON.stringify({
        message: commitMessage || `ContextOps: Syncing ${path} from ContextFlow`,
        content: Buffer.from(content).toString('base64'),
        sha: sha // Only included if updating
      })
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      return NextResponse.json({ success: false, error: err.message || 'Failed to commit file' }, { status: putRes.status });
    }

    return NextResponse.json({ success: true, message: 'Successfully synced to GitHub' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
